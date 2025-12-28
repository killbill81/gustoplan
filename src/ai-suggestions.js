import { getCurrentUser } from './auth.js';
import { getUserAIProfile, getAIProfileSummary, reanalyzeAllHistory } from './ia-utils.js';

export default function initAISuggestions() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.getElementById('ai-profile-container');
    const summaryText = document.getElementById('ai-summary-text');
    const refreshBtn = document.getElementById('refresh-ai-btn');
    const statsContainer = document.getElementById('ai-stats-grid');

    async function handleReanalyze() {
        if (!refreshBtn) return;
        const originalText = refreshBtn.innerHTML;
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-sync fa-spin mr-2"></i> Synchronisation...';

        try {
            const result = await reanalyzeAllHistory(user.uid);
            // Si la fonction Cloud renvoie le profil, on l'affiche directement
            if (result && result.profile) {
                await loadProfile(result.profile, result.debug, result);
            } else {
                await loadProfile();
            }
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la ré-analyse.");
        } finally {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = originalText;
        }
    }


    async function loadProfile(directProfile = null, debugData = null, directResult = null) {
        if (!container) return;

        const profile = directProfile || await getUserAIProfile(user.uid);
        if (!profile) {
            container.innerHTML = `
                <div class="text-center p-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <i class="fas fa-robot text-4xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500">Pas encore assez de données pour analyser vos habitudes.</p>
                    <p class="text-sm text-gray-400 mt-2 mb-4">L'IA se base sur vos menus sauvegardés ou archivés.</p>
                    <button id="force-sync-btn" class="btn btn-secondary btn-sm">
                        <i class="fas fa-sync-alt mr-2"></i> Analyser mon historique existant
                    </button>
                </div>
            `;
            const syncBtn = document.getElementById('force-sync-btn');
            if (syncBtn) syncBtn.addEventListener('click', handleReanalyze);
            return;
        }

        // Render Stats
        if (statsContainer) {
            const stats = profile.global_stats || {};
            statsContainer.innerHTML = `
                <div class="bg-blue-50 p-4 rounded-lg text-center">
                    <span class="block text-2xl font-bold text-blue-700">${stats.total_meals_planned || 0}</span>
                    <span class="text-xs text-blue-600 uppercase font-semibold">Repas planifiés</span>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg text-center">
                    <span class="block text-2xl font-bold text-purple-700">${Object.keys(profile.recipe_frequency || {}).length}</span>
                    <span class="text-xs text-purple-600 uppercase font-semibold">Recettes différentes</span>
                </div>
            `;
            statsContainer.classList.remove('md:grid-cols-3');
            statsContainer.classList.add('md:grid-cols-2');
        }

        // Display Debug Info if available
        const debugWrapper = document.getElementById('ai-debug-wrapper');
        const debugInfo = document.getElementById('ai-debug-info');
        const closeDebugBtn = document.getElementById('close-debug-btn');
        const statsGrid = document.getElementById('ai-stats-grid');

        // prioritiser debugData (résultat direct) sinon debug_info (persistance)
        const finalDebug = debugData || (profile && profile.debug_info);

        console.log("[IA-Debug] Rendering profile UI.", {
            hasDebugData: !!debugData,
            hasProfileDebug: !!(profile && profile.debug_info),
            version: directResult?.version || profile?.version || "Inconnue"
        });

        if (debugInfo && debugWrapper) {
            const isV24 = finalDebug && !Array.isArray(finalDebug) && finalDebug.meals;
            const meals = isV24 ? finalDebug.meals : (Array.isArray(finalDebug) ? finalDebug : []);
            const rawStats = isV24 ? finalDebug.raw_stats : null;

            if (meals.length > 0) {
                let debugHtml = `<div class="mb-2 text-white border-b border-gray-700 pb-1 flex flex-col text-[10px] font-mono">
                    <div class="flex justify-between w-full">
                        <span>V: ${directResult?.version || profile?.version || "P"}</span>
                        <span>${meals.length} repas</span>
                    </div>`;

                if (rawStats && rawStats.total_servings !== undefined) {
                    debugHtml += `<div class="text-orange-300 mt-1">Total: ${rawStats.total_servings}p / ${rawStats.servings_count}r = ${(rawStats.total_servings / rawStats.servings_count).toFixed(2)}</div>`;
                }

                debugHtml += `</div>`;

                meals.forEach((d, idx) => {
                    const itemsStr = d.items.map(i => `${i.name}`).join(', ');
                    debugHtml += `<div class="mb-1">
                        <span class="text-orange-300 font-bold">${idx + 1}.</span> 
                        <span class="text-gray-400 text-[9px]">${d.path}</span>
                        <br>${itemsStr}
                    </div>`;
                });
                debugInfo.innerHTML = debugHtml;
            } else {
                debugInfo.innerHTML = `
                    <div class="text-orange-400 font-mono text-[10px]">
                        [ERREUR] Aucune donnée de comptage.<br>
                        - Version: ${directResult?.version || profile?.version || "Inconnue"}<br>
                        - Raw: ${JSON.stringify(profile).substring(0, 100)}...
                    </div>`;
            }

            if (closeDebugBtn) {
                closeDebugBtn.onclick = () => debugWrapper.classList.add('hidden');
            }

            if (statsGrid && !document.getElementById('show-debug-trigger')) {
                console.log("[IA-Debug] Injecting trigger button");
                const trigger = document.createElement('div');
                trigger.id = 'show-debug-trigger';
                trigger.className = 'col-span-full text-center mt-2';
                trigger.innerHTML = `
                    <button class="btn btn-secondary btn-sm !text-[10px] !py-1 !px-3 shadow-sm hover:shadow-md transition-all">
                        <i class="fas fa-bug mr-2"></i> Voir le détail du comptage IA
                    </button>
                `;
                trigger.onclick = () => {
                    debugWrapper.classList.remove('hidden');
                    console.log("[IA-Debug] Show wrapper click");
                };
                statsGrid.after(trigger);
            }
        }

        // Render Top Recipes
        const freq = profile.recipe_frequency || {};
        const sortedRecipes = Object.entries(freq).sort(([, a], [, b]) => b - a).slice(0, 10);

        const topRecipesList = document.getElementById('ai-top-recipes');
        if (topRecipesList) {
            if (sortedRecipes.length === 0) {
                topRecipesList.innerHTML = '<li class="text-sm text-gray-400 italic">Aucune recette récurrente détectée.</li>';
            } else {
                topRecipesList.innerHTML = '<div class="flex justify-center p-4"><i class="fas fa-spinner fa-spin text-gray-400"></i></div>';

                try {
                    const { db } = await import('./firebase-config.js');
                    const { doc, getDoc } = await import('firebase/firestore');

                    const recipePromises = sortedRecipes.map(async ([key, count]) => {
                        // Si la clé ressemble à un ID Firestore (20 char alphanumeric), on cherche l'ID
                        const isId = /^[a-zA-Z0-9]{15,}$/.test(key);
                        if (isId) {
                            try {
                                const rSnap = await getDoc(doc(db, 'recipes', key));
                                return {
                                    name: rSnap.exists() ? rSnap.data().name : `Recette #${key.substring(0, 5)}`,
                                    count
                                };
                            } catch (e) {
                                return { name: key, count };
                            }
                        } else {
                            // C'est déjà le nom
                            return { name: key, count };
                        }
                    });

                    const recipeData = await Promise.all(recipePromises);

                    topRecipesList.innerHTML = recipeData.map(r => `
                        <li class="flex justify-between items-center p-3 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-xl transition-all shadow-sm hover:shadow-md">
                            <span class="text-sm font-semibold text-gray-700">${r.name}</span>
                            <span class="bg-tomato text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center">
                                <i class="fas fa-fire-alt mr-1 text-[8px]"></i> ${r.count} fois
                            </span>
                        </li>
                    `).join('');
                } catch (err) {
                    console.error("Error rendering AI list:", err);
                    topRecipesList.innerHTML = '<li class="text-xs text-red-500">Erreur lors du rendu.</li>';
                }
            }
        }
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyse en cours...';

            const summary = await getAIProfileSummary(user.uid);
            if (summaryText) {
                summaryText.innerHTML = `<div class="prose prose-sm">${summary}</div>`;
                summaryText.classList.remove('hidden');
            }

            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt mr-2"></i> Actualiser mon analyse';
        });
    }

    loadProfile();

    // Ajout d'un écouteur pour un éventuel bouton de synchronisation globale dans le header ou ailleurs
    document.addEventListener('requestAISync', handleReanalyze);

    return () => {
        document.removeEventListener('requestAISync', handleReanalyze);
    };
}

import { db, functions } from './firebase-config.js';
import { httpsCallable } from "firebase/functions";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Récupère le profil IA (habitudes et préférences).
 * Note: On utilise désormais la collection racine 'ai_profiles' 
 * pour éviter les problèmes de permissions sur les sous-collections de 'users'.
 */
export async function getUserAIProfile(uid) {
    if (!uid) return null;
    try {
        const profRef = doc(db, 'ai_profiles', uid);
        const snap = await getDoc(profRef);
        return snap.exists() ? snap.data() : null;
    } catch (error) {
        console.error("Erreur getUserAIProfile:", error);
        return null;
    }
}

/**
 * Met à jour le profil IA de manière incrémentale.
 */
export async function updateProfileIncremental(uid, planData) {
    if (!uid || !planData) return;

    try {
        const profRef = doc(db, 'ai_profiles', uid);
        const currentProfile = await getUserAIProfile(uid) || {
            global_stats: { total_meals_planned: 0, avg_servings: 0, top_categories: {} },
            recipe_frequency: {},
            last_updated: null
        };

        const stats = currentProfile.global_stats;
        const freq = currentProfile.recipe_frequency || {};

        let newMealsCount = 0;

        if (planData.weeks) {
            Object.values(planData.weeks).forEach(week => {
                if (week.menuData) {
                    Object.values(week.menuData).forEach(meals => {
                        if (Array.isArray(meals)) {
                            meals.forEach(m => {
                                // Aligné sur Cloud v2.1 : ID ou Nom, et on compte chaque instance
                                const key = m.id || m.name;
                                if (key) {
                                    freq[key] = (freq[key] || 0) + 1;
                                    newMealsCount++;
                                }
                            });
                        }
                    });
                }
            });
        }

        stats.total_meals_planned += newMealsCount;

        await setDoc(profRef, {
            global_stats: stats,
            recipe_frequency: freq,
            last_updated: serverTimestamp()
        }, { merge: true });
        console.log("Profil IA mis à jour avec succès dans 'ai_profiles'.");
    } catch (error) {
        console.error("Erreur updateProfileIncremental:", error);
    }
}

/**
 * Ré-analyse complète via Cloud Function pour contourner les restrictions Firestore.
 */
export async function reanalyzeAllHistory(uid) {
    if (!uid) return;
    console.log("[IA] Appel de la fonction Cloud syncAIProfile...");

    try {
        const syncAIProfile = httpsCallable(functions, 'syncAIProfile');
        const result = await syncAIProfile();
        console.log("[IA] Résultat brut Cloud:", JSON.stringify(result.data, null, 2));
        return result.data;
    } catch (error) {
        console.error("[IA] ERREUR lors de la synchronisation Cloud:", error);
        throw error;
    }
}

/**
 * Appelle Gemini pour obtenir un résumé textuel.
 */
export async function getAIProfileSummary(uid) {
    const profile = await getUserAIProfile(uid);
    if (!profile) return "Aucune donnée d'habitude disponible.";

    try {
        const analyzeHistory = httpsCallable(functions, 'analyzeHistory');
        const result = await analyzeHistory({ profile });
        return result.data.summary;
    } catch (error) {
        console.error("Erreur getAIProfileSummary:", error);
        return "Impossible de générer le résumé IA.";
    }
}


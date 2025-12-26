import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, writeBatch, query, where } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { seasonManager } from './season-manager.js';
import { ingredientModalManager } from './ingredient-modal.js';

export default function init() {
    // --- DOM Elements ---
    const listContainer = document.getElementById('ingredients-list-container');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const tabsContainer = document.getElementById('category-tabs');
    const searchBar = document.getElementById('search-bar');

    // Category Management Modal
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    const categoryModal = document.getElementById('category-management-modal');
    const closeCategoryModalBtn = document.getElementById('close-category-modal');
    const doneCategoryModalBtn = document.getElementById('done-category-modal-btn');
    const addCategoryForm = document.getElementById('add-category-form');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const categoryListDiv = document.getElementById('category-list');

    // Audit IA Elements
    const auditBtn = document.getElementById('audit-ingredients-btn');
    const auditModal = document.getElementById('audit-modal');
    const closeAuditBtn = document.getElementById('close-audit-modal');
    const applyAuditBtn = document.getElementById('apply-audit-btn');
    const auditListBody = document.getElementById('audit-results-list');

    // --- State ---
    let allIngredients = [];
    let ingredientCategories = [];
    let activeCategory = '';
    let searchTerm = '';
    let previousActiveCategory = null;

    // --- Main Data Loading ---
    async function fetchAllData() {
        await fetchIngredientCategories();
        await fetchAllIngredients();
    }

    async function fetchIngredientCategories() {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "ingredient_categories"));
            ingredientCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            ingredientCategories.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Erreur lors de la récupération des catégories: ", error);
        }
    }

    async function fetchAllIngredients() {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "ingredients"));
            allIngredients = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderTabs();
            renderIngredients();
        } catch (error) {
            console.error("Erreur de chargement des ingrédients: ", error);
        }
    }

    // --- Category Management Modal Logic ---
    function openCategoryModal() {
        renderCategoryList();
        categoryModal.classList.remove('hidden');
    }

    function closeCategoryModal() {
        categoryModal.classList.add('hidden');
    }

    function renderCategoryList() {
        categoryListDiv.innerHTML = '';
        if (ingredientCategories.length === 0) {
            categoryListDiv.innerHTML = '<p class="text-gray-500">Aucune catégorie définie.</p>';
            return;
        }

        ingredientCategories.forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.className = 'flex items-center justify-between p-2 border-b';

            const catName = document.createElement('span');
            catName.textContent = cat.name;
            catDiv.appendChild(catName);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'flex space-x-2';

            const renameBtn = document.createElement('button');
            renameBtn.className = 'text-blue-500 hover:bg-blue-50 text-xs px-2 py-1 rounded-md';
            renameBtn.innerHTML = '<i class="fas fa-edit"></i>';
            renameBtn.addEventListener('click', () => handleRenameCategory(cat));
            buttonsDiv.appendChild(renameBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded-md';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => handleDeleteCategory(cat));
            buttonsDiv.appendChild(deleteBtn);

            catDiv.appendChild(buttonsDiv);
            categoryListDiv.appendChild(catDiv);
        });
    }

    async function handleAddCategory(e) {
        e.preventDefault();
        const newName = newCategoryNameInput.value.trim();
        if (newName && !ingredientCategories.find(c => c.name.toLowerCase() === newName.toLowerCase())) {
            try {
                await addDoc(collection(db, "ingredient_categories"), { name: newName });
                newCategoryNameInput.value = '';
                await fetchIngredientCategories();
                renderCategoryList();
                renderTabs();
            } catch (error) {
                console.error("Erreur d'ajout de catégorie: ", error);
            }
        } else {
            alert("Cette catégorie existe déjà ou le nom est invalide.");
        }
    }

    async function handleRenameCategory(category) {
        const oldName = category.name;
        const newName = prompt(`Entrez le nouveau nom pour la catégorie "${oldName}":`, oldName);
        if (newName && newName.trim() !== '' && newName !== oldName) {
            try {
                await setDoc(doc(db, "ingredient_categories", category.id), { name: newName });
                const q = query(collection(db, "ingredients"), where("category", "==", oldName));
                const querySnapshot = await getDocs(q);
                const batch = writeBatch(db);
                querySnapshot.forEach((doc) => {
                    batch.update(doc.ref, { category: newName });
                });
                await batch.commit();
                await fetchAllData();
                renderCategoryList();
            } catch (error) {
                console.error("Erreur de renommage: ", error);
            }
        }
    }

    async function handleDeleteCategory(category) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}"?\n\nTous les ingrédients associés seront déplacés vers la catégorie "Inconnue".`)) {
            try {
                await deleteDoc(doc(db, "ingredient_categories", category.id));
                const q = query(collection(db, "ingredients"), where("category", "==", category.name));
                const querySnapshot = await getDocs(q);
                const batch = writeBatch(db);
                querySnapshot.forEach((doc) => {
                    batch.update(doc.ref, { category: "Inconnue" });
                });
                await batch.commit();
                activeCategory = '';
                await fetchAllData();
                renderCategoryList();
            } catch (error) {
                console.error("Erreur de suppression: ", error);
            }
        }
    }

    // --- Main View Rendering ---
    function renderTabs() {
        tabsContainer.innerHTML = '';

        const officialCategoryNames = ingredientCategories.map(c => c.name);
        const categoriesInUse = [...new Set(allIngredients.map(i => i.category || 'Inconnue'))];
        let allCategories = [...new Set([...officialCategoryNames, ...categoriesInUse])];

        allCategories.sort((a, b) => a.localeCompare(b));

        if (allCategories.includes('Inconnue')) {
            allCategories = allCategories.filter(c => c !== 'Inconnue');
            allCategories.push('Inconnue');
        }

        if (allCategories.length === 0 && allIngredients.length > 0) {
            allCategories.push('Inconnue');
        }

        if (!activeCategory && allCategories.length > 0) {
            activeCategory = allCategories[0];
        }

        allCategories.forEach(category => {
            const tab = document.createElement('button');
            const isActive = category === activeCategory;
            tab.className = `px-4 py-2 text-sm font-medium rounded-t-lg ${isActive ? 'bg-tomato text-white' : 'text-gray-500 hover:text-tomato'}`;
            tab.textContent = category;
            tab.addEventListener('click', () => handleTabClick(category));
            tabsContainer.appendChild(tab);
        });
    }

    function handleTabClick(category) {
        activeCategory = category;
        renderTabs(); // Redessine les onglets pour mettre à jour le style actif
        renderIngredients();
    }

    function renderIngredients() {
        listContainer.innerHTML = '';
        const currentCategory = activeCategory || (ingredientCategories.length > 0 ? ingredientCategories[0].name : 'Inconnue');
        let ingredientsForCategory = allIngredients.filter(ing => (ing.category || 'Inconnue') === currentCategory);

        // Filter by search term
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            ingredientsForCategory = ingredientsForCategory.filter(ing => ing.name.toLowerCase().includes(lowerCaseSearchTerm));
        }

        // --- Seasonality Sorting ---
        // Scores: 2 = Full Season, 1 = Partial (not used yet), 0 = Out
        ingredientsForCategory.forEach(ing => ing.seasonScore = seasonManager.getIngredientScore(ing));

        // Off-season behavior: Hide?
        if (seasonManager.config.offSeasonBehavior === 'hide') {
            ingredientsForCategory = ingredientsForCategory.filter(ing => ing.seasonScore > 0);
        }

        if (ingredientsForCategory.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-gray-500 p-10">Aucun ingrédient dans cette catégorie (ou tout est masqué).</p>';
            return;
        }

        // Sort: Score DESC, then Name ASC
        // If sorting "last" for off-season is enabled (which is implicitly handled by score sorting if we sort by score first)
        // If behavior is "dim" but order matters:
        if (seasonManager.config.offSeasonBehavior === 'last' || seasonManager.config.offSeasonBehavior === 'dim') {
            ingredientsForCategory.sort((a, b) => {
                if (b.seasonScore !== a.seasonScore) return b.seasonScore - a.seasonScore;
                return a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' });
            });
        } else {
            // Just alpha sort if seasonality disabled or other logic
            ingredientsForCategory.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));
        }


        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';

        ingredientsForCategory.forEach(ing => {
            const isOutOfSeason = ing.seasonScore === 0;
            const dimStyle = isOutOfSeason && seasonManager.config.offSeasonBehavior === 'dim' ? 'opacity-50 grayscale transition-all hover:grayscale-0 hover:opacity-100' : '';

            const card = document.createElement('div');
            // Add 'relative' for badges
            card.className = `p-3 bg-white shadow-sm rounded-lg flex flex-col items-start space-y-2 relative border border-transparent ${dimStyle}`;

            if (ing.imageUrl) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'relative w-full h-24 mb-2';

                const image = document.createElement('img');
                image.src = ing.imageUrl;
                image.alt = ing.name;
                image.className = 'w-full h-full object-cover rounded-md';
                imageContainer.appendChild(image);

                // Badge on Image
                if (ing.seasonScore === 2) {
                    const badge = document.createElement('div');
                    badge.className = 'absolute top-1 right-1 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm z-10';
                    badge.textContent = 'De saison';
                    imageContainer.appendChild(badge);
                } else if (isOutOfSeason) {
                    const badge = document.createElement('div');
                    badge.className = 'absolute top-1 right-1 bg-gray-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm z-10';
                    badge.textContent = 'Hors saison';
                    imageContainer.appendChild(badge);
                }

                card.appendChild(imageContainer);
            } else {
                // Badge on Card (No Image)
                if (ing.seasonScore === 2) {
                    card.classList.add('border-green-100');
                    const badge = document.createElement('div');
                    badge.className = 'absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200 shadow-sm z-10';
                    badge.textContent = 'De saison';
                    card.appendChild(badge);
                } else if (isOutOfSeason) {
                    const badge = document.createElement('div');
                    badge.className = 'absolute top-2 right-2 bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200 shadow-sm z-10';
                    badge.textContent = 'Hors saison';
                    card.appendChild(badge);
                }
            }

            const infoDiv = document.createElement('div');
            infoDiv.className = 'flex-grow w-full flex justify-between items-center';
            const nameSpan = document.createElement('span');
            nameSpan.className = 'font-medium text-gray-800';
            nameSpan.textContent = ing.name;
            const unitSpan = document.createElement('span');
            unitSpan.className = 'text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-full';
            unitSpan.textContent = ing.unit;
            infoDiv.appendChild(nameSpan);
            infoDiv.appendChild(unitSpan);
            card.appendChild(infoDiv);

            // Seasonality Display
            const seasonalityContainer = document.createElement('div');
            seasonalityContainer.className = 'w-full flex flex-col gap-1 mt-1 px-1';

            let hasSeasonality = false;

            // 1. Seasons Row
            if (ing.seasons && ing.seasons.length > 0) {
                hasSeasonality = true;
                const seasonsRow = document.createElement('div');
                seasonsRow.className = 'flex flex-wrap gap-1';

                const icons = { 'Printemps': '🌸', 'Eté': '☀️', 'Automne': '🍂', 'Hiver': '❄️' };
                const order = ['Printemps', 'Eté', 'Automne', 'Hiver'];
                ing.seasons.sort((a, b) => order.indexOf(a) - order.indexOf(b)).forEach(s => {
                    const span = document.createElement('span');
                    span.textContent = `${icons[s] || ''} ${s}`;
                    span.title = s;
                    span.className = 'text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200 whitespace-nowrap';
                    seasonsRow.appendChild(span);
                });
                seasonalityContainer.appendChild(seasonsRow);
            }

            // 2. Months Row
            if (ing.months && ing.months.length > 0) {
                hasSeasonality = true;
                const monthsRow = document.createElement('div');
                monthsRow.className = 'flex flex-wrap gap-1';

                // Sort months chronologically
                const monthOrder = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
                ing.months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

                ing.months.forEach(m => {
                    const span = document.createElement('span');
                    span.textContent = m.slice(0, 3) + '.'; // Abbreviate: Jan., Fév., etc.
                    span.title = m;
                    span.className = 'text-[10px] text-gray-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100 whitespace-nowrap';
                    monthsRow.appendChild(span);
                });
                seasonalityContainer.appendChild(monthsRow);
            }

            // 3. Fallback
            if (!hasSeasonality) {
                const fallbackRow = document.createElement('div');
                fallbackRow.className = 'flex flex-wrap gap-1';
                const span = document.createElement('span');
                span.textContent = "Toute l'année 🌍";
                span.className = 'text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-200 whitespace-nowrap';
                fallbackRow.appendChild(span);
                seasonalityContainer.appendChild(fallbackRow);
            }
            card.appendChild(seasonalityContainer);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'w-full flex justify-end items-center space-x-2 border-t pt-2 mt-2';
            const editBtn = document.createElement('button');
            editBtn.className = 'text-blue-500 hover:bg-blue-50 text-xs px-2 py-1 rounded-md';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => ingredientModalManager.open(ing, fetchAllIngredients));
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded-md';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click', () => deleteIngredient(ing.id, ing.name));
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            card.appendChild(actionsDiv);
            grid.appendChild(card);
        });
        listContainer.appendChild(grid);
    }

    async function deleteIngredient(id, name) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer l'ingrédient "${name}" ?`)) {
            try {
                await deleteDoc(doc(db, "ingredients", id));
                await fetchAllIngredients();
            } catch (error) {
                console.error("Erreur de suppression de l'ingrédient: ", error);
            }
        }
    }

    // --- Audit IA Logic ---
    async function handleAudit() {
        if (allIngredients.length === 0) {
            alert("Aucun ingrédient à auditer.");
            return;
        }

        auditBtn.disabled = true;
        auditBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Audit en cours...';
        auditListBody.innerHTML = '<tr><td colspan="5" class="p-6 text-center text-gray-500 italic"><i class="fas fa-spinner fa-spin mr-2"></i> Analyse en cours (cela peut prendre du temps si vous avez beaucoup d\'ingrédients)...</td></tr>';

        try {
            const functions = getFunctions();
            const auditIngredientsFn = httpsCallable(functions, 'auditIngredients');

            // Batch process if there are many ingredients (to avoid AI response limits)
            const batchSize = 50;
            let allSuggestions = [];

            for (let i = 0; i < allIngredients.length; i += batchSize) {
                const chunk = allIngredients.slice(i, i + batchSize);
                const result = await auditIngredientsFn({ ingredients: chunk });
                if (result.data && result.data.suggestions) {
                    allSuggestions = allSuggestions.concat(result.data.suggestions);
                }
            }

            renderAuditResults(allSuggestions);
            auditModal.classList.remove('hidden');
        } catch (error) {
            console.error("Audit failed:", error);
            alert("Erreur lors de l'audit : " + error.message);
        } finally {
            auditBtn.disabled = false;
            auditBtn.innerHTML = '<i class="fas fa-stethoscope mr-2"></i> Audit Qualité IA';
        }
    }

    function renderAuditResults(suggestions) {
        auditListBody.innerHTML = '';
        suggestions.forEach(s => {
            const original = allIngredients.find(i => i.name === s.name);
            if (!original) return;

            const hasDiff = (s.unit !== (original.unit || '')) ||
                (s.cat !== (original.category || ''));

            if (!hasDiff) return;

            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors";
            row.innerHTML = `
                <td class="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">${s.name}</td>
                <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div class="flex flex-col gap-1">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-400">U: ${original.unit || 'n/a'}</span>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-700 text-[10px] font-medium text-gray-600 dark:text-gray-400">C: ${original.category || 'n/a'}</span>
                    </div>
                </td>
                <td class="px-4 py-4 text-sm">
                    <div class="flex flex-col gap-1">
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-tomato/10 text-tomato text-[10px] font-bold border border-tomato/20">${s.unit}</span>
                        <span class="inline-flex items-center px-1.5 py-0.5 rounded-md bg-tomato/10 text-tomato text-[10px] font-bold border border-tomato/20">${s.cat}</span>
                    </div>
                </td>
                <td class="px-4 py-4 text-xs text-gray-500 dark:text-gray-400 italic font-medium leading-relaxed max-w-[200px] break-words" title="${s.reason}">${s.reason}</td>
                <td class="px-4 py-4 text-center">
                    <div class="flex items-center justify-center">
                        <input type="checkbox" class="audit-apply-checkbox w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded cursor-pointer accent-tomato" 
                            data-id="${original.id}" 
                            data-unit="${s.unit}" 
                            data-cat="${s.cat}" checked>
                    </div>
                </td>
            `;
            auditListBody.appendChild(row);
        });

        if (auditListBody.innerHTML === '') {
            auditListBody.innerHTML = '<tr><td colspan="5" class="p-12 text-center text-gray-500 dark:text-gray-400 italic text-lg font-medium">✨ Aucune amélioration suggérée. Vos données sont parfaites !</td></tr>';
            applyAuditBtn.classList.add('hidden');
        } else {
            applyAuditBtn.classList.remove('hidden');
        }
    }

    async function applySuggestions() {
        const checkboxes = auditListBody.querySelectorAll('.audit-apply-checkbox:checked');
        if (checkboxes.length === 0) {
            auditModal.classList.add('hidden');
            return;
        }

        const confirmMsg = `Vous allez mettre à jour ${checkboxes.length} ingrédients. \n\nIMPORTANT : Ces changements seront également propagés à toutes vos recettes existantes pour garantir la cohérence des unités. \n\nSouhaitez-vous continuer ?`;
        if (!confirm(confirmMsg)) return;

        applyAuditBtn.disabled = true;
        applyAuditBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Application...';

        try {
            const batch = writeBatch(db);
            const changes = [];

            checkboxes.forEach(cb => {
                const id = cb.dataset.id;
                const unit = cb.dataset.unit;
                const category = cb.dataset.cat;

                // Find original name for propagation
                const original = allIngredients.find(i => i.id === id);
                if (original) {
                    changes.push({ name: original.name, oldUnit: original.unit, newUnit: unit });
                }

                batch.update(doc(db, "ingredients", id), { unit, category });
            });

            await batch.commit();

            // Propagate to recipes
            await propagateChangesToRecipes(changes);

            alert(`${checkboxes.length} ingrédients mis à jour et propagés aux recettes !`);
            auditModal.classList.add('hidden');
            await fetchAllData();
        } catch (error) {
            console.error("Batch update failed:", error);
            alert("Erreur lors de la mise à jour : " + error.message);
        } finally {
            applyAuditBtn.disabled = false;
            applyAuditBtn.innerHTML = 'Enregistrer les sélectionnés';
        }
    }

    async function propagateChangesToRecipes(changes) {
        // We only care about name and newUnit
        const recipesSnap = await getDocs(collection(db, "recipes"));
        const batch = writeBatch(db);
        let updatedCount = 0;

        recipesSnap.forEach(recipeDoc => {
            const recipeData = recipeDoc.data();
            let recipeModified = false;
            const updatedIngredients = (recipeData.ingredients || []).map(ing => {
                const change = changes.find(c => c.name === ing.name);
                if (change && ing.unit !== change.newUnit) {
                    recipeModified = true;
                    return { ...ing, unit: change.newUnit };
                }
                return ing;
            });

            if (recipeModified) {
                batch.update(recipeDoc.ref, { ingredients: updatedIngredients });
                updatedCount++;
            }
        });

        if (updatedCount > 0) {
            await batch.commit();
            console.log(`Propagatated changes to ${updatedCount} recipes.`);
        }
    }

    // --- Event Listeners ---
    window.addEventListener('seasonality-config-changed', () => {
        renderIngredients();
    });

    searchBar.addEventListener('input', (e) => {
        const newSearchTerm = e.target.value.toLowerCase();

        // If user starts typing in an empty bar, save the current category
        if (!searchTerm && newSearchTerm) {
            previousActiveCategory = activeCategory;
        }

        searchTerm = newSearchTerm;

        if (searchTerm) {
            const foundIngredient = allIngredients.find(ing => ing.name.toLowerCase().includes(searchTerm));
            if (foundIngredient) {
                activeCategory = foundIngredient.category || 'Inconnue';
            }
        } else {
            // If search is cleared, revert to the saved category
            if (previousActiveCategory) {
                activeCategory = previousActiveCategory;
                previousActiveCategory = null; // Reset for the next search
            }
        }

        renderTabs();
        renderIngredients();
    });

    addIngredientBtn.addEventListener('click', () => ingredientModalManager.open(null, fetchAllIngredients));

    manageCategoriesBtn.addEventListener('click', openCategoryModal);
    closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
    doneCategoryModalBtn.addEventListener('click', closeCategoryModal);
    addCategoryForm.addEventListener('submit', handleAddCategory);

    // Audit IA Listeners
    if (auditBtn) auditBtn.addEventListener('click', handleAudit);
    if (closeAuditBtn) closeAuditBtn.addEventListener('click', () => auditModal.classList.add('hidden'));
    if (applyAuditBtn) applyAuditBtn.addEventListener('click', applySuggestions);

    fetchAllData();
}

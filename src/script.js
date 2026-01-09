// Importe les fonctions Firebase
import { db, functions } from './firebase-config.js';
import { httpsCallable } from "firebase/functions";
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, where, updateDoc, runTransaction, onSnapshot, orderBy } from "firebase/firestore";
import { recipeFormHandler } from './form-handler.js';
import { getCurrentUserId } from './auth.js';
import { openShareModal, openInviteParticipantModal } from './sharing.js';
import { initPlanManagement, getUserPlans, populatePlanSelector, saveHistory, saveOrUpdatePlanSaveByName, archivePlan, createPlan } from './plans.js';
import { toggleFavoriteStatus } from './recipes.js';
import { connectToPresenceChannel, disconnectFromPresenceChannel, updateUserActivity } from './presence.js';
import { seasonManager } from './season-manager.js';
import { ingredientModalManager } from './ingredient-modal.js';

export default function init() {

    // --- DOM Elements ---
    const elements = {
        mealPlanGrid: document.getElementById('meal-plan-grid'),
        currentWeekDisplay: document.getElementById('current-week-display'),
        prevWeekBtn: document.getElementById('prev-week-btn'),
        nextWeekBtn: document.getElementById('next-week-btn'),
        clearMenuBtn: document.getElementById('clear-menu-btn'),
        shoppingListContainer: document.getElementById('shopping-list'),
        startDaySelect: document.getElementById('start-day-select'),
        defaultServingsControl: document.getElementById('default-servings-control'), // Updated
        mealSelectModal: document.getElementById('meal-select-modal'),
        closeMealSelectModalBtn: document.getElementById('close-meal-select-modal'),
        mealSelectModalTitle: document.getElementById('meal-select-modal-title'),
        mealSelectList: document.getElementById('meal-select-list'),
        recipeFormModal: document.getElementById('edit-recipe-form-modal'),
        closeRecipeModalBtn: document.getElementById('close-edit-recipe-modal'),
        cancelRecipeBtn: document.getElementById('edit-cancel-recipe-btn'),
        recipeForm: document.getElementById('edit-recipe-form'),
        addItemInput: document.getElementById('add-item-input'),
        addItemBtn: document.getElementById('add-item-btn'),
        addItemResults: document.getElementById('add-item-results'),
        importListBtn: document.getElementById('import-list-btn'),
        importListModal: document.getElementById('import-list-modal'),
        closeImportListModalBtn: document.getElementById('close-import-list-modal'),
        importListContainer: document.getElementById('import-list-container'),
        exportTxtBtn: document.getElementById('export-txt-btn'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
        exportPlanPdfBtn: document.getElementById('export-plan-pdf-btn'),
        sharePlanBtn: document.getElementById('share-plan-btn'),
        planSelect: document.getElementById('plan-select'),
        inviteParticipantBtn: document.getElementById('invite-participant-btn'),
        historyPlanBtn: document.getElementById('history-plan-btn'),
        planHistoryModal: document.getElementById('plan-history-modal'),
        closePlanHistoryModalBtn: document.getElementById('close-plan-history-modal'),
        planHistoryList: document.getElementById('plan-history-list'),
        savePlanBtn: document.getElementById('save-plan-btn'),
        openTrashBtn: document.getElementById('open-trash-btn'),
        trashCount: document.getElementById('trash-count'),
        trashModal: document.getElementById('trash-modal'),
        closeTrashModalBtn: document.getElementById('close-trash-modal'),
        trashListContainer: document.getElementById('trash-list-container'),
        emptyTrashBtn: document.getElementById('empty-trash-btn'),
        smartPlanBtn: document.getElementById('smart-plan-btn'),
        archivePlanBtn: document.getElementById('archive-plan-btn'),
    };

    // --- New UI Component Functions ---
    function createServingsControl(currentValue, changeCallback) {
        const container = document.createElement('div');
        container.className = 'flex items-center space-x-2';

        const minusBtn = document.createElement('button');
        minusBtn.className = 'btn btn-outline btn-xs';
        minusBtn.textContent = '-';

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'font-medium text-center w-6';
        valueDisplay.textContent = currentValue;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'btn btn-outline btn-xs';
        plusBtn.textContent = '+';

        minusBtn.addEventListener('click', () => {
            let num = parseInt(valueDisplay.textContent, 10);
            if (num > 1) {
                num--;
                valueDisplay.textContent = num;
                changeCallback(num);
            }
        });

        plusBtn.addEventListener('click', () => {
            let num = parseInt(valueDisplay.textContent, 10);
            num++;
            valueDisplay.textContent = num;
            changeCallback(num);
        });

        container.appendChild(minusBtn);
        container.appendChild(valueDisplay);
        container.appendChild(plusBtn);

        return container;
    }

    function createVerticalServingsControl(currentValue, isOverridden, changeCallback, isReadOnly = false) {
        const container = document.createElement('div');
        container.className = 'flex flex-col items-center justify-center h-full';

        const plusBtn = document.createElement('button');
        plusBtn.className = 'text-gray-600 hover:bg-gray-100 p-0 h-4 flex items-center justify-center w-full rounded-md';
        plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
        plusBtn.disabled = isReadOnly;

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'font-medium text-center text-sm my-1';
        valueDisplay.textContent = currentValue;

        const minusBtn = document.createElement('button');
        minusBtn.className = 'text-gray-600 hover:bg-gray-100 p-0 h-4 flex items-center justify-center w-full rounded-md';
        minusBtn.innerHTML = '<i class="fas fa-minus"></i>';
        minusBtn.disabled = isReadOnly;

        if (isOverridden) {
            plusBtn.classList.add('text-white');
            valueDisplay.classList.add('text-white');
            minusBtn.classList.add('text-white');
        }

        if (!isReadOnly) {
            plusBtn.addEventListener('click', () => {
                let num = parseInt(valueDisplay.textContent, 10);
                num++;
                valueDisplay.textContent = num;
                changeCallback(num);
            });

            minusBtn.addEventListener('click', () => {
                let num = parseInt(valueDisplay.textContent, 10);
                if (num > 1) {
                    num--;
                    valueDisplay.textContent = num;
                    changeCallback(num);
                }
            });
        }

        container.appendChild(plusBtn);
        container.appendChild(valueDisplay);
        container.appendChild(minusBtn);

        return container;
    }

    recipeFormHandler.setActivityUpdater(updateUserActivity);

    recipeFormHandler.setOnSaveCallback(async () => {
        // The real-time recipe listener will now handle updates.
        // No need to manually reload everything here.
    });

    // --- State Variables ---
    let currentWeek = 1;
    let startDay = 'Lundi';
    let menuData = {};
    let servingsData = {};
    let remarksData = {};
    const shoppingList = [];
    let draggedItem = null;
    let availableMeals = [];
    let masterIngredientList = [];
    let defaultNumPeople = 1;
    let tooltipTimer = null;
    let currentlyOpenTooltipButton = null;

    let allPlans = [];
    let currentPlan = null;

    const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // --- Helper Functions ---
    function normalizeString(str) {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function sanitizeForFirebaseKey(str) {
        if (!str) return '';
        return str.replace(/\./g, '_');
    }

    async function promptForUnit(ingredientName) {
        const unitModal = document.getElementById('unit-select-modal');
        const title = document.getElementById('unit-modal-title');
        const list = document.getElementById('unit-modal-list');
        const cancelBtn = document.getElementById('unit-modal-cancel');
        title.textContent = `Choisir une unité pour "${ingredientName}"`;
        list.innerHTML = '';
        return new Promise((resolve, reject) => {
            const units = ['g', 'kg', 'ml', 'l', 'pièce(s)', 'c.à.s.', 'c.à.c.', 'pincée(s)'];
            const clickListener = (unit) => {
                unitModal.classList.add('hidden');
                resolve(unit);
            };
            units.forEach(unit => {
                const unitBtn = document.createElement('button');
                unitBtn.className = 'btn btn-outline';
                unitBtn.textContent = unit;
                unitBtn.addEventListener('click', () => clickListener(unit));
                list.appendChild(unitBtn);
            });
            const cancelListener = () => {
                unitModal.classList.add('hidden');
                reject();
            };
            cancelBtn.addEventListener('click', cancelListener, { once: true });
            unitModal.addEventListener('click', (e) => {
                if (e.target === unitModal) cancelListener();
            }, { once: true });
            unitModal.classList.remove('hidden');
        });
    }

    // --- Firebase Functions ---
    async function fetchMasterIngredients() {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "ingredients"));
            masterIngredientList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            masterIngredientList.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Erreur lors de la récupération des ingrédients: ", error);
        }
    }



    function loadWeekDataFromPlan() {
        if (!currentPlan) {
            menuData = {};
            servingsData = {};
            remarksData = {};
            defaultNumPeople = 1;
            startDay = 'Lundi';
        } else {
            const weekData = currentPlan.weeks ? (currentPlan.weeks[currentWeek] || {}) : {};
            menuData = weekData.menuData || {};
            servingsData = weekData.servingsData || {};
            remarksData = weekData.remarksData || {};
            defaultNumPeople = currentPlan.defaultNumPeople || 1;
            startDay = currentPlan.startDay || 'Lundi';
        }

        if (elements.startDaySelect) elements.startDaySelect.value = startDay;
        if (elements.defaultServingsControl) {
            elements.defaultServingsControl.innerHTML = '';
            const defaultServingsComponent = createServingsControl(defaultNumPeople, async (newValue) => {
                defaultNumPeople = newValue;
                if (currentPlan) {
                    await updateCurrentPlan({ defaultNumPeople: newValue }, `a changé le nombre de personnes par défaut à ${newValue}`);
                }
            });
            elements.defaultServingsControl.appendChild(defaultServingsComponent);
        }

        updateWeekDisplay();
        renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
        renderMobilePlanner(document.getElementById('mobile-meal-plan'), { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
        generateShoppingListFromPlan();
    }

    async function updateCurrentPlan(updateData, description) {
        if (!currentPlan) return;
        // Save history BEFORE the update
        await saveHistory(currentPlan.id, currentPlan, description);
        const planRef = doc(db, "plans", currentPlan.id);
        try {
            await updateDoc(planRef, { ...updateData, lastUpdated: new Date() });
        } catch (error) {
            console.error("Error updating plan:", error);
            alert("Une erreur de sauvegarde est survenue.");
        }
    }

    async function loadAndRenderSharedPlans(week) {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const plansRef = collection(db, "plans");
        const q = query(plansRef, where("userId", "==", userId), where("isShared", "==", true), where("week", "==", week));

        try {
            const sharedPlansSnap = await getDocs(q);
            const sharedPlans = sharedPlansSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderSharedPlans(sharedPlans);
        } catch (error) {
            console.error("Error loading shared plans:", error);
        }
    }

    function renderSharedPlans(sharedPlans) {
        const container = elements.sharedPlansModalContainer;
        if (!container) return;

        container.innerHTML = ''; // Clear previous content

        if (sharedPlans.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center p-4">Aucun plan partagé avec vous pour cette semaine.</p>';
            return;
        }

        sharedPlans.forEach(plan => {
            const planItem = document.createElement('div');
            planItem.className = 'flex justify-between items-center p-3 bg-gray-50 rounded-lg';

            const planName = document.createElement('span');
            planName.className = 'font-medium text-gray-800';
            planName.textContent = plan.name || 'Plan partagé';
            planItem.appendChild(planName);

            const buttonsDiv = document.createElement('div');
            buttonsDiv.className = 'flex space-x-2';

            const previewBtn = document.createElement('button');
            previewBtn.className = 'btn btn-outline btn-sm';
            previewBtn.textContent = 'Prévisualiser';
            previewBtn.addEventListener('click', () => previewSharedPlan(plan, sharedPlans));
            buttonsDiv.appendChild(previewBtn);

            const integrateBtn = document.createElement('button');
            integrateBtn.className = 'btn btn-primary btn-sm';
            integrateBtn.textContent = 'Intégrer';
            integrateBtn.addEventListener('click', () => integrateSharedPlan(plan));
            buttonsDiv.appendChild(integrateBtn);

            planItem.appendChild(buttonsDiv);
            container.appendChild(planItem);
        });
    }

    function previewSharedPlan(plan, allSharedPlans) {
        const container = elements.sharedPlansModalContainer;
        if (!container) return;

        container.innerHTML = ''; // Clear the list view

        // Add a back button
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-outline btn-sm mb-4';
        backButton.innerHTML = '<i class="fas fa-arrow-left mr-2"></i> Retour à la liste';
        backButton.addEventListener('click', () => renderSharedPlans(allSharedPlans));
        container.appendChild(backButton);

        // Create the wrapper for the preview
        const planWrapper = document.createElement('div');
        planWrapper.className = 'bg-white rounded-xl shadow-md p-4 overflow-x-auto planner-preview'; // Add the preview class

        const planTitle = document.createElement('h3');
        planTitle.className = 'text-lg font-bold text-gray-700 mb-3';
        planTitle.textContent = plan.name || 'Plan partagé';
        planWrapper.appendChild(planTitle);

        const gridContainer = document.createElement('div');
        gridContainer.className = 'min-w-[1400px]'; // This will be overridden by CSS, but good for structure

        const headerHTML = `
            <div class="grid grid-cols-[100px_35px_repeat(5,_minmax(0,_1fr))_35px_repeat(5,_minmax(0,_1fr))] gap-1 text-center mb-1">
                <div class="p-2"></div>
                <div class="p-2 rounded-t-lg bg-amber-100 text-amber-800 font-bold col-span-6">MIDI</div>
                <div class="p-2 rounded-t-lg bg-stone-200 text-stone-800 font-bold col-span-6">SOIR</div>
                <div class="p-1"></div>
                <div class="p-1 text-xs font-semibold"><i class="fas fa-users"></i></div>
                <div class="p-1 text-xs font-semibold text-gray-600">Entrée</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Plat</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Accomp.</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Dessert</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Remarque</div>
                <div class="p-1 text-xs font-semibold"><i class="fas fa-users"></i></div>
                <div class="p-1 text-xs font-semibold text-gray-600">Entrée</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Plat</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Accomp.</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Dessert</div>
                <div class="p-1 text-xs font-semibold text-gray-600">Remarque</div>
            </div>
        `;
        gridContainer.innerHTML = headerHTML;

        const plannerRowsContainer = document.createElement('div');
        gridContainer.appendChild(plannerRowsContainer);

        planWrapper.appendChild(gridContainer);
        container.appendChild(planWrapper);

        // Render the planner for this shared plan in read-only mode
        renderPlanner(plannerRowsContainer, plan, true);
    }

    async function integrateSharedPlan(plan) {
        if (confirm(`Voulez-vous vraiment intégrer le plan "${plan.name || 'Plan partagé'}" ?\n\nATTENTION : Cela remplacera votre planification actuelle pour la semaine ${currentWeek}.`)) {
            const userId = getCurrentUserId();
            if (!userId) return;

            const planToSave = {
                userId: userId,
                menuData: plan.menuData || {},
                servingsData: plan.servingsData || {},
                remarksData: plan.remarksData || {},
                defaultNumPeople: plan.defaultNumPeople || 1,
                startDay: plan.startDay || 'Lundi',
                lastUpdated: new Date()
                // Note: isShared is NOT included, so it becomes a personal plan.
            };

            try {
                const docRef = doc(db, "plans", `${userId}_semaine-${currentWeek}`);
                await setDoc(docRef, planToSave);

                // Now that it's saved, update the UI
                closeSharedPlansModal();

                // Update the global state
                menuData = planToSave.menuData;
                servingsData = planToSave.servingsData;
                remarksData = planToSave.remarksData;
                defaultNumPeople = planToSave.defaultNumPeople;
                startDay = planToSave.startDay;

                // Update the in-memory representation and re-render
                renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
                const mobilePlanContainer = document.getElementById('mobile-meal-plan');
                if (mobilePlanContainer) {
                    renderMobilePlanner(mobilePlanContainer, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
                }
                generateShoppingListFromPlan();

            } catch (error) {
                console.error("Erreur lors de l'intégration du plan:", error);
                alert("Une erreur est survenue lors de l'intégration du plan.");
            }
        }
    }

    function openSharedPlansModal() {
        elements.sharedPlansModalTitle.textContent = `Plans partagés pour la Semaine ${currentWeek}`;
        elements.sharedPlansModalContainer.innerHTML = '<p class="text-gray-500 text-center p-4">Chargement...</p>';
        elements.sharedPlansModal.classList.remove('hidden');
        loadAndRenderSharedPlans(currentWeek);
    }

    function closeSharedPlansModal() {
        elements.sharedPlansModal.classList.add('hidden');
    }

    function closePlanHistoryModal() {
        elements.planHistoryModal.classList.add('hidden');
    }

    async function rollbackPlan(historyId) {
        if (!currentPlan) return;
        if (!confirm("Voulez-vous vraiment restaurer cette version ? L'état actuel sera sauvegardé dans l'historique avant la restauration.")) return;

        try {
            const historyRef = doc(db, 'plans', currentPlan.id, 'history', historyId);
            const historySnap = await getDoc(historyRef);

            if (!historySnap.exists()) {
                throw new Error("Version de l'historique non trouvée.");
            }

            const planStateToRestore = historySnap.data().planState;

            // First, save the current state to history before rolling back
            await saveHistory(currentPlan.id, currentPlan);

            // Now, restore the old state
            const planRef = doc(db, "plans", currentPlan.id);
            await setDoc(planRef, planStateToRestore); // Use setDoc to overwrite the whole plan

            closePlanHistoryModal();
            // The onSnapshot listener for plans will automatically update the UI.

        } catch (error) {
            console.error("Erreur lors du rollback :", error);
        }
    }

    async function deleteHistoryEntry(historyId, elementToRemove) {
        if (!currentPlan) return;
        if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement cette entrée de l'historique ?")) return;

        try {
            const historyDocRef = doc(db, 'plans', currentPlan.id, 'history', historyId);
            await deleteDoc(historyDocRef);
            // Remove the element from the UI for immediate feedback
            elementToRemove.remove();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'historique :", error);
            alert("Une erreur est survenue lors de la suppression.");
        }
    }

    async function openHistoryModal() {
        if (!currentPlan) return;

        elements.planHistoryList.innerHTML = '<p>Chargement de l\'historique...</p>';
        elements.planHistoryModal.classList.remove('hidden');

        try {
            const historyRef = collection(db, 'plans', currentPlan.id, 'history');
            const q = query(historyRef, orderBy("timestamp", "desc"));
            const querySnapshot = await getDocs(q);

            elements.planHistoryList.innerHTML = '';
            if (querySnapshot.empty) {
                elements.planHistoryList.innerHTML = '<p>Aucun historique pour ce plan.</p>';
                return;
            }

            querySnapshot.forEach(docSnap => {
                const historyData = docSnap.data();
                const historyItem = document.createElement('div');
                historyItem.className = 'p-3 border-b flex justify-between items-center';

                const infoDiv = document.createElement('div');
                const date = historyData.timestamp?.toDate().toLocaleString('fr-FR') || 'Date inconnue';
                const description = historyData.description || 'Modification diverse';
                const modifier = historyData.modifiedByName || 'Inconnu';

                infoDiv.innerHTML = `
                    <p class="font-medium">${modifier} ${description}</p>
                    <p class="text-sm text-gray-500">${date}</p>
                `;

                const buttonsDiv = document.createElement('div');
                buttonsDiv.className = 'flex items-center space-x-2';

                const rollbackBtn = document.createElement('button');
                rollbackBtn.className = 'btn btn-secondary btn-sm';
                rollbackBtn.textContent = 'Revenir à cette version';
                rollbackBtn.addEventListener('click', () => rollbackPlan(docSnap.id));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'text-red-500 hover:bg-red-100 text-sm px-3 py-1 rounded-md';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.title = 'Supprimer cette version';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteHistoryEntry(docSnap.id, historyItem);
                });

                buttonsDiv.appendChild(rollbackBtn);
                buttonsDiv.appendChild(deleteBtn);

                historyItem.appendChild(infoDiv);
                historyItem.appendChild(buttonsDiv);
                elements.planHistoryList.appendChild(historyItem);
            });
        } catch (error) {
            console.error("Erreur de chargement de l'historique:", error);
            elements.planHistoryList.innerHTML = '<p class="text-red-500">Impossible de charger l\'historique.</p>';
        }
    }

    async function handleSmartPlan() {
        if (!currentPlan) return alert("Veuillez d'abord sélectionner un menu.");

        // Choice logic
        if (Object.keys(menuData).length > 0) {
            const createNew = confirm("Un menu existe déjà. Voulez-vous créer un NOUVEAU menu pour cette suggestion ?\n(OK = Nouveau menu, Annuler = Écraser l'actuel)");
            if (createNew) {
                const name = prompt("Nom du nouveau menu :", `Menu Intelligent - ${new Date().toLocaleDateString('fr-FR')}`);
                if (!name) return; // Exit if user cancels name prompt

                elements.smartPlanBtn.disabled = true;
                elements.smartPlanBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Création du menu...';

                const newId = await createPlan(name);
                if (!newId) {
                    elements.smartPlanBtn.disabled = false;
                    elements.smartPlanBtn.innerHTML = '<i class="fas fa-magic mr-1 md:mr-2"></i> Menu Intelligent';
                    return;
                }

                // We must select the new plan. 
                // Since the listener updates allPlans, we might need to find it once it arrives.
                // But for the sake of the next steps, we can forge it.
                const newPlan = { id: newId, name: name, userId: getCurrentUserId(), weeks: {}, isOwner: true };
                allPlans.push(newPlan);
                elements.planSelect.value = newId;
                loadPlanFromSelection();
            } else {
                if (!confirm("Voulez-vous vraiment ÉCRASER le menu actuel ?")) return;
            }
        }

        elements.smartPlanBtn.disabled = true;
        const originalContent = elements.smartPlanBtn.innerHTML;
        elements.smartPlanBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Chef Gusto réfléchit...';

        try {
            // 1. Get all recipes
            const recipesSnap = await getDocs(collection(db, "recipes"));
            const allRecipesForSmart = recipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // 2. Get history (last 3 weeks)
            const userId = getCurrentUserId();
            const plansSnap = await getDocs(query(collection(db, "plans"), where("userId", "==", userId), orderBy("lastUpdated", "desc")));
            const recentHistory = [];
            plansSnap.docs.slice(0, 3).forEach(doc => {
                const data = doc.data();
                if (data.weeks) {
                    Object.values(data.weeks).forEach(w => {
                        if (w.menuData) {
                            Object.values(w.menuData).forEach(day => {
                                if (day.MIDI) recentHistory.push(day.MIDI);
                                if (day.SOIR) recentHistory.push(day.SOIR);
                            });
                        }
                    });
                }
            });

            // 3. Call AI
            const suggestMenu = httpsCallable(functions, 'suggestMenu');
            const result = await suggestMenu({
                recipes: allRecipesForSmart,
                history: [...new Set(recentHistory)],
                season: seasonManager.getCurrentSeason()
            });

            const suggestedMenu = result.data.menu;
            const description = result.data.description;

            // 4. Update menuData locally with correct slot mapping
            // Slot format: "dayIndex-mealType-categoryIndex"
            // categoryIndex for "Plat" is 1
            const daysMap = { "Lundi": 0, "Mardi": 1, "Mercredi": 2, "Jeudi": 3, "Vendredi": 4, "Samedi": 5, "Dimanche": 6 };
            const newMenuData = JSON.parse(JSON.stringify(menuData)); // Keep existing if we only want to overwrite plats

            for (const [dayName, meals] of Object.entries(suggestedMenu)) {
                const dayIndex = daysMap[dayName];
                if (dayIndex === undefined) continue;

                const mapMeal = (recipeName, mealType) => {
                    const slotId = `${dayIndex}-${mealType === 'MIDI' ? 'lunch' : 'dinner'}-1`;
                    if (recipeName) {
                        const recipe = allRecipesForSmart.find(r => r.name === recipeName);
                        if (recipe) {
                            newMenuData[slotId] = [{ id: recipe.id }];
                        } else {
                            // Fallback if AI used a slightly different name (unlikely with constraints)
                            console.warn(`Recipe not found for Smart Plan: ${recipeName}`);
                        }
                    } else {
                        delete newMenuData[slotId];
                    }
                };

                mapMeal(meals.MIDI, 'MIDI');
                mapMeal(meals.SOIR, 'SOIR');
            }

            // 5. Save to Firestore
            await updateCurrentPlan({ [`weeks.${currentWeek}.menuData`]: newMenuData }, description || "Génération Smart Plan par l'IA");

            // 6. Immediate UI Refresh
            menuData = newMenuData;
            renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
            const mobilePlanContainer = document.getElementById('mobile-meal-plan');
            if (mobilePlanContainer) {
                renderMobilePlanner(mobilePlanContainer, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
            }
            generateShoppingListFromPlan();

            alert(description || "Menu généré avec succès !");

        } catch (error) {
            console.error("Smart Plan error:", error);
            alert("Erreur lors de la génération : " + error.message);
        } finally {
            elements.smartPlanBtn.disabled = false;
            elements.smartPlanBtn.innerHTML = originalContent;
        }
    }


    async function clearMenu() {
        if (!currentPlan) {
            alert("Veuillez d'abord sélectionner un plan.");
            return;
        }
        if (confirm(`Voulez-vous vraiment vider le menu de la semaine ${currentWeek} pour le plan "${currentPlan.name}" ?`)) {
            menuData = {};
            servingsData = {};
            remarksData = {};

            // 1. Re-render the empty plan (Desktop)
            renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);

            // 2. Refresh Mobile UI if needed
            const mobilePlanContainer = document.getElementById('mobile-meal-plan');
            if (mobilePlanContainer) {
                renderMobilePlanner(mobilePlanContainer, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
            }

            // 3. Save the cleared week data to Firestore
            await updateCurrentPlan({
                [`weeks.${currentWeek}.menuData`]: {},
                [`weeks.${currentWeek}.servingsData`]: {},
                [`weeks.${currentWeek}.remarksData`]: {}
            }, "a vidé le menu de la semaine");

            // 4. Update shopping list
            generateShoppingListFromPlan();
        }
    }

    function renderMobilePlanner(container, plan, isReadOnly = false) {
        if (!container) return;

        const planMenuData = plan.menuData || {};
        const planServingsData = plan.servingsData || {};
        const planRemarksData = plan.remarksData || {};
        const planDefaultNumPeople = plan.defaultNumPeople || 1;
        const planStartDay = plan.startDay || 'Lundi';

        container.innerHTML = ''; // Clear previous content
        const mobileContent = document.createDocumentFragment();

        const startDayIndex = allDays.indexOf(planStartDay);
        const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

        weekDays.forEach(dayName => {
            const dayOriginalIndex = allDays.indexOf(dayName);

            // Card for each day
            const dayCard = document.createElement('div');
            dayCard.className = 'bg-blue-100 border border-blue-300 rounded-xl shadow-md p-4 mb-4';

            // Day title
            const dayTitle = document.createElement('h3');
            dayTitle.className = 'text-xl font-bold text-gray-800 dark:text-gray-800 mb-3';
            dayTitle.textContent = dayName.toUpperCase();
            dayCard.appendChild(dayTitle);

            const mealsContainer = document.createElement('div');
            mealsContainer.className = 'space-y-4';

            ['lunch', 'dinner'].forEach(mealType => {
                const mealSection = document.createElement('div');
                mealSection.className = `border-t pt-3 ${mealType === 'lunch' ? 'bg-amber-50' : 'bg-stone-100'} rounded-lg p-2`;

                const mealHeader = document.createElement('div');
                mealHeader.className = 'flex justify-between items-center mb-2';

                const mealTitle = document.createElement('h4');
                mealTitle.className = 'text-lg font-semibold text-tomato';
                mealTitle.textContent = mealType === 'lunch' ? 'Midi' : 'Soir';
                mealHeader.appendChild(mealTitle);

                if (!isReadOnly) {
                    const servingsKey = `${dayOriginalIndex}-${mealType}`;
                    const currentValue = planServingsData[servingsKey] || planDefaultNumPeople;
                    const servingsControl = createServingsControl(currentValue, (newValue) => {
                        handleServingsChange(servingsKey, newValue);
                    });
                    mealHeader.appendChild(servingsControl);
                }

                mealSection.appendChild(mealHeader);

                const mealSlotsContainer = document.createElement('div');
                mealSlotsContainer.className = 'space-y-2';

                let hasContent = false;
                const categories = ['Entrée', 'Plat', 'Accompagnement', 'Dessert', 'Remarque'];

                for (let i = 0; i < categories.length; i++) {
                    const categoryName = categories[i];
                    const slotId = `${dayOriginalIndex}-${mealType}-${i}`;
                    const mealsInSlot = planMenuData[slotId];

                    const categoryWrapper = document.createElement('div');
                    categoryWrapper.className = 'mb-2';

                    const categoryHeader = document.createElement('h5');
                    categoryHeader.className = 'text-md font-semibold text-gray-700 mb-1';
                    categoryHeader.textContent = categoryName;
                    categoryWrapper.appendChild(categoryHeader);

                    if (categoryName === 'Remarque') {
                        categoryWrapper.appendChild(createRemarkElement(slotId, planRemarksData, isReadOnly));
                    } else {
                        const mealsList = document.createElement('div');
                        mealsList.className = 'space-y-1';

                        if (Array.isArray(mealsInSlot) && mealsInSlot.length > 0) {
                            hasContent = true;
                            mealsInSlot.forEach((mealRef, index) => {
                                const fullMeal = availableMeals.find(m => m.id === mealRef.id);
                                if (fullMeal) {
                                    const mealCard = createMealCardElement(fullMeal, slotId, index, isReadOnly);
                                    mealCard.classList.remove('bg-white', 'shadow-sm');
                                    mealCard.classList.add('bg-emerald-200', 'border', 'border-emerald-400');

                                    if (!isReadOnly) {
                                        const editButton = mealCard.querySelector('.edit-meal-btn');
                                        const deleteButton = mealCard.querySelector('.delete-meal-btn');
                                        if (editButton) editButton.classList.remove('hidden');
                                        if (deleteButton) deleteButton.classList.remove('hidden');
                                    }
                                    mealsList.appendChild(mealCard);
                                }
                            });
                        }

                        if (!isReadOnly) {
                            const addMealButton = document.createElement('button');
                            addMealButton.className = 'btn btn-outline btn-sm w-full mt-2';
                            addMealButton.innerHTML = `<i class="fas fa-plus mr-2"></i> Ajouter une ${categoryName.toLowerCase()}`;
                            addMealButton.addEventListener('click', () => {
                                openMealSelectModal(slotId);
                            });
                            mealsList.appendChild(addMealButton);
                        } else if (!hasContent) {
                            mealsList.innerHTML = '<p class="text-sm text-gray-500 italic">Aucun plat prévu.</p>';
                        }
                        categoryWrapper.appendChild(mealsList);
                    }
                    mealSlotsContainer.appendChild(categoryWrapper);
                }

                mealSection.appendChild(mealSlotsContainer);
                mealsContainer.appendChild(mealSection);
            });

            dayCard.appendChild(mealsContainer);
            mobileContent.appendChild(dayCard);
        });

        container.appendChild(mobileContent);
        // No need for attachPlannerListeners here as we handle clicks directly
    }

    function renderPlanner(container, plan, isReadOnly = false) {
        if (!container) return;

        const planMenuData = plan.menuData || {};
        const planServingsData = plan.servingsData || {};
        const planRemarksData = plan.remarksData || {};
        const planDefaultNumPeople = plan.defaultNumPeople || 1;
        const planStartDay = plan.startDay || 'Lundi';

        // The header for the planner grid is static in the HTML, so we only render the rows.
        const gridContent = document.createDocumentFragment();

        const mealTypes = ['lunch', 'dinner'];
        const subSlotsCount = 5;
        const startDayIndex = allDays.indexOf(planStartDay);
        const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

        weekDays.forEach(dayName => {
            const dayOriginalIndex = allDays.indexOf(dayName);
            const dayRow = document.createElement('div');
            dayRow.className = 'grid grid-cols-[100px_35px_repeat(5,_minmax(0,_1fr))_35px_repeat(5,_minmax(0,_1fr))] items-stretch border-b border-gray-300';

            const dayHeader = document.createElement('div');
            dayHeader.className = 'font-bold p-2 flex items-center justify-center bg-gray-100 dark:bg-gray-100 text-sm border-r border-gray-300 text-gray-800 dark:text-gray-800';
            dayHeader.textContent = dayName.toUpperCase();
            dayRow.appendChild(dayHeader);

            mealTypes.forEach(mealType => {
                const servingsKey = `${dayOriginalIndex}-${mealType}`;
                const currentValue = planServingsData[servingsKey] || planDefaultNumPeople;
                const isOverridden = planServingsData.hasOwnProperty(servingsKey);

                const servingsCell = document.createElement('div');
                const servingsControl = createVerticalServingsControl(currentValue, isOverridden, (newValue) => {
                    handleServingsChange(servingsKey, newValue);
                }, isReadOnly); // Pass read-only flag

                let cellClasses = 'border-r border-gray-300 flex items-center justify-center transition-colors duration-300';
                if (isOverridden) cellClasses += ' bg-tomato';
                else cellClasses += (mealType === 'lunch') ? ' bg-amber-50' : ' bg-stone-100';
                servingsCell.className = cellClasses;
                servingsCell.appendChild(servingsControl);
                dayRow.appendChild(servingsCell);

                for (let i = 0; i < subSlotsCount; i++) {
                    const slotId = `${dayOriginalIndex}-${mealType}-${i}`;
                    const mealsInSlot = planMenuData[slotId];
                    const mealSlotDiv = document.createElement('div');
                    const category = getCategoryFromSlotId(slotId);

                    let slotClasses = 'meal-slot p-1 min-h-[70px] flex flex-col justify-start border-r border-gray-300';
                    slotClasses += (mealType === 'lunch') ? ' bg-amber-50' : ' bg-stone-100';
                    mealSlotDiv.className = slotClasses;
                    mealSlotDiv.dataset.slotId = slotId;

                    if (category === 'Remarque') {
                        mealSlotDiv.appendChild(createRemarkElement(slotId, planRemarksData, isReadOnly));
                    } else if (Array.isArray(mealsInSlot) && mealsInSlot.length > 0) {
                        const cardsContainer = document.createElement('div');
                        cardsContainer.className = 'w-full';
                        mealsInSlot.forEach((mealRef, index) => {
                            // Find the full, up-to-date meal object from the reference ID
                            const fullMeal = availableMeals.find(m => m.id === mealRef.id);
                            if (fullMeal) {
                                cardsContainer.appendChild(createMealCardElement(fullMeal, slotId, index, isReadOnly));
                            } else {
                                // Handle case where recipe was deleted but reference still exists in plan
                                const deletedCard = document.createElement('div');
                                deletedCard.className = 'p-1 bg-red-100 text-red-700 rounded shadow-sm text-center text-xs font-medium';
                                deletedCard.textContent = 'Recette supprimée';
                                cardsContainer.appendChild(deletedCard);
                            }
                        });
                        mealSlotDiv.appendChild(cardsContainer);
                        if (!isReadOnly) {
                            mealSlotDiv.appendChild(createAddElement(slotId, true));
                        }
                    } else {
                        if (!isReadOnly) {
                            mealSlotDiv.appendChild(createAddElement(slotId, false));
                        }
                    }
                    dayRow.appendChild(mealSlotDiv);
                }
            });
            gridContent.appendChild(dayRow);
        });

        // Replace container's content
        container.innerHTML = '';
        container.appendChild(gridContent);

        if (!isReadOnly) {
            attachPlannerListeners();
        }
    }


    async function fetchSavedLists() {
        const userId = getCurrentUserId();
        if (!db || !userId) return [];
        try {
            const q = query(collection(db, "shopping_lists"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            const allUserLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filter out lists that are shared with the user
            const personalLists = allUserLists.filter(list => list.isShared !== true);
            return personalLists;
        } catch (error) {
            console.error("Erreur de chargement des listes de courses sauvegardées: ", error);
            return [];
        }
    }

    async function openImportListModal() {
        const savedLists = await fetchSavedLists();
        elements.importListContainer.innerHTML = '';
        if (savedLists.length === 0) {
            elements.importListContainer.innerHTML = '<p class="text-center text-gray-500">Aucune liste sauvegardée.</p>';
            return;
        }

        savedLists.forEach(list => {
            const listButton = document.createElement('button');
            listButton.className = 'w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150';
            listButton.textContent = list.name;
            listButton.addEventListener('click', () => {
                if (confirm(`Voulez-vous vraiment importer les ingrédients de la liste "${list.name}" ?`)) {
                    list.ingredients.forEach(ingredient => {
                        const quantity = parseFloat(String(ingredient.quantity).replace(',', '.')) || 0;
                        addIngredientToShoppingList(ingredient.name, quantity, ingredient.unit);
                    });
                    closeImportListModal();
                }
            });
            elements.importListContainer.appendChild(listButton);
        });

        elements.importListModal.classList.remove('hidden');
    }

    function closeImportListModal() {
        elements.importListModal.classList.add('hidden');
    }

    // --- UI Functions & Event Handlers ---
    function setupShoppingListAutocomplete() {
        elements.addItemInput?.addEventListener('input', () => {
            const searchTerm = elements.addItemInput.value.toLowerCase();
            const resultsContainer = elements.addItemResults;
            resultsContainer.innerHTML = '';
            if (!searchTerm) {
                resultsContainer.classList.add('hidden');
                return;
            }

            let filtered = masterIngredientList.filter(i => i.name.toLowerCase().includes(searchTerm));

            // Seasonality Logic
            filtered.forEach(item => item.seasonScore = seasonManager.getIngredientScore(item));

            // Sort: Score DESC, then Name ASC
            filtered.sort((a, b) => {
                if (b.seasonScore !== a.seasonScore) return b.seasonScore - a.seasonScore;
                return a.name.localeCompare(b.name);
            });

            filtered.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center'; // Flex for badge

                const textSpan = document.createElement('span');
                textSpan.textContent = item.name;
                resultItem.appendChild(textSpan);

                // Season Badge
                if (seasonManager.config.mode !== 'disabled') {
                    if (item.seasonScore === 2) {
                        const badge = document.createElement('span');
                        badge.className = 'text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200 ml-2 whitespace-nowrap';
                        badge.textContent = 'De saison'; // Simple text
                        resultItem.appendChild(badge);
                    } else if (item.seasonScore === 0) {
                        const badge = document.createElement('span');
                        badge.className = 'text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full border border-gray-200 ml-2 whitespace-nowrap';
                        badge.textContent = 'Hors saison';
                        resultItem.appendChild(badge);
                        resultItem.classList.add('opacity-75'); // Slight dim
                    }
                }

                resultItem.addEventListener('click', () => {
                    addIngredientToShoppingList(item.name, 1, item.unit);
                    elements.addItemInput.value = '';
                    resultsContainer.classList.add('hidden');
                });
                resultsContainer.appendChild(resultItem);
            });

            const createItem = document.createElement('div');
            createItem.className = 'p-2 bg-green-50 hover:bg-green-200 cursor-pointer font-bold text-green-700';
            createItem.textContent = `+ Créer "${elements.addItemInput.value}"`;

            createItem.addEventListener('click', () => {
                const newName = elements.addItemInput.value;
                ingredientModalManager.open(newName, async () => {
                    await fetchMasterIngredients(); // Refresh master list
                    // Find the new ingredient to get its unit
                    const newIng = masterIngredientList.find(i => i.name === newName);
                    const unit = newIng ? newIng.unit : '';
                    addIngredientToShoppingList(newName, 1, unit);
                    elements.addItemInput.value = '';
                    resultsContainer.classList.add('hidden');
                });
            });
            resultsContainer.appendChild(createItem);
            resultsContainer.classList.remove('hidden');
        });

        elements.addItemBtn?.addEventListener('click', () => {
            const text = elements.addItemInput.value;
            if (text) {
                addIngredientToShoppingList(text, 1, '');
                elements.addItemInput.value = '';
                elements.addItemResults.classList.add('hidden');
            }
        });

        document.addEventListener('click', (e) => {
            if (elements.addItemInput && !elements.addItemInput.contains(e.target) && !elements.addItemResults.contains(e.target)) {
                elements.addItemResults.classList.add('hidden');
            }
        });
    }

    function exportToTxt() {
        if (shoppingList.length === 0) {
            alert("La liste de courses est vide.");
            return;
        }

        const groupedList = shoppingList.reduce((acc, item) => {
            const category = item.category || 'Inconnue';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(groupedList).sort((a, b) => {
            if (a === 'Inconnue') return 1;
            if (b === 'Inconnue') return -1;
            return a.localeCompare(b);
        });

        let txtContent = "Liste de courses - GustoPlan\n\n";
        sortedCategories.forEach(category => {
            txtContent += `--- ${category.toUpperCase()} ---\n`;
            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));
            itemsInCategory.forEach(item => {
                const formattedQuantity = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                let line = `${formattedQuantity} ${item.unit || ''} ${item.name}`;

                // Add annotations
                if (item.sources && item.sources.length > 0) {
                    const groupedSources = item.sources.reduce((acc, source) => {
                        const servingsText = source.servings ? ` - ${source.servings} pers.` : '';
                        const key = `${source.recipeName} (${source.day} ${source.time})${servingsText}`;
                        if (!acc[key]) {
                            acc[key] = 0;
                        }
                        acc[key] += source.quantity;
                        return acc;
                    }, {});

                    const annotationString = Object.keys(groupedSources).join(' / ');
                    line += ` *** ${annotationString} ***`;
                }
                txtContent += line + '\n';
            });
            txtContent += "\n";
        });

        const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "liste-de-courses.txt");
    }

    function exportToPdf() {
        if (shoppingList.length === 0) {
            alert("La liste de courses est vide.");
            return;
        }
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const groupedList = shoppingList.reduce((acc, item) => {
            const category = item.category || 'Inconnue';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(groupedList).sort((a, b) => {
            if (a === 'Inconnue') return 1;
            if (b === 'Inconnue') return -1;
            return a.localeCompare(b);
        });

        doc.setFontSize(18);
        doc.text("Liste de courses - GustoPlan", 14, 22);
        let y = 35;
        const pageHeight = doc.internal.pageSize.height;
        const bottomMargin = 20;

        const checkPageBreak = () => {
            if (y > pageHeight - bottomMargin) {
                doc.addPage();
                y = 20;
            }
        };

        sortedCategories.forEach(category => {
            checkPageBreak();
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`--- ${category.toUpperCase()} ---`, 14, y);
            y += 8;
            doc.setFont(undefined, 'normal');

            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));
            itemsInCategory.forEach(item => {
                checkPageBreak();
                doc.setFontSize(12);
                const formattedQuantity = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                doc.text(`${formattedQuantity} ${item.unit || ''} ${item.name}`, 14, y);
                y += 6;

                // Add annotations
                if (item.sources && item.sources.length > 0) {
                    const groupedSources = item.sources.reduce((acc, source) => {
                        const servingsText = source.servings ? ` - ${source.servings} pers.` : '';
                        const key = `${source.recipeName} (${source.day} ${source.time})${servingsText}`;
                        if (!acc[key]) {
                            acc[key] = 0;
                        }
                        acc[key] += source.quantity;
                        return acc;
                    }, {});

                    doc.setFontSize(9);
                    doc.setTextColor(100); // a shade of gray

                    for (const key in groupedSources) {
                        checkPageBreak();
                        doc.text(`  * ${key}`, 18, y);
                        y += 5;
                    }
                    doc.setTextColor(0); // reset to black
                }
                y += 2; // small space after each ingredient
            });
            y += 5; // Extra space between categories
        });

        doc.save("liste-de-courses.pdf");
    }

    async function exportPlanToPDF() {
        if (!currentPlan) {
            alert("Veuillez sélectionner un menu à exporter.");
            return;
        }

        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');

        try {
            const { jsPDF } = window.jspdf;
            const pdfDoc = new jsPDF();

            const planRef = doc(db, "plans", currentPlan.id);
            const planSnap = await getDoc(planRef);
            const fullPlan = planSnap.exists() ? planSnap.data() : null;

            if (!fullPlan || !fullPlan.weeks) {
                alert("Ce menu est vide et ne peut pas être exporté.");
                return;
            }

            pdfDoc.setFontSize(18);
            pdfDoc.text(`Menu de Repas : ${fullPlan.name}`, 14, 20);

            const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
            const categories = { '0': 'E', '1': 'P', '2': 'A', '3': 'D' }; // Abrégé pour la clarté

            const sortedWeeks = Object.keys(fullPlan.weeks).sort((a, b) => parseInt(a) - parseInt(b));
            let firstTable = true;

            for (const weekNumber of sortedWeeks) {
                const weekData = fullPlan.weeks[weekNumber];
                const menu = weekData.menuData || {};

                if (Object.keys(menu).length === 0) {
                    continue; // Skip empty weeks
                }

                const head = [['Jour', 'Midi', 'Soir']];
                const body = [];
                const startDayIndex = allDays.indexOf(fullPlan.startDay || 'Lundi');
                const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

                for (const dayName of weekDays) {
                    const dayIndex = allDays.indexOf(dayName);
                    let lunchMeals = [];
                    let dinnerMeals = [];

                    for (const mealType of ['lunch', 'dinner']) {
                        for (const catIndex in categories) {
                            const slotId = `${dayIndex}-${mealType}-${catIndex}`;
                            if (menu[slotId] && Array.isArray(menu[slotId])) {
                                menu[slotId].forEach(meal => {
                                    const mealText = `[${categories[catIndex]}] ${meal.name}`;
                                    if (mealType === 'lunch') {
                                        lunchMeals.push(mealText);
                                    } else {
                                        dinnerMeals.push(mealText);
                                    }
                                });
                            }
                        }
                    }
                    body.push([dayName, lunchMeals.join('\n') || '-', dinnerMeals.join('\n') || '-']);
                }

                pdfDoc.setFontSize(14);
                const startY = firstTable ? 30 : pdfDoc.autoTable.previous.finalY + 20;
                pdfDoc.text(`Semaine ${weekNumber}`, 14, startY - 5);

                pdfDoc.autoTable({
                    startY: startY,
                    head: head,
                    body: body,
                    theme: 'grid',
                    styles: { cellPadding: 2, fontSize: 8, valign: 'middle' },
                    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
                    alternateRowStyles: { fillColor: [245, 245, 245] },
                });

                firstTable = false;
            }

            pdfDoc.save(`menu_${fullPlan.name.replace(/ /g, '_')}.pdf`);

        } catch (error) {
            console.error("Erreur lors de la génération du PDF du plan :", error);
            alert("Une erreur est survenue lors de la création du PDF.");
        } finally {
            if (loadingOverlay) loadingOverlay.classList.add('hidden');
        }
    } async function addIngredientToShoppingList(name, quantity, unit, isAdjustment = false) {
        if (!currentPlan) return alert("Veuillez sélectionner un menu.");

        const planRef = doc(db, "plans", currentPlan.id);
        try {
            await runTransaction(db, async (transaction) => {
                const planDoc = await transaction.get(planRef);
                if (!planDoc.exists()) {
                    throw "Le menu n'existe plus.";
                }

                const currentItems = planDoc.data().manualItems || [];
                const key = `${name.trim().toLowerCase()}_${unit || ''}`;
                const itemIndex = currentItems.findIndex(item => `${item.name.trim().toLowerCase()}_${item.unit || ''}` === key);

                if (itemIndex > -1) {
                    // Si l'ajustement existe déjà, on met à jour sa quantité
                    currentItems[itemIndex].totalQuantity += quantity;
                } else {
                    // Sinon, on crée un nouvel ajustement manuel
                    const masterIngredient = masterIngredientList.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
                    currentItems.push({
                        name: name.trim(),
                        totalQuantity: quantity,
                        unit: unit,
                        source: 'manual',
                        category: (masterIngredient === null || masterIngredient === void 0 ? void 0 : masterIngredient.category) || 'Inconnue'
                    });
                }

                // On ne filtre PLUS les éléments à 0 (pour qu'ils aillent dans la corbeille)
                // Sauf si c'est un ajustement qui annule exactement une recette (cas rare, mais on garde pour l'instant)
                // Pour le fix corbeille : on garde tout. La vue filtrera les items actifs (>0).
                const finalItems = currentItems;

                transaction.update(planRef, { manualItems: finalItems, lastUpdated: new Date() });
            });
        } catch (error) {
            console.error("Erreur transactionnelle lors de l'ajustement de l'ingrédient: ", error);
            alert("Une erreur de synchronisation est survenue. Veuillez réessayer.");
        }
    }

    function getIncrementStep(unit) {
        const lowerUnit = unit ? unit.toLowerCase() : '';
        if (lowerUnit.includes('g') || lowerUnit.includes('ml')) {
            return 10;
        }
        return 1;
    }

    function updateTrashUI(deletedItems) {
        if (elements.openTrashBtn) {
            elements.openTrashBtn.classList.remove('hidden'); // Always visible now
            if (elements.trashCount) {
                elements.trashCount.textContent = deletedItems.length;
                if (deletedItems.length > 0) {
                    elements.trashCount.classList.remove('bg-gray-200');
                    elements.trashCount.classList.add('bg-red-500', 'text-white');
                } else {
                    elements.trashCount.classList.add('bg-gray-200');
                    elements.trashCount.classList.remove('bg-red-500', 'text-white');
                }
            }
        }

        if (deletedItems && deletedItems.length > 0) {

            if (elements.emptyTrashBtn) {
                elements.emptyTrashBtn.classList.remove('hidden');
                // Clone to remove old listeners if any
                const newEmptyBtn = elements.emptyTrashBtn.cloneNode(true);
                elements.emptyTrashBtn.parentNode.replaceChild(newEmptyBtn, elements.emptyTrashBtn);
                elements.emptyTrashBtn = newEmptyBtn;

                elements.emptyTrashBtn.addEventListener('click', async () => {
                    if (!currentPlan || !confirm("Voulez-vous supprimer définitivement tous les éléments de la corbeille ?")) return;
                    const planRef = doc(db, "plans", currentPlan.id);
                    const itemsToHide = deletedItems.map(i => `${i.name}_${i.unit || ''}`);

                    try {
                        await import('firebase/firestore').then(module => {
                            module.updateDoc(planRef, {
                                hiddenTrashItems: module.arrayUnion(...itemsToHide),
                                lastUpdated: new Date()
                            });
                        });
                        elements.trashModal.classList.add('hidden');
                    } catch (error) {
                        console.error("Erreur vidage corbeille:", error);
                    }
                });
            }

            if (elements.trashListContainer) {
                elements.trashListContainer.innerHTML = '';
                const deletedUl = document.createElement('ul');
                deletedUl.className = 'space-y-2';

                deletedItems.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'p-2 rounded bg-gray-100 flex justify-between items-center group';

                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'text-sm text-gray-500 line-through';
                    nameSpan.textContent = item.name;
                    li.appendChild(nameSpan);

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'flex items-center space-x-2';

                    const restoreBtn = document.createElement('button');
                    restoreBtn.className = 'btn btn-xs btn-outline text-blue-600 hover:bg-blue-50 border-blue-300';
                    restoreBtn.innerHTML = '<i class="fas fa-undo mr-1"></i> Restaurer';
                    restoreBtn.addEventListener('click', async () => {
                        if (!currentPlan) return;
                        const planRef = doc(db, "plans", currentPlan.id);
                        try {
                            await runTransaction(db, async (transaction) => {
                                const planDoc = await transaction.get(planRef);
                                if (!planDoc.exists()) return;

                                const currentItems = planDoc.data().manualItems || [];
                                const itemIndex = currentItems.findIndex(i => i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit);

                                if (itemIndex > -1) {
                                    if (item.source === 'manual') {
                                        // Si c'est un item manuel, on le restaure à 1 (ou sa valeur par défaut)
                                        currentItems[itemIndex].totalQuantity = 1;
                                    } else {
                                        // Si c'est un ajustement de recette, on le supprime pour revenir à la valeur calculée
                                        currentItems.splice(itemIndex, 1);
                                    }
                                }

                                transaction.update(planRef, { manualItems: currentItems, lastUpdated: new Date() });
                            });
                            // If it was the last item, close modal
                            if (deletedItems.length <= 1) elements.trashModal.classList.add('hidden');
                        } catch (error) {
                            console.error("Erreur lors de la restauration :", error);
                        }
                    });

                    const deleteForeverBtn = document.createElement('button');
                    deleteForeverBtn.className = 'text-gray-400 hover:text-red-600 text-xs p-1 rounded-md';
                    deleteForeverBtn.title = "Supprimer définitivement";
                    deleteForeverBtn.innerHTML = '<i class="fas fa-times"></i>';
                    deleteForeverBtn.addEventListener('click', async () => {
                        if (!currentPlan) return;
                        const planRef = doc(db, "plans", currentPlan.id);
                        const key = `${item.name}_${item.unit || ''}`;
                        try {
                            await import('firebase/firestore').then(module => {
                                module.updateDoc(planRef, {
                                    hiddenTrashItems: module.arrayUnion(key),
                                    lastUpdated: new Date()
                                });
                            });
                            // If it was the last item, close modal
                            if (deletedItems.length <= 1) elements.trashModal.classList.add('hidden');
                        } catch (error) {
                            console.error("Erreur suppression définitive:", error);
                        }
                    });

                    actionsDiv.appendChild(restoreBtn);
                    actionsDiv.appendChild(deleteForeverBtn);
                    li.appendChild(actionsDiv);
                    deletedUl.appendChild(li);
                });
                elements.trashListContainer.appendChild(deletedUl);
            }
        } else {
            // When no deleted items, still show trash button, but clear modal content and hide empty trash button
            if (elements.trashListContainer) elements.trashListContainer.innerHTML = '<p class="text-center text-gray-500 italic py-4">La corbeille est vide.</p>';
            if (elements.emptyTrashBtn) elements.emptyTrashBtn.classList.add('hidden');
        }
    }

    function renderShoppingList(deletedItems = []) {
        // Always update trash UI first, regardless of shopping list state
        updateTrashUI(deletedItems);

        const container = elements.shoppingListContainer;
        if (!container) return;
        container.innerHTML = '';
        if (shoppingList.length === 0 && deletedItems.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 italic py-4">Votre liste de courses est vide.</p>';
            return;
        }

        // Use checked items from the current plan (synced via Firestore)
        const checkedItems = currentPlan ? (currentPlan.checkedItems || {}) : {};

        const groupedList = shoppingList.reduce((acc, item) => {
            const category = item.category || 'Inconnue';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {});

        const sortedCategories = Object.keys(groupedList).sort((a, b) => {
            if (a === 'Inconnue') return 1;
            if (b === 'Inconnue') return -1;
            return a.localeCompare(b);
        });

        sortedCategories.forEach(category => {
            const categoryHeader = document.createElement('h4');
            categoryHeader.className = 'text-sm font-bold text-stone-800 bg-stone-200 mt-4 mb-2 px-3 py-1 rounded-md';
            categoryHeader.textContent = category;
            container.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            ul.className = 'space-y-2'; // Increased spacing for annotations
            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));

            itemsInCategory.forEach(item => {
                const unsanitizedKey = `${item.name}_${item.unit || ''}`;
                const key = sanitizeForFirebaseKey(unsanitizedKey);
                const isChecked = checkedItems.hasOwnProperty(key) ? checkedItems[key] : (checkedItems[unsanitizedKey] || false);

                const li = document.createElement('li');
                let liClasses = 'p-2 rounded';

                const isManual = item.hasManualEntry === true || item.source === 'manual';
                if (isManual) {
                    li.style.backgroundColor = "#ffedd5"; // Force orange background
                    liClasses += ' bg-orange-100';
                } else {
                    liClasses += ' bg-gray-50';
                }
                li.className = liClasses;

                const mainRow = document.createElement('div');
                mainRow.className = 'flex justify-between items-center';

                // Item Name (with checkmark if applicable)
                const nameContainer = document.createElement('div');
                nameContainer.className = 'flex-grow flex items-center';

                if (isChecked) {
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check mr-2 bg-green-500 text-white rounded-full p-1 flex items-center justify-center w-5 h-5';
                    nameContainer.appendChild(checkIcon);
                }

                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-sm font-medium transition-all duration-200'; // Slightly larger text
                if (isChecked) {
                    nameSpan.classList.add('line-through', 'text-gray-400');
                }
                nameSpan.textContent = item.name;
                nameContainer.appendChild(nameSpan);

                mainRow.appendChild(nameContainer);

                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'flex items-center space-x-2 mx-2';

                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'font-medium w-20 text-center text-sm'; // Slightly larger text
                if (isChecked) {
                    quantitySpan.classList.add('text-gray-400');
                }
                const formattedQuantity = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                quantitySpan.textContent = `${formattedQuantity} ${item.unit || ''}`.trim();

                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'flex flex-col';

                const plusBtn = document.createElement('button');
                plusBtn.className = 'btn btn-outline btn-xs rounded-b-none';
                plusBtn.textContent = '+';
                plusBtn.addEventListener('click', async () => {
                    const step = getIncrementStep(item.unit);
                    await addIngredientToShoppingList(item.name, step, item.unit);
                });

                const minusBtn = document.createElement('button');
                minusBtn.className = 'btn btn-outline btn-xs rounded-t-none -mt-px';
                minusBtn.textContent = '-';
                minusBtn.addEventListener('click', async () => {
                    const step = getIncrementStep(item.unit);
                    await addIngredientToShoppingList(item.name, -step, item.unit);
                });

                buttonsContainer.appendChild(plusBtn);
                buttonsContainer.appendChild(minusBtn);
                controlsDiv.appendChild(quantitySpan);
                controlsDiv.appendChild(buttonsContainer);
                mainRow.appendChild(controlsDiv);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-item-btn text-red-500 hover:text-red-700';
                deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
                deleteButton.addEventListener('click', () => {
                    // Pour supprimer un article (même automatique), on ajoute un ajustement manuel négatif
                    addIngredientToShoppingList(item.name, -item.totalQuantity, item.unit, true);
                });
                mainRow.appendChild(deleteButton);
                li.appendChild(mainRow);

                // Add annotations
                if (item.sources && item.sources.length > 0) {
                    const annotationsDiv = document.createElement('div');
                    annotationsDiv.className = 'p-2 mt-1 ml-4 rounded-md bg-stone-100';

                    // Group sources by recipe and day
                    const groupedSources = item.sources.reduce((acc, source) => {
                        const servingsText = source.servings ? ` - ${source.servings} pers.` : '';
                        const key = `${source.recipeName} (${source.day} ${source.time})${servingsText}`;
                        if (!acc[key]) {
                            acc[key] = 0;
                        }
                        acc[key] += source.quantity;
                        return acc;
                    }, {});

                    for (const key in groupedSources) {
                        const annotationSpan = document.createElement('span');
                        annotationSpan.className = 'block text-xs text-gray-500';
                        annotationSpan.textContent = `↳ ${key}`;
                        annotationsDiv.appendChild(annotationSpan);
                    }
                    li.appendChild(annotationsDiv);
                }

                ul.appendChild(li);
            });
            container.appendChild(ul);
        });
    }

    async function generateShoppingListFromPlan() {
        if (!currentPlan) {
            shoppingList.length = 0;
            renderShoppingList();
            return;
        }

        // Start with a deep copy of manual items for the current plan
        const manualItems = currentPlan.manualItems ? JSON.parse(JSON.stringify(currentPlan.manualItems)) : [];
        const combinedIngredients = new Map(manualItems.map(item => {
            const key = `${item.name.trim().toLowerCase()}_${item.unit || ''}`;
            item.hasManualEntry = true; // AJOUT DU FLAG POUR IDENTIFICATION
            return [key, item];
        }));

        const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        // Iterate over ALL weeks in the plan
        if (currentPlan.weeks) {
            for (const weekNumber in currentPlan.weeks) {
                const weekData = currentPlan.weeks[weekNumber];
                const weekMenuData = weekData.menuData || {};
                const weekServingsData = weekData.servingsData || {};

                // Process the menu for that week
                for (const slotId in weekMenuData) {
                    const mealsInSlot = weekMenuData[slotId];
                    if (!Array.isArray(mealsInSlot)) continue;

                    const [dayIndexStr, mealType] = slotId.split('-');
                    const dayIndex = parseInt(dayIndexStr, 10);
                    const dayName = allDays[dayIndex] || 'Jour inconnu';
                    const mealTime = mealType === 'lunch' ? 'midi' : 'soir';
                    const servingsKey = `${dayIndex}-${mealType}`;
                    const numPeopleForMeal = parseInt(weekServingsData[servingsKey] || currentPlan.defaultNumPeople, 10);

                    for (const mealInPlan of mealsInSlot) {
                        const latestMealData = availableMeals.find(m => m.id === mealInPlan.id);
                        const mealToUse = latestMealData || mealInPlan;
                        if (!mealToUse || !Array.isArray(mealToUse.ingredients)) continue;

                        const recipeBaseServings = mealToUse.servings || 1;
                        if (recipeBaseServings <= 0) continue;

                        mealToUse.ingredients.forEach(ingredient => {
                            const { name, quantity, unit } = ingredient;
                            if (!name || !quantity) return;

                            const masterIngredient = masterIngredientList.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
                            const category = masterIngredient ? masterIngredient.category : 'Inconnue';
                            const baseValue = parseFloat(String(quantity).replace(',', '.'));
                            if (isNaN(baseValue)) return;

                            const valuePerServing = baseValue / recipeBaseServings;
                            const finalQuantity = valuePerServing * numPeopleForMeal;
                            const displayUnit = unit || '';
                            const key = `${name.trim().toLowerCase()}_${displayUnit}`;

                            const sourceInfo = {
                                recipeName: mealToUse.name,
                                day: `${dayName} (S${weekNumber})`,
                                time: mealTime,
                                quantity: finalQuantity,
                                servings: numPeopleForMeal
                            };

                            if (combinedIngredients.has(key)) {
                                const existing = combinedIngredients.get(key);
                                existing.totalQuantity += finalQuantity;
                                if (existing.source === 'manual') {
                                    existing.source = 'mixed';
                                }
                                if (Array.isArray(existing.sources)) {
                                    existing.sources.push(sourceInfo);
                                } else {
                                    existing.sources = [sourceInfo];
                                }
                            } else {
                                combinedIngredients.set(key, {
                                    name: name.trim(),
                                    totalQuantity: finalQuantity,
                                    unit: displayUnit,
                                    source: 'plan',
                                    category: category,
                                    sources: [sourceInfo]
                                });
                            }
                        });
                    }
                }
            }
        }

        const finalIngredients = Array.from(combinedIngredients.values());
        const hiddenTrashItems = currentPlan.hiddenTrashItems || [];

        const activeIngredients = finalIngredients.filter(item => item.totalQuantity > 0).sort((a, b) => a.name.localeCompare(b.name));

        // Filter deleted ingredients: quantity <= 0, has source, AND NOT in hidden list
        const deletedIngredients = finalIngredients.filter(item => {
            const key = `${item.name}_${item.unit || ''}`;
            return item.totalQuantity <= 0 &&
                (item.source === 'manual' || (item.sources && item.sources.length > 0)) &&
                !hiddenTrashItems.includes(key);
        }).sort((a, b) => a.name.localeCompare(b.name));

        shoppingList.length = 0;
        shoppingList.push(...activeIngredients);

        // Pass deleted ingredients to render function (we'll store them in a property of shoppingList for convenience or a global var)
        renderShoppingList(deletedIngredients);
    }

    function openMealSelectModal(slotId) {
        const category = getCategoryFromSlotId(slotId);
        if (!category || !elements.mealSelectModal) return;
        elements.mealSelectModalTitle.textContent = `Sélectionner : ${category}`;
        elements.mealSelectList.innerHTML = '';
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Rechercher dans la catégorie...';
        searchInput.className = 'w-full p-2 mb-4 border border-gray-300 rounded-lg';
        elements.mealSelectList.appendChild(searchInput);
        const normalizedCategory = normalizeString(category);
        const categoryMeals = availableMeals.filter(meal => normalizeString(meal.category) === normalizedCategory)
            .sort((a, b) => {
                // Sort by favorite status first (true comes first), then by name
                const favA = a.isFavorite ? 1 : 0;
                const favB = b.isFavorite ? 1 : 0;
                if (favB !== favA) {
                    return favB - favA;
                }
                return a.name.localeCompare(b.name);
            });

        const listContainer = document.createElement('div');
        listContainer.className = 'space-y-1 max-h-80 overflow-y-auto';
        elements.mealSelectList.appendChild(listContainer);
        function renderFilteredList(searchTerm = '') {
            listContainer.innerHTML = '';
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const mealsToRender = categoryMeals.filter(meal => meal.name.toLowerCase().includes(lowerCaseSearchTerm));
            if (mealsToRender.length === 0) {
                listContainer.innerHTML = `<p class="text-gray-500 p-4">Aucun plat ne correspond à votre recherche.</p>`;
            } else {
                mealsToRender.forEach(meal => {
                    const mealButton = document.createElement('button');
                    mealButton.className = 'w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150';
                    const nameP = document.createElement('p');
                    nameP.className = 'font-medium text-gray-800 text-sm';

                    if (meal.isFavorite) {
                        nameP.innerHTML = `${meal.name} <i class="fas fa-heart text-red-500 ml-2"></i>`;
                    } else {
                        nameP.textContent = meal.name;
                    }

                    mealButton.appendChild(nameP);
                    mealButton.addEventListener('click', () => { addMealToSlot(slotId, meal); closeMealSelectModal(); });
                    listContainer.appendChild(mealButton);
                });
            }
        }
        searchInput.addEventListener('input', (e) => renderFilteredList(e.target.value));
        renderFilteredList();
        elements.mealSelectModal.classList.remove('hidden');
        searchInput.focus();
    }

    function closeMealSelectModal() {
        if (elements.mealSelectModal) elements.mealSelectModal.classList.add('hidden');
    }

    function handleDragStart(event) {
        draggedItem = event.target.closest('.meal-card');
        const slotId = draggedItem.closest('.meal-slot').dataset.slotId;
        event.dataTransfer.setData('text/plain', slotId);
        setTimeout(() => { if (draggedItem) draggedItem.style.opacity = '0.5'; }, 0);
    }

    function handleDragEnd() {
        if (draggedItem) { draggedItem.style.opacity = '1'; draggedItem = null; }
    }

    function handleDragOver(event) {
        event.preventDefault();
        const targetSlot = event.target.closest('.meal-slot');
        if (targetSlot) {
            const category = getCategoryFromSlotId(targetSlot.dataset.slotId);
            if (category !== 'Remarque') targetSlot.classList.add('bg-gray-200');
        }
    }

    function handleDragLeave(event) {
        const targetSlot = event.target.closest('.meal-slot');
        if (targetSlot) targetSlot.classList.remove('bg-gray-200');
    }

    async function handleDrop(event) {
        event.preventDefault();
        const fromSlotId = event.dataTransfer.getData('text/plain');
        const toSlot = event.target.closest('.meal-slot');
        if (toSlot) {
            toSlot.classList.remove('bg-gray-200');
            const toSlotId = toSlot.dataset.slotId;
            const toCategory = getCategoryFromSlotId(toSlotId);
            if (toCategory === 'Remarque') return;
            if (fromSlotId && toSlotId && fromSlotId !== toSlotId) {
                const fromMeal = menuData[fromSlotId];
                const fromCategory = getCategoryFromSlotId(fromSlotId);
                if (normalizeString(fromCategory) !== normalizeString(toCategory)) {
                    alert(`Action impossible : un(e) "${fromCategory}" ne peut pas aller dans la catégorie "${toCategory}".`);
                    return;
                }
                const toMeal = menuData[toSlotId];
                menuData[toSlotId] = fromMeal;
                if (toMeal) menuData[fromSlotId] = toMeal; else delete menuData[fromSlotId];
                renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
                await updateCurrentPlan({ [`weeks.${currentWeek}.menuData`]: menuData }, 'a déplacé un plat');
                await generateShoppingListFromPlan();
            }
        }
    }

    function getCategoryFromSlotId(slotId) {
        const type = slotId.split('-')[2];
        switch (type) {
            case '0': return 'Entrée';
            case '1': return 'Plat';
            case '2': return 'Accompagnement';
            case '3': return 'Dessert';
            case '4': return 'Remarque';
            default: return '';
        }
    }

    function createMealCardElement(meal, slotId, index, isReadOnly = false) {
        const card = document.createElement('div');
        card.className = 'meal-card p-1 flex flex-col items-center bg-white rounded shadow-sm text-center relative w-full mb-1';
        if (!isReadOnly) {
            card.classList.add('cursor-grab');
            card.draggable = true;
        }

        // Favorite Heart Icon
        if (!isReadOnly) {
            const heartBtn = document.createElement('button');
            heartBtn.className = 'absolute -top-2 -right-1 text-base';
            heartBtn.innerHTML = `<i class="fas fa-heart"></i>`;
            if (meal.isFavorite) {
                heartBtn.classList.add('text-red-500');
            } else {
                heartBtn.classList.add('text-gray-300', 'hover:text-red-400');
            }
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // The main onSnapshot listener will handle the UI update automatically
                toggleFavoriteStatus(meal.id, meal.isFavorite);
            });
            heartBtn.addEventListener('mousedown', e => e.stopPropagation());
            card.appendChild(heartBtn);
        }

        const nameSpan = document.createElement('span');
        nameSpan.className = 'text-xs font-medium p-1 break-words w-full text-gray-800 dark:text-gray-800';
        nameSpan.textContent = meal.name;

        card.appendChild(nameSpan);

        if (!isReadOnly) {
            const hoverButtonsDiv = document.createElement('div');
            hoverButtonsDiv.className = 'absolute top-0 left-0 flex';

            const editButton = document.createElement('button');
            editButton.className = 'edit-meal-btn text-gray-600 hover:text-gray-800 hidden px-1 py-0.5';
            editButton.innerHTML = '<i class="fas fa-pencil-alt fa-xs"></i>';
            editButton.title = 'Modifier la recette';
            editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const latestMeal = availableMeals.find(m => m.id === meal.id);
                recipeFormHandler.openForm(latestMeal || meal, 'Modifier la recette');
            });
            editButton.addEventListener('mousedown', e => e.stopPropagation());
            hoverButtonsDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-meal-btn text-red-700 hover:text-red-900 hidden px-1 py-0.5';
            deleteButton.innerHTML = '<i class="fas fa-times-circle fa-xs"></i>';
            deleteButton.title = 'Retirer du menu';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteMeal(slotId, index);
            });
            deleteButton.addEventListener('mousedown', e => e.stopPropagation());
            hoverButtonsDiv.appendChild(deleteButton);
            card.appendChild(hoverButtonsDiv);

            card.addEventListener('mouseenter', () => {
                editButton.classList.remove('hidden');
                deleteButton.classList.remove('hidden');
            });

            card.addEventListener('mouseleave', () => {
                editButton.classList.add('hidden');
                deleteButton.classList.add('hidden');
            });
        }

        const infoButtonContainer = document.createElement('div');
        infoButtonContainer.className = 'absolute bottom-1 right-1';

        const infoButton = document.createElement('button');
        infoButton.className = 'info-meal-btn bg-gray-500 text-white hover:bg-gray-600 rounded w-3 h-3 flex items-center justify-center shadow-sm';
        infoButton.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
        infoButton.title = 'Plus d\'infos';

        infoButton.dataset.slotId = slotId;
        infoButton.dataset.mealIndex = index;
        infoButton.addEventListener('mousedown', e => e.stopPropagation());

        infoButtonContainer.appendChild(infoButton);
        card.appendChild(infoButtonContainer);

        return card;
    }

    function toggleIngredientsTooltip(button, meal) {
        // First, remove any existing tooltips from the DOM.
        document.querySelectorAll('.planner-ingredient-tooltip').forEach(tt => tt.remove());

        // If the button we just clicked is the one that was open, we're done closing it.
        if (currentlyOpenTooltipButton === button) {
            button.classList.remove('info-open');
            button.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
            currentlyOpenTooltipButton = null;
            return;
        }

        // If another button was open, reset it to its closed state.
        if (currentlyOpenTooltipButton) {
            currentlyOpenTooltipButton.classList.remove('info-open');
            currentlyOpenTooltipButton.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
        }

        // Now, open the new tooltip for the clicked button.
        button.classList.add('info-open');
        button.innerHTML = '<i class="fas fa-times fa-xs"></i>';
        currentlyOpenTooltipButton = button;

        const tooltip = document.createElement('div');
        tooltip.className = 'planner-ingredient-tooltip z-50 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg text-left text-sm';

        if (meal.ingredients && meal.ingredients.length > 0) {
            if (meal.servings && meal.servings > 0) {
                const servingsInfo = document.createElement('p');
                servingsInfo.className = 'mb-2 text-sm text-gray-600 flex items-center';
                servingsInfo.innerHTML = `<i class="fas fa-users mr-2"></i> Pour ${meal.servings} ${meal.servings > 1 ? 'personnes' : 'personne'}`;
                tooltip.appendChild(servingsInfo);
            }
            const title = document.createElement('h4');
            title.className = 'font-bold mb-2 text-gray-800';
            title.textContent = 'Ingrédients :';
            tooltip.appendChild(title);
            const list = document.createElement('ul');
            list.className = 'space-y-1 text-gray-600';
            meal.ingredients.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = `• ${ing.quantity || ''} ${ing.unit || ''} ${ing.name}`.trim();
                list.appendChild(li);
            });
            tooltip.appendChild(list);
        } else {
            tooltip.textContent = 'Aucun ingrédient spécifié pour cette recette.';
        }

        document.body.appendChild(tooltip);

        const cardRect = button.closest('.meal-card').getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // On mobile, center it and place it below the card
            tooltip.style.width = '90vw';
            tooltip.style.maxWidth = '320px';
            const newTooltipRect = tooltip.getBoundingClientRect();
            let top = cardRect.bottom + 10;
            let left = (window.innerWidth - newTooltipRect.width) / 2;

            if (top + newTooltipRect.height > window.innerHeight) {
                top = cardRect.top - newTooltipRect.height - 10;
            }
            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;

        } else {
            // Original desktop logic
            let left = cardRect.right + 10;
            if (left + tooltipRect.width > window.innerWidth) {
                left = cardRect.left - tooltipRect.width - 10;
            }
            let top = cardRect.top;
            if (top + tooltipRect.height > window.innerHeight) {
                top = cardRect.bottom - tooltipRect.height;
            }
            if (top < 10) {
                top = 10;
            }
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }

        tooltip.style.position = 'fixed';
    }

    function createAddElement(slotId, isSmall = false) {
        const wrapper = document.createElement('div');
        const button = document.createElement('button');

        if (isSmall) {
            wrapper.className = 'w-full flex justify-center pt-1';
            button.className = 'add-more-meal-btn text-gray-400 hover:text-green-500 transition-colors duration-150';
            button.innerHTML = '<i class="fas fa-plus-circle"></i>';
            button.title = 'Ajouter une autre recette';
        } else {
            wrapper.className = 'flex items-center justify-center h-full';
            button.className = 'add-meal-btn text-green-500 hover:text-green-700 transition-transform duration-150 hover:scale-125';
            button.innerHTML = '<i class="fas fa-plus-circle text-lg"></i>';
        }

        button.addEventListener('click', () => openMealSelectModal(slotId));
        wrapper.appendChild(button);
        return wrapper;
    }

    function createRemarkElement(slotId, planRemarksData, isReadOnly = false) {
        if (isReadOnly) {
            const remarkDisplay = document.createElement('p');
            remarkDisplay.className = 'w-full h-full p-1 text-xs text-gray-700';
            remarkDisplay.textContent = planRemarksData[slotId] || '';
            return remarkDisplay;
        }
        const textArea = document.createElement('textarea');
        textArea.className = 'w-full h-full p-1 text-xs bg-white border-0 rounded focus:outline-none focus:ring-1 focus:ring-tomato resize-none';
        textArea.placeholder = 'Remarque...';
        textArea.value = remarksData[slotId] || '';
        textArea.dataset.slotId = slotId; // Add slotId for easy selection

        textArea.addEventListener('change', (event) => {
            const value = event.target.value;
            if (value) { remarksData[slotId] = value; } else { delete remarksData[slotId]; }

            const [dayIndexStr, mealType] = slotId.split('-');
            const dayName = allDays[parseInt(dayIndexStr, 10)];
            const mealTypeName = mealType === 'lunch' ? 'midi' : 'soir';
            const description = `a modifié la remarque pour ${dayName} ${mealTypeName}`;

            updateCurrentPlan({ [`weeks.${currentWeek}.remarksData`]: remarksData }, description);
        });

        textArea.addEventListener('focus', (event) => {
            updateUserActivity({ type: 'editing_remark', fieldId: slotId });
        });

        textArea.addEventListener('blur', (event) => {
            updateUserActivity('idle');
        });

        return textArea;
    }

    function attachPlannerListeners() {
        document.querySelectorAll('.meal-card').forEach(card => {
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });
        document.querySelectorAll('.meal-slot').forEach(slot => {
            slot.addEventListener('dragover', handleDragOver);
            slot.addEventListener('dragleave', handleDragLeave);
            slot.addEventListener('drop', handleDrop);
        });
    }



    async function addMealToSlot(slotId, meal) {
        const newMenuData = JSON.parse(JSON.stringify(menuData));
        const currentMeals = newMenuData[slotId];

        // Store only a reference to the meal (its ID), not a full copy.
        const mealReference = { id: meal.id };

        if (Array.isArray(currentMeals)) {
            currentMeals.push(mealReference);
        } else {
            newMenuData[slotId] = [mealReference];
        }

        const [dayIndexStr, mealType] = slotId.split('-');
        const dayName = allDays[parseInt(dayIndexStr, 10)];
        const mealTypeName = mealType === 'lunch' ? 'midi' : 'soir';
        const description = `a ajouté '${meal.name}' à ${dayName} ${mealTypeName}`;

        await updateCurrentPlan({ [`weeks.${currentWeek}.menuData`]: newMenuData }, description);
        // The onSnapshot listener will handle the UI update.
        closeMealSelectModal();
    }

    async function handleDeleteMeal(slotId, index) {
        if (!currentPlan || !menuData[slotId] || !Array.isArray(menuData[slotId])) return;

        const mealToDelete = menuData[slotId][index];
        // Create a deep copy of the menu data to modify
        const newMenuData = JSON.parse(JSON.stringify(menuData));

        // Remove the meal from the copied data
        newMenuData[slotId].splice(index, 1);
        if (newMenuData[slotId].length === 0) {
            delete newMenuData[slotId];
        }

        const [dayIndexStr, mealType] = slotId.split('-');
        const dayName = allDays[parseInt(dayIndexStr, 10)];
        const mealTypeName = mealType === 'lunch' ? 'midi' : 'soir';
        const description = `a supprimé '${mealToDelete.name}' de ${dayName} ${mealTypeName}`;

        await updateCurrentPlan({ [`weeks.${currentWeek}.menuData`]: newMenuData }, description);
        // The onSnapshot listener will handle the UI update for everyone.
    }


    function changeWeek(weekNumber) {
        if (weekNumber >= 1 && weekNumber <= 52) {
            currentWeek = weekNumber;
            loadWeekDataFromPlan();
        }
    }

    function updateWeekDisplay() {
        if (elements.currentWeekDisplay) elements.currentWeekDisplay.textContent = `Semaine ${currentWeek}`;
    }

    function setupEventListeners() {
        elements.prevWeekBtn?.addEventListener('click', () => changeWeek(currentWeek - 1));
        elements.nextWeekBtn?.addEventListener('click', () => changeWeek(currentWeek + 1));
        elements.clearMenuBtn?.addEventListener('click', clearMenu);

        elements.startDaySelect?.addEventListener('change', async (event) => {
            startDay = event.target.value;
            if (currentPlan) {
                await updateCurrentPlan({ startDay: startDay }, `a changé le premier jour de la semaine à '${startDay}'`);
            }
            // No need to re-render, the listener will catch the change
        });

        elements.planSelect?.addEventListener('change', loadPlanFromSelection);

        elements.closeMealSelectModalBtn?.addEventListener('click', closeMealSelectModal);
        elements.mealSelectModal?.addEventListener('click', (e) => { if (e.target === elements.mealSelectModal) closeMealSelectModal(); });
        elements.closeRecipeModalBtn?.addEventListener('click', () => recipeFormHandler.closeForm());
        elements.cancelRecipeBtn?.addEventListener('click', () => recipeFormHandler.closeForm());

        elements.importListBtn?.addEventListener('click', openImportListModal);
        elements.closeImportListModalBtn?.addEventListener('click', closeImportListModal);
        elements.importListModal?.addEventListener('click', (e) => { if (e.target === elements.importListModal) closeImportListModal(); });

        elements.exportTxtBtn?.addEventListener('click', exportToTxt);
        elements.exportPdfBtn?.addEventListener('click', exportToPdf);
        elements.exportPlanPdfBtn?.addEventListener('click', exportPlanToPDF);

        const handlePlannerClick = (e) => {
            const infoButton = e.target.closest('.info-meal-btn');
            if (infoButton) {
                const slotId = infoButton.dataset.slotId;
                const mealIndex = parseInt(infoButton.dataset.mealIndex, 10);

                if (slotId && !isNaN(mealIndex)) {
                    const mealRef = menuData[slotId]?.[mealIndex];
                    // Ensure we have a reference with an ID
                    if (mealRef && mealRef.id) {
                        // Find the full, up-to-date meal data from the master list
                        const fullMeal = availableMeals.find(m => m.id === mealRef.id);
                        if (fullMeal) {
                            toggleIngredientsTooltip(infoButton, fullMeal);
                        }
                    }
                }
            }
        };

        elements.mealPlanGrid?.addEventListener('click', handlePlannerClick);
        const mobilePlanContainer = document.getElementById('mobile-meal-plan');
        mobilePlanContainer?.addEventListener('click', handlePlannerClick);

        elements.sharePlanBtn?.addEventListener('click', () => {
            if (!currentPlan) {
                alert("Veuillez sélectionner un menu à partager.");
                return;
            }
            openShareModal({ plan: currentPlan });
        });

        elements.inviteParticipantBtn?.addEventListener('click', () => {
            if (!currentPlan) {
                alert("Veuillez sélectionner un menu pour inviter des participants.");
                return;
            }
            openInviteParticipantModal(currentPlan);
        });

        elements.historyPlanBtn?.addEventListener('click', openHistoryModal);
        elements.closePlanHistoryModalBtn?.addEventListener('click', closePlanHistoryModal);
        elements.smartPlanBtn?.addEventListener('click', handleSmartPlan);
        elements.archivePlanBtn?.addEventListener('click', async () => {
            const msg = currentPlan && currentPlan.isOwner
                ? "Voulez-vous archiver ce menu ? Il sera masqué pour vous mais restera accessible par Chef Gusto pour ses recommandations."
                : "Voulez-vous masquer ce menu collaboratif de votre liste ? Il restera accessible aux autres membres et Chef Gusto pourra toujours s'y référer.";
            if (currentPlan && confirm(msg)) {
                await archivePlan(currentPlan.id, true);
                alert("Menu masqué/archivé avec succès.");
            }
        });
        elements.planHistoryModal?.addEventListener('click', (e) => { if (e.target === elements.planHistoryModal) closePlanHistoryModal(); });

        // Use delegation for dynamically added buttons (like trash button in shopping list)
        document.addEventListener('click', (e) => {
            const trashBtn = e.target.closest('#open-trash-btn');
            if (trashBtn) {
                console.log('DEBUG: Trash button clicked');
                let modal = document.getElementById('trash-modal');

                if (!modal && elements && elements.trashModal) {
                    modal = elements.trashModal;
                }

                if (modal) {
                    // Hoist to body if not already there to avoid z-index traps
                    if (modal.parentNode !== document.body) {
                        console.log('DEBUG: Hoisting trash modal to body');
                        document.body.appendChild(modal);
                    }

                    modal.classList.remove('hidden');
                    // Force visibility
                    modal.style.display = 'flex';
                    modal.style.zIndex = '9999';
                    modal.style.position = 'fixed';
                    modal.style.inset = '0';
                    console.log('DEBUG: Trash modal forced open');
                } else {
                    console.error('DEBUG: Trash modal element NOT FOUND');
                    alert("Erreur: Impossible de trouver la fenêtre de corbeille.");
                }
            }
        });
        // Delegation for closing the trash modal (button & background)
        document.addEventListener('click', (e) => {
            const closeBtn = e.target.closest('#close-trash-modal');
            const modal = document.getElementById('trash-modal');

            // Click on Close Button OR Click on backdrop (modal itself)
            if (modal && !modal.classList.contains('hidden')) {
                if (closeBtn || e.target === modal) {
                    console.log('DEBUG: Closing trash modal');
                    modal.classList.add('hidden');
                    // IMPORTANT: Clear the forced inline styles so 'hidden' class takes effect
                    modal.style.display = '';
                    modal.style.zIndex = '';
                    modal.style.position = '';
                    modal.style.inset = '';
                }
            }
        });

        elements.savePlanBtn?.addEventListener('click', async () => {
            if (!currentPlan) {
                alert("Veuillez sélectionner un menu de travail avant de sauvegarder.");
                return;
            }
            const saveModal = document.getElementById('save-plan-as-modal');
            const saveForm = document.getElementById('save-plan-as-form');
            const saveInput = document.getElementById('save-plan-name');
            const cancelBtn = document.getElementById('cancel-save-plan-as-btn');
            const closeBtn = document.getElementById('close-save-plan-as-modal');

            // Pré-remplir le nom de la sauvegarde
            const date = new Date().toLocaleDateString('fr-FR');
            const weekCount = currentPlan.weeks ? Object.keys(currentPlan.weeks).filter(w => currentPlan.weeks[w] && Object.keys(currentPlan.weeks[w].menuData || {}).length > 0).length : 0;
            const weekText = weekCount > 1 ? `${weekCount} semaines` : `${weekCount} semaine`;
            saveInput.value = `${currentPlan.name} (${weekText}) - ${date}`;

            saveModal.classList.remove('hidden');

            const formSubmitHandler = async (e) => {
                e.preventDefault();
                const saveName = saveInput.value;
                if (!saveName) return;

                // Ensure the current week's data is fresh in the plan object before saving
                if (!currentPlan.weeks) {
                    currentPlan.weeks = {};
                }
                currentPlan.weeks[currentWeek] = {
                    menuData: menuData,
                    servingsData: servingsData,
                    remarksData: remarksData
                };
                currentPlan.startDay = startDay;
                currentPlan.defaultNumPeople = defaultNumPeople;

                // Deep copy the plan object and resolve meal references to save a complete, self-contained snapshot.
                const planToSave = JSON.parse(JSON.stringify(currentPlan));
                if (planToSave.weeks) {
                    for (const weekNumber in planToSave.weeks) {
                        const weekData = planToSave.weeks[weekNumber];
                        if (weekData && weekData.menuData) {
                            for (const slotId in weekData.menuData) {
                                const mealsInSlot = weekData.menuData[slotId];
                                if (Array.isArray(mealsInSlot)) {
                                    weekData.menuData[slotId] = mealsInSlot.map(mealRef => {
                                        if (mealRef && mealRef.id) {
                                            const fullMeal = availableMeals.find(m => m.id === mealRef.id);
                                            return fullMeal || mealRef; // Fallback to ref if not found
                                        }
                                        return mealRef;
                                    });
                                }
                            }
                        }
                    }
                }

                await saveOrUpdatePlanSaveByName(saveName, planToSave);
                saveModal.classList.add('hidden');
                saveForm.removeEventListener('submit', formSubmitHandler);
            };

            const closeModalHandler = () => {
                saveModal.classList.add('hidden');
                saveForm.removeEventListener('submit', formSubmitHandler);
            };

            saveForm.addEventListener('submit', formSubmitHandler, { once: true });
            cancelBtn.addEventListener('click', closeModalHandler, { once: true });
            closeBtn.addEventListener('click', closeModalHandler, { once: true });
        });
    }

    function getInitials(name = '') {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.substring(0, 2).toUpperCase();
    }

    function updatePresenceUI(allParticipants = [], presences = {}) {
        const avatarContainer = document.getElementById('collaborators-bar');
        const activityContainer = document.getElementById('activity-labels-container');
        const tooltip = document.getElementById('name-tooltip');
        if (!avatarContainer || !tooltip || !activityContainer) return;

        // --- Reset UI state ---
        avatarContainer.innerHTML = '';
        activityContainer.innerHTML = '';
        // Unlock all remark fields first
        document.querySelectorAll('.remark-lock-overlay').forEach(overlay => overlay.remove());
        document.querySelectorAll('textarea[data-slot-id]').forEach(textarea => {
            textarea.disabled = false;
        });

        if (allParticipants.length <= 1 && Object.keys(presences).length <= 1) {
            avatarContainer.classList.add('hidden');
            return;
        }

        let activityHtml = '';
        const currentUserId = getCurrentUserId();

        allParticipants.forEach(p => {
            if (!p) return;

            const isOnline = presences.hasOwnProperty(p.uid);
            const presenceInfo = presences[p.uid] || {};

            // --- Avatar Logic ---
            const avatar = document.createElement('div');
            avatar.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-xs ring-2 ring-white cursor-pointer transition-all duration-300';
            const statusText = isOnline ? '(présent)' : '(absent)';
            avatar.dataset.name = `${p.displayName || 'Inconnu'} ${statusText}`;

            if (p.photoURL) {
                avatar.innerHTML = `<img src="${p.photoURL}" alt="${p.displayName}" class="w-full h-full rounded-full object-cover">`;
            } else {
                avatar.textContent = getInitials(p.displayName);
            }

            if (!isOnline) {
                avatar.classList.add('grayscale', 'opacity-50');
            }

            avatar.addEventListener('mouseenter', (e) => {
                tooltip.textContent = e.currentTarget.dataset.name;
                tooltip.classList.remove('hidden');
                const rect = e.currentTarget.getBoundingClientRect();
                tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
                tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            });

            avatar.addEventListener('mouseleave', () => {
                tooltip.classList.add('hidden');
            });

            avatarContainer.appendChild(avatar);

            // --- Activity & Locking Logic ---
            if (isOnline && p.uid !== currentUserId) { // Only check for other users' activities
                const status = presenceInfo.status;
                if (typeof status === 'object' && status.type === 'editing_remark') {
                    // Lock the remark field
                    const textarea = document.querySelector(`textarea[data-slot-id="${status.fieldId}"]`);
                    if (textarea) {
                        textarea.disabled = true;
                        const overlay = document.createElement('div');
                        overlay.className = 'remark-lock-overlay absolute inset-0 bg-gray-400 bg-opacity-25 flex items-center justify-center text-xs text-white font-bold';
                        overlay.innerHTML = `<i class="fas fa-lock mr-1"></i> ${p.displayName} écrit...`;
                        if (textarea.parentElement) {
                            textarea.parentElement.classList.add('relative');
                            textarea.parentElement.appendChild(overlay);
                        }
                    }
                } else if (typeof status === 'string' && status !== 'idle') {
                    // Handle simple string statuses like 'editing_recipe'
                    let actionText = '';
                    switch (status) {
                        case 'editing_recipe':
                            actionText = 'modifie une recette...';
                            break;
                    }
                    if (actionText) {
                        activityHtml += `<span class="italic mr-4">${p.displayName} ${actionText}</span>`;
                    }
                }
            }
        });

        activityContainer.innerHTML = activityHtml;
        avatarContainer.classList.remove('hidden');
    }

    function loadPlanFromSelection() {
        // Déconnexion du canal de présence de l'ancien plan
        disconnectFromPresenceChannel();

        const selectedPlanId = elements.planSelect.value;
        if (selectedPlanId) {
            localStorage.setItem('lastActivePlanId', selectedPlanId);
        }
        currentPlan = allPlans.find(p => p.id === selectedPlanId) || null;

        // Afficher/cacher les boutons d'action en fonction de la propriété
        const deletePlanBtn = document.getElementById('delete-plan-btn');
        const renamePlanBtn = document.getElementById('rename-plan-btn');
        const leavePlanBtn = document.getElementById('leave-plan-btn');
        const inviteParticipantBtn = document.getElementById('invite-participant-btn');
        const historyPlanBtn = document.getElementById('history-plan-btn');
        const archivePlanBtn = document.getElementById('archive-plan-btn');

        if (deletePlanBtn) deletePlanBtn.style.display = currentPlan && currentPlan.isOwner ? 'inline-flex' : 'none';
        if (renamePlanBtn) renamePlanBtn.style.display = currentPlan && currentPlan.isOwner ? 'inline-flex' : 'none';
        if (historyPlanBtn) historyPlanBtn.style.display = currentPlan && currentPlan.isOwner ? 'inline-flex' : 'none';
        if (archivePlanBtn) archivePlanBtn.style.display = currentPlan ? 'inline-flex' : 'none';
        if (leavePlanBtn) leavePlanBtn.style.display = currentPlan && !currentPlan.isOwner ? 'inline-flex' : 'none';
        if (inviteParticipantBtn) {
            const isCollaborative = currentPlan && (currentPlan.type === 'collaborative' || (currentPlan.collaborators && currentPlan.collaborators.length > 0));
            inviteParticipantBtn.style.display = currentPlan && currentPlan.isOwner && isCollaborative ? 'inline-flex' : 'none';
        }

        // Gérer l'affichage des collaborateurs et la présence
        if (currentPlan && currentPlan.participants && currentPlan.participants.length > 1) {
            // Afficher immédiatement tous les participants comme étant hors ligne
            updatePresenceUI(currentPlan.participants, {});
            // Se connecter pour recevoir les mises à jour de statut en temps réel
            connectToPresenceChannel(currentPlan.id, (presences) => {
                updatePresenceUI(currentPlan.participants, presences);
            });
        } else {
            // S'assurer que la barre est cachée si le plan n'est pas collaboratif
            updatePresenceUI([], {});
        }

        if (currentPlan) {
            currentPlan.manualItems = currentPlan.manualItems || [];
        }
        loadWeekDataFromPlan();
    }

    async function handleServingsChange(servingsKey, newValue) {
        if (!currentPlan) return;

        const newServingsData = JSON.parse(JSON.stringify(servingsData));

        if (newValue === defaultNumPeople) {
            delete newServingsData[servingsKey]; // Revert to default
        } else {
            newServingsData[servingsKey] = newValue;
        }

        const [dayIndexStr, mealType] = servingsKey.split('-');
        const dayName = allDays[parseInt(dayIndexStr, 10)];
        const mealTypeName = mealType === 'lunch' ? 'midi' : 'soir';
        const description = `a changé le nombre de personnes pour ${dayName} ${mealTypeName} à ${newValue}`;

        await updateCurrentPlan({ [`weeks.${currentWeek}.servingsData`]: newServingsData }, description);
    }

    async function initializeApp() {
        if (!db) return;

        const cleanupPlanManagement = initPlanManagement();
        setupEventListeners();
        setupShoppingListAutocomplete();

        await fetchMasterIngredients();

        // Set up a real-time listener for recipes
        const unsubscribeFromRecipes = onSnapshot(collection(db, "recipes"), (snapshot) => {
            console.log("Recipe data updated from listener.");
            availableMeals = snapshot.docs.map(doc => { const data = doc.data(); return { id: doc.id, ...data, imageUrl: data.imageUrl || '' }; });

            // If a plan is currently loaded, refresh the UI that depends on recipe data.
            if (currentPlan) {
                // This logic is important to update the in-memory representation of meals in the plan
                for (const slotId in menuData) {
                    const mealsInSlot = menuData[slotId];
                    if (Array.isArray(mealsInSlot)) {
                        const updatedMealsInSlot = mealsInSlot.map(mealInPlan => {
                            if (mealInPlan && mealInPlan.id) {
                                const updatedMeal = availableMeals.find(m => m.id === mealInPlan.id);
                                return updatedMeal ? { ...updatedMeal } : mealInPlan;
                            }
                            return mealInPlan;
                        });
                        menuData[slotId] = updatedMealsInSlot;
                    }
                }
                // Re-render the planner to reflect potential changes (like favorite status)
                renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
                renderMobilePlanner(document.getElementById('mobile-meal-plan'), { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);

                // Also, regenerate the shopping list if a recipe's content changed
                generateShoppingListFromPlan();
            }
        });

        // Get all plans for the user and populate the selector
        const unsubscribeFromPlans = getUserPlans((plans) => {
            allPlans = plans;
            populatePlanSelector(plans);

            // Vérifier si un plan a été passé depuis la page 'Mes Plans'
            const selectedPlanId = localStorage.getItem('selectedPlanId');
            const lastActivePlanId = localStorage.getItem('lastActivePlanId');

            if (selectedPlanId && plans.some(p => p.id === selectedPlanId)) {
                elements.planSelect.value = selectedPlanId;
                localStorage.removeItem('selectedPlanId'); // Nettoyer après utilisation
            } else if (lastActivePlanId && plans.some(p => p.id === lastActivePlanId)) {
                elements.planSelect.value = lastActivePlanId;
            }

            loadPlanFromSelection(); // Load data directly after populating
        });

        // Return a function that unsubscribes from both listeners
        return () => {
            unsubscribeFromPlans();
            unsubscribeFromRecipes();
            cleanupPlanManagement();
        };
    }

    const cleanupPromise = initializeApp();

    return async () => {
        const cleanup = await cleanupPromise;
        if (typeof cleanup === 'function') {
            cleanup();
        }
    };
}
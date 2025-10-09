// Importe les fonctions Firebase
import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, query, where } from "firebase/firestore";
import { RecipeFormHandler } from './form-handler.js';
import { getCurrentUserId } from './auth.js';
import { openShareModal } from './sharing.js';
import { initPlanManagement, getUserPlans, populatePlanSelector } from './plans.js';

let editRecipeFormHandler = null;

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
        sharePlanBtn: document.getElementById('share-plan-btn'),
        planSelect: document.getElementById('plan-select'),
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
        plusBtn.className = 'btn btn-ghost btn-xs p-0 h-4 flex items-center justify-center w-full';
        plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
        plusBtn.disabled = isReadOnly;

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'font-medium text-center text-sm my-1';
        valueDisplay.textContent = currentValue;

        const minusBtn = document.createElement('button');
        minusBtn.className = 'btn btn-ghost btn-xs p-0 h-4 flex items-center justify-center w-full';
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

    // --- Recipe Form Handler Instance ---
    if (editRecipeFormHandler) {
        editRecipeFormHandler.destroy();
    }
    editRecipeFormHandler = new RecipeFormHandler(
        db,
        'edit-recipe-form-modal',
        'edit-recipe-form',
        'edit-recipe-modal-title',
        'edit-recipe-id',
        'edit-recipe-name',
        'edit-recipe-category',
        'edit-recipe-servings',
        'edit-recipe-prep-time',
        'edit-recipe-difficulty',
        'edit-recipe-steps',
        'edit-ingredients-list',
        'edit-add-ingredient-btn',
        'edit-save-recipe-btn',
        'close-edit-recipe-modal',
        'edit-cancel-recipe-btn'
    );

    editRecipeFormHandler.setOnSaveCallback(async () => {
        await loadAvailableMeals();
        // After a recipe is edited, we need to update it in our in-memory plan (menuData)
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
        renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
        await generateShoppingListFromPlan();
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
    
    let allPlans = [];
    let currentPlan = null;

    // --- Helper Functions ---
    function normalizeString(str) {
        if (!str) return '';
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

    async function loadAvailableMeals() {
        if (!db) return;
        const recipesCollectionRef = collection(db, "recipes");
        try {
            const snapshot = await getDocs(recipesCollectionRef);
            availableMeals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error loading available meals from Firebase:", error);
        }
    }

    async function saveCurrentPlan() {
        const userId = getCurrentUserId();
        if (!db || !userId || !currentPlan) return;

        const weekData = {
            menuData,
            servingsData,
            remarksData,
        };

        const planRef = doc(db, "plans", currentPlan.id);
        try {
            await setDoc(planRef, {
                // Save plan-level settings
                defaultNumPeople: defaultNumPeople,
                startDay: startDay,
                manualItems: currentPlan.manualItems || [],
                // Save data for the current week, merging with other weeks
                weeks: {
                    [currentWeek]: weekData
                }
            }, { merge: true });
        } catch (error) {
            console.error("Erreur de sauvegarde du plan:", error);
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
            // These settings are per-plan, not per-week
            defaultNumPeople = currentPlan.defaultNumPeople || 1;
            startDay = currentPlan.startDay || 'Lundi';
        }
        
        if (elements.startDaySelect) elements.startDaySelect.value = startDay;
        if (elements.defaultServingsControl) {
            elements.defaultServingsControl.innerHTML = '';
            const defaultServingsComponent = createServingsControl(defaultNumPeople, async (newValue) => {
                defaultNumPeople = newValue;
                if (currentPlan) currentPlan.defaultNumPeople = newValue;
                renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
                await saveCurrentPlan();
                await generateShoppingListFromPlan();
            });
            elements.defaultServingsControl.appendChild(defaultServingsComponent);
        }

        updateWeekDisplay();
        renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
        generateShoppingListFromPlan();
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
                availablePlans[0] = { ...availablePlans[0], ...planToSave };
                loadPlan(availablePlans[0]);

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


    async function clearMenu() {
        if (!currentPlan) {
            alert("Veuillez d'abord sélectionner un plan.");
            return;
        }
        if (confirm(`Voulez-vous vraiment vider le menu de la semaine ${currentWeek} pour le plan "${currentPlan.name}" ?`)) {
            menuData = {};
            servingsData = {};
            remarksData = {};
            
            // Re-render the empty plan
            renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
            
            // Save the cleared week
            await saveCurrentPlan();
            await generateShoppingListFromPlan();
        }
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

        const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const mealTypes = ['lunch', 'dinner'];
        const subSlotsCount = 5;
        const startDayIndex = allDays.indexOf(planStartDay);
        const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

        weekDays.forEach(dayName => {
            const dayOriginalIndex = allDays.indexOf(dayName);
            const dayRow = document.createElement('div');
            dayRow.className = 'grid grid-cols-[100px_35px_repeat(5,_minmax(0,_1fr))_35px_repeat(5,_minmax(0,_1fr))] items-stretch border-b border-gray-300';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'font-bold p-2 flex items-center justify-center bg-gray-100 text-sm border-r border-gray-300';
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
                        mealsInSlot.forEach((meal, index) => {
                            cardsContainer.appendChild(createMealCardElement(meal, slotId, index, isReadOnly));
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

            const filtered = masterIngredientList.filter(i => i.name.toLowerCase().includes(searchTerm));

            filtered.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'p-2 hover:bg-gray-100 cursor-pointer';
                resultItem.textContent = item.name;
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
            createItem.addEventListener('click', async () => {
                const newName = elements.addItemInput.value;
                try {
                    const newUnit = await promptForUnit(newName);
                    await addDoc(collection(db, "ingredients"), { name: newName, unit: newUnit });
                    await fetchMasterIngredients();
                    addIngredientToShoppingList(newName, 1, newUnit);
                    elements.addItemInput.value = '';
                    resultsContainer.classList.add('hidden');
                } catch {} 
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
                        const key = `${source.recipeName} (${source.day} ${source.time})`;
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
                        const key = `${source.recipeName} (${source.day} ${source.time})`;
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

    async function addIngredientToShoppingList(name, quantity, unit) {
        if (!currentPlan) {
            alert("Veuillez sélectionner un plan avant d'ajouter des ingrédients manuellement.");
            return;
        }
        if (!Array.isArray(currentPlan.manualItems)) {
            currentPlan.manualItems = [];
        }

        const masterIngredient = masterIngredientList.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
        const category = masterIngredient ? masterIngredient.category : 'Inconnue';
        const key = `${name.trim().toLowerCase()}_${unit || ''}`;
        const existingManualItem = currentPlan.manualItems.find(item => `${item.name.trim().toLowerCase()}_${item.unit || ''}` === key);

        if (existingManualItem) {
            existingManualItem.totalQuantity += quantity;
        } else {
            currentPlan.manualItems.push({
                name: name.trim(),
                totalQuantity: quantity,
                unit: unit,
                source: 'manual',
                category: category
            });
        }
        
        await saveCurrentPlan();
        await generateShoppingListFromPlan();
    }

    function getIncrementStep(unit) {
        const lowerUnit = unit ? unit.toLowerCase() : '';
        if (lowerUnit.includes('g') || lowerUnit.includes('ml')) {
            return 10;
        }
        return 1;
    }

    function renderShoppingList() {
        const container = elements.shoppingListContainer;
        if (!container) return;
        container.innerHTML = '';
        if (shoppingList.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500 italic py-4">Votre liste de courses est vide.</p>';
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

        sortedCategories.forEach(category => {
            const categoryHeader = document.createElement('h4');
            categoryHeader.className = 'text-sm font-bold text-stone-800 bg-stone-200 mt-4 mb-2 px-3 py-1 rounded-md';
            categoryHeader.textContent = category;
            container.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            ul.className = 'space-y-2'; // Increased spacing for annotations
            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));

            itemsInCategory.forEach(item => {
                const li = document.createElement('li');
                let liClasses = 'p-2 rounded';
                li.className = liClasses + (item.source === 'manual' ? ' bg-lemon' : ' bg-gray-50');

                const mainRow = document.createElement('div');
                mainRow.className = 'flex justify-between items-center';

                const nameSpan = document.createElement('span');
                nameSpan.className = 'flex-grow text-sm font-medium'; // Slightly larger text
                nameSpan.textContent = item.name;
                mainRow.appendChild(nameSpan);

                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'flex items-center space-x-2 mx-2';

                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'font-medium w-20 text-center text-sm'; // Slightly larger text
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
                    const indexToRemove = shoppingList.findIndex(i => i === item);
                    if (indexToRemove > -1) {
                        shoppingList.splice(indexToRemove, 1);
                    }
                    renderShoppingList();
                    saveShoppingListToFirebase();
                });
                mainRow.appendChild(deleteButton);
                li.appendChild(mainRow);

                // Add annotations
                if (item.sources && item.sources.length > 0) {
                    const annotationsDiv = document.createElement('div');
                    annotationsDiv.className = 'p-2 mt-1 ml-4 rounded-md bg-stone-100';
                    
                    // Group sources by recipe and day
                    const groupedSources = item.sources.reduce((acc, source) => {
                        const key = `${source.recipeName} (${source.day} ${source.time})`;
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
                                quantity: finalQuantity
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

        shoppingList.length = 0;
        shoppingList.push(...Array.from(combinedIngredients.values()).sort((a, b) => a.name.localeCompare(b.name)));
        
        renderShoppingList();
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
        const categoryMeals = availableMeals.filter(meal => normalizeString(meal.category) === normalizedCategory).sort((a, b) => a.name.localeCompare(b.name));
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
                    nameP.textContent = meal.name;
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
                await saveCurrentPlan();
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

        const nameSpan = document.createElement('span');
        nameSpan.className = 'text-xs font-medium p-1 break-words w-full';
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
                editRecipeFormHandler.openForm(latestMeal || meal, 'Modifier la recette');
            });
            hoverButtonsDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-meal-btn text-red-700 hover:text-red-900 hidden px-1 py-0.5';
            deleteButton.innerHTML = '<i class="fas fa-times-circle fa-xs"></i>';
            deleteButton.title = 'Retirer du planning';
            deleteButton.addEventListener('click', (e) => { 
                e.stopPropagation(); 
                handleDeleteMeal(slotId, index);
            });
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

        infoButtonContainer.appendChild(infoButton);
        card.appendChild(infoButtonContainer);

        return card;
    }

    function toggleIngredientsTooltip(button, meal) {
        const wasOpen = button.classList.contains('info-open');

        document.querySelectorAll('.planner-ingredient-tooltip').forEach(tt => tt.remove());
        document.querySelectorAll('.info-meal-btn').forEach(btn => {
            btn.classList.remove('info-open');
            btn.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
        });

        if (!wasOpen) {
            button.innerHTML = '<i class="fas fa-times fa-xs"></i>';
            button.classList.add('info-open');

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
            tooltip.style.position = 'fixed';
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
        }
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
        textArea.className = 'w-full h-full p-1 text-xs bg-transparent border-0 rounded focus:outline-none focus:ring-1 focus:ring-tomato resize-none';
        textArea.placeholder = 'Remarque...';
        textArea.value = remarksData[slotId] || '';
        textArea.addEventListener('change', (event) => {
            const value = event.target.value;
            if (value) { remarksData[slotId] = value; } else { delete remarksData[slotId]; }
            saveCurrentPlan();
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
        const currentMeals = menuData[slotId];

        if (Array.isArray(currentMeals)) {
            currentMeals.push({ ...meal });
        } else if (currentMeals) {
            menuData[slotId] = [currentMeals, { ...meal }];
        } else {
            menuData[slotId] = [{ ...meal }];
        }
        
        renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
        await saveCurrentPlan();
        await generateShoppingListFromPlan();
    }

    async function handleDeleteMeal(slotId, index) {
        document.querySelectorAll('.planner-ingredient-tooltip').forEach(tt => tt.remove());
        document.querySelectorAll('.info-meal-btn').forEach(btn => {
            btn.classList.remove('info-open');
            btn.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
        });

        if (menuData[slotId] && Array.isArray(menuData[slotId])) {
            menuData[slotId].splice(index, 1);
            if (menuData[slotId].length === 0) {
                delete menuData[slotId];
            }
            renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false);
            await saveCurrentPlan();
            await generateShoppingListFromPlan();
        }
    }

    async function clearMenu() {
        if (confirm("Voulez-vous vraiment vider le menu de cette semaine ?")) {
            // Créer un objet de plan vide en conservant les paramètres de l'utilisateur
            const emptyPlan = {
                id: availablePlans.length > 0 ? availablePlans[0].id : `${getCurrentUserId()}_semaine-${currentWeek}`,
                name: availablePlans.length > 0 ? availablePlans[0].name : "Mon plan",
                menuData: {},
                servingsData: {},
                remarksData: {},
                defaultNumPeople: defaultNumPeople,
                startDay: startDay,
                lastUpdated: new Date()
            };
    
            // Charger le plan vide dans l'état global et l'interface utilisateur
            loadPlan(emptyPlan);
    
            // Mettre à jour la représentation en mémoire du plan
            if (availablePlans.length > 0) {
                availablePlans[0] = emptyPlan;
            } else {
                availablePlans.push(emptyPlan);
            }
            
            // Sauvegarder le plan vidé dans Firebase
            await saveCurrentPlan();
        }
    }    function changeWeek(weekNumber) {
        if (weekNumber >= 1 && weekNumber <= 52) {
            currentWeek = weekNumber;
            loadWeekDataFromPlan();
        }
    }

    function updateWeekDisplay() {
        if(elements.currentWeekDisplay) elements.currentWeekDisplay.textContent = `Semaine ${currentWeek}`;
    }

    function setupEventListeners() {
        elements.prevWeekBtn?.addEventListener('click', () => changeWeek(currentWeek - 1));
        elements.nextWeekBtn?.addEventListener('click', () => changeWeek(currentWeek + 1));
        elements.clearMenuBtn?.addEventListener('click', clearMenu);
        
        elements.startDaySelect?.addEventListener('change', (event) => { 
            startDay = event.target.value; 
            if (currentPlan) currentPlan.startDay = startDay;
            renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false); 
            saveCurrentPlan();
        });

        elements.planSelect?.addEventListener('change', loadPlanFromSelection);

        elements.closeMealSelectModalBtn?.addEventListener('click', closeMealSelectModal);
        elements.mealSelectModal?.addEventListener('click', (e) => { if (e.target === elements.mealSelectModal) closeMealSelectModal(); });
        elements.closeRecipeModalBtn?.addEventListener('click', () => editRecipeFormHandler.closeForm());
        elements.cancelRecipeBtn?.addEventListener('click', () => editRecipeFormHandler.closeForm());

        elements.importListBtn?.addEventListener('click', openImportListModal);
        elements.closeImportListModalBtn?.addEventListener('click', closeImportListModal);
        elements.importListModal?.addEventListener('click', (e) => { if (e.target === elements.importListModal) closeImportListModal(); });

        elements.exportTxtBtn?.addEventListener('click', exportToTxt);
        elements.exportPdfBtn?.addEventListener('click', exportToPdf);

        elements.mealPlanGrid?.addEventListener('click', (e) => {
            const infoButton = e.target.closest('.info-meal-btn');
            if (infoButton) {
                const slotId = infoButton.dataset.slotId;
                const mealIndex = parseInt(infoButton.dataset.mealIndex, 10);
                
                if (slotId && !isNaN(mealIndex)) {
                    const meal = menuData[slotId]?.[mealIndex];
                    if (meal) {
                        toggleIngredientsTooltip(infoButton, meal);
                    }
                }
            }
        });

        elements.sharePlanBtn?.addEventListener('click', () => {
            if (!currentPlan) {
                alert("Veuillez sélectionner un plan à partager.");
                return;
            }
            openShareModal({ plan: currentPlan });
        });
    }

    function getInitials(name = '') {
        const names = name.split(' ');
        const initials = names.map(n => n[0]).join('');
        return initials.substring(0, 2).toUpperCase();
    }

    function renderCollaborators(participants = []) {
        const container = document.getElementById('collaborators-bar');
        const tooltip = document.getElementById('name-tooltip');
        if (!container || !tooltip) return;

        container.innerHTML = '';
        if (participants.length <= 1) {
            container.classList.add('hidden');
            return;
        }

        participants.forEach(p => {
            const avatar = document.createElement('div');
            avatar.className = 'w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white font-bold text-xs ring-2 ring-white cursor-pointer';
            avatar.dataset.name = p.displayName || 'Inconnu';

            if (p.photoURL) {
                avatar.innerHTML = `<img src="${p.photoURL}" alt="${p.displayName}" class="w-full h-full rounded-full object-cover">`;
            } else {
                avatar.textContent = getInitials(p.displayName);
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

            container.appendChild(avatar);
        });

        container.classList.remove('hidden');
    }

    function loadPlanFromSelection() {
        const selectedPlanId = elements.planSelect.value;
        currentPlan = allPlans.find(p => p.id === selectedPlanId) || null;
        
        // Show/hide action buttons based on ownership
        const deletePlanBtn = document.getElementById('delete-plan-btn');
        const renamePlanBtn = document.getElementById('rename-plan-btn');
        const leavePlanBtn = document.getElementById('leave-plan-btn');

        if (deletePlanBtn) deletePlanBtn.style.display = currentPlan && currentPlan.isOwner ? 'inline-flex' : 'none';
        if (renamePlanBtn) renamePlanBtn.style.display = currentPlan && currentPlan.isOwner ? 'inline-flex' : 'none';
        if (leavePlanBtn) leavePlanBtn.style.display = currentPlan && !currentPlan.isOwner ? 'inline-flex' : 'none';

        // Render the collaborators bar
        renderCollaborators(currentPlan?.participants);

        if (currentPlan) {
            currentPlan.manualItems = currentPlan.manualItems || [];
        }
        loadWeekDataFromPlan();
    }

    async function handleServingsChange(servingsKey, newValue) {
        if (newValue === defaultNumPeople) {
            delete servingsData[servingsKey]; // Revert to default, clean up data
        } else {
            servingsData[servingsKey] = newValue;
        }
        renderPlanner(elements.mealPlanGrid, { menuData, servingsData, remarksData, defaultNumPeople, startDay }, false); // Re-render to apply style changes
        await saveCurrentPlan();
        await generateShoppingListFromPlan();
    }

    async function initializeApp() {
        if (!db) return;
        
        initPlanManagement();
        setupEventListeners();
        setupShoppingListAutocomplete();

        await fetchMasterIngredients();
        await loadAvailableMeals();

        // Get all plans for the user and populate the selector
        const unsubscribeFromPlans = getUserPlans((plans) => {
            allPlans = plans;
            populatePlanSelector(plans);
            loadPlanFromSelection(); // Load data directly after populating
        });

        return unsubscribeFromPlans; // Return the cleanup function
    }
    
    const cleanupPromise = initializeApp();

    return async () => {
        const cleanup = await cleanupPromise;
        if (typeof cleanup === 'function') {
            cleanup();
        }
    };
}
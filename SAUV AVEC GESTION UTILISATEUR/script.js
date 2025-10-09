// Importe les fonctions Firebase
import { db } from './firebase-config.js';
import { doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { RecipeFormHandler } from './form-handler.js';
import { getCurrentUserId } from './auth.js';

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
        mealSelectModal: document.getElementById('meal-select-modal'),
        closeMealSelectModalBtn: document.getElementById('close-meal-select-modal'),
        mealSelectModalTitle: document.getElementById('meal-select-modal-title'),
        mealSelectList: document.getElementById('meal-select-list'),
        recipeFormModal: document.getElementById('edit-recipe-form-modal'),
        closeRecipeModalBtn: document.getElementById('close-edit-recipe-modal'),
        cancelRecipeBtn: document.getElementById('edit-cancel-recipe-btn'),
        recipeForm: document.getElementById('edit-recipe-form'),
        numPeopleInput: document.getElementById('num-people-input'),
        decreasePeopleBtn: document.getElementById('decrease-people-btn'),
        increasePeopleBtn: document.getElementById('increase-people-btn'),
        addItemInput: document.getElementById('add-item-input'),
        addItemBtn: document.getElementById('add-item-btn'),
        addItemResults: document.getElementById('add-item-results'),
        importListBtn: document.getElementById('import-list-btn'),
        importListModal: document.getElementById('import-list-modal'),
        closeImportListModalBtn: document.getElementById('close-import-list-modal'),
        importListContainer: document.getElementById('import-list-container'),
        exportTxtBtn: document.getElementById('export-txt-btn'),
        exportPdfBtn: document.getElementById('export-pdf-btn'),
    };

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
        renderPlanner();
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
    let numPeople = 1;
    let tooltipTimer = null;

    // --- Helper Functions ---
    function normalizeString(str) {
        if (!str) return '';
        return str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
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

    async function loadPlanForWeek(week) {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const docRef = doc(db, "plans", `${userId}_semaine-${week}`);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                menuData = data.menuData || {};
                servingsData = data.servingsData || {};
                remarksData = data.remarksData || {};
                numPeople = data.numPeople || 1;
                startDay = data.startDay || 'Lundi';
                if (elements.numPeopleInput) {
                    elements.numPeopleInput.value = numPeople;
                }
                if (elements.startDaySelect) {
                    elements.startDaySelect.value = startDay;
                }
            } else {
                menuData = {}; servingsData = {}; remarksData = {};
                numPeople = 1;
                startDay = 'Lundi';
                if (elements.numPeopleInput) {
                    elements.numPeopleInput.value = numPeople;
                }
                if (elements.startDaySelect) {
                    elements.startDaySelect.value = startDay;
                }
            }
        } catch (error) {
            console.error("Erreur de lecture depuis Firebase:", error);
            menuData = {}; servingsData = {}; remarksData = {};
        }
        updateWeekDisplay();
        renderPlanner();
    }

    async function saveCurrentPlan() {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        const planToSave = { menuData, servingsData, remarksData, numPeople: numPeople, startDay: startDay, lastUpdated: new Date() };
        try {
            const docRef = doc(db, "plans", `${userId}_semaine-${currentWeek}`);
            await setDoc(docRef, planToSave);
        } catch (error) {
            console.error("Erreur de sauvegarde sur Firebase:", error);
        }
    }

    async function fetchSavedLists() {
        if (!db) return [];
        try {
            const querySnapshot = await getDocs(collection(db, "shopping_lists"));
            return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
                txtContent += `- ${formattedQuantity} ${item.unit || ''} ${item.name}\n`;
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
        doc.text("Liste de courses - GustoPlan", 20, 20);
        let y = 30;

        sortedCategories.forEach(category => {
            if (y > 270) { // Add new page if content overflows
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text(`--- ${category.toUpperCase()} ---`, 20, y);
            y += 8;
            doc.setFont(undefined, 'normal');
            doc.setFontSize(12);

            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));
            itemsInCategory.forEach(item => {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                const formattedQuantity = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                doc.text(`- ${formattedQuantity} ${item.unit || ''} ${item.name}`, 20, y);
                y += 7;
            });
            y += 5; // Extra space between categories
        });

        doc.save("liste-de-courses.pdf");
    }

    async function saveShoppingListToFirebase() {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        try {
            const docRef = doc(db, "active_shopping_list", userId);
            await setDoc(docRef, { items: shoppingList });
        } catch (error) {
            console.error("Erreur de sauvegarde de la liste de courses sur Firebase:", error);
        }
    }

    async function loadShoppingListFromFirebase() {
        const userId = getCurrentUserId();
        if (!db || !userId) return false;

        const docRef = doc(db, "active_shopping_list", userId);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                shoppingList.length = 0;
                Array.prototype.push.apply(shoppingList, data.items || []);
                renderShoppingList();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erreur de chargement de la liste de courses depuis Firebase:", error);
            return false;
        }
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
            createItem.className = 'p-2 bg-blue-50 hover:bg-blue-200 cursor-pointer font-bold text-blue-700';
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
            if (elements.addItemInput && !elements.addItemInput.contains(e.target) && elements.addItemResults && !elements.addItemResults.contains(e.target)) {
                elements.addItemResults.classList.add('hidden');
            }
        });
    }

    function addIngredientToShoppingList(name, quantity, unit) {
        const key = `${name.trim().toLowerCase()}_${unit || ''}`;
        const existingItem = shoppingList.find(item => `${item.name.trim().toLowerCase()}_${item.unit || ''}` === key);

        const masterIngredient = masterIngredientList.find(i => i.name.toLowerCase() === name.trim().toLowerCase());
        const category = masterIngredient ? masterIngredient.category : 'Inconnue';

        if (existingItem) {
            existingItem.totalQuantity = (existingItem.totalQuantity || 0) + quantity;
            existingItem.source = 'manual'; 
        } else {
            shoppingList.push({ name: name.trim(), totalQuantity: quantity, unit: unit, source: 'manual', category: category });
        }
        
        renderShoppingList();
        saveShoppingListToFirebase();
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
            categoryHeader.className = 'text-sm font-bold text-blue-800 bg-blue-200 mt-4 mb-2 px-3 py-1 rounded-md';
            categoryHeader.textContent = category;
            container.appendChild(categoryHeader);

            const ul = document.createElement('ul');
            ul.className = 'space-y-1';
            const itemsInCategory = groupedList[category].sort((a, b) => a.name.localeCompare(b.name));

            itemsInCategory.forEach(item => {
                const li = document.createElement('li');
                let liClasses = 'flex justify-between items-center p-2 rounded';
                li.className = liClasses + (item.source === 'manual' ? ' bg-lemon' : ' bg-gray-50');

                const nameSpan = document.createElement('span');
                nameSpan.className = 'flex-grow text-xs';
                nameSpan.textContent = item.name;
                li.appendChild(nameSpan);

                const controlsDiv = document.createElement('div');
                controlsDiv.className = 'flex items-center space-x-2 mx-2';

                const quantitySpan = document.createElement('span');
                quantitySpan.className = 'font-medium w-20 text-center text-xs';
                const formattedQuantity = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                quantitySpan.textContent = `${formattedQuantity} ${item.unit || ''}`.trim();

                const buttonsContainer = document.createElement('div');
                buttonsContainer.className = 'flex flex-col';

                const plusBtn = document.createElement('button');
                plusBtn.className = 'btn btn-outline btn-xs rounded-b-none';
                plusBtn.textContent = '+';
                plusBtn.addEventListener('click', () => {
                    const step = getIncrementStep(item.unit);
                    item.totalQuantity += step;
                    renderShoppingList();
                    saveShoppingListToFirebase();
                });

                const minusBtn = document.createElement('button');
                minusBtn.className = 'btn btn-outline btn-xs rounded-t-none -mt-px';
                minusBtn.textContent = '-';
                minusBtn.addEventListener('click', () => {
                    const step = getIncrementStep(item.unit);
                    item.totalQuantity = Math.max(0, item.totalQuantity - step);
                    renderShoppingList();
                    saveShoppingListToFirebase();
                });

                buttonsContainer.appendChild(plusBtn);
                buttonsContainer.appendChild(minusBtn);
                controlsDiv.appendChild(quantitySpan);
                controlsDiv.appendChild(buttonsContainer);
                li.appendChild(controlsDiv);

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
                li.appendChild(deleteButton);
                ul.appendChild(li);
            });
            container.appendChild(ul);
        });
    }

    async function generateShoppingListFromPlan() {
        const manualItems = shoppingList.filter(item => item.source === 'manual');
        const manualItemsMap = new Map(manualItems.map(item => [`${item.name.trim().toLowerCase()}_${item.unit || ''}`, { ...item }]));

        const planIngredients = new Map();

        // Process only the current, in-memory plan
        for (const slotId in menuData) {
            const mealsInSlot = menuData[slotId];
            if (!Array.isArray(mealsInSlot)) continue;

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
                    const finalQuantity = valuePerServing * numPeople; // Use the current people count
                    const displayUnit = unit || '';
                    const key = `${name.trim().toLowerCase()}_${displayUnit}`;

                    if (planIngredients.has(key)) {
                        planIngredients.get(key).totalQuantity += finalQuantity;
                    } else {
                        planIngredients.set(key, { name: name.trim(), totalQuantity: finalQuantity, unit: displayUnit, source: 'plan', category: category });
                    }
                });
            }
        }

        manualItemsMap.forEach((manualItem, key) => {
            if (planIngredients.has(key)) {
                planIngredients.get(key).totalQuantity += manualItem.totalQuantity;
                planIngredients.get(key).source = 'manual';
            } else {
                planIngredients.set(key, manualItem);
            }
        });

        shoppingList.length = 0;
        shoppingList.push(...Array.from(planIngredients.values()).sort((a, b) => a.name.localeCompare(b.name)));
        
        renderShoppingList();
        await saveShoppingListToFirebase();
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
                renderPlanner();
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

    function createMealCardElement(meal, slotId, index) {
        const card = document.createElement('div');
        card.className = 'meal-card p-1 flex flex-col items-center bg-white rounded shadow-sm text-center relative w-full cursor-grab mb-1';
        card.draggable = true;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'text-xs font-medium p-1 break-words w-full';
        nameSpan.textContent = meal.name;
        card.appendChild(nameSpan);

        const hoverButtonsDiv = document.createElement('div');
        hoverButtonsDiv.className = 'absolute top-0 left-0 flex';

        const editButton = document.createElement('button');
        editButton.className = 'edit-meal-btn text-blue-500 hover:text-blue-700 hidden px-1 py-0.5';
        editButton.innerHTML = '<i class="fas fa-pencil-alt fa-xs"></i>';
        editButton.title = 'Modifier la recette';
        editButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const latestMeal = availableMeals.find(m => m.id === meal.id);
            editRecipeFormHandler.openForm(latestMeal || meal, 'Modifier la recette');
        });
        hoverButtonsDiv.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-meal-btn text-red-500 hover:text-red-700 hidden px-1 py-0.5';
        deleteButton.innerHTML = '<i class="fas fa-times-circle fa-xs"></i>';
        deleteButton.title = 'Retirer du planning';
        deleteButton.addEventListener('click', (e) => { 
            e.stopPropagation(); 
            handleDeleteMeal(slotId, index);
        });
        hoverButtonsDiv.appendChild(deleteButton);
        card.appendChild(hoverButtonsDiv);

        const infoButtonContainer = document.createElement('div');
        infoButtonContainer.className = 'absolute bottom-1 right-1';

        const infoButton = document.createElement('button');
        infoButton.className = 'info-meal-btn bg-blue-500 text-white hover:bg-blue-600 rounded w-3 h-3 flex items-center justify-center shadow-sm';
        infoButton.innerHTML = '<i class="fas fa-plus fa-xs"></i>';
        infoButton.title = 'Plus d\'infos';

        infoButton.dataset.slotId = slotId;
        infoButton.dataset.mealIndex = index;

        infoButtonContainer.appendChild(infoButton);
        card.appendChild(infoButtonContainer);

        card.addEventListener('mouseenter', () => {
            editButton.classList.remove('hidden');
            deleteButton.classList.remove('hidden');
        });

        card.addEventListener('mouseleave', () => {
            editButton.classList.add('hidden');
            deleteButton.classList.add('hidden');
        });

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

    function createRemarkElement(slotId) {
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

    function renderPlanner() {
        const grid = elements.mealPlanGrid;
        if (!grid) return;
        grid.innerHTML = '';
        const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const mealTypes = ['lunch', 'dinner'];
        const subSlotsCount = 5;
        const startDayIndex = allDays.indexOf(startDay);
        const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

        weekDays.forEach(dayName => {
            const dayOriginalIndex = allDays.indexOf(dayName);
            const dayRow = document.createElement('div');
            dayRow.className = 'grid grid-cols-[100px_repeat(10,_minmax(0,_1fr))] items-stretch border-b border-gray-300';
            const dayHeader = document.createElement('div');
            dayHeader.className = 'font-bold p-2 flex items-center justify-center bg-gray-100 text-sm border-r border-gray-300';
            dayHeader.textContent = dayName.toUpperCase();
            dayRow.appendChild(dayHeader);

            mealTypes.forEach(mealType => {
                for (let i = 0; i < subSlotsCount; i++) {
                    const slotId = `${dayOriginalIndex}-${mealType}-${i}`;
                    const mealsInSlot = menuData[slotId];
                    const mealSlotDiv = document.createElement('div');
                    const category = getCategoryFromSlotId(slotId);
                    
                    let slotClasses = 'meal-slot p-1 min-h-[70px] flex flex-col justify-start border-r border-gray-300';
                    slotClasses += (mealType === 'lunch') ? ' bg-blue-50' : ' bg-purple-50';
                    mealSlotDiv.className = slotClasses;
                    mealSlotDiv.dataset.slotId = slotId;

                    if (category === 'Remarque') {
                        mealSlotDiv.appendChild(createRemarkElement(slotId));
                    } else if (Array.isArray(mealsInSlot) && mealsInSlot.length > 0) {
                        const cardsContainer = document.createElement('div');
                        cardsContainer.className = 'w-full';
                        mealsInSlot.forEach((meal, index) => {
                            cardsContainer.appendChild(createMealCardElement(meal, slotId, index));
                        });
                        mealSlotDiv.appendChild(cardsContainer);
                        mealSlotDiv.appendChild(createAddElement(slotId, true));
                    } else {
                        mealSlotDiv.appendChild(createAddElement(slotId, false));
                    }
                    dayRow.appendChild(mealSlotDiv);
                }
            });
            grid.appendChild(dayRow);
        });
        attachPlannerListeners();
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
        
        renderPlanner();
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
            renderPlanner();
            await saveCurrentPlan();
            await generateShoppingListFromPlan();
        }
    }

    async function clearMenu() {
        if (confirm("Voulez-vous vraiment vider le menu de cette semaine ?")) {
            menuData = {}; 
            servingsData = {}; 
            remarksData = {};
            
            await saveCurrentPlan(); 
            
            renderPlanner();

            await generateShoppingListFromPlan();
        }
    }

    function changeWeek(weekNumber) {
        if (weekNumber >= 1 && weekNumber <= 52) {
            currentWeek = weekNumber;
            loadPlanForWeek(currentWeek);
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
            renderPlanner(); 
            saveCurrentPlan();
        });
        elements.closeMealSelectModalBtn?.addEventListener('click', closeMealSelectModal);
        elements.mealSelectModal?.addEventListener('click', (e) => { if (e.target === elements.mealSelectModal) closeMealSelectModal(); });
        elements.closeRecipeModalBtn?.addEventListener('click', () => editRecipeFormHandler.closeForm());
        elements.cancelRecipeBtn?.addEventListener('click', () => editRecipeFormHandler.closeForm());

        elements.importListBtn?.addEventListener('click', openImportListModal);
        elements.closeImportListModalBtn?.addEventListener('click', closeImportListModal);
        elements.importListModal?.addEventListener('click', (e) => { if (e.target === elements.importListModal) closeImportListModal(); });

        elements.exportTxtBtn?.addEventListener('click', exportToTxt);
        elements.exportPdfBtn?.addEventListener('click', exportToPdf);

        elements.numPeopleInput?.addEventListener('input', async (event) => {
            numPeople = parseInt(event.target.value) || 1;
            await saveCurrentPlan();
            await generateShoppingListFromPlan();
        });
        elements.decreasePeopleBtn?.addEventListener('click', async () => {
            if (numPeople > 1) {
                numPeople--;
                elements.numPeopleInput.value = numPeople;
                await saveCurrentPlan();
                await generateShoppingListFromPlan();
            }
        });
        elements.increasePeopleBtn?.addEventListener('click', async () => {
            numPeople++;
            elements.numPeopleInput.value = numPeople;
            await saveCurrentPlan();
            await generateShoppingListFromPlan();
        });

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
    }

    async function initializeApp() {
        if (!db) return;
        setupEventListeners();
        setupShoppingListAutocomplete();
        await fetchMasterIngredients();
        await loadAvailableMeals();
        
        await loadShoppingListFromFirebase();

        await loadPlanForWeek(currentWeek);

        await generateShoppingListFromPlan();
    }
    
    initializeApp();
}

// GustoPlan - lists.js
import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, query, where, getDoc, updateDoc } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';
import { openShareModal } from './sharing.js';

export default function init() {
    // --- DOM Elements ---
    const searchBar = document.getElementById('search-bar');
    const listsContainer = document.getElementById('lists-container');
    const addListBtn = document.getElementById('add-list-btn');
    const sharedListsContainer = document.getElementById('shared-lists-container');

    // Modal elements
    const listFormModal = document.getElementById('list-form-modal');
    const listModalTitle = document.getElementById('list-modal-title');
    const closeListModalBtn = document.getElementById('close-list-modal');
    const cancelListBtn = document.getElementById('cancel-list-btn');
    const listForm = document.getElementById('list-form');
    const listIdInput = document.getElementById('list-id');
    const listNameInput = document.getElementById('list-name');
    const ingredientsListDiv = document.getElementById('ingredients-list');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const saveListBtn = document.getElementById('save-list-btn');

    // --- State ---
    let allLists = [];
    let searchTerm = '';
    let masterIngredientList = [];
    let currentIngredients = [];

    // --- Main Data Loading ---
    async function fetchAllData() {
        await fetchMasterIngredients();
        await fetchAllLists();
        await loadSharedLists();
    }

    async function fetchMasterIngredients() {
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "ingredients"));
            masterIngredientList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            masterIngredientList.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Erreur lors de la récupération de la liste des ingrédients: ", error);
        }
    }

    async function fetchAllLists() {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        try {
            const q = query(collection(db, "shopping_lists"), where("userId", "==", userId));
            const querySnapshot = await getDocs(q);
            allLists = querySnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(list => list.isShared !== true);
            renderLists();
        } catch (error) {
            console.error("Erreur de chargement des listes: ", error);
        }
    }

    async function loadSharedLists() {
        const userId = getCurrentUserId();
        if (!db || !userId) return;

        console.log(`Recherche de listes partagées pour userId: ${userId}`);
        try {
            const q = query(collection(db, "shopping_lists"), where("userId", "==", userId), where("isShared", "==", true));
            const querySnapshot = await getDocs(q);
            console.log(`Trouvé ${querySnapshot.size} liste(s) partagée(s).`);
            const sharedLists = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderSharedLists(sharedLists);
        } catch (error) {
            console.error("Erreur de chargement des listes partagées: ", error);
        }
    }

    // --- List Modal Logic ---
    async function openListModal(list = null) {
        await fetchMasterIngredients(); // S'assure que la liste est à jour
        listForm.reset();
        ingredientsListDiv.innerHTML = '';
        currentIngredients = [];

        if (list) {
            listModalTitle.textContent = "Modifier la liste";
            listIdInput.value = list.id;
            listNameInput.value = list.name;
            if (list.ingredients && list.ingredients.length > 0) {
                list.ingredients.forEach(ing => addIngredientInput(ing));
            } else {
                addIngredientInput();
            }
        } else {
            listModalTitle.textContent = "Créer une liste";
            listIdInput.value = '';
            addIngredientInput();
        }
        listFormModal.classList.remove('hidden');
    }

    function closeListModal() {
        listFormModal.classList.add('hidden');
    }

    async function handleListFormSubmit(e) {
        e.preventDefault();
        saveListBtn.disabled = true;

        const userId = getCurrentUserId();
        if (!userId) {
            alert("Erreur : utilisateur non connecté.");
            saveListBtn.disabled = false;
            return;
        }

        const finalIngredients = currentIngredients.filter(ing => ing && ing.name && ing.quantity);

        const listData = {
            name: listNameInput.value,
            ingredients: finalIngredients,
            userId: userId // Ajout de l'ID utilisateur
        };

        if (!listData.name) {
            alert("Le nom de la liste est requis.");
            saveListBtn.disabled = false;
            return;
        }

        const id = listIdInput.value;
        try {
            if (id) {
                await setDoc(doc(db, "shopping_lists", id), listData);
            } else {
                await addDoc(collection(db, "shopping_lists"), listData);
            }
            closeListModal();
            await fetchAllLists();
        } catch (error) {
            console.error("Erreur de sauvegarde de la liste: ", error);
        } finally {
            saveListBtn.disabled = false;
        }
    }

    function addIngredientInput(ingredient = { quantity: '', name: '', unit: '' }) {
        const ingredientRow = document.createElement('div');
        ingredientRow.className = 'relative flex items-stretch space-x-2 ingredient-row';

        const newIngredient = { ...ingredient };
        currentIngredients.push(newIngredient);
        const index = currentIngredients.length - 1;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.className = 'ingredient-quantity mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm';
        quantityInput.placeholder = 'Qté';
        quantityInput.value = newIngredient.quantity;
        quantityInput.addEventListener('change', (e) => { currentIngredients[index].quantity = e.target.value; });

        const unitDisplay = document.createElement('input');
        unitDisplay.type = 'text';
        unitDisplay.className = 'ingredient-unit mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm bg-gray-100';
        unitDisplay.placeholder = 'Unité';
        unitDisplay.readOnly = true;
        unitDisplay.value = newIngredient.unit || '';

        const nameInputContainer = document.createElement('div');
        nameInputContainer.className = 'relative w-1/2';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'ingredient-name mt-1 block w-full rounded-md border-gray-300 shadow-sm';
        nameInput.placeholder = 'Chercher un ingrédient...';
        nameInput.value = newIngredient.name;
        nameInputContainer.appendChild(nameInput);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 hidden max-h-48 overflow-y-auto';
        nameInputContainer.appendChild(resultsDiv);

        nameInput.addEventListener('input', () => {
            const searchTerm = nameInput.value.toLowerCase();
            if (!searchTerm) {
                resultsDiv.classList.add('hidden');
                return;
            }
            const filtered = masterIngredientList.filter(i => i.name.toLowerCase().includes(searchTerm));
            resultsDiv.innerHTML = '';
            filtered.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'p-2 hover:bg-tomato hover:text-white cursor-pointer';
                resultItem.textContent = item.name;
                resultItem.addEventListener('click', () => {
                    nameInput.value = item.name;
                    unitDisplay.value = item.unit;
                    resultsDiv.classList.add('hidden');
                    currentIngredients[index].name = item.name;
                    currentIngredients[index].unit = item.unit;
                    currentIngredients[index].id = item.id;
                });
                resultsDiv.appendChild(resultItem);
            });

            // Option to create new
            const createItem = document.createElement('div');
            createItem.className = 'p-2 bg-blue-50 hover:bg-blue-200 cursor-pointer font-bold text-blue-700';
            createItem.textContent = `+ Créer "${nameInput.value}"`;
            createItem.addEventListener('click', async () => {
                const newName = nameInput.value;
                const newUnit = 'pièce(s)'; // Default unit
                try {
                    const docRef = await addDoc(collection(db, "ingredients"), { name: newName, unit: newUnit, category: 'Inconnue' });
                    await fetchMasterIngredients(); // Refresh master list
                    nameInput.value = newName;
                    unitDisplay.value = newUnit;
                    resultsDiv.classList.add('hidden');
                    currentIngredients[index].name = newName;
                    currentIngredients[index].unit = newUnit;
                    currentIngredients[index].id = docRef.id;
                } catch (error) {
                    console.error("Erreur d'ajout d'ingrédient", error);
                    alert("L'ingrédient n'a pas pu être créé.");
                }
            });
            resultsDiv.appendChild(createItem);

            resultsDiv.classList.remove('hidden');
        });

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'btn btn-ghost text-red-500 hover:bg-red-50 btn-sm mt-1';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', () => {
            ingredientRow.remove();
            currentIngredients[index] = null;
        });

        ingredientRow.appendChild(nameInputContainer);
        ingredientRow.appendChild(quantityInput);
        ingredientRow.appendChild(unitDisplay);
        ingredientRow.appendChild(removeBtn);
        ingredientsListDiv.appendChild(ingredientRow);
    }

    // --- Main View Rendering ---
    function renderLists() {
        listsContainer.innerHTML = '';
        let listsToRender = allLists;

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            listsToRender = allLists.filter(list => list.name.toLowerCase().includes(lowerCaseSearchTerm));
        }

        if (listsToRender.length === 0) {
            listsContainer.innerHTML = '<p class="text-center text-gray-500 p-10 col-span-full">Aucune liste de courses trouvée.</p>';
            return;
        }

        listsToRender.sort((a, b) => a.name.localeCompare(b.name));

        listsToRender.forEach(list => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col';

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start border-b pb-2 mb-2';
            const name = document.createElement('h4');
            name.className = 'text-lg font-bold text-gray-800';
            name.textContent = list.name;
            header.appendChild(name);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex space-x-2';
            const editBtn = document.createElement('button');
            editBtn.className = 'btn btn-ghost btn-sm text-blue-500';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => openListModal(list));
            actionsDiv.appendChild(editBtn);

            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn btn-ghost btn-sm text-green-500';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.addEventListener('click', () => openShareModal({ list: list }));
            actionsDiv.appendChild(shareBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-ghost btn-sm text-red-500';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => deleteList(list.id, list.name));
            actionsDiv.appendChild(deleteBtn);
            header.appendChild(actionsDiv);

            const ingredientList = document.createElement('ul');
            ingredientList.className = 'space-y-1 text-sm text-gray-600 flex-grow';
            if (list.ingredients && list.ingredients.length > 0) {
                list.ingredients.forEach(ing => {
                    const li = document.createElement('li');
                    li.textContent = `${ing.quantity} ${ing.unit || ''} - ${ing.name}`.trim();
                    ingredientList.appendChild(li);
                });
            } else {
                ingredientList.innerHTML = '<li class="italic text-gray-400">Cette liste est vide.</li>';
            }

            card.appendChild(header);
            card.appendChild(ingredientList);
            listsContainer.appendChild(card);
        });
    }

    function renderSharedLists(lists) {
        sharedListsContainer.innerHTML = '';

        if (lists.length === 0) {
            sharedListsContainer.innerHTML = '<p class="text-center text-gray-500 p-10 col-span-full">Aucune liste de courses partagée trouvée.</p>';
            return;
        }

        lists.sort((a, b) => a.name.localeCompare(b.name));

        lists.forEach(list => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg shadow-md p-4 flex flex-col';

            const header = document.createElement('div');
            header.className = 'flex justify-between items-start border-b pb-2 mb-2';
            const name = document.createElement('h4');
            name.className = 'text-lg font-bold text-gray-800';
            name.textContent = list.name;
            header.appendChild(name);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'flex space-x-2';

            const integrateBtn = document.createElement('button');
            integrateBtn.className = 'btn btn-secondary btn-sm';
            integrateBtn.innerHTML = '<i class="fas fa-copy mr-2"></i> Copier dans mes listes';
            integrateBtn.title = "Copier cette liste dans vos listes personnelles";
            integrateBtn.addEventListener('click', () => copySharedListToPersonal(list.id));
            actionsDiv.appendChild(integrateBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-ghost btn-sm text-red-500';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = "Supprimer cette liste partagée";
            deleteBtn.addEventListener('click', () => deleteSharedList(list.id, list.name));
            actionsDiv.appendChild(deleteBtn);

            header.appendChild(actionsDiv);

            const ingredientList = document.createElement('ul');
            ingredientList.className = 'space-y-1 text-sm text-gray-600 flex-grow';
            if (list.ingredients && list.ingredients.length > 0) {
                list.ingredients.forEach(ing => {
                    const li = document.createElement('li');
                    li.textContent = `${ing.quantity} ${ing.unit || ''} - ${ing.name}`.trim();
                    ingredientList.appendChild(li);
                });
            } else {
                ingredientList.innerHTML = '<li class="italic text-gray-400">Cette liste est vide.</li>';
            }

            card.appendChild(header);
            card.appendChild(ingredientList);
            sharedListsContainer.appendChild(card);
        });
    }

    async function deleteList(id, name) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la liste "${name}" ?`)) {
            try {
                await deleteDoc(doc(db, "shopping_lists", id));
                await fetchAllLists();
            } catch (error) {
                console.error("Erreur de suppression de la liste: ", error);
            }
        }
    }

    async function deleteSharedList(id, name) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la liste partagée "${name}" ?`)) {
            try {
                await deleteDoc(doc(db, "shopping_lists", id));
                await loadSharedLists(); // Refresh only the shared lists
            } catch (error) {
                console.error("Erreur de suppression de la liste partagée: ", error);
                alert("Une erreur est survenue.");
            }
        }
    }

    async function copySharedListToPersonal(listId) {
        if (!confirm("Voulez-vous vraiment copier cette liste dans vos listes personnelles ? Elle ne sera plus considérée comme une liste partagée.")) {
            return;
        }

        try {
            const listRef = doc(db, "shopping_lists", listId);
            await updateDoc(listRef, { isShared: false });
            await fetchAllData(); // Refresh both personal and shared lists
        } catch (error) {
            console.error("Erreur lors de la copie de la liste: ", error);
            alert("Une erreur est survenue.");
        }
    }

    // --- Event Listeners ---
    searchBar.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderLists();
    });

    addListBtn.addEventListener('click', () => openListModal());
    closeListModalBtn.addEventListener('click', closeListModal);
    cancelListBtn.addEventListener('click', closeListModal);
    listForm.addEventListener('submit', handleListFormSubmit);
    addIngredientBtn.addEventListener('click', () => addIngredientInput());

    if (db) {
        fetchAllData();
    }
}

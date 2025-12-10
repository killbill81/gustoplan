// ingredients.js
import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc, writeBatch, query, where } from "firebase/firestore";

export default function init() {
    // --- DOM Elements ---
    const listContainer = document.getElementById('ingredients-list-container');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const tabsContainer = document.getElementById('category-tabs');
    const searchBar = document.getElementById('search-bar');

    // Ingredient Modal
    const ingredientModal = document.getElementById('ingredient-form-modal');
    const ingredientModalTitle = document.getElementById('ingredient-modal-title');
    const closeIngredientModalBtn = document.getElementById('close-ingredient-modal');
    const cancelIngredientModalBtn = document.getElementById('cancel-ingredient-btn');
    const ingredientForm = document.getElementById('ingredient-form');
    const ingredientIdInput = document.getElementById('ingredient-id');
    const ingredientNameInput = document.getElementById('ingredient-name');
    const ingredientUnitSelect = document.getElementById('ingredient-unit');
    const ingredientCategorySelect = document.getElementById('ingredient-category');

    // Category Management Modal
    const manageCategoriesBtn = document.getElementById('manage-categories-btn');
    const categoryModal = document.getElementById('category-management-modal');
    const closeCategoryModalBtn = document.getElementById('close-category-modal');
    const doneCategoryModalBtn = document.getElementById('done-category-modal-btn');
    const addCategoryForm = document.getElementById('add-category-form');
    const newCategoryNameInput = document.getElementById('new-category-name');
    const categoryListDiv = document.getElementById('category-list');

    // --- State ---
    let allIngredients = [];
    let ingredientCategories = [];
    let activeCategory = '';
    let searchTerm = '';
    let previousActiveCategory = null;
    const units = ['g', 'kg', 'ml', 'l', 'pièce(s)', 'c.à.s.', 'c.à.c.', 'pincée(s)'];

    // --- Main Data Loading ---
    async function fetchAllData() {
        await fetchIngredientCategories();
        await ensureDefaultCategories(); // Check and add defaults if missing
        await fetchAllIngredients();
    }

    async function ensureDefaultCategories() {
        if (!db) return;
        const defaults = ["Fruit", "Légume"];
        // Re-fetch local list names just in case, but we rely on ingredientCategories populated above
        const existingNames = ingredientCategories.map(c => c.name.toLowerCase());
        
        let added = false;
        for (const def of defaults) {
            if (!existingNames.includes(def.toLowerCase())) {
                try {
                    await addDoc(collection(db, "ingredient_categories"), { name: def });
                    // Manually push to local list to update UI immediately without re-fetch
                    ingredientCategories.push({ name: def, id: "temp_" + def }); 
                    added = true;
                } catch (e) {
                    console.error(`Erreur ajout catégorie défaut ${def}`, e);
                }
            }
        }
        if (added) {
            ingredientCategories.sort((a, b) => a.name.localeCompare(b.name));
        }
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

    // --- Ingredient Modal Logic ---
    function openIngredientModal(ingredient = null) {
        ingredientForm.reset();
        
        ingredientUnitSelect.innerHTML = '';
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            ingredientUnitSelect.appendChild(option);
        });

        const officialCategoryNames = ingredientCategories.map(c => c.name);
        const usedCategoryNames = [...new Set(allIngredients.map(i => i.category).filter(Boolean))];
        const allAvailableCategories = [...new Set([...officialCategoryNames, ...usedCategoryNames])];
        allAvailableCategories.sort((a, b) => a.localeCompare(b.name));
        
        ingredientCategorySelect.innerHTML = '';
        if (allAvailableCategories.length === 0) {
        }
        allAvailableCategories.forEach(catName => {
            const option = document.createElement('option');
            option.value = catName;
            option.textContent = catName;
            ingredientCategorySelect.appendChild(option);
        });

        if (ingredient) {
            ingredientModalTitle.textContent = "Modifier l'ingrédient";
            ingredientIdInput.value = ingredient.id;
            ingredientNameInput.value = ingredient.name;
            ingredientUnitSelect.value = ingredient.unit || ''; // Set to empty if no unit
            ingredientCategorySelect.value = ingredient.category || (allAvailableCategories.length > 0 ? allAvailableCategories[0] : '');
            document.getElementById('ingredient-image-url').value = ingredient.imageUrl || '';
        } else {
            ingredientModalTitle.textContent = "Ajouter un ingrédient";
            ingredientIdInput.value = '';
            ingredientUnitSelect.value = units[0];
            ingredientCategorySelect.value = activeCategory || (allAvailableCategories.length > 0 ? allAvailableCategories[0] : '');
        }
        ingredientModal.classList.remove('hidden');
    }

    function closeIngredientModal() {
        ingredientModal.classList.add('hidden');
    }

    async function handleIngredientFormSubmit(e) {
        e.preventDefault();
        const id = ingredientIdInput.value;
        const ingredientData = {
            name: ingredientNameInput.value,
            unit: ingredientUnitSelect.value,
            category: ingredientCategorySelect.value,
            imageUrl: document.getElementById('ingredient-image-url').value || `https://tse2.mm.bing.net/th?q=${encodeURIComponent(ingredientNameInput.value)}%20ingredient&w=400&h=300&c=7&rs=1&p=0`
        };

        if (!ingredientData.name || !ingredientData.category) { // Unit is optional now
            alert("Le nom et la catégorie sont requis.");
            return;
        }

        try {
            if (id) {
                await setDoc(doc(db, "ingredients", id), ingredientData);
            } else {
                await addDoc(collection(db, "ingredients"), ingredientData);
            }
            closeIngredientModal();
            await fetchAllIngredients();
        } catch (error) {
            console.error("Erreur de sauvegarde de l'ingrédient: ", error);
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

        if(allCategories.length === 0 && allIngredients.length > 0) {
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

        if (ingredientsForCategory.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-gray-500 p-10">Aucun ingrédient dans cette catégorie.</p>';
            return;
        }

        ingredientsForCategory.sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }));

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
        
        ingredientsForCategory.forEach(ing => {
            const card = document.createElement('div');
            card.className = 'p-3 bg-white shadow-sm rounded-lg flex flex-col items-start space-y-2';

            if (ing.imageUrl) {
                const image = document.createElement('img');
                image.src = ing.imageUrl;
                image.alt = ing.name;
                image.className = 'w-full h-24 object-cover rounded-md mb-2'; // Style pour une petite image
                card.appendChild(image);
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
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'w-full flex justify-end items-center space-x-2 border-t pt-2 mt-2';
            const editBtn = document.createElement('button');
            editBtn.className = 'text-blue-500 hover:bg-blue-50 text-xs px-2 py-1 rounded-md';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.addEventListener('click', () => openIngredientModal(ing));
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded-md';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click', () => deleteIngredient(ing.id, ing.name));
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            card.appendChild(infoDiv);
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

    // --- Event Listeners ---
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

    addIngredientBtn.addEventListener('click', () => openIngredientModal());
    closeIngredientModalBtn.addEventListener('click', closeIngredientModal);
    cancelIngredientModalBtn.addEventListener('click', closeIngredientModal);
    ingredientForm.addEventListener('submit', handleIngredientFormSubmit);

    manageCategoriesBtn.addEventListener('click', openCategoryModal);
    closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
    doneCategoryModalBtn.addEventListener('click', closeCategoryModal);
    addCategoryForm.addEventListener('submit', handleAddCategory);

    fetchAllData();
}

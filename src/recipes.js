// GustoPlan - recipes.js
import { db } from './firebase-config.js';
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { RecipeFormHandler } from './form-handler.js';

let recipeFormHandler = null;

export async function toggleFavoriteStatus(recipeId, currentStatus) {
    if (!recipeId) return;
    const recipeRef = doc(db, 'recipes', recipeId);
    try {
        await updateDoc(recipeRef, {
            isFavorite: !currentStatus
        });
    } catch (error) {
        console.error("Error toggling favorite status:", error);
    }
}

export default function init() {
    // --- DOM Elements ---
    const searchBar = document.getElementById('search-bar');
    const tabsContainer = document.getElementById('category-tabs');
    const recipeListContainer = document.getElementById('recipe-list-container');
    const addRecipeBtn = document.getElementById('add-recipe-btn');
    
    // --- Recipe Form Handler Instance ---
    if (recipeFormHandler) {
        recipeFormHandler.destroy();
    }
    recipeFormHandler = new RecipeFormHandler(
        db,
        'edit-recipe-form-modal', // Correct modal ID
        'edit-recipe-form',       // Correct form ID
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

    // The onSnapshot listener will handle updates, so the callback is less critical
    // but we can keep it for an explicit refresh if needed after a form save.
    recipeFormHandler.setOnSaveCallback(() => {
        // The listener will catch the change, no manual refresh needed.
    });

    

    // --- State ---
    let allRecipes = [];
    let activeCategory = '';
    let searchTerm = '';
    let previousActiveCategory = null; // Added for search behavior
    const categoryOrder = ['Entrée', 'Plat', 'Accompagnement', 'Dessert'];

    // --- Style Maps ---
    const categoryBgColorMap = { 'PLAT': 'bg-orange-100', 'DESSERT': 'bg-amber-100', 'ENTREE': 'bg-lime-100', 'ACCOMPAGNEMENT': 'bg-stone-200', 'PETIT-DEJEUNER': 'bg-orange-100', 'BOISSON': 'bg-cyan-100', 'SAUCE': 'bg-red-100' };
    const categoryTextColorMap = { 'PLAT': 'text-orange-800', 'DESSERT': 'text-amber-800', 'ENTREE': 'text-lime-800', 'ACCOMPAGNEMENT': 'text-stone-800', 'PETIT-DEJEUNER': 'text-orange-800', 'BOISSON': 'text-cyan-800', 'SAUCE': 'text-red-800' };
    const defaultBgColor = 'bg-gray-100';
    const defaultTextColor = 'text-gray-800';

    // --- Main Functions ---
    function initRecipeListener() {
        if (!db) return () => {}; // Return an empty unsubscribe function if db is not available
        
        const unsubscribe = onSnapshot(collection(db, "recipes"), (snapshot) => {
            console.log("Recipe data updated on /recipes page from listener.");
            allRecipes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            renderTabs();
            renderRecipes();
        }, (error) => {
            console.error("Erreur lors de l\'écoute des recettes: ", error);
        });

        return unsubscribe; // Return the unsubscribe function for cleanup
    }

    function handleTabClick(category) {
        activeCategory = category;
        renderTabs();
        renderRecipes();
    }

    function renderTabs() {
        if (!tabsContainer) return;
        tabsContainer.innerHTML = '';
        const categories = [...new Set(allRecipes.map(r => r.category || 'Non classé'))];
        const sortedCategories = categories.sort((a, b) => {
            const findIndex = (cat) => {
                const normalizedCat = cat.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                for (let i = 0; i < categoryOrder.length; i++) {
                    const normalizedOrderCat = categoryOrder[i].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    if (normalizedOrderCat === normalizedCat) return i;
                }
                return -1;
            };
            const indexA = findIndex(a);
            const indexB = findIndex(b);
            if (indexA > -1 && indexB > -1) return indexA - indexB;
            if (indexA > -1) return -1;
            if (indexB > -1) return 1;
            return a.localeCompare(b);
        });

        if (!activeCategory && sortedCategories.length > 0) {
            activeCategory = sortedCategories[0];
        }

        sortedCategories.forEach(category => {
            const tab = document.createElement('button');
            const normalizedCategory = category.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
            const isActive = category === activeCategory;
            if (isActive) {
                const bgColor = categoryBgColorMap[normalizedCategory] || defaultBgColor;
                const textColor = categoryTextColorMap[normalizedCategory] || defaultTextColor;
                tab.className = `px-4 py-2 text-sm font-bold rounded-t-lg ${bgColor} ${textColor}`;
            } else {
                tab.className = 'px-4 py-2 text-sm font-medium text-gray-500 hover:text-tomato';
            }
            tab.textContent = category;
            tab.addEventListener('click', () => handleTabClick(category));
            tabsContainer.appendChild(tab);
        });
    }

    function renderRecipes() {
        if (!recipeListContainer) return;
        recipeListContainer.innerHTML = '';

        // 1. Filter by the active category first
        let recipesForCategory = allRecipes.filter(r => (r.category || 'Non classé') === activeCategory);

        // 2. Then, filter by the search term if it exists
        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            recipesForCategory = recipesForCategory.filter(recipe => recipe.name.toLowerCase().includes(lowerCaseSearchTerm));
        }

        recipesForCategory.sort((a, b) => a.name.localeCompare(b.name));

        if (recipesForCategory.length === 0) {
            recipeListContainer.innerHTML = `<p class="text-gray-500 text-center p-10">Aucune recette trouvée.</p>`;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4';
        recipesForCategory.forEach(recipe => {
            grid.appendChild(createRecipeCard(recipe));
        });
        recipeListContainer.appendChild(grid);
    }

    function createRecipeCard(recipe) {
        const card = document.createElement('div');
        // Use the standard white card style, consistent with other pages
        card.className = 'bg-white dark:bg-gray-800 shadow-md rounded-lg flex flex-col p-3';

        // --- Image Section ---
        if (recipe.imageUrl) {
            const image = document.createElement('img');
            image.src = recipe.imageUrl;
            image.alt = recipe.name;
            image.className = 'w-full h-24 object-cover rounded-md mb-2';
            card.appendChild(image);
        }

        // --- Header Section ---
        const header = document.createElement('div');
        header.className = 'w-full flex justify-between items-start';

        const name = document.createElement('h4');
        name.className = 'font-bold text-gray-800 dark:text-gray-200 pr-2'; // Added padding-right
        name.textContent = recipe.name;
        name.title = recipe.name;
        header.appendChild(name);

        const heartBtn = document.createElement('button');
        heartBtn.className = 'text-lg flex-shrink-0'; // Prevent button from shrinking
        heartBtn.innerHTML = `<i class="fas fa-heart"></i>`;
        if (recipe.isFavorite) {
            heartBtn.classList.add('text-red-500');
        } else {
            heartBtn.classList.add('text-gray-300', 'dark:text-gray-500', 'hover:text-red-400');
        }
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavoriteStatus(recipe.id, recipe.isFavorite);
        });
        header.appendChild(heartBtn);
        card.appendChild(header);

        // --- Details Section ---
        const details = document.createElement('p');
        details.className = 'text-sm text-gray-600 dark:text-gray-400 mt-1 w-full';
        details.textContent = `${recipe.difficulty || ''} - Pour ${recipe.servings || '?'} pers.`;
        card.appendChild(details);

        // --- Spacer ---
        const flexGrow = document.createElement('div');
        flexGrow.className = 'flex-grow';
        card.appendChild(flexGrow);

        // --- Actions Section ---
        const actions = document.createElement('div');
        actions.className = 'w-full flex justify-end items-center space-x-2 border-t dark:border-gray-700 pt-2 mt-2';

        const editButton = document.createElement('button');
        editButton.className = 'btn btn-ghost btn-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/50';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.title = 'Modifier';
        editButton.addEventListener('click', () => recipeFormHandler.openForm(recipe, 'Modifier la recette'));
        actions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-ghost btn-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/50';
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.title = 'Supprimer';
        deleteButton.addEventListener('click', () => handleDeleteRecipe(recipe.id, recipe.name));
        actions.appendChild(deleteButton);
        
        card.appendChild(actions);

        return card;
    }

    async function handleDeleteRecipe(id, name) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer la recette "${name}" ?`)) {
            try {
                await deleteDoc(doc(db, "recipes", id));
                fetchAllRecipes();
            } catch (error) {
                console.error("Erreur lors de la suppression: ", error);
            }
        }
    }

    // --- Event Listeners ---
    addRecipeBtn.addEventListener('click', () => recipeFormHandler.openForm(null, 'Ajouter une recette'));
    
    searchBar.addEventListener('input', (e) => {
        const newSearchTerm = e.target.value;

        if (!searchTerm && newSearchTerm) { // Search is starting
            previousActiveCategory = activeCategory;
        }

        searchTerm = newSearchTerm;

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const foundRecipe = allRecipes.find(recipe => recipe.name.toLowerCase().includes(lowerCaseSearchTerm));
            if (foundRecipe) {
                activeCategory = foundRecipe.category || 'Non classé';
            }
        } else { // Search is cleared
            if (previousActiveCategory) {
                activeCategory = previousActiveCategory;
                previousActiveCategory = null;
            }
        }
        
        renderTabs();
        renderRecipes();
    });

    if (db) {
        const unsubscribe = initRecipeListener();
        // The cleanup function for the router will be to unsubscribe
        return unsubscribe;
    }
}
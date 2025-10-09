// GustoPlan - recipes.js
import { db } from './firebase-config.js';
import { collection, getDocs, doc, setDoc, addDoc, deleteDoc } from "firebase/firestore";
import { RecipeFormHandler } from './form-handler.js';

let recipeFormHandler = null;

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
        'recipe-form-modal',
        'recipe-form',
        'recipe-modal-title',
        'recipe-id',
        'recipe-name',
        'recipe-category',
        'recipe-servings',
        'recipe-prep-time',
        'recipe-difficulty',
        'recipe-steps',
        'ingredients-list',
        'add-ingredient-btn',
        'save-recipe-btn',
        'close-recipe-modal', // Added closeButtonId
        'cancel-recipe-btn'   // Added cancelButtonId
    );

    recipeFormHandler.setOnSaveCallback(fetchAllRecipes); // Set callback to refresh recipes after save

    

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
    async function fetchAllRecipes() {
        console.log("fetchAllRecipes called.");
        if (!db) return;
        try {
            const querySnapshot = await getDocs(collection(db, "recipes"));
            allRecipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Fetched recipes:", allRecipes);
            renderTabs();
            renderRecipes();
        } catch (error) {
            console.error("Erreur lors de la récupération des recettes: ", error);
        }
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
        let bgColor = defaultBgColor;
        if (recipe.category) {
            const normalizedCategory = recipe.category.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
            bgColor = categoryBgColorMap[normalizedCategory] || defaultBgColor;
        }
        const card = document.createElement('div');
        card.className = `rounded-lg shadow-sm flex flex-col p-2 ${bgColor}`;
        const name = document.createElement('h4');
        name.className = 'text-sm font-bold text-gray-800 truncate';
        name.textContent = recipe.name;
        name.title = recipe.name;
        card.appendChild(name);
        const details = document.createElement('p');
        details.className = 'text-xs text-gray-600 mt-1';
        details.textContent = `${recipe.difficulty || ''} - Pour ${recipe.servings || '?'} pers.`
        card.appendChild(details);
        const flexGrow = document.createElement('div');
        flexGrow.className = 'flex-grow';
        card.appendChild(flexGrow);
        const actions = document.createElement('div');
        actions.className = 'flex justify-end space-x-2 mt-2';
        const editButton = document.createElement('button');
        editButton.className = 'btn btn-outline btn-xs border-gray-400 hover:bg-gray-200';
        editButton.innerHTML = '<i class="fas fa-edit"></i>';
        editButton.title = 'Modifier';
        editButton.addEventListener('click', () => recipeFormHandler.openForm(recipe, 'Modifier la recette'));
        actions.appendChild(editButton);
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-ghost text-red-700 hover:bg-red-100 btn-xs';
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
        fetchAllRecipes();
    }
}
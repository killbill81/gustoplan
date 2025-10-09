const mainContent = document.querySelector('main');

const routes = {
    'menu': {
        html: `
        <div class="flex flex-col md:flex-row md:space-x-2">

            <!-- Left Column: Meal Planner -->
            <div class="w-full md:w-5/6">
                <section id="meal-planning-section" aria-labelledby="meal-planning-heading" class="mb-8 md:mb-12">
                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6">
                        <h2 id="meal-planning-heading" class="text-xl md:text-2xl font-bold text-gray-800">Planification des repas</h2>
                        <div class="mt-3 md:mt-0 flex items-center space-x-2 md:space-x-3">
                            <button id="generate-plan-ai-btn" class="btn btn-primary btn-sm">
                                <i class="fas fa-robot mr-1 md:mr-2"></i> IA Semaine
                            </button>
                            <button id="clear-menu-btn" class="btn btn-outline btn-sm text-red-500 hover:bg-red-50">
                                <i class="fas fa-trash-alt mr-1 md:mr-2"></i> Vider le menu
                            </button>
                        </div>
                    </div>

                    <!-- Week Navigation & Settings -->
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-3 md:space-y-0">
                        <!-- Week Navigation -->
                        <div class="flex justify-between items-center bg-white p-2 md:p-3 rounded-lg shadow-sm">
                            <button id="prev-week-btn" class="btn btn-ghost btn-sm" aria-label="Semaine précédente">
                                <i class="fas fa-chevron-left mr-1 md:mr-2"></i> Préc.
                            </button>
                            <div id="current-week-display" class="text-gray-700 font-medium text-sm md:text-base text-center mx-4">Semaine X</div>
                            <button id="next-week-btn" class="btn btn-ghost btn-sm" aria-label="Semaine suivante">
                                Suiv. <i class="fas fa-chevron-right ml-1 md:ml-2"></i>
                            </button>
                        </div>
                        <!-- Start Day Selector -->
                        <div class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                            <label for="start-day-select" class="text-sm font-medium text-gray-700">Début de semaine:</label>
                            <select id="start-day-select" class="rounded-md border-gray-300 shadow-sm focus:border-tomato focus:ring focus:ring-tomato focus:ring-opacity-50 text-sm py-1">
                                <option>Lundi</option>
                                <option>Mardi</option>
                                <option>Mercredi</option>
                                <option>Jeudi</option>
                                <option>Vendredi</option>
                                <option>Samedi</option>
                                <option>Dimanche</option>
                            </select>
                        </div>
                    </div>

                    <!-- Meal Plan Grid -->
                    <div class="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
                        <div id="meal-plan-grid-layout" class="min-w-[1200px]">
                            <!-- Header -->
                            <div class="grid grid-cols-[100px_repeat(10,_minmax(0,_1fr))] gap-1 text-center mb-1">
                                <div class="p-2"></div> <!-- Empty corner -->
                                <div class="p-2 rounded-t-lg bg-blue-100 text-blue-800 font-bold col-span-5">MIDI</div>
                                <div class="p-2 rounded-t-lg bg-purple-100 text-purple-800 font-bold col-span-5">SOIR</div>
                                
                                <div class="p-1 text-xs font-semibold"></div> <!-- Empty under day name -->
                                <div class="p-1 text-xs font-semibold text-gray-600">Entrée</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Plat</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Accomp.</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Dessert</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Remarque</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Entrée</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Plat</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Accomp.</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Dessert</div>
                                <div class="p-1 text-xs font-semibold text-gray-600">Remarque</div>
                            </div>
                            <!-- Rows generated by JS -->
                            <div id="meal-plan-grid" class="space-y-1">
                                <div class="p-10 text-center text-gray-500 italic col-span-full">Chargement du planning...</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Right Column: Shopping List -->
            <div class="w-full md:w-1/6">
                <section id="shopping-list-section" aria-labelledby="shopping-list-heading" class="mb-8 md:mb-12 md:sticky md:top-24">
                    <div class="bg-white rounded-xl shadow-md p-4 md:p-6">
                        <h2 id="shopping-list-heading" class="text-xl md:text-2xl font-bold text-gray-800 mb-4">Liste de courses</h2>
                        <div class="flex justify-end space-x-2 mb-4">
                            <button id="import-list-btn" class="btn btn-secondary btn-sm">
                                <i class="fas fa-download mr-2"></i>Importer une liste
                            </button>
                            <div id="export-buttons-container" class="flex space-x-2">
                                <button id="export-txt-btn" class="btn btn-outline btn-sm">
                                    <i class="fas fa-file-alt mr-2"></i>TXT
                                </button>
                                <button id="export-pdf-btn" class="btn btn-outline btn-sm">
                                    <i class="fas fa-file-pdf mr-2"></i>PDF
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center space-x-2 mb-4">
                            <label for="num-people-input" class="text-sm font-medium text-gray-700">Pour</label>
                            <button id="decrease-people-btn" class="btn btn-outline btn-xs">-</button>
                            <input type="number" id="num-people-input" value="1" min="1" class="w-12 text-center border border-gray-300 rounded-md px-2 py-1 text-sm">
                            <button id="increase-people-btn" class="btn btn-outline btn-xs">+</button>
                            <span class="text-sm font-medium text-gray-700">personnes</span>
                        </div>

                        <!-- Shopping List Container -->
                        <div id="shopping-list-container" class="mb-4 max-h-[60vh] overflow-y-auto pr-2">
                            <ul id="shopping-list" class="space-y-2 text-sm">
                                <!-- Les articles de la liste de courses seront générés ici -->
                            </ul>
                        </div>

                        <!-- Add Item Input -->
                        <div class="mt-4 flex items-stretch">
                            <div class="relative flex-grow">
                                <input type="text" id="add-item-input" placeholder="Chercher ou ajouter..." class="w-full border border-gray-300 rounded-l-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-tomato focus:border-transparent">
                                <div id="add-item-results" class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 hidden max-h-48 overflow-y-auto bottom-full mb-2"></div>
                            </div>
                            <button id="add-item-btn" class="btn btn-primary rounded-l-none -ml-px btn-xs" aria-label="Ajouter l'article">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>

                         <!-- AI Shopping Tips Placeholder -->
                        <div id="ai-shopping-tip" class="mt-6 bg-avocado bg-opacity-10 rounded-lg p-3 hidden">
                            <div class="flex items-start">
                                 <div class="w-8 h-8 bg-avocado bg-opacity-20 rounded-full flex items-center justify-center mr-3 shrink-0">
                                    <i class="fas fa-lightbulb text-avocado"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-avocado mb-1 text-sm">Astuce Économique</h4>
                                    <p id="ai-shopping-tip-text" class="text-sm text-gray-700">...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        `,
        script: './script.js'
    },
    'recipes': {
        html: `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Mes Recettes</h2>
            <button id="add-recipe-btn" class="btn btn-primary">
                <i class="fas fa-plus mr-2"></i> Ajouter une recette
            </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <input type="text" id="search-bar" placeholder="Rechercher une recette..." class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-tomato focus:border-tomato">
        </div>

        <!-- Tabs Navigation -->
        <div id="category-tabs" class="mb-6 border-b border-gray-200 flex space-x-4 flex-nowrap overflow-x-auto pb-2">
            <!-- Tabs will be generated by recipes.js here -->
        </div>

        <!-- Recipe List Container -->
        <div id="recipe-list-container">
            <!-- Recipes for the selected tab will be loaded here -->
        </div>

        <!-- Reconstructed Recipe Form Modal -->
        <div id="recipe-form-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] hidden">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto relative">
                <button id="close-recipe-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Fermer">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <h3 id="recipe-modal-title" class="text-2xl font-bold mb-6">Ajouter/Modifier une recette</h3>
                <form id="recipe-form" class="space-y-4">
                    <input type="hidden" id="recipe-id">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label for="recipe-name" class="block text-sm font-medium text-gray-700">Nom de la recette</label>
                            <input type="text" id="recipe-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                        </div>
                        <div>
                            <label for="recipe-category" class="block text-sm font-medium text-gray-700">Catégorie</label>
                            <select id="recipe-category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                                <option>ENTREE</option>
                                <option>PLAT</option>
                                <option>ACCOMPAGNEMENT</option>
                                <option>DESSERT</option>
                            </select>
                        </div>
                        <div>
                            <label for="recipe-servings" class="block text-sm font-medium text-gray-700">Nombre de personnes</label>
                            <input type="number" id="recipe-servings" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="1">
                        </div>
                        <div>
                            <label for="recipe-prep-time" class="block text-sm font-medium text-gray-700">Temps de préparation (min)</label>
                            <input type="number" id="recipe-prep-time" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" min="0">
                        </div>
                         <div>
                            <label for="recipe-difficulty" class="block text-sm font-medium text-gray-700">Difficulté</label>
                            <select id="recipe-difficulty" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                <option>Très facile</option>
                                <option>Facile</option>
                                <option>Moyen</option>
                                <option>Difficile</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-medium text-gray-800 mb-2">Ingrédients</h4>
                        <div id="ingredients-list" class="space-y-2"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline btn-sm mt-2">
                            <i class="fas fa-plus mr-2"></i> Ajouter un ingrédient
                        </button>
                    </div>
                    <div>
                        <label for="recipe-steps" class="block text-lg font-medium text-gray-800">Préparation</label>
                        <textarea id="recipe-steps" rows="8" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                    </div>
                    <div class="flex justify-end space-x-4 pt-4">
                        <button type="button" id="cancel-recipe-btn" class="btn btn-ghost">Annuler</button>
                        <button type="submit" id="save-recipe-btn" class="btn btn-primary">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
        `,
        script: './recipes.js'
    },
    'ingredients': {
        html: `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Mes Ingrédients</h2>
            <div class="flex space-x-2">
                <button id="manage-categories-btn" class="btn btn-outline">
                    <i class="fas fa-tags mr-2"></i> Gérer les catégories
                </button>
                <button id="add-ingredient-btn" class="btn btn-primary">
                    <i class="fas fa-plus mr-2"></i> Ajouter un ingrédient
                </button>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <input type="text" id="search-bar" placeholder="Rechercher un ingrédient..." class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-tomato focus:border-tomato">
        </div>

        <!-- Tabs Navigation -->
        <div id="category-tabs" class="mb-6 border-b border-gray-200 flex space-x-4 flex-nowrap overflow-x-auto pb-2">
            <!-- Tabs will be generated by ingredients.js here -->
        </div>

        <!-- Ingredient List Container -->
        <div id="ingredients-list-container">
            <p class="text-center text-gray-500 p-10">Chargement des ingrédients...</p>
        </div>

        <!-- Ingredient Form Modal -->
        <div id="ingredient-form-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] hidden">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-md relative">
                <button id="close-ingredient-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                <h3 id="ingredient-modal-title" class="text-lg font-bold mb-4">Ajouter un Ingrédient</h3>
                <form id="ingredient-form" class="space-y-4">
                    <input type="hidden" id="ingredient-id">
                    <div>
                        <label for="ingredient-name" class="block text-sm font-medium text-gray-700">Nom</label>
                        <input type="text" id="ingredient-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                    </div>
                    <div>
                        <label for="ingredient-unit" class="block text-sm font-medium text-gray-700">Unité par défaut</label>
                        <select id="ingredient-unit" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></select>
                    </div>
                    <div>
                        <label for="ingredient-category" class="block text-sm font-medium text-gray-700">Catégorie</label>
                        <select id="ingredient-category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required></select>
                    </div>
                    <div class="flex justify-end space-x-4 pt-2">
                        <button type="button" id="cancel-ingredient-btn" class="btn btn-ghost">Annuler</button>
                        <button type="submit" id="save-ingredient-btn" class="btn btn-primary">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Category Management Modal -->
        <div id="category-management-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] hidden">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-lg relative">
                <h3 class="text-lg font-bold mb-4">Gérer les catégories d'ingrédients</h3>
                <form id="add-category-form" class="flex items-center space-x-2 mb-4">
                    <input type="text" id="new-category-name" placeholder="Nom de la nouvelle catégorie" class="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                    <button type="submit" class="btn btn-secondary">Ajouter</button>
                </form>
                <div id="category-list" class="max-h-64 overflow-y-auto border rounded-lg p-2"></div>
                <div class="flex justify-end space-x-4 mt-4">
                     <button type="button" id="close-category-modal" class="btn btn-ghost">Annuler</button>
                    <button type="button" id="done-category-modal-btn" class="btn btn-primary">Terminé</button>
                </div>
            </div>
        </div>
        `,
        script: './ingredients.js'
    },
    'lists': {
        html: `
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Mes Listes de Courses</h2>
            <button id="add-list-btn" class="btn btn-primary">
                <i class="fas fa-plus mr-2"></i> Créer une liste
            </button>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <input type="text" id="search-bar" placeholder="Rechercher une liste..." class="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-tomato focus:border-tomato">
        </div>

        <!-- Lists Container -->
        <div id="lists-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Les listes seront chargées ici par JS -->
        </div>

        <!-- List Form Modal -->
        <div id="list-form-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] hidden">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-2xl relative">
                <button id="close-list-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><i class="fas fa-times text-xl"></i></button>
                <h3 id="list-modal-title" class="text-lg font-bold mb-4">Créer une liste</h3>
                <form id="list-form" class="space-y-4">
                    <input type="hidden" id="list-id">
                    <div>
                        <label for="list-name" class="block text-sm font-medium text-gray-700">Nom de la liste</label>
                        <input type="text" id="list-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                    </div>
                    <div>
                        <h4 class="text-md font-medium text-gray-800 mb-2">Ingrédients</h4>
                        <div id="ingredients-list" class="space-y-2 max-h-64 overflow-y-auto p-2 border rounded-md"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline btn-sm mt-2">
                            <i class="fas fa-plus mr-2"></i> Ajouter un ingrédient
                        </button>
                    </div>
                    <div class="flex justify-end space-x-4 pt-2">
                        <button type="button" id="cancel-list-btn" class="btn btn-ghost">Annuler</button>
                        <button type="submit" id="save-list-btn" class="btn btn-primary">Sauvegarder la liste</button>
                    </div>
                </form>
            </div>
        </div>
        `,
        script: './lists.js'
    }
};

async function navigateTo(path) {
    const route = routes[path];
    if (route && mainContent) {
        mainContent.innerHTML = route.html;
        if (route.script) {
            // Dynamically import the script for the new view
            const module = await import(route.script);
            if (module.default && typeof module.default === 'function') {
                module.default();
            }
        }
    } else {
        console.error(`Route not found: ${path}`);
    }
}

export { navigateTo };
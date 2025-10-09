const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/lists-Cs57890n.js","assets/sharing-DxU2BjFu.js","assets/recipes-cVV6TKd4.js","assets/form-handler-xDDizNKw.js","assets/script-BaXBbL6j.js","assets/plans-B7vTKjwb.js"])))=>i.map(i=>d[i]);
(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();const Zd="modulepreload",ef=function(n){return"/gustoplan/"+n},uc={},Ne=function(e,t,r){let s=Promise.resolve();if(t&&t.length>0){let h=function(d){return Promise.all(d.map(m=>Promise.resolve(m).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),l=a?.nonce||a?.getAttribute("nonce");s=h(t.map(d=>{if(d=ef(d),d in uc)return;uc[d]=!0;const m=d.endsWith(".css"),g=m?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${g}`))return;const v=document.createElement("link");if(v.rel=m?"stylesheet":Zd,m||(v.as="script"),v.crossOrigin="",v.href=d,l&&v.setAttribute("nonce",l),document.head.appendChild(v),m)return new Promise((R,V)=>{v.addEventListener("load",R),v.addEventListener("error",()=>V(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(a){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=a,window.dispatchEvent(l),!l.defaultPrevented)throw a}return s.then(a=>{for(const l of a||[])l.status==="rejected"&&o(l.reason);return e().catch(o)})},hc=document.querySelector("main"),tf={menu:{html:`
        <div class="flex flex-col md:flex-row md:space-x-2">

            <!-- Left Column: Meal Planner -->
            <div class="w-full md:w-5/6">
                <section id="meal-planning-section" aria-labelledby="meal-planning-heading" class="mb-8 md:mb-12">
                                    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                        <h2 id="meal-planning-heading" class="text-xl md:text-2xl font-bold text-gray-800">Planification des repas</h2>
                                        <div class="mt-3 md:mt-0 flex items-center space-x-2 md:space-x-3">
                                            <button id="generate-plan-ai-btn" class="btn btn-primary btn-sm">
                                                <i class="fas fa-robot mr-1 md:mr-2"></i> IA Semaine
                                            </button>
                                            <button id="clear-menu-btn" class="btn btn-outline btn-sm text-red-800 hover:bg-red-100">
                                                <i class="fas fa-trash-alt mr-1 md:mr-2"></i> Vider le menu
                                            </button>
                                            <button id="share-plan-btn" class="btn btn-secondary btn-sm">
                                                <i class="fas fa-share-alt mr-1 md:mr-2"></i> Partager
                                            </button>
                                        </div>
                                    </div>
                            
                                    <!-- Week Navigation & Plan Selector -->
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
                                        <!-- Plan Selector -->
                                        <div class="flex items-center space-x-2 bg-white p-3 rounded-lg shadow-sm">
                                            <label for="plan-select" class="text-sm font-medium text-gray-700">Plan affiché:</label>
                                            <select id="plan-select" class="rounded-md border-gray-300 shadow-sm focus:border-tomato focus:ring focus:ring-tomato focus:ring-opacity-50 text-sm py-1">
                                                <!-- Options will be generated by JS -->
                                            </select>
                                            <button id="create-plan-btn" class="btn btn-primary btn-sm" title="Créer un nouveau plan">
                                                <i class="fas fa-plus"></i>
                                            </button>
                                            <button id="rename-plan-btn" class="btn btn-ghost text-blue-500 hover:bg-blue-100 btn-sm" title="Renommer le plan sélectionné">
                                                <i class="fas fa-pencil-alt"></i>
                                            </button>
                                            <button id="leave-plan-btn" class="btn btn-ghost text-yellow-600 hover:bg-yellow-100 btn-sm" title="Quitter le plan collaboratif">
                                                <i class="fas fa-door-open"></i>
                                            </button>
                                            <button id="delete-plan-btn" class="btn btn-ghost text-red-500 hover:bg-red-100 btn-sm" title="Supprimer le plan sélectionné">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Collaborators Bar -->
                                    <div id="collaborators-bar" class="flex items-center space-x-2 mb-4 hidden">
                                        <!-- Avatars will be injected here -->
                                    </div>
                            
                                            <!-- Settings Section -->
                                            <div class="inline-flex items-center space-x-6 bg-white p-3 rounded-lg shadow-sm mb-4">                                        <div>
                                            <label for="start-day-select" class="text-sm font-medium text-gray-700">Début de semaine:</label>
                                            <select id="start-day-select" class="rounded-md border-gray-300 shadow-sm focus:border-tomato focus:ring-tomato text-sm py-1">
                                                <option>Lundi</option>
                                                <option>Mardi</option>
                                                <option>Mercredi</option>
                                                <option>Jeudi</option>
                                                <option>Vendredi</option>
                                                <option>Samedi</option>
                                                <option>Dimanche</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label for="default-servings-input" class="text-sm font-medium text-gray-700">Personnes par défaut:</label>
                                            <div id="default-servings-control" class="mt-1"></div>
                                        </div>
                                    </div>                    <!-- Meal Plan Grid -->
                    <div class="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
                        <div id="meal-plan-grid-layout" class="min-w-[1400px]">
                            <!-- Header -->
                            <div class="grid grid-cols-[100px_35px_repeat(5,_minmax(0,_1fr))_35px_repeat(5,_minmax(0,_1fr))] gap-1 text-center mb-1">
                                <div class="p-2"></div> <!-- Empty corner -->
                                <div class="p-2 rounded-t-lg bg-amber-100 text-amber-800 font-bold col-span-6">MIDI</div>
                                <div class="p-2 rounded-t-lg bg-stone-200 text-stone-800 font-bold col-span-6">SOIR</div>
                                
                                <div class="p-1"></div> <!-- Empty under day name -->
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
                            <!-- Rows generated by JS -->
                            <div id="meal-plan-grid" class="space-y-1">
                                <div class="p-10 text-center text-gray-500 italic col-span-full">Chargement du planning...</div>
                            </div>                                            </div>
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
                    
                                            <!-- Shopping List Container -->
                                            <div id="shopping-list-container" class="mb-4 max-h-[70vh] overflow-y-auto pr-2">                            <ul id="shopping-list" class="space-y-2 text-sm">
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

        <!-- Shared Plans Modal -->
        <div id="shared-plans-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] hidden">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto relative">
                <button id="close-shared-plans-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600" aria-label="Fermer">
                    <i class="fas fa-times text-xl"></i>
                </button>
                <h3 id="shared-plans-modal-title" class="text-2xl font-bold mb-6">Plans partagés pour la Semaine X</h3>
                <div id="shared-plans-modal-container" class="space-y-6">
                    <!-- Shared plans will be loaded here -->
                </div>
            </div>
        </div>
        `,script:"./script.js"},recipes:{html:`
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
        `,script:"./recipes.js"},ingredients:{html:`
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
        `,script:"./ingredients.js"},lists:{html:`
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
        <div id="lists-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>

        <div class="mt-12">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Listes Partagées</h2>
            <div id="shared-lists-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Les listes partagées seront chargées ici par JS -->
            </div>
        </div>

        <!-- List Form Modal -->
        <div id="list-form-modal" class="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-[100] hidden pt-20">
            <div class="bg-white rounded-xl p-6 w-11/12 max-w-3xl min-h-[75vh] max-h-[90vh] overflow-y-auto relative">
                <button id="close-list-modal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"><i class="fas fa-times text-xl"></i></button>
                <h3 id="list-modal-title" class="text-lg font-bold mb-4">Créer une liste</h3>
                <form id="list-form" class="space-y-4 pb-20">
                    <input type="hidden" id="list-id">
                    <div>
                        <label for="list-name" class="block text-sm font-medium text-gray-700">Nom de la liste</label>
                        <input type="text" id="list-name" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required>
                    </div>
                    <div>
                        <h4 class="text-md font-medium text-gray-800 mb-2">Ingrédients</h4>
                        <div id="ingredients-list" class="space-y-2"></div>
                        <button type="button" id="add-ingredient-btn" class="btn btn-outline btn-sm mt-2">
                            <i class="fas fa-plus mr-2"></i> Ajouter un ingrédient
                        </button>
                    </div>
                </form>
                <div class="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex justify-end space-x-4">
                    <button type="button" id="cancel-list-btn" class="btn btn-ghost">Annuler</button>
                    <button type="submit" form="list-form" id="save-list-btn" class="btn btn-primary">Sauvegarder la liste</button>
                </div>
            </div>
        </div>
        `,script:"./lists.js"},friends:{html:`
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Mes Amis</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2">
                <h3 class="text-xl font-bold text-gray-800 mb-4">Liste d'amis</h3>
                <div id="friends-list-container" class="space-y-4">
                    <!-- La liste d'amis sera chargée ici -->
                </div>
            </div>
            <div>
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">Rechercher un ami</h3>
                    <div class="mb-4">
                        <div class="flex items-center space-x-2">
                            <input type="text" id="search-friends-input" placeholder="Nom ou email..." class="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-tomato focus:border-tomato">
                            <button id="search-friends-btn" class="btn btn-primary"><i class="fas fa-search"></i></button>
                        </div>
                        <div id="search-results-container" class="mt-2 space-y-2"></div>
                    </div>
                </div>
            </div>
        </div>
        `,script:"./friends.js"},shared:{html:`
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800">Mes Partages</h2>
        </div>

        <div class="space-y-12">
            <div>
                <h3 class="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Partages Reçus</h3>
                <div id="received-shares-container" class="space-y-4">
                    <!-- L'historique des partages acceptés sera chargé ici -->
                </div>
            </div>
            <div>
                <h3 class="text-xl font-bold text-gray-700 border-b pb-2 mb-4">Mes Partages Envoyés</h3>
                <div id="sent-shares-container" class="space-y-4">
                    <!-- L'historique des partages envoyés sera chargé ici -->
                </div>
            </div>
        </div>
        `,script:"./shared.js"}},nf=Object.assign({"./auth.js":()=>Ne(()=>Promise.resolve().then(()=>rE),void 0),"./firebase-config.js":()=>Ne(()=>Promise.resolve().then(()=>nE),void 0),"./form-handler.js":()=>Ne(()=>import("./form-handler-xDDizNKw.js"),[]),"./friends.js":()=>Ne(()=>Promise.resolve().then(()=>iE),void 0),"./ingredients.js":()=>Ne(()=>import("./ingredients-CtBJc02q.js"),[]),"./lists.js":()=>Ne(()=>import("./lists-Cs57890n.js"),__vite__mapDeps([0,1])),"./main.js":()=>Ne(()=>Promise.resolve().then(()=>pE),void 0),"./notifications.js":()=>Ne(()=>Promise.resolve().then(()=>fE),void 0),"./plans.js":()=>Ne(()=>import("./plans-B7vTKjwb.js"),[]),"./recipes.js":()=>Ne(()=>import("./recipes-cVV6TKd4.js"),__vite__mapDeps([2,3])),"./script.js":()=>Ne(()=>import("./script-BaXBbL6j.js"),__vite__mapDeps([4,3,1,5])),"./shared.js":()=>Ne(()=>import("./shared-BKmRYnwh.js"),[]),"./sharing.js":()=>Ne(()=>import("./sharing-DxU2BjFu.js"),[])});let Hr=null;async function dc(n){typeof Hr=="function"&&(Hr(),Hr=null);const e=tf[n];if(e&&hc){if(hc.innerHTML=e.html,e.script){const t=nf[e.script];if(t){const r=await t();r.default&&typeof r.default=="function"&&(Hr=r.default())}else console.error(`Module not found for path: ${e.script}`)}}else console.error(`Route not found: ${n}`)}const rf=()=>{};var fc={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $l=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},sf=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[t++];e[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[t++],a=n[t++],l=n[t++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(h>>10)),e[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[t++],a=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return e.join("")},zl={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,l=a?n[s+1]:0,h=s+2<n.length,d=h?n[s+2]:0,m=o>>2,g=(o&3)<<4|l>>4;let v=(l&15)<<2|d>>6,R=d&63;h||(R=64,a||(v=64)),r.push(t[m],t[g],t[v],t[R])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray($l(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):sf(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=t[n.charAt(s++)],l=s<n.length?t[n.charAt(s)]:0;++s;const d=s<n.length?t[n.charAt(s)]:64;++s;const g=s<n.length?t[n.charAt(s)]:64;if(++s,o==null||l==null||d==null||g==null)throw new of;const v=o<<2|l>>4;if(r.push(v),d!==64){const R=l<<4&240|d>>2;if(r.push(R),g!==64){const V=d<<6&192|g;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class of extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const af=function(n){const e=$l(n);return zl.encodeByteArray(e,!0)},ls=function(n){return af(n).replace(/\./g,"")},Hl=function(n){try{return zl.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cf(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lf=()=>cf().__FIREBASE_DEFAULTS__,uf=()=>{if(typeof process>"u"||typeof fc>"u")return;const n=fc.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},hf=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&Hl(n[1]);return e&&JSON.parse(e)},xs=()=>{try{return rf()||lf()||uf()||hf()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},Gl=n=>xs()?.emulatorHosts?.[n],df=n=>{const e=Gl(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},Wl=()=>xs()?.config,Kl=n=>xs()?.[`_${n}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ff{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sn(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function Ql(n){return(await fetch(n,{credentials:"include"})).ok}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mf(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[ls(JSON.stringify(t)),ls(JSON.stringify(a)),""].join(".")}const nr={};function pf(){const n={prod:[],emulator:[]};for(const e of Object.keys(nr))nr[e]?n.emulator.push(e):n.prod.push(e);return n}function gf(n){let e=document.getElementById(n),t=!1;return e||(e=document.createElement("div"),e.setAttribute("id",n),t=!0),{created:t,element:e}}let mc=!1;function Xl(n,e){if(typeof window>"u"||typeof document>"u"||!Sn(window.location.host)||nr[n]===e||nr[n]||mc)return;nr[n]=e;function t(v){return`__firebase__banner__${v}`}const r="__firebase__banner",o=pf().prod.length>0;function a(){const v=document.getElementById(r);v&&v.remove()}function l(v){v.style.display="flex",v.style.background="#7faaf0",v.style.position="fixed",v.style.bottom="5px",v.style.left="5px",v.style.padding=".5em",v.style.borderRadius="5px",v.style.alignItems="center"}function h(v,R){v.setAttribute("width","24"),v.setAttribute("id",R),v.setAttribute("height","24"),v.setAttribute("viewBox","0 0 24 24"),v.setAttribute("fill","none"),v.style.marginLeft="-6px"}function d(){const v=document.createElement("span");return v.style.cursor="pointer",v.style.marginLeft="16px",v.style.fontSize="24px",v.innerHTML=" &times;",v.onclick=()=>{mc=!0,a()},v}function m(v,R){v.setAttribute("id",R),v.innerText="Learn more",v.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",v.setAttribute("target","__blank"),v.style.paddingLeft="5px",v.style.textDecoration="underline"}function g(){const v=gf(r),R=t("text"),V=document.getElementById(R)||document.createElement("span"),D=t("learnmore"),C=document.getElementById(D)||document.createElement("a"),B=t("preprendIcon"),q=document.getElementById(B)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(v.created){const K=v.element;l(K),m(C,D);const be=d();h(q,B),K.append(q,V,C,be),document.body.appendChild(K)}o?(V.innerText="Preview backend disconnected.",q.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(q.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,V.innerText="Preview backend running in this workspace."),V.setAttribute("id",R)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",g):g()}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function we(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function _f(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(we())}function yf(){const n=xs()?.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function vf(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Ef(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function Tf(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function If(){const n=we();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function wf(){return!yf()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function bf(){try{return typeof indexedDB=="object"}catch{return!1}}function Af(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{e(s.error?.message||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rf="FirebaseError";class ot extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Rf,Object.setPrototypeOf(this,ot.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,pr.prototype.create)}}class pr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,o=this.errors[e],a=o?Sf(o,r):"Error",l=`${this.serviceName}: ${a} (${s}).`;return new ot(s,l,r)}}function Sf(n,e){return n.replace(Pf,(t,r)=>{const s=e[r];return s!=null?String(s):`<${r}?>`})}const Pf=/\{\$([^}]+)}/g;function Cf(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function et(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const o=n[s],a=e[s];if(pc(o)&&pc(a)){if(!et(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function pc(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gr(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Vf(n,e){const t=new kf(n,e);return t.subscribe.bind(t)}class kf{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");Nf(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=Ri),s.error===void 0&&(s.error=Ri),s.complete===void 0&&(s.complete=Ri);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Nf(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function Ri(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(n){return n&&n._delegate?n._delegate:n}class Gt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bt="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Df{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new ff;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Of(e))try{this.getOrInitializeService({instanceIdentifier:Bt})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(e=Bt){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=Bt){return this.instances.has(e)}getOptions(e=Bt){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[o,a]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);r===l&&a.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&e(o,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:xf(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=Bt){return this.component?this.component.multipleInstances?e:Bt:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function xf(n){return n===Bt?void 0:n}function Of(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mf{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Df(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})($||($={}));const Lf={debug:$.DEBUG,verbose:$.VERBOSE,info:$.INFO,warn:$.WARN,error:$.ERROR,silent:$.SILENT},Ff=$.INFO,Uf={[$.DEBUG]:"log",[$.VERBOSE]:"log",[$.INFO]:"info",[$.WARN]:"warn",[$.ERROR]:"error"},Bf=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Uf[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class uo{constructor(e){this.name=e,this._logLevel=Ff,this._logHandler=Bf,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in $))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Lf[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,$.DEBUG,...e),this._logHandler(this,$.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,$.VERBOSE,...e),this._logHandler(this,$.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,$.INFO,...e),this._logHandler(this,$.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,$.WARN,...e),this._logHandler(this,$.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,$.ERROR,...e),this._logHandler(this,$.ERROR,...e)}}const jf=(n,e)=>e.some(t=>n instanceof t);let gc,_c;function qf(){return gc||(gc=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function $f(){return _c||(_c=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Jl=new WeakMap,Li=new WeakMap,Yl=new WeakMap,Si=new WeakMap,ho=new WeakMap;function zf(n){const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{t(Et(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return e.then(t=>{t instanceof IDBCursor&&Jl.set(t,n)}).catch(()=>{}),ho.set(e,n),e}function Hf(n){if(Li.has(n))return;const e=new Promise((t,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{t(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Li.set(n,e)}let Fi={get(n,e,t){if(n instanceof IDBTransaction){if(e==="done")return Li.get(n);if(e==="objectStoreNames")return n.objectStoreNames||Yl.get(n);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Et(n[e])},set(n,e,t){return n[e]=t,!0},has(n,e){return n instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in n}};function Gf(n){Fi=n(Fi)}function Wf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const r=n.call(Pi(this),e,...t);return Yl.set(r,e.sort?e.sort():[e]),Et(r)}:$f().includes(n)?function(...e){return n.apply(Pi(this),e),Et(Jl.get(this))}:function(...e){return Et(n.apply(Pi(this),e))}}function Kf(n){return typeof n=="function"?Wf(n):(n instanceof IDBTransaction&&Hf(n),jf(n,qf())?new Proxy(n,Fi):n)}function Et(n){if(n instanceof IDBRequest)return zf(n);if(Si.has(n))return Si.get(n);const e=Kf(n);return e!==n&&(Si.set(n,e),ho.set(e,n)),e}const Pi=n=>ho.get(n);function Qf(n,e,{blocked:t,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,e),l=Et(a);return r&&a.addEventListener("upgradeneeded",h=>{r(Et(a.result),h.oldVersion,h.newVersion,Et(a.transaction),h)}),t&&a.addEventListener("blocked",h=>t(h.oldVersion,h.newVersion,h)),l.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",d=>s(d.oldVersion,d.newVersion,d))}).catch(()=>{}),l}const Xf=["get","getKey","getAll","getAllKeys","count"],Jf=["put","add","delete","clear"],Ci=new Map;function yc(n,e){if(!(n instanceof IDBDatabase&&!(e in n)&&typeof e=="string"))return;if(Ci.get(e))return Ci.get(e);const t=e.replace(/FromIndex$/,""),r=e!==t,s=Jf.includes(t);if(!(t in(r?IDBIndex:IDBObjectStore).prototype)||!(s||Xf.includes(t)))return;const o=async function(a,...l){const h=this.transaction(a,s?"readwrite":"readonly");let d=h.store;return r&&(d=d.index(l.shift())),(await Promise.all([d[t](...l),s&&h.done]))[0]};return Ci.set(e,o),o}Gf(n=>({...n,get:(e,t,r)=>yc(e,t)||n.get(e,t,r),has:(e,t)=>!!yc(e,t)||n.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yf{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(Zf(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function Zf(n){return n.getComponent()?.type==="VERSION"}const Ui="@firebase/app",vc="0.14.3";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tt=new uo("@firebase/app"),em="@firebase/app-compat",tm="@firebase/analytics-compat",nm="@firebase/analytics",rm="@firebase/app-check-compat",sm="@firebase/app-check",im="@firebase/auth",om="@firebase/auth-compat",am="@firebase/database",cm="@firebase/data-connect",lm="@firebase/database-compat",um="@firebase/functions",hm="@firebase/functions-compat",dm="@firebase/installations",fm="@firebase/installations-compat",mm="@firebase/messaging",pm="@firebase/messaging-compat",gm="@firebase/performance",_m="@firebase/performance-compat",ym="@firebase/remote-config",vm="@firebase/remote-config-compat",Em="@firebase/storage",Tm="@firebase/storage-compat",Im="@firebase/firestore",wm="@firebase/ai",bm="@firebase/firestore-compat",Am="firebase",Rm="12.3.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bi="[DEFAULT]",Sm={[Ui]:"fire-core",[em]:"fire-core-compat",[nm]:"fire-analytics",[tm]:"fire-analytics-compat",[sm]:"fire-app-check",[rm]:"fire-app-check-compat",[im]:"fire-auth",[om]:"fire-auth-compat",[am]:"fire-rtdb",[cm]:"fire-data-connect",[lm]:"fire-rtdb-compat",[um]:"fire-fn",[hm]:"fire-fn-compat",[dm]:"fire-iid",[fm]:"fire-iid-compat",[mm]:"fire-fcm",[pm]:"fire-fcm-compat",[gm]:"fire-perf",[_m]:"fire-perf-compat",[ym]:"fire-rc",[vm]:"fire-rc-compat",[Em]:"fire-gcs",[Tm]:"fire-gcs-compat",[Im]:"fire-fst",[bm]:"fire-fst-compat",[wm]:"fire-vertex","fire-js":"fire-js",[Am]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const us=new Map,Pm=new Map,ji=new Map;function Ec(n,e){try{n.container.addComponent(e)}catch(t){tt.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function gn(n){const e=n.name;if(ji.has(e))return tt.debug(`There were multiple attempts to register component ${e}.`),!1;ji.set(e,n);for(const t of us.values())Ec(t,n);for(const t of Pm.values())Ec(t,n);return!0}function fo(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function ze(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cm={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Tt=new pr("app","Firebase",Cm);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vm{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Gt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Tt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pn=Rm;function Zl(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:Bi,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Tt.create("bad-app-name",{appName:String(s)});if(t||(t=Wl()),!t)throw Tt.create("no-options");const o=us.get(s);if(o){if(et(t,o.options)&&et(r,o.config))return o;throw Tt.create("duplicate-app",{appName:s})}const a=new Mf(s);for(const h of ji.values())a.addComponent(h);const l=new Vm(t,r,a);return us.set(s,l),l}function eu(n=Bi){const e=us.get(n);if(!e&&n===Bi&&Wl())return Zl();if(!e)throw Tt.create("no-app",{appName:n});return e}function It(n,e,t){let r=Sm[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${e}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${e}" contains illegal characters (whitespace or "/")`),tt.warn(a.join(" "));return}gn(new Gt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const km="firebase-heartbeat-database",Nm=1,lr="firebase-heartbeat-store";let Vi=null;function tu(){return Vi||(Vi=Qf(km,Nm,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(lr)}catch(t){console.warn(t)}}}}).catch(n=>{throw Tt.create("idb-open",{originalErrorMessage:n.message})})),Vi}async function Dm(n){try{const t=(await tu()).transaction(lr),r=await t.objectStore(lr).get(nu(n));return await t.done,r}catch(e){if(e instanceof ot)tt.warn(e.message);else{const t=Tt.create("idb-get",{originalErrorMessage:e?.message});tt.warn(t.message)}}}async function Tc(n,e){try{const r=(await tu()).transaction(lr,"readwrite");await r.objectStore(lr).put(e,nu(n)),await r.done}catch(t){if(t instanceof ot)tt.warn(t.message);else{const r=Tt.create("idb-set",{originalErrorMessage:t?.message});tt.warn(r.message)}}}function nu(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xm=1024,Om=30;class Mm{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Fm(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{const t=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ic();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(s=>s.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>Om){const s=Um(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){tt.warn(e)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=Ic(),{heartbeatsToSend:t,unsentEntries:r}=Lm(this._heartbeatsCache.heartbeats),s=ls(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return tt.warn(e),""}}}function Ic(){return new Date().toISOString().substring(0,10)}function Lm(n,e=xm){const t=[];let r=n.slice();for(const s of n){const o=t.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),wc(t)>e){o.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),wc(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class Fm{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return bf()?Af().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Dm(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Tc(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return Tc(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function wc(n){return ls(JSON.stringify({version:2,heartbeats:n})).length}function Um(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bm(n){gn(new Gt("platform-logger",e=>new Yf(e),"PRIVATE")),gn(new Gt("heartbeat",e=>new Mm(e),"PRIVATE")),It(Ui,vc,n),It(Ui,vc,"esm2020"),It("fire-js","")}Bm("");function ru(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const jm=ru,su=new pr("auth","Firebase",ru());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hs=new uo("@firebase/auth");function qm(n,...e){hs.logLevel<=$.WARN&&hs.warn(`Auth (${Pn}): ${n}`,...e)}function Zr(n,...e){hs.logLevel<=$.ERROR&&hs.error(`Auth (${Pn}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(n,...e){throw mo(n,...e)}function He(n,...e){return mo(n,...e)}function iu(n,e,t){const r={...jm(),[e]:t};return new pr("auth","Firebase",r).create(e,{appName:n.name})}function qt(n){return iu(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function mo(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return su.create(n,...e)}function F(n,e,...t){if(!n)throw mo(e,...t)}function Ye(n){const e="INTERNAL ASSERTION FAILED: "+n;throw Zr(e),new Error(e)}function rt(n,e){n||Ye(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qi(){return typeof self<"u"&&self.location?.href||""}function $m(){return bc()==="http:"||bc()==="https:"}function bc(){return typeof self<"u"&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zm(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&($m()||Ef()||"connection"in navigator)?navigator.onLine:!0}function Hm(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _r{constructor(e,t){this.shortDelay=e,this.longDelay=t,rt(t>e,"Short delay should be less than long delay!"),this.isMobile=_f()||Tf()}get(){return zm()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function po(n,e){rt(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Ye("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Ye("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Ye("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gm={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wm=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Km=new _r(3e4,6e4);function go(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function Cn(n,e,t,r,s={}){return au(n,s,async()=>{let o={},a={};r&&(e==="GET"?a=r:o={body:JSON.stringify(r)});const l=gr({key:n.config.apiKey,...a}).slice(1),h=await n._getAdditionalHeaders();h["Content-Type"]="application/json",n.languageCode&&(h["X-Firebase-Locale"]=n.languageCode);const d={method:e,headers:h,...o};return vf()||(d.referrerPolicy="no-referrer"),n.emulatorConfig&&Sn(n.emulatorConfig.host)&&(d.credentials="include"),ou.fetch()(await cu(n,n.config.apiHost,t,l),d)})}async function au(n,e,t){n._canInitEmulator=!1;const r={...Gm,...e};try{const s=new Xm(n),o=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const a=await o.json();if("needConfirmation"in a)throw Gr(n,"account-exists-with-different-credential",a);if(o.ok&&!("errorMessage"in a))return a;{const l=o.ok?a.errorMessage:a.error.message,[h,d]=l.split(" : ");if(h==="FEDERATED_USER_ID_ALREADY_LINKED")throw Gr(n,"credential-already-in-use",a);if(h==="EMAIL_EXISTS")throw Gr(n,"email-already-in-use",a);if(h==="USER_DISABLED")throw Gr(n,"user-disabled",a);const m=r[h]||h.toLowerCase().replace(/[_\s]+/g,"-");if(d)throw iu(n,m,d);nt(n,m)}}catch(s){if(s instanceof ot)throw s;nt(n,"network-request-failed",{message:String(s)})}}async function Qm(n,e,t,r,s={}){const o=await Cn(n,e,t,r,s);return"mfaPendingCredential"in o&&nt(n,"multi-factor-auth-required",{_serverResponse:o}),o}async function cu(n,e,t,r){const s=`${e}${t}?${r}`,o=n,a=o.config.emulator?po(n.config,s):`${n.config.apiScheme}://${s}`;return Wm.includes(t)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(a).toString():a}class Xm{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(He(this.auth,"network-request-failed")),Km.get())})}}function Gr(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=He(n,e,r);return s.customData._tokenResponse=t,s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jm(n,e){return Cn(n,"POST","/v1/accounts:delete",e)}async function ds(n,e){return Cn(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rr(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function Ym(n,e=!1){const t=re(n),r=await t.getIdToken(e),s=_o(r);F(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,a=o?.sign_in_provider;return{claims:s,token:r,authTime:rr(ki(s.auth_time)),issuedAtTime:rr(ki(s.iat)),expirationTime:rr(ki(s.exp)),signInProvider:a||null,signInSecondFactor:o?.sign_in_second_factor||null}}function ki(n){return Number(n)*1e3}function _o(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return Zr("JWT malformed, contained fewer than 3 sections"),null;try{const s=Hl(t);return s?JSON.parse(s):(Zr("Failed to decode base64 JWT payload"),null)}catch(s){return Zr("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Ac(n){const e=_o(n);return F(e,"internal-error"),F(typeof e.exp<"u","internal-error"),F(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ur(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof ot&&Zm(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function Zm({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ep{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=rr(this.lastLoginAt),this.creationTime=rr(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fs(n){const e=n.auth,t=await n.getIdToken(),r=await ur(n,ds(e,{idToken:t}));F(r?.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const o=s.providerUserInfo?.length?lu(s.providerUserInfo):[],a=np(n.providerData,o),l=n.isAnonymous,h=!(n.email&&s.passwordHash)&&!a?.length,d=l?h:!1,m={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:a,metadata:new $i(s.createdAt,s.lastLoginAt),isAnonymous:d};Object.assign(n,m)}async function tp(n){const e=re(n);await fs(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function np(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function lu(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rp(n,e){const t=await au(n,{},async()=>{const r=gr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:o}=n.config,a=await cu(n,s,"/v1/token",`key=${o}`),l=await n._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const h={method:"POST",headers:l,body:r};return n.emulatorConfig&&Sn(n.emulatorConfig.host)&&(h.credentials="include"),ou.fetch()(a,h)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function sp(n,e){return Cn(n,"POST","/v2/accounts:revokeToken",go(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){F(e.idToken,"internal-error"),F(typeof e.idToken<"u","internal-error"),F(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Ac(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){F(e.length!==0,"internal-error");const t=Ac(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(F(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:o}=await rp(e,t);this.updateTokensAndExpiration(r,s,Number(o))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:o}=t,a=new dn;return r&&(F(typeof r=="string","internal-error",{appName:e}),a.refreshToken=r),s&&(F(typeof s=="string","internal-error",{appName:e}),a.accessToken=s),o&&(F(typeof o=="number","internal-error",{appName:e}),a.expirationTime=o),a}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new dn,this.toJSON())}_performRefresh(){return Ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ft(n,e){F(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Fe{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new ep(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new $i(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await ur(this,this.stsTokenManager.getToken(this.auth,e));return F(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Ym(this,e)}reload(){return tp(this)}_assign(e){this!==e&&(F(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Fe({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){F(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await fs(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ze(this.auth.app))return Promise.reject(qt(this.auth));const e=await this.getIdToken();return await ur(this,Jm(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,o=t.phoneNumber??void 0,a=t.photoURL??void 0,l=t.tenantId??void 0,h=t._redirectEventId??void 0,d=t.createdAt??void 0,m=t.lastLoginAt??void 0,{uid:g,emailVerified:v,isAnonymous:R,providerData:V,stsTokenManager:D}=t;F(g&&D,e,"internal-error");const C=dn.fromJSON(this.name,D);F(typeof g=="string",e,"internal-error"),ft(r,e.name),ft(s,e.name),F(typeof v=="boolean",e,"internal-error"),F(typeof R=="boolean",e,"internal-error"),ft(o,e.name),ft(a,e.name),ft(l,e.name),ft(h,e.name),ft(d,e.name),ft(m,e.name);const B=new Fe({uid:g,auth:e,email:s,emailVerified:v,displayName:r,isAnonymous:R,photoURL:a,phoneNumber:o,tenantId:l,stsTokenManager:C,createdAt:d,lastLoginAt:m});return V&&Array.isArray(V)&&(B.providerData=V.map(q=>({...q}))),h&&(B._redirectEventId=h),B}static async _fromIdTokenResponse(e,t,r=!1){const s=new dn;s.updateFromServerResponse(t);const o=new Fe({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await fs(o),o}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];F(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?lu(s.providerUserInfo):[],a=!(s.email&&s.passwordHash)&&!o?.length,l=new dn;l.updateFromIdToken(r);const h=new Fe({uid:s.localId,auth:e,stsTokenManager:l,isAnonymous:a}),d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new $i(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!o?.length};return Object.assign(h,d),h}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rc=new Map;function Ze(n){rt(n instanceof Function,"Expected a class definition");let e=Rc.get(n);return e?(rt(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,Rc.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uu{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}uu.type="NONE";const Sc=uu;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function es(n,e,t){return`firebase:${n}:${e}:${t}`}class fn{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:o}=this.auth;this.fullUserKey=es(this.userKey,s.apiKey,o),this.fullPersistenceKey=es("persistence",s.apiKey,o),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await ds(this.auth,{idToken:e}).catch(()=>{});return t?Fe._fromGetAccountInfoResponse(this.auth,t,e):null}return Fe._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new fn(Ze(Sc),e,r);const s=(await Promise.all(t.map(async d=>{if(await d._isAvailable())return d}))).filter(d=>d);let o=s[0]||Ze(Sc);const a=es(r,e.config.apiKey,e.name);let l=null;for(const d of t)try{const m=await d._get(a);if(m){let g;if(typeof m=="string"){const v=await ds(e,{idToken:m}).catch(()=>{});if(!v)break;g=await Fe._fromGetAccountInfoResponse(e,v,m)}else g=Fe._fromJSON(e,m);d!==o&&(l=g),o=d;break}}catch{}const h=s.filter(d=>d._shouldAllowMigration);return!o._shouldAllowMigration||!h.length?new fn(o,e,r):(o=h[0],l&&await o._set(a,l.toJSON()),await Promise.all(t.map(async d=>{if(d!==o)try{await d._remove(a)}catch{}})),new fn(o,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(mu(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(hu(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(gu(e))return"Blackberry";if(_u(e))return"Webos";if(du(e))return"Safari";if((e.includes("chrome/")||fu(e))&&!e.includes("edge/"))return"Chrome";if(pu(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if(r?.length===2)return r[1]}return"Other"}function hu(n=we()){return/firefox\//i.test(n)}function du(n=we()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function fu(n=we()){return/crios\//i.test(n)}function mu(n=we()){return/iemobile/i.test(n)}function pu(n=we()){return/android/i.test(n)}function gu(n=we()){return/blackberry/i.test(n)}function _u(n=we()){return/webos/i.test(n)}function yo(n=we()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function ip(n=we()){return yo(n)&&!!window.navigator?.standalone}function op(){return If()&&document.documentMode===10}function yu(n=we()){return yo(n)||pu(n)||_u(n)||gu(n)||/windows phone/i.test(n)||mu(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vu(n,e=[]){let t;switch(n){case"Browser":t=Pc(we());break;case"Worker":t=`${Pc(we())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Pn}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ap{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=o=>new Promise((a,l)=>{try{const h=e(o);a(h)}catch(h){l(h)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cp(n,e={}){return Cn(n,"GET","/v2/passwordPolicy",go(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lp=6;class up{constructor(e){const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??lp,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,o){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=o))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hp{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Cc(this),this.idTokenSubscription=new Cc(this),this.beforeStateQueue=new ap(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=su,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Ze(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await fn.create(this,e),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await ds(this,{idToken:e}),r=await Fe._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(ze(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(a=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(a,a))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=this.redirectUser?._redirectEventId,a=r?._redirectEventId,l=await this.tryRedirectSignIn(e);(!o||o===a)&&l?.user&&(r=l.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return F(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await fs(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=Hm()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ze(this.app))return Promise.reject(qt(this));const t=e?re(e):null;return t&&F(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&F(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ze(this.app)?Promise.reject(qt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ze(this.app)?Promise.reject(qt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ze(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await cp(this),t=new up(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new pr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await sp(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Ze(e)||this._popupRedirectResolver;F(t,this,"argument-error"),this.redirectPersistenceManager=await fn.create(this,[Ze(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const o=typeof t=="function"?t:t.next.bind(t);let a=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(F(l,this,"internal-error"),l.then(()=>{a||o(this.currentUser)}),typeof t=="function"){const h=e.addObserver(t,r,s);return()=>{a=!0,h()}}else{const h=e.addObserver(t);return()=>{a=!0,h()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return F(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=vu(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(ze(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&qm(`Error while retrieving App Check token: ${e.error}`),e?.token}}function vo(n){return re(n)}class Cc{constructor(e){this.auth=e,this.observer=null,this.addObserver=Vf(t=>this.observer=t)}get next(){return F(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Eo={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function dp(n){Eo=n}function fp(n){return Eo.loadJS(n)}function mp(){return Eo.gapiScript}function pp(n){return`__${n}${Math.floor(Math.random()*1e6)}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gp(n,e){const t=fo(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),o=t.getOptions();if(et(o,e??{}))return s;nt(s,"already-initialized")}return t.initialize({options:e})}function _p(n,e){const t=e?.persistence||[],r=(Array.isArray(t)?t:[t]).map(Ze);e?.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e?.popupRedirectResolver)}function yp(n,e,t){const r=vo(n);F(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,o=Eu(e),{host:a,port:l}=vp(e),h=l===null?"":`:${l}`,d={url:`${o}//${a}${h}/`},m=Object.freeze({host:a,port:l,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){F(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),F(et(d,r.config.emulator)&&et(m,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=d,r.emulatorConfig=m,r.settings.appVerificationDisabledForTesting=!0,Sn(a)?(Ql(`${o}//${a}${h}`),Xl("Auth",!0)):Ep()}function Eu(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function vp(n){const e=Eu(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const o=s[1];return{host:o,port:Vc(r.substr(o.length+1))}}else{const[o,a]=r.split(":");return{host:o,port:Vc(a)}}}function Vc(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function Ep(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tu{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Ye("not implemented")}_getIdTokenResponse(e){return Ye("not implemented")}_linkToIdToken(e,t){return Ye("not implemented")}_getReauthenticationResolver(e){return Ye("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mn(n,e){return Qm(n,"POST","/v1/accounts:signInWithIdp",go(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tp="http://localhost";class Wt extends Tu{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new Wt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):nt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...o}=t;if(!r||!s)return null;const a=new Wt(r,s);return a.idToken=o.idToken||void 0,a.accessToken=o.accessToken||void 0,a.secret=o.secret,a.nonce=o.nonce,a.pendingToken=o.pendingToken||null,a}_getIdTokenResponse(e){const t=this.buildRequest();return mn(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,mn(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,mn(e,t)}buildRequest(){const e={requestUri:Tp,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=gr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iu{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr extends Iu{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt extends yr{constructor(){super("facebook.com")}static credential(e){return Wt._fromParams({providerId:mt.PROVIDER_ID,signInMethod:mt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return mt.credentialFromTaggedObject(e)}static credentialFromError(e){return mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return mt.credential(e.oauthAccessToken)}catch{return null}}}mt.FACEBOOK_SIGN_IN_METHOD="facebook.com";mt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt extends yr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return Wt._fromParams({providerId:pt.PROVIDER_ID,signInMethod:pt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return pt.credentialFromTaggedObject(e)}static credentialFromError(e){return pt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return pt.credential(t,r)}catch{return null}}}pt.GOOGLE_SIGN_IN_METHOD="google.com";pt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt extends yr{constructor(){super("github.com")}static credential(e){return Wt._fromParams({providerId:gt.PROVIDER_ID,signInMethod:gt.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return gt.credentialFromTaggedObject(e)}static credentialFromError(e){return gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return gt.credential(e.oauthAccessToken)}catch{return null}}}gt.GITHUB_SIGN_IN_METHOD="github.com";gt.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t extends yr{constructor(){super("twitter.com")}static credential(e,t){return Wt._fromParams({providerId:_t.PROVIDER_ID,signInMethod:_t.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return _t.credentialFromTaggedObject(e)}static credentialFromError(e){return _t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return _t.credential(t,r)}catch{return null}}}_t.TWITTER_SIGN_IN_METHOD="twitter.com";_t.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const o=await Fe._fromIdTokenResponse(e,r,s),a=kc(r);return new _n({user:o,providerId:a,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=kc(r);return new _n({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function kc(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ms extends ot{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,ms.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new ms(e,t,r,s)}}function wu(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?ms._fromErrorAndOperation(n,o,e,r):o})}async function Ip(n,e,t=!1){const r=await ur(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return _n._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wp(n,e,t=!1){const{auth:r}=n;if(ze(r.app))return Promise.reject(qt(r));const s="reauthenticate";try{const o=await ur(n,wu(r,s,e,n),t);F(o.idToken,r,"internal-error");const a=_o(o.idToken);F(a,r,"internal-error");const{sub:l}=a;return F(n.uid===l,r,"user-mismatch"),_n._forOperation(n,s,o)}catch(o){throw o?.code==="auth/user-not-found"&&nt(r,"user-mismatch"),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bp(n,e,t=!1){if(ze(n.app))return Promise.reject(qt(n));const r="signIn",s=await wu(n,r,e),o=await _n._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(o.user),o}function Ap(n,e,t,r){return re(n).onIdTokenChanged(e,t,r)}function Rp(n,e,t){return re(n).beforeAuthStateChanged(e,t)}function Sp(n,e,t,r){return re(n).onAuthStateChanged(e,t,r)}function Pp(n){return re(n).signOut()}const ps="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bu{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ps,"1"),this.storage.removeItem(ps),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cp=1e3,Vp=10;class Au extends bu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=yu(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((a,l,h)=>{this.notifyListeners(a,h)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const a=this.storage.getItem(r);!t&&this.localCache[r]===a||this.notifyListeners(r,a)},o=this.storage.getItem(r);op()&&o!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,Vp):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},Cp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}Au.type="LOCAL";const kp=Au;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ru extends bu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Ru.type="SESSION";const Su=Ru;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Np(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Os(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:o}=t.data,a=this.handlersMap[s];if(!a?.size)return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const l=Array.from(a).map(async d=>d(t.origin,o)),h=await Np(l);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:h})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Os.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function To(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dp{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,a;return new Promise((l,h)=>{const d=To("",20);s.port1.start();const m=setTimeout(()=>{h(new Error("unsupported_event"))},r);a={messageChannel:s,onMessage(g){const v=g;if(v.data.eventId===d)switch(v.data.status){case"ack":clearTimeout(m),o=setTimeout(()=>{h(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),l(v.data.response);break;default:clearTimeout(m),clearTimeout(o),h(new Error("invalid_response"));break}}},this.handlers.add(a),s.port1.addEventListener("message",a.onMessage),this.target.postMessage({eventType:e,eventId:d,data:t},[s.port2])}).finally(()=>{a&&this.removeMessageHandler(a)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ge(){return window}function xp(n){Ge().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pu(){return typeof Ge().WorkerGlobalScope<"u"&&typeof Ge().importScripts=="function"}async function Op(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Mp(){return navigator?.serviceWorker?.controller||null}function Lp(){return Pu()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cu="firebaseLocalStorageDb",Fp=1,gs="firebaseLocalStorage",Vu="fbase_key";class vr{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Ms(n,e){return n.transaction([gs],e?"readwrite":"readonly").objectStore(gs)}function Up(){const n=indexedDB.deleteDatabase(Cu);return new vr(n).toPromise()}function zi(){const n=indexedDB.open(Cu,Fp);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(gs,{keyPath:Vu})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(gs)?e(r):(r.close(),await Up(),e(await zi()))})})}async function Nc(n,e,t){const r=Ms(n,!0).put({[Vu]:e,value:t});return new vr(r).toPromise()}async function Bp(n,e){const t=Ms(n,!1).get(e),r=await new vr(t).toPromise();return r===void 0?null:r.value}function Dc(n,e){const t=Ms(n,!0).delete(e);return new vr(t).toPromise()}const jp=800,qp=3;class ku{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await zi(),this.db)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(t++>qp)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Pu()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Os._getInstance(Lp()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await Op(),!this.activeServiceWorker)return;this.sender=new Dp(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||Mp()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await zi();return await Nc(e,ps,"1"),await Dc(e,ps),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>Nc(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>Bp(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>Dc(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(s=>{const o=Ms(s,!1).getAll();return new vr(o).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:o}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),jp)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}ku.type="LOCAL";const $p=ku;new _r(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zp(n,e){return e?Ze(e):(F(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io extends Tu{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return mn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return mn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return mn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function Hp(n){return bp(n.auth,new Io(n),n.bypassAuthState)}function Gp(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),wp(t,new Io(n),n.bypassAuthState)}async function Wp(n){const{auth:e,user:t}=n;return F(t,e,"internal-error"),Ip(t,new Io(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nu{constructor(e,t,r,s,o=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:o,error:a,type:l}=e;if(a){this.reject(a);return}const h={auth:this.auth,requestUri:t,sessionId:r,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(h))}catch(d){this.reject(d)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return Hp;case"linkViaPopup":case"linkViaRedirect":return Wp;case"reauthViaPopup":case"reauthViaRedirect":return Gp;default:nt(this.auth,"internal-error")}}resolve(e){rt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){rt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kp=new _r(2e3,1e4);class ln extends Nu{constructor(e,t,r,s,o){super(e,t,s,o),this.provider=r,this.authWindow=null,this.pollId=null,ln.currentPopupAction&&ln.currentPopupAction.cancel(),ln.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return F(e,this.auth,"internal-error"),e}async onExecution(){rt(this.filter.length===1,"Popup operations only handle one event");const e=To();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(He(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(He(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ln.currentPopupAction=null}pollUserCancellation(){const e=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(He(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,Kp.get())};e()}}ln.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qp="pendingRedirect",ts=new Map;class Xp extends Nu{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=ts.get(this.auth._key());if(!e){try{const r=await Jp(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}ts.set(this.auth._key(),e)}return this.bypassAuthState||ts.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Jp(n,e){const t=eg(e),r=Zp(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function Yp(n,e){ts.set(n._key(),e)}function Zp(n){return Ze(n._redirectPersistence)}function eg(n){return es(Qp,n.config.apiKey,n.name)}async function tg(n,e,t=!1){if(ze(n.app))return Promise.reject(qt(n));const r=vo(n),s=zp(r,e),a=await new Xp(r,s,t).execute();return a&&!t&&(delete a.user._redirectEventId,await r._persistUserIfCurrent(a.user),await r._setRedirectUser(null,e)),a}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ng=600*1e3;class rg{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!sg(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!Du(e)){const r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(He(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=ng&&this.cachedEventUids.clear(),this.cachedEventUids.has(xc(e))}saveEventToCache(e){this.cachedEventUids.add(xc(e)),this.lastProcessedEventTime=Date.now()}}function xc(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Du({type:n,error:e}){return n==="unknown"&&e?.code==="auth/no-auth-event"}function sg(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Du(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ig(n,e={}){return Cn(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const og=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ag=/^https?/;async function cg(n){if(n.config.emulator)return;const{authorizedDomains:e}=await ig(n);for(const t of e)try{if(lg(t))return}catch{}nt(n,"unauthorized-domain")}function lg(n){const e=qi(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const a=new URL(n);return a.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&a.hostname===r}if(!ag.test(t))return!1;if(og.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ug=new _r(3e4,6e4);function Oc(){const n=Ge().___jsl;if(n?.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function hg(n){return new Promise((e,t)=>{function r(){Oc(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Oc(),t(He(n,"network-request-failed"))},timeout:ug.get()})}if(Ge().gapi?.iframes?.Iframe)e(gapi.iframes.getContext());else if(Ge().gapi?.load)r();else{const s=pp("iframefcb");return Ge()[s]=()=>{gapi.load?r():t(He(n,"network-request-failed"))},fp(`${mp()}?onload=${s}`).catch(o=>t(o))}}).catch(e=>{throw ns=null,e})}let ns=null;function dg(n){return ns=ns||hg(n),ns}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fg=new _r(5e3,15e3),mg="__/auth/iframe",pg="emulator/auth/iframe",gg={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},_g=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function yg(n){const e=n.config;F(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?po(e,pg):`https://${n.config.authDomain}/${mg}`,r={apiKey:e.apiKey,appName:n.name,v:Pn},s=_g.get(n.config.apiHost);s&&(r.eid=s);const o=n._getFrameworks();return o.length&&(r.fw=o.join(",")),`${t}?${gr(r).slice(1)}`}async function vg(n){const e=await dg(n),t=Ge().gapi;return F(t,n,"internal-error"),e.open({where:document.body,url:yg(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:gg,dontclear:!0},r=>new Promise(async(s,o)=>{await r.restyle({setHideOnLeave:!1});const a=He(n,"network-request-failed"),l=Ge().setTimeout(()=>{o(a)},fg.get());function h(){Ge().clearTimeout(l),s(r)}r.ping(h).then(h,()=>{o(a)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Eg={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Tg=500,Ig=600,wg="_blank",bg="http://localhost";class Mc{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Ag(n,e,t,r=Tg,s=Ig){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),a=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const h={...Eg,width:r.toString(),height:s.toString(),top:o,left:a},d=we().toLowerCase();t&&(l=fu(d)?wg:t),hu(d)&&(e=e||bg,h.scrollbars="yes");const m=Object.entries(h).reduce((v,[R,V])=>`${v}${R}=${V},`,"");if(ip(d)&&l!=="_self")return Rg(e||"",l),new Mc(null);const g=window.open(e||"",l,m);F(g,n,"popup-blocked");try{g.focus()}catch{}return new Mc(g)}function Rg(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sg="__/auth/handler",Pg="emulator/auth/handler",Cg=encodeURIComponent("fac");async function Lc(n,e,t,r,s,o){F(n.config.authDomain,n,"auth-domain-config-required"),F(n.config.apiKey,n,"invalid-api-key");const a={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Pn,eventId:s};if(e instanceof Iu){e.setDefaultLanguage(n.languageCode),a.providerId=e.providerId||"",Cf(e.getCustomParameters())||(a.customParameters=JSON.stringify(e.getCustomParameters()));for(const[m,g]of Object.entries({}))a[m]=g}if(e instanceof yr){const m=e.getScopes().filter(g=>g!=="");m.length>0&&(a.scopes=m.join(","))}n.tenantId&&(a.tid=n.tenantId);const l=a;for(const m of Object.keys(l))l[m]===void 0&&delete l[m];const h=await n._getAppCheckToken(),d=h?`#${Cg}=${encodeURIComponent(h)}`:"";return`${Vg(n)}?${gr(l).slice(1)}${d}`}function Vg({config:n}){return n.emulator?po(n,Pg):`https://${n.authDomain}/${Sg}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ni="webStorageSupport";class kg{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Su,this._completeRedirectFn=tg,this._overrideRedirectResult=Yp}async _openPopup(e,t,r,s){rt(this.eventManagers[e._key()]?.manager,"_initialize() not called before _openPopup()");const o=await Lc(e,t,r,qi(),s);return Ag(e,o,To())}async _openRedirect(e,t,r,s){await this._originValidation(e);const o=await Lc(e,t,r,qi(),s);return xp(o),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:o}=this.eventManagers[t];return s?Promise.resolve(s):(rt(o,"If manager is not set, promise should be"),o)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await vg(e),r=new rg(e);return t.register("authEvent",s=>(F(s?.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Ni,{type:Ni},s=>{const o=s?.[0]?.[Ni];o!==void 0&&t(!!o),nt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=cg(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return yu()||du()||yo()}}const Ng=kg;var Fc="@firebase/auth",Uc="1.11.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dg{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e(r?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){F(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xg(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Og(n){gn(new Gt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),o=e.getProvider("app-check-internal"),{apiKey:a,authDomain:l}=r.options;F(a&&!a.includes(":"),"invalid-api-key",{appName:r.name});const h={apiKey:a,authDomain:l,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:vu(n)},d=new hp(r,s,o,h);return _p(d,t),d},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),gn(new Gt("auth-internal",e=>{const t=vo(e.getProvider("auth").getImmediate());return(r=>new Dg(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),It(Fc,Uc,xg(n)),It(Fc,Uc,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mg=300,Lg=Kl("authIdTokenMaxAge")||Mg;let Bc=null;const Fg=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>Lg)return;const s=t?.token;Bc!==s&&(Bc=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Ug(n=eu()){const e=fo(n,"auth");if(e.isInitialized())return e.getImmediate();const t=gp(n,{popupRedirectResolver:Ng,persistence:[$p,kp,Su]}),r=Kl("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(r,location.origin);if(location.origin===o.origin){const a=Fg(o.toString());Rp(t,a,()=>a(t.currentUser)),Ap(t,l=>a(l))}}const s=Gl("auth");return s&&yp(t,`http://${s}`),t}function Bg(){return document.getElementsByTagName("head")?.[0]??document}dp({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const o=He("internal-error");o.customData=s,t(o)},r.type="text/javascript",r.charset="UTF-8",Bg().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Og("Browser");var jg="firebase",qg="12.3.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */It(jg,qg,"app");var jc=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var wt,xu;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(T,p){function y(){}y.prototype=p.prototype,T.F=p.prototype,T.prototype=new y,T.prototype.constructor=T,T.D=function(I,E,b){for(var _=Array(arguments.length-2),Ce=2;Ce<arguments.length;Ce++)_[Ce-2]=arguments[Ce];return p.prototype[E].apply(I,_)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,p,y){y||(y=0);const I=Array(16);if(typeof p=="string")for(var E=0;E<16;++E)I[E]=p.charCodeAt(y++)|p.charCodeAt(y++)<<8|p.charCodeAt(y++)<<16|p.charCodeAt(y++)<<24;else for(E=0;E<16;++E)I[E]=p[y++]|p[y++]<<8|p[y++]<<16|p[y++]<<24;p=T.g[0],y=T.g[1],E=T.g[2];let b=T.g[3],_;_=p+(b^y&(E^b))+I[0]+3614090360&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(E^p&(y^E))+I[1]+3905402710&4294967295,b=p+(_<<12&4294967295|_>>>20),_=E+(y^b&(p^y))+I[2]+606105819&4294967295,E=b+(_<<17&4294967295|_>>>15),_=y+(p^E&(b^p))+I[3]+3250441966&4294967295,y=E+(_<<22&4294967295|_>>>10),_=p+(b^y&(E^b))+I[4]+4118548399&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(E^p&(y^E))+I[5]+1200080426&4294967295,b=p+(_<<12&4294967295|_>>>20),_=E+(y^b&(p^y))+I[6]+2821735955&4294967295,E=b+(_<<17&4294967295|_>>>15),_=y+(p^E&(b^p))+I[7]+4249261313&4294967295,y=E+(_<<22&4294967295|_>>>10),_=p+(b^y&(E^b))+I[8]+1770035416&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(E^p&(y^E))+I[9]+2336552879&4294967295,b=p+(_<<12&4294967295|_>>>20),_=E+(y^b&(p^y))+I[10]+4294925233&4294967295,E=b+(_<<17&4294967295|_>>>15),_=y+(p^E&(b^p))+I[11]+2304563134&4294967295,y=E+(_<<22&4294967295|_>>>10),_=p+(b^y&(E^b))+I[12]+1804603682&4294967295,p=y+(_<<7&4294967295|_>>>25),_=b+(E^p&(y^E))+I[13]+4254626195&4294967295,b=p+(_<<12&4294967295|_>>>20),_=E+(y^b&(p^y))+I[14]+2792965006&4294967295,E=b+(_<<17&4294967295|_>>>15),_=y+(p^E&(b^p))+I[15]+1236535329&4294967295,y=E+(_<<22&4294967295|_>>>10),_=p+(E^b&(y^E))+I[1]+4129170786&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^E&(p^y))+I[6]+3225465664&4294967295,b=p+(_<<9&4294967295|_>>>23),_=E+(p^y&(b^p))+I[11]+643717713&4294967295,E=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(E^b))+I[0]+3921069994&4294967295,y=E+(_<<20&4294967295|_>>>12),_=p+(E^b&(y^E))+I[5]+3593408605&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^E&(p^y))+I[10]+38016083&4294967295,b=p+(_<<9&4294967295|_>>>23),_=E+(p^y&(b^p))+I[15]+3634488961&4294967295,E=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(E^b))+I[4]+3889429448&4294967295,y=E+(_<<20&4294967295|_>>>12),_=p+(E^b&(y^E))+I[9]+568446438&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^E&(p^y))+I[14]+3275163606&4294967295,b=p+(_<<9&4294967295|_>>>23),_=E+(p^y&(b^p))+I[3]+4107603335&4294967295,E=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(E^b))+I[8]+1163531501&4294967295,y=E+(_<<20&4294967295|_>>>12),_=p+(E^b&(y^E))+I[13]+2850285829&4294967295,p=y+(_<<5&4294967295|_>>>27),_=b+(y^E&(p^y))+I[2]+4243563512&4294967295,b=p+(_<<9&4294967295|_>>>23),_=E+(p^y&(b^p))+I[7]+1735328473&4294967295,E=b+(_<<14&4294967295|_>>>18),_=y+(b^p&(E^b))+I[12]+2368359562&4294967295,y=E+(_<<20&4294967295|_>>>12),_=p+(y^E^b)+I[5]+4294588738&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^E)+I[8]+2272392833&4294967295,b=p+(_<<11&4294967295|_>>>21),_=E+(b^p^y)+I[11]+1839030562&4294967295,E=b+(_<<16&4294967295|_>>>16),_=y+(E^b^p)+I[14]+4259657740&4294967295,y=E+(_<<23&4294967295|_>>>9),_=p+(y^E^b)+I[1]+2763975236&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^E)+I[4]+1272893353&4294967295,b=p+(_<<11&4294967295|_>>>21),_=E+(b^p^y)+I[7]+4139469664&4294967295,E=b+(_<<16&4294967295|_>>>16),_=y+(E^b^p)+I[10]+3200236656&4294967295,y=E+(_<<23&4294967295|_>>>9),_=p+(y^E^b)+I[13]+681279174&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^E)+I[0]+3936430074&4294967295,b=p+(_<<11&4294967295|_>>>21),_=E+(b^p^y)+I[3]+3572445317&4294967295,E=b+(_<<16&4294967295|_>>>16),_=y+(E^b^p)+I[6]+76029189&4294967295,y=E+(_<<23&4294967295|_>>>9),_=p+(y^E^b)+I[9]+3654602809&4294967295,p=y+(_<<4&4294967295|_>>>28),_=b+(p^y^E)+I[12]+3873151461&4294967295,b=p+(_<<11&4294967295|_>>>21),_=E+(b^p^y)+I[15]+530742520&4294967295,E=b+(_<<16&4294967295|_>>>16),_=y+(E^b^p)+I[2]+3299628645&4294967295,y=E+(_<<23&4294967295|_>>>9),_=p+(E^(y|~b))+I[0]+4096336452&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~E))+I[7]+1126891415&4294967295,b=p+(_<<10&4294967295|_>>>22),_=E+(p^(b|~y))+I[14]+2878612391&4294967295,E=b+(_<<15&4294967295|_>>>17),_=y+(b^(E|~p))+I[5]+4237533241&4294967295,y=E+(_<<21&4294967295|_>>>11),_=p+(E^(y|~b))+I[12]+1700485571&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~E))+I[3]+2399980690&4294967295,b=p+(_<<10&4294967295|_>>>22),_=E+(p^(b|~y))+I[10]+4293915773&4294967295,E=b+(_<<15&4294967295|_>>>17),_=y+(b^(E|~p))+I[1]+2240044497&4294967295,y=E+(_<<21&4294967295|_>>>11),_=p+(E^(y|~b))+I[8]+1873313359&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~E))+I[15]+4264355552&4294967295,b=p+(_<<10&4294967295|_>>>22),_=E+(p^(b|~y))+I[6]+2734768916&4294967295,E=b+(_<<15&4294967295|_>>>17),_=y+(b^(E|~p))+I[13]+1309151649&4294967295,y=E+(_<<21&4294967295|_>>>11),_=p+(E^(y|~b))+I[4]+4149444226&4294967295,p=y+(_<<6&4294967295|_>>>26),_=b+(y^(p|~E))+I[11]+3174756917&4294967295,b=p+(_<<10&4294967295|_>>>22),_=E+(p^(b|~y))+I[2]+718787259&4294967295,E=b+(_<<15&4294967295|_>>>17),_=y+(b^(E|~p))+I[9]+3951481745&4294967295,T.g[0]=T.g[0]+p&4294967295,T.g[1]=T.g[1]+(E+(_<<21&4294967295|_>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+b&4294967295}r.prototype.v=function(T,p){p===void 0&&(p=T.length);const y=p-this.blockSize,I=this.C;let E=this.h,b=0;for(;b<p;){if(E==0)for(;b<=y;)s(this,T,b),b+=this.blockSize;if(typeof T=="string"){for(;b<p;)if(I[E++]=T.charCodeAt(b++),E==this.blockSize){s(this,I),E=0;break}}else for(;b<p;)if(I[E++]=T[b++],E==this.blockSize){s(this,I),E=0;break}}this.h=E,this.o+=p},r.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var p=1;p<T.length-8;++p)T[p]=0;p=this.o*8;for(var y=T.length-8;y<T.length;++y)T[y]=p&255,p/=256;for(this.v(T),T=Array(16),p=0,y=0;y<4;++y)for(let I=0;I<32;I+=8)T[p++]=this.g[y]>>>I&255;return T};function o(T,p){var y=l;return Object.prototype.hasOwnProperty.call(y,T)?y[T]:y[T]=p(T)}function a(T,p){this.h=p;const y=[];let I=!0;for(let E=T.length-1;E>=0;E--){const b=T[E]|0;I&&b==p||(y[E]=b,I=!1)}this.g=y}var l={};function h(T){return-128<=T&&T<128?o(T,function(p){return new a([p|0],p<0?-1:0)}):new a([T|0],T<0?-1:0)}function d(T){if(isNaN(T)||!isFinite(T))return g;if(T<0)return C(d(-T));const p=[];let y=1;for(let I=0;T>=y;I++)p[I]=T/y|0,y*=4294967296;return new a(p,0)}function m(T,p){if(T.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(T.charAt(0)=="-")return C(m(T.substring(1),p));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const y=d(Math.pow(p,8));let I=g;for(let b=0;b<T.length;b+=8){var E=Math.min(8,T.length-b);const _=parseInt(T.substring(b,b+E),p);E<8?(E=d(Math.pow(p,E)),I=I.j(E).add(d(_))):(I=I.j(y),I=I.add(d(_)))}return I}var g=h(0),v=h(1),R=h(16777216);n=a.prototype,n.m=function(){if(D(this))return-C(this).m();let T=0,p=1;for(let y=0;y<this.g.length;y++){const I=this.i(y);T+=(I>=0?I:4294967296+I)*p,p*=4294967296}return T},n.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(V(this))return"0";if(D(this))return"-"+C(this).toString(T);const p=d(Math.pow(T,6));var y=this;let I="";for(;;){const E=be(y,p).g;y=B(y,E.j(p));let b=((y.g.length>0?y.g[0]:y.h)>>>0).toString(T);if(y=E,V(y))return b+I;for(;b.length<6;)b="0"+b;I=b+I}},n.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function V(T){if(T.h!=0)return!1;for(let p=0;p<T.g.length;p++)if(T.g[p]!=0)return!1;return!0}function D(T){return T.h==-1}n.l=function(T){return T=B(this,T),D(T)?-1:V(T)?0:1};function C(T){const p=T.g.length,y=[];for(let I=0;I<p;I++)y[I]=~T.g[I];return new a(y,~T.h).add(v)}n.abs=function(){return D(this)?C(this):this},n.add=function(T){const p=Math.max(this.g.length,T.g.length),y=[];let I=0;for(let E=0;E<=p;E++){let b=I+(this.i(E)&65535)+(T.i(E)&65535),_=(b>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);I=_>>>16,b&=65535,_&=65535,y[E]=_<<16|b}return new a(y,y[y.length-1]&-2147483648?-1:0)};function B(T,p){return T.add(C(p))}n.j=function(T){if(V(this)||V(T))return g;if(D(this))return D(T)?C(this).j(C(T)):C(C(this).j(T));if(D(T))return C(this.j(C(T)));if(this.l(R)<0&&T.l(R)<0)return d(this.m()*T.m());const p=this.g.length+T.g.length,y=[];for(var I=0;I<2*p;I++)y[I]=0;for(I=0;I<this.g.length;I++)for(let E=0;E<T.g.length;E++){const b=this.i(I)>>>16,_=this.i(I)&65535,Ce=T.i(E)>>>16,xt=T.i(E)&65535;y[2*I+2*E]+=_*xt,q(y,2*I+2*E),y[2*I+2*E+1]+=b*xt,q(y,2*I+2*E+1),y[2*I+2*E+1]+=_*Ce,q(y,2*I+2*E+1),y[2*I+2*E+2]+=b*Ce,q(y,2*I+2*E+2)}for(T=0;T<p;T++)y[T]=y[2*T+1]<<16|y[2*T];for(T=p;T<2*p;T++)y[T]=0;return new a(y,0)};function q(T,p){for(;(T[p]&65535)!=T[p];)T[p+1]+=T[p]>>>16,T[p]&=65535,p++}function K(T,p){this.g=T,this.h=p}function be(T,p){if(V(p))throw Error("division by zero");if(V(T))return new K(g,g);if(D(T))return p=be(C(T),p),new K(C(p.g),C(p.h));if(D(p))return p=be(T,C(p)),new K(C(p.g),p.h);if(T.g.length>30){if(D(T)||D(p))throw Error("slowDivide_ only works with positive integers.");for(var y=v,I=p;I.l(T)<=0;)y=Pe(y),I=Pe(I);var E=he(y,1),b=he(I,1);for(I=he(I,2),y=he(y,2);!V(I);){var _=b.add(I);_.l(T)<=0&&(E=E.add(y),b=_),I=he(I,1),y=he(y,1)}return p=B(T,E.j(p)),new K(E,p)}for(E=g;T.l(p)>=0;){for(y=Math.max(1,Math.floor(T.m()/p.m())),I=Math.ceil(Math.log(y)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),b=d(y),_=b.j(p);D(_)||_.l(T)>0;)y-=I,b=d(y),_=b.j(p);V(b)&&(b=v),E=E.add(b),T=B(T,_)}return new K(E,T)}n.B=function(T){return be(this,T).h},n.and=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)&T.i(I);return new a(y,this.h&T.h)},n.or=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)|T.i(I);return new a(y,this.h|T.h)},n.xor=function(T){const p=Math.max(this.g.length,T.g.length),y=[];for(let I=0;I<p;I++)y[I]=this.i(I)^T.i(I);return new a(y,this.h^T.h)};function Pe(T){const p=T.g.length+1,y=[];for(let I=0;I<p;I++)y[I]=T.i(I)<<1|T.i(I-1)>>>31;return new a(y,T.h)}function he(T,p){const y=p>>5;p%=32;const I=T.g.length-y,E=[];for(let b=0;b<I;b++)E[b]=p>0?T.i(b+y)>>>p|T.i(b+y+1)<<32-p:T.i(b+y);return new a(E,T.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,xu=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=d,a.fromString=m,wt=a}).apply(typeof jc<"u"?jc:typeof self<"u"?self:typeof window<"u"?window:{});var Wr=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Ou,Zn,Mu,rs,Hi,Lu,Fu,Uu;(function(){var n,e=Object.defineProperty;function t(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof Wr=="object"&&Wr];for(var c=0;c<i.length;++c){var u=i[c];if(u&&u.Math==Math)return u}throw Error("Cannot find global object")}var r=t(this);function s(i,c){if(c)e:{var u=r;i=i.split(".");for(var f=0;f<i.length-1;f++){var w=i[f];if(!(w in u))break e;u=u[w]}i=i[i.length-1],f=u[i],c=c(f),c!=f&&c!=null&&e(u,i,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(c){var u=[],f;for(f in c)Object.prototype.hasOwnProperty.call(c,f)&&u.push([f,c[f]]);return u}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function l(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function h(i,c,u){return i.call.apply(i.bind,arguments)}function d(i,c,u){return d=h,d.apply(null,arguments)}function m(i,c){var u=Array.prototype.slice.call(arguments,1);return function(){var f=u.slice();return f.push.apply(f,arguments),i.apply(this,f)}}function g(i,c){function u(){}u.prototype=c.prototype,i.Z=c.prototype,i.prototype=new u,i.prototype.constructor=i,i.Ob=function(f,w,A){for(var k=Array(arguments.length-2),j=2;j<arguments.length;j++)k[j-2]=arguments[j];return c.prototype[w].apply(f,k)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function R(i){const c=i.length;if(c>0){const u=Array(c);for(let f=0;f<c;f++)u[f]=i[f];return u}return[]}function V(i,c){for(let f=1;f<arguments.length;f++){const w=arguments[f];var u=typeof w;if(u=u!="object"?u:w?Array.isArray(w)?"array":u:"null",u=="array"||u=="object"&&typeof w.length=="number"){u=i.length||0;const A=w.length||0;i.length=u+A;for(let k=0;k<A;k++)i[u+k]=w[k]}else i.push(w)}}class D{constructor(c,u){this.i=c,this.j=u,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function C(i){a.setTimeout(()=>{throw i},0)}function B(){var i=T;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class q{constructor(){this.h=this.g=null}add(c,u){const f=K.get();f.set(c,u),this.h?this.h.next=f:this.g=f,this.h=f}}var K=new D(()=>new be,i=>i.reset());class be{constructor(){this.next=this.g=this.h=null}set(c,u){this.h=c,this.g=u,this.next=null}reset(){this.next=this.g=this.h=null}}let Pe,he=!1,T=new q,p=()=>{const i=Promise.resolve(void 0);Pe=()=>{i.then(y)}};function y(){for(var i;i=B();){try{i.h.call(i.g)}catch(u){C(u)}var c=K;c.j(i),c.h<100&&(c.h++,i.next=c.g,c.g=i)}he=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var b=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const u=()=>{};a.addEventListener("test",u,c),a.removeEventListener("test",u,c)}catch{}return i})();function _(i){return/^[\s\xa0]*$/.test(i)}function Ce(i,c){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,c)}g(Ce,E),Ce.prototype.init=function(i,c){const u=this.type=i.type,f=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget,c||(u=="mouseover"?c=i.fromElement:u=="mouseout"&&(c=i.toElement)),this.relatedTarget=c,f?(this.clientX=f.clientX!==void 0?f.clientX:f.pageX,this.clientY=f.clientY!==void 0?f.clientY:f.pageY,this.screenX=f.screenX||0,this.screenY=f.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&Ce.Z.h.call(this)},Ce.prototype.h=function(){Ce.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var xt="closure_listenable_"+(Math.random()*1e6|0),Td=0;function Id(i,c,u,f,w){this.listener=i,this.proxy=null,this.src=c,this.type=u,this.capture=!!f,this.ha=w,this.key=++Td,this.da=this.fa=!1}function Vr(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function kr(i,c,u){for(const f in i)c.call(u,i[f],f,i)}function wd(i,c){for(const u in i)c.call(void 0,i[u],u,i)}function la(i){const c={};for(const u in i)c[u]=i[u];return c}const ua="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function ha(i,c){let u,f;for(let w=1;w<arguments.length;w++){f=arguments[w];for(u in f)i[u]=f[u];for(let A=0;A<ua.length;A++)u=ua[A],Object.prototype.hasOwnProperty.call(f,u)&&(i[u]=f[u])}}function Nr(i){this.src=i,this.g={},this.h=0}Nr.prototype.add=function(i,c,u,f,w){const A=i.toString();i=this.g[A],i||(i=this.g[A]=[],this.h++);const k=ri(i,c,f,w);return k>-1?(c=i[k],u||(c.fa=!1)):(c=new Id(c,this.src,A,!!f,w),c.fa=u,i.push(c)),c};function ni(i,c){const u=c.type;if(u in i.g){var f=i.g[u],w=Array.prototype.indexOf.call(f,c,void 0),A;(A=w>=0)&&Array.prototype.splice.call(f,w,1),A&&(Vr(c),i.g[u].length==0&&(delete i.g[u],i.h--))}}function ri(i,c,u,f){for(let w=0;w<i.length;++w){const A=i[w];if(!A.da&&A.listener==c&&A.capture==!!u&&A.ha==f)return w}return-1}var si="closure_lm_"+(Math.random()*1e6|0),ii={};function da(i,c,u,f,w){if(Array.isArray(c)){for(let A=0;A<c.length;A++)da(i,c[A],u,f,w);return null}return u=pa(u),i&&i[xt]?i.J(c,u,l(f)?!!f.capture:!1,w):bd(i,c,u,!1,f,w)}function bd(i,c,u,f,w,A){if(!c)throw Error("Invalid event type");const k=l(w)?!!w.capture:!!w;let j=ai(i);if(j||(i[si]=j=new Nr(i)),u=j.add(c,u,f,k,A),u.proxy)return u;if(f=Ad(),u.proxy=f,f.src=i,f.listener=u,i.addEventListener)b||(w=k),w===void 0&&(w=!1),i.addEventListener(c.toString(),f,w);else if(i.attachEvent)i.attachEvent(ma(c.toString()),f);else if(i.addListener&&i.removeListener)i.addListener(f);else throw Error("addEventListener and attachEvent are unavailable.");return u}function Ad(){function i(u){return c.call(i.src,i.listener,u)}const c=Rd;return i}function fa(i,c,u,f,w){if(Array.isArray(c))for(var A=0;A<c.length;A++)fa(i,c[A],u,f,w);else f=l(f)?!!f.capture:!!f,u=pa(u),i&&i[xt]?(i=i.i,A=String(c).toString(),A in i.g&&(c=i.g[A],u=ri(c,u,f,w),u>-1&&(Vr(c[u]),Array.prototype.splice.call(c,u,1),c.length==0&&(delete i.g[A],i.h--)))):i&&(i=ai(i))&&(c=i.g[c.toString()],i=-1,c&&(i=ri(c,u,f,w)),(u=i>-1?c[i]:null)&&oi(u))}function oi(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[xt])ni(c.i,i);else{var u=i.type,f=i.proxy;c.removeEventListener?c.removeEventListener(u,f,i.capture):c.detachEvent?c.detachEvent(ma(u),f):c.addListener&&c.removeListener&&c.removeListener(f),(u=ai(c))?(ni(u,i),u.h==0&&(u.src=null,c[si]=null)):Vr(i)}}}function ma(i){return i in ii?ii[i]:ii[i]="on"+i}function Rd(i,c){if(i.da)i=!0;else{c=new Ce(c,this);const u=i.listener,f=i.ha||i.src;i.fa&&oi(i),i=u.call(f,c)}return i}function ai(i){return i=i[si],i instanceof Nr?i:null}var ci="__closure_events_fn_"+(Math.random()*1e9>>>0);function pa(i){return typeof i=="function"?i:(i[ci]||(i[ci]=function(c){return i.handleEvent(c)}),i[ci])}function ve(){I.call(this),this.i=new Nr(this),this.M=this,this.G=null}g(ve,I),ve.prototype[xt]=!0,ve.prototype.removeEventListener=function(i,c,u,f){fa(this,i,c,u,f)};function Ae(i,c){var u,f=i.G;if(f)for(u=[];f;f=f.G)u.push(f);if(i=i.M,f=c.type||c,typeof c=="string")c=new E(c,i);else if(c instanceof E)c.target=c.target||i;else{var w=c;c=new E(f,i),ha(c,w)}w=!0;let A,k;if(u)for(k=u.length-1;k>=0;k--)A=c.g=u[k],w=Dr(A,f,!0,c)&&w;if(A=c.g=i,w=Dr(A,f,!0,c)&&w,w=Dr(A,f,!1,c)&&w,u)for(k=0;k<u.length;k++)A=c.g=u[k],w=Dr(A,f,!1,c)&&w}ve.prototype.N=function(){if(ve.Z.N.call(this),this.i){var i=this.i;for(const c in i.g){const u=i.g[c];for(let f=0;f<u.length;f++)Vr(u[f]);delete i.g[c],i.h--}}this.G=null},ve.prototype.J=function(i,c,u,f){return this.i.add(String(i),c,!1,u,f)},ve.prototype.K=function(i,c,u,f){return this.i.add(String(i),c,!0,u,f)};function Dr(i,c,u,f){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();let w=!0;for(let A=0;A<c.length;++A){const k=c[A];if(k&&!k.da&&k.capture==u){const j=k.listener,ce=k.ha||k.src;k.fa&&ni(i.i,k),w=j.call(ce,f)!==!1&&w}}return w&&!f.defaultPrevented}function Sd(i,c){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=d(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(i,c||0)}function ga(i){i.g=Sd(()=>{i.g=null,i.i&&(i.i=!1,ga(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Pd extends I{constructor(c,u){super(),this.m=c,this.l=u,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:ga(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Ln(i){I.call(this),this.h=i,this.g={}}g(Ln,I);var _a=[];function ya(i){kr(i.g,function(c,u){this.g.hasOwnProperty(u)&&oi(c)},i),i.g={}}Ln.prototype.N=function(){Ln.Z.N.call(this),ya(this)},Ln.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var li=a.JSON.stringify,Cd=a.JSON.parse,Vd=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function va(){}function Ea(){}var Fn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ui(){E.call(this,"d")}g(ui,E);function hi(){E.call(this,"c")}g(hi,E);var Ot={},Ta=null;function xr(){return Ta=Ta||new ve}Ot.Ia="serverreachability";function Ia(i){E.call(this,Ot.Ia,i)}g(Ia,E);function Un(i){const c=xr();Ae(c,new Ia(c))}Ot.STAT_EVENT="statevent";function wa(i,c){E.call(this,Ot.STAT_EVENT,i),this.stat=c}g(wa,E);function Re(i){const c=xr();Ae(c,new wa(c,i))}Ot.Ja="timingevent";function ba(i,c){E.call(this,Ot.Ja,i),this.size=c}g(ba,E);function Bn(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},c)}function jn(){this.g=!0}jn.prototype.ua=function(){this.g=!1};function kd(i,c,u,f,w,A){i.info(function(){if(i.g)if(A){var k="",j=A.split("&");for(let X=0;X<j.length;X++){var ce=j[X].split("=");if(ce.length>1){const de=ce[0];ce=ce[1];const qe=de.split("_");k=qe.length>=2&&qe[1]=="type"?k+(de+"="+ce+"&"):k+(de+"=redacted&")}}}else k=null;else k=A;return"XMLHTTP REQ ("+f+") [attempt "+w+"]: "+c+`
`+u+`
`+k})}function Nd(i,c,u,f,w,A,k){i.info(function(){return"XMLHTTP RESP ("+f+") [ attempt "+w+"]: "+c+`
`+u+`
`+A+" "+k})}function en(i,c,u,f){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+xd(i,u)+(f?" "+f:"")})}function Dd(i,c){i.info(function(){return"TIMEOUT: "+c})}jn.prototype.info=function(){};function xd(i,c){if(!i.g)return c;if(!c)return null;try{const A=JSON.parse(c);if(A){for(i=0;i<A.length;i++)if(Array.isArray(A[i])){var u=A[i];if(!(u.length<2)){var f=u[1];if(Array.isArray(f)&&!(f.length<1)){var w=f[0];if(w!="noop"&&w!="stop"&&w!="close")for(let k=1;k<f.length;k++)f[k]=""}}}}return li(A)}catch{return c}}var Or={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Aa={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},Ra;function di(){}g(di,va),di.prototype.g=function(){return new XMLHttpRequest},Ra=new di;function qn(i){return encodeURIComponent(String(i))}function Od(i){var c=1;i=i.split(":");const u=[];for(;c>0&&i.length;)u.push(i.shift()),c--;return i.length&&u.push(i.join(":")),u}function at(i,c,u,f){this.j=i,this.i=c,this.l=u,this.S=f||1,this.V=new Ln(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Sa}function Sa(){this.i=null,this.g="",this.h=!1}var Pa={},fi={};function mi(i,c,u){i.M=1,i.A=Lr(je(c)),i.u=u,i.R=!0,Ca(i,null)}function Ca(i,c){i.F=Date.now(),Mr(i),i.B=je(i.A);var u=i.B,f=i.S;Array.isArray(f)||(f=[String(f)]),qa(u.i,"t",f),i.C=0,u=i.j.L,i.h=new Sa,i.g=oc(i.j,u?c:null,!i.u),i.P>0&&(i.O=new Pd(d(i.Y,i,i.g),i.P)),c=i.V,u=i.g,f=i.ba;var w="readystatechange";Array.isArray(w)||(w&&(_a[0]=w.toString()),w=_a);for(let A=0;A<w.length;A++){const k=da(u,w[A],f||c.handleEvent,!1,c.h||c);if(!k)break;c.g[k.key]=k}c=i.J?la(i.J):{},i.u?(i.v||(i.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,c)):(i.v="GET",i.g.ea(i.B,i.v,null,c)),Un(),kd(i.i,i.v,i.B,i.l,i.S,i.u)}at.prototype.ba=function(i){i=i.target;const c=this.O;c&&ut(i)==3?c.j():this.Y(i)},at.prototype.Y=function(i){try{if(i==this.g)e:{const j=ut(this.g),ce=this.g.ya(),X=this.g.ca();if(!(j<3)&&(j!=3||this.g&&(this.h.h||this.g.la()||Qa(this.g)))){this.K||j!=4||ce==7||(ce==8||X<=0?Un(3):Un(2)),pi(this);var c=this.g.ca();this.X=c;var u=Md(this);if(this.o=c==200,Nd(this.i,this.v,this.B,this.l,this.S,j,c),this.o){if(this.U&&!this.L){t:{if(this.g){var f,w=this.g;if((f=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!_(f)){var A=f;break t}}A=null}if(i=A)en(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,gi(this,i);else{this.o=!1,this.m=3,Re(12),Mt(this),$n(this);break e}}if(this.R){i=!0;let de;for(;!this.K&&this.C<u.length;)if(de=Ld(this,u),de==fi){j==4&&(this.m=4,Re(14),i=!1),en(this.i,this.l,null,"[Incomplete Response]");break}else if(de==Pa){this.m=4,Re(15),en(this.i,this.l,u,"[Invalid Chunk]"),i=!1;break}else en(this.i,this.l,de,null),gi(this,de);if(Va(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),j!=4||u.length!=0||this.h.h||(this.m=1,Re(16),i=!1),this.o=this.o&&i,!i)en(this.i,this.l,u,"[Invalid Chunked Response]"),Mt(this),$n(this);else if(u.length>0&&!this.W){this.W=!0;var k=this.j;k.g==this&&k.aa&&!k.P&&(k.j.info("Great, no buffering proxy detected. Bytes received: "+u.length),bi(k),k.P=!0,Re(11))}}else en(this.i,this.l,u,null),gi(this,u);j==4&&Mt(this),this.o&&!this.K&&(j==4?nc(this.j,this):(this.o=!1,Mr(this)))}else Jd(this.g),c==400&&u.indexOf("Unknown SID")>0?(this.m=3,Re(12)):(this.m=0,Re(13)),Mt(this),$n(this)}}}catch{}finally{}};function Md(i){if(!Va(i))return i.g.la();const c=Qa(i.g);if(c==="")return"";let u="";const f=c.length,w=ut(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return Mt(i),$n(i),"";i.h.i=new a.TextDecoder}for(let A=0;A<f;A++)i.h.h=!0,u+=i.h.i.decode(c[A],{stream:!(w&&A==f-1)});return c.length=0,i.h.g+=u,i.C=0,i.h.g}function Va(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function Ld(i,c){var u=i.C,f=c.indexOf(`
`,u);return f==-1?fi:(u=Number(c.substring(u,f)),isNaN(u)?Pa:(f+=1,f+u>c.length?fi:(c=c.slice(f,f+u),i.C=f+u,c)))}at.prototype.cancel=function(){this.K=!0,Mt(this)};function Mr(i){i.T=Date.now()+i.H,ka(i,i.H)}function ka(i,c){if(i.D!=null)throw Error("WatchDog timer not null");i.D=Bn(d(i.aa,i),c)}function pi(i){i.D&&(a.clearTimeout(i.D),i.D=null)}at.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Dd(this.i,this.B),this.M!=2&&(Un(),Re(17)),Mt(this),this.m=2,$n(this)):ka(this,this.T-i)};function $n(i){i.j.I==0||i.K||nc(i.j,i)}function Mt(i){pi(i);var c=i.O;c&&typeof c.dispose=="function"&&c.dispose(),i.O=null,ya(i.V),i.g&&(c=i.g,i.g=null,c.abort(),c.dispose())}function gi(i,c){try{var u=i.j;if(u.I!=0&&(u.g==i||_i(u.h,i))){if(!i.L&&_i(u.h,i)&&u.I==3){try{var f=u.Ba.g.parse(c)}catch{f=null}if(Array.isArray(f)&&f.length==3){var w=f;if(w[0]==0){e:if(!u.v){if(u.g)if(u.g.F+3e3<i.F)qr(u),Br(u);else break e;wi(u),Re(18)}}else u.xa=w[1],0<u.xa-u.K&&w[2]<37500&&u.F&&u.A==0&&!u.C&&(u.C=Bn(d(u.Va,u),6e3));xa(u.h)<=1&&u.ta&&(u.ta=void 0)}else Ft(u,11)}else if((i.L||u.g==i)&&qr(u),!_(c))for(w=u.Ba.g.parse(c),c=0;c<w.length;c++){let X=w[c];const de=X[0];if(!(de<=u.K))if(u.K=de,X=X[1],u.I==2)if(X[0]=="c"){u.M=X[1],u.ba=X[2];const qe=X[3];qe!=null&&(u.ka=qe,u.j.info("VER="+u.ka));const Ut=X[4];Ut!=null&&(u.za=Ut,u.j.info("SVER="+u.za));const ht=X[5];ht!=null&&typeof ht=="number"&&ht>0&&(f=1.5*ht,u.O=f,u.j.info("backChannelRequestTimeoutMs_="+f)),f=u;const dt=i.g;if(dt){const zr=dt.g?dt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(zr){var A=f.h;A.g||zr.indexOf("spdy")==-1&&zr.indexOf("quic")==-1&&zr.indexOf("h2")==-1||(A.j=A.l,A.g=new Set,A.h&&(yi(A,A.h),A.h=null))}if(f.G){const Ai=dt.g?dt.g.getResponseHeader("X-HTTP-Session-Id"):null;Ai&&(f.wa=Ai,J(f.J,f.G,Ai))}}u.I=3,u.l&&u.l.ra(),u.aa&&(u.T=Date.now()-i.F,u.j.info("Handshake RTT: "+u.T+"ms")),f=u;var k=i;if(f.na=ic(f,f.L?f.ba:null,f.W),k.L){Oa(f.h,k);var j=k,ce=f.O;ce&&(j.H=ce),j.D&&(pi(j),Mr(j)),f.g=k}else ec(f);u.i.length>0&&jr(u)}else X[0]!="stop"&&X[0]!="close"||Ft(u,7);else u.I==3&&(X[0]=="stop"||X[0]=="close"?X[0]=="stop"?Ft(u,7):Ii(u):X[0]!="noop"&&u.l&&u.l.qa(X),u.A=0)}}Un(4)}catch{}}var Fd=class{constructor(i,c){this.g=i,this.map=c}};function Na(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Da(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function xa(i){return i.h?1:i.g?i.g.size:0}function _i(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function yi(i,c){i.g?i.g.add(c):i.h=c}function Oa(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}Na.prototype.cancel=function(){if(this.i=Ma(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Ma(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const u of i.g.values())c=c.concat(u.G);return c}return R(i.i)}var La=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Ud(i,c){if(i){i=i.split("&");for(let u=0;u<i.length;u++){const f=i[u].indexOf("=");let w,A=null;f>=0?(w=i[u].substring(0,f),A=i[u].substring(f+1)):w=i[u],c(w,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function ct(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;i instanceof ct?(this.l=i.l,zn(this,i.j),this.o=i.o,this.g=i.g,Hn(this,i.u),this.h=i.h,vi(this,$a(i.i)),this.m=i.m):i&&(c=String(i).match(La))?(this.l=!1,zn(this,c[1]||"",!0),this.o=Gn(c[2]||""),this.g=Gn(c[3]||"",!0),Hn(this,c[4]),this.h=Gn(c[5]||"",!0),vi(this,c[6]||"",!0),this.m=Gn(c[7]||"")):(this.l=!1,this.i=new Kn(null,this.l))}ct.prototype.toString=function(){const i=[];var c=this.j;c&&i.push(Wn(c,Fa,!0),":");var u=this.g;return(u||c=="file")&&(i.push("//"),(c=this.o)&&i.push(Wn(c,Fa,!0),"@"),i.push(qn(u).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),u=this.u,u!=null&&i.push(":",String(u))),(u=this.h)&&(this.g&&u.charAt(0)!="/"&&i.push("/"),i.push(Wn(u,u.charAt(0)=="/"?qd:jd,!0))),(u=this.i.toString())&&i.push("?",u),(u=this.m)&&i.push("#",Wn(u,zd)),i.join("")},ct.prototype.resolve=function(i){const c=je(this);let u=!!i.j;u?zn(c,i.j):u=!!i.o,u?c.o=i.o:u=!!i.g,u?c.g=i.g:u=i.u!=null;var f=i.h;if(u)Hn(c,i.u);else if(u=!!i.h){if(f.charAt(0)!="/")if(this.g&&!this.h)f="/"+f;else{var w=c.h.lastIndexOf("/");w!=-1&&(f=c.h.slice(0,w+1)+f)}if(w=f,w==".."||w==".")f="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){f=w.lastIndexOf("/",0)==0,w=w.split("/");const A=[];for(let k=0;k<w.length;){const j=w[k++];j=="."?f&&k==w.length&&A.push(""):j==".."?((A.length>1||A.length==1&&A[0]!="")&&A.pop(),f&&k==w.length&&A.push("")):(A.push(j),f=!0)}f=A.join("/")}else f=w}return u?c.h=f:u=i.i.toString()!=="",u?vi(c,$a(i.i)):u=!!i.m,u&&(c.m=i.m),c};function je(i){return new ct(i)}function zn(i,c,u){i.j=u?Gn(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function Hn(i,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);i.u=c}else i.u=null}function vi(i,c,u){c instanceof Kn?(i.i=c,Hd(i.i,i.l)):(u||(c=Wn(c,$d)),i.i=new Kn(c,i.l))}function J(i,c,u){i.i.set(c,u)}function Lr(i){return J(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function Gn(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function Wn(i,c,u){return typeof i=="string"?(i=encodeURI(i).replace(c,Bd),u&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function Bd(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var Fa=/[#\/\?@]/g,jd=/[#\?:]/g,qd=/[#\?]/g,$d=/[#\?@]/g,zd=/#/g;function Kn(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Lt(i){i.g||(i.g=new Map,i.h=0,i.i&&Ud(i.i,function(c,u){i.add(decodeURIComponent(c.replace(/\+/g," ")),u)}))}n=Kn.prototype,n.add=function(i,c){Lt(this),this.i=null,i=tn(this,i);let u=this.g.get(i);return u||this.g.set(i,u=[]),u.push(c),this.h+=1,this};function Ua(i,c){Lt(i),c=tn(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function Ba(i,c){return Lt(i),c=tn(i,c),i.g.has(c)}n.forEach=function(i,c){Lt(this),this.g.forEach(function(u,f){u.forEach(function(w){i.call(c,w,f,this)},this)},this)};function ja(i,c){Lt(i);let u=[];if(typeof c=="string")Ba(i,c)&&(u=u.concat(i.g.get(tn(i,c))));else for(i=Array.from(i.g.values()),c=0;c<i.length;c++)u=u.concat(i[c]);return u}n.set=function(i,c){return Lt(this),this.i=null,i=tn(this,i),Ba(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=ja(this,i),i.length>0?String(i[0]):c):c};function qa(i,c,u){Ua(i,c),u.length>0&&(i.i=null,i.g.set(tn(i,c),R(u)),i.h+=u.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(let f=0;f<c.length;f++){var u=c[f];const w=qn(u);u=ja(this,u);for(let A=0;A<u.length;A++){let k=w;u[A]!==""&&(k+="="+qn(u[A])),i.push(k)}}return this.i=i.join("&")};function $a(i){const c=new Kn;return c.i=i.i,i.g&&(c.g=new Map(i.g),c.h=i.h),c}function tn(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function Hd(i,c){c&&!i.j&&(Lt(i),i.i=null,i.g.forEach(function(u,f){const w=f.toLowerCase();f!=w&&(Ua(this,f),qa(this,w,u))},i)),i.j=c}function Gd(i,c){const u=new jn;if(a.Image){const f=new Image;f.onload=m(lt,u,"TestLoadImage: loaded",!0,c,f),f.onerror=m(lt,u,"TestLoadImage: error",!1,c,f),f.onabort=m(lt,u,"TestLoadImage: abort",!1,c,f),f.ontimeout=m(lt,u,"TestLoadImage: timeout",!1,c,f),a.setTimeout(function(){f.ontimeout&&f.ontimeout()},1e4),f.src=i}else c(!1)}function Wd(i,c){const u=new jn,f=new AbortController,w=setTimeout(()=>{f.abort(),lt(u,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:f.signal}).then(A=>{clearTimeout(w),A.ok?lt(u,"TestPingServer: ok",!0,c):lt(u,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),lt(u,"TestPingServer: error",!1,c)})}function lt(i,c,u,f,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),f(u)}catch{}}function Kd(){this.g=new Vd}function Ei(i){this.i=i.Sb||null,this.h=i.ab||!1}g(Ei,va),Ei.prototype.g=function(){return new Fr(this.i,this.h)};function Fr(i,c){ve.call(this),this.H=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}g(Fr,ve),n=Fr.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=c,this.readyState=1,Xn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(c.body=i),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,Qn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,Xn(this)),this.g&&(this.readyState=3,Xn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;za(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function za(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?Qn(this):Xn(this),this.readyState==3&&za(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,Qn(this))},n.Na=function(i){this.g&&(this.response=i,Qn(this))},n.ga=function(){this.g&&Qn(this)};function Qn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,Xn(i)}n.setRequestHeader=function(i,c){this.A.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var u=c.next();!u.done;)u=u.value,i.push(u[0]+": "+u[1]),u=c.next();return i.join(`\r
`)};function Xn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(Fr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Ha(i){let c="";return kr(i,function(u,f){c+=f,c+=":",c+=u,c+=`\r
`}),c}function Ti(i,c,u){e:{for(f in u){var f=!1;break e}f=!0}f||(u=Ha(u),typeof i=="string"?u!=null&&qn(u):J(i,c,u))}function te(i){ve.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}g(te,ve);var Qd=/^https?$/i,Xd=["POST","PUT"];n=te.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,c,u,f){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():Ra.g(),this.g.onreadystatechange=v(d(this.Ca,this));try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(A){Ga(this,A);return}if(i=u||"",u=new Map(this.headers),f)if(Object.getPrototypeOf(f)===Object.prototype)for(var w in f)u.set(w,f[w]);else if(typeof f.keys=="function"&&typeof f.get=="function")for(const A of f.keys())u.set(A,f.get(A));else throw Error("Unknown input type for opt_headers: "+String(f));f=Array.from(u.keys()).find(A=>A.toLowerCase()=="content-type"),w=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(Xd,c,void 0)>=0)||f||w||u.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[A,k]of u)this.g.setRequestHeader(A,k);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(A){Ga(this,A)}};function Ga(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.o=5,Wa(i),Ur(i)}function Wa(i){i.A||(i.A=!0,Ae(i,"complete"),Ae(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,Ae(this,"complete"),Ae(this,"abort"),Ur(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Ur(this,!0)),te.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?Ka(this):this.Xa())},n.Xa=function(){Ka(this)};function Ka(i){if(i.h&&typeof o<"u"){if(i.v&&ut(i)==4)setTimeout(i.Ca.bind(i),0);else if(Ae(i,"readystatechange"),ut(i)==4){i.h=!1;try{const A=i.ca();e:switch(A){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var u;if(!(u=c)){var f;if(f=A===0){let k=String(i.D).match(La)[1]||null;!k&&a.self&&a.self.location&&(k=a.self.location.protocol.slice(0,-1)),f=!Qd.test(k?k.toLowerCase():"")}u=f}if(u)Ae(i,"complete"),Ae(i,"success");else{i.o=6;try{var w=ut(i)>2?i.g.statusText:""}catch{w=""}i.l=w+" ["+i.ca()+"]",Wa(i)}}finally{Ur(i)}}}}function Ur(i,c){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const u=i.g;i.g=null,c||Ae(i,"ready");try{u.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function ut(i){return i.g?i.g.readyState:0}n.ca=function(){try{return ut(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),Cd(c)}};function Qa(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function Jd(i){const c={};i=(i.g&&ut(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let f=0;f<i.length;f++){if(_(i[f]))continue;var u=Od(i[f]);const w=u[0];if(u=u[1],typeof u!="string")continue;u=u.trim();const A=c[w]||[];c[w]=A,A.push(u)}wd(c,function(f){return f.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function Jn(i,c,u){return u&&u.internalChannelParams&&u.internalChannelParams[i]||c}function Xa(i){this.za=0,this.i=[],this.j=new jn,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=Jn("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=Jn("baseRetryDelayMs",5e3,i),this.Za=Jn("retryDelaySeedMs",1e4,i),this.Ta=Jn("forwardChannelMaxRetries",2,i),this.va=Jn("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new Na(i&&i.concurrentRequestLimit),this.Ba=new Kd,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Xa.prototype,n.ka=8,n.I=1,n.connect=function(i,c,u,f){Re(0),this.W=i,this.H=c||{},u&&f!==void 0&&(this.H.OSID=u,this.H.OAID=f),this.F=this.X,this.J=ic(this,null,this.W),jr(this)};function Ii(i){if(Ja(i),i.I==3){var c=i.V++,u=je(i.J);if(J(u,"SID",i.M),J(u,"RID",c),J(u,"TYPE","terminate"),Yn(i,u),c=new at(i,i.j,c),c.M=2,c.A=Lr(je(u)),u=!1,a.navigator&&a.navigator.sendBeacon)try{u=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!u&&a.Image&&(new Image().src=c.A,u=!0),u||(c.g=oc(c.j,null),c.g.ea(c.A)),c.F=Date.now(),Mr(c)}sc(i)}function Br(i){i.g&&(bi(i),i.g.cancel(),i.g=null)}function Ja(i){Br(i),i.v&&(a.clearTimeout(i.v),i.v=null),qr(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function jr(i){if(!Da(i.h)&&!i.m){i.m=!0;var c=i.Ea;Pe||p(),he||(Pe(),he=!0),T.add(c,i),i.D=0}}function Yd(i,c){return xa(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=c.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=Bn(d(i.Ea,i,c),rc(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const w=new at(this,this.j,i);let A=this.o;if(this.U&&(A?(A=la(A),ha(A,this.U)):A=this.U),this.u!==null||this.R||(w.J=A,A=null),this.S)e:{for(var c=0,u=0;u<this.i.length;u++){t:{var f=this.i[u];if("__data__"in f.map&&(f=f.map.__data__,typeof f=="string")){f=f.length;break t}f=void 0}if(f===void 0)break;if(c+=f,c>4096){c=u;break e}if(c===4096||u===this.i.length-1){c=u+1;break e}}c=1e3}else c=1e3;c=Za(this,w,c),u=je(this.J),J(u,"RID",i),J(u,"CVER",22),this.G&&J(u,"X-HTTP-Session-Id",this.G),Yn(this,u),A&&(this.R?c="headers="+qn(Ha(A))+"&"+c:this.u&&Ti(u,this.u,A)),yi(this.h,w),this.Ra&&J(u,"TYPE","init"),this.S?(J(u,"$req",c),J(u,"SID","null"),w.U=!0,mi(w,u,null)):mi(w,u,c),this.I=2}}else this.I==3&&(i?Ya(this,i):this.i.length==0||Da(this.h)||Ya(this))};function Ya(i,c){var u;c?u=c.l:u=i.V++;const f=je(i.J);J(f,"SID",i.M),J(f,"RID",u),J(f,"AID",i.K),Yn(i,f),i.u&&i.o&&Ti(f,i.u,i.o),u=new at(i,i.j,u,i.D+1),i.u===null&&(u.J=i.o),c&&(i.i=c.G.concat(i.i)),c=Za(i,u,1e3),u.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),yi(i.h,u),mi(u,f,c)}function Yn(i,c){i.H&&kr(i.H,function(u,f){J(c,f,u)}),i.l&&kr({},function(u,f){J(c,f,u)})}function Za(i,c,u){u=Math.min(i.i.length,u);const f=i.l?d(i.l.Ka,i.l,i):null;e:{var w=i.i;let j=-1;for(;;){const ce=["count="+u];j==-1?u>0?(j=w[0].g,ce.push("ofs="+j)):j=0:ce.push("ofs="+j);let X=!0;for(let de=0;de<u;de++){var A=w[de].g;const qe=w[de].map;if(A-=j,A<0)j=Math.max(0,w[de].g-100),X=!1;else try{A="req"+A+"_"||"";try{var k=qe instanceof Map?qe:Object.entries(qe);for(const[Ut,ht]of k){let dt=ht;l(ht)&&(dt=li(ht)),ce.push(A+Ut+"="+encodeURIComponent(dt))}}catch(Ut){throw ce.push(A+"type="+encodeURIComponent("_badmap")),Ut}}catch{f&&f(qe)}}if(X){k=ce.join("&");break e}}k=void 0}return i=i.i.splice(0,u),c.G=i,k}function ec(i){if(!i.g&&!i.v){i.Y=1;var c=i.Da;Pe||p(),he||(Pe(),he=!0),T.add(c,i),i.A=0}}function wi(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=Bn(d(i.Da,i),rc(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,tc(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=Bn(d(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Re(10),Br(this),tc(this))};function bi(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function tc(i){i.g=new at(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var c=je(i.na);J(c,"RID","rpc"),J(c,"SID",i.M),J(c,"AID",i.K),J(c,"CI",i.F?"0":"1"),!i.F&&i.ia&&J(c,"TO",i.ia),J(c,"TYPE","xmlhttp"),Yn(i,c),i.u&&i.o&&Ti(c,i.u,i.o),i.O&&(i.g.H=i.O);var u=i.g;i=i.ba,u.M=1,u.A=Lr(je(c)),u.u=null,u.R=!0,Ca(u,i)}n.Va=function(){this.C!=null&&(this.C=null,Br(this),wi(this),Re(19))};function qr(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function nc(i,c){var u=null;if(i.g==c){qr(i),bi(i),i.g=null;var f=2}else if(_i(i.h,c))u=c.G,Oa(i.h,c),f=1;else return;if(i.I!=0){if(c.o)if(f==1){u=c.u?c.u.length:0,c=Date.now()-c.F;var w=i.D;f=xr(),Ae(f,new ba(f,u)),jr(i)}else ec(i);else if(w=c.m,w==3||w==0&&c.X>0||!(f==1&&Yd(i,c)||f==2&&wi(i)))switch(u&&u.length>0&&(c=i.h,c.i=c.i.concat(u)),w){case 1:Ft(i,5);break;case 4:Ft(i,10);break;case 3:Ft(i,6);break;default:Ft(i,2)}}}function rc(i,c){let u=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(u*=2),u*c}function Ft(i,c){if(i.j.info("Error code "+c),c==2){var u=d(i.bb,i),f=i.Ua;const w=!f;f=new ct(f||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||zn(f,"https"),Lr(f),w?Gd(f.toString(),u):Wd(f.toString(),u)}else Re(2);i.I=0,i.l&&i.l.pa(c),sc(i),Ja(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Re(2)):(this.j.info("Failed to ping google.com"),Re(1))};function sc(i){if(i.I=0,i.ja=[],i.l){const c=Ma(i.h);(c.length!=0||i.i.length!=0)&&(V(i.ja,c),V(i.ja,i.i),i.h.i.length=0,R(i.i),i.i.length=0),i.l.oa()}}function ic(i,c,u){var f=u instanceof ct?je(u):new ct(u);if(f.g!="")c&&(f.g=c+"."+f.g),Hn(f,f.u);else{var w=a.location;f=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;const A=new ct(null);f&&zn(A,f),c&&(A.g=c),w&&Hn(A,w),u&&(A.h=u),f=A}return u=i.G,c=i.wa,u&&c&&J(f,u,c),J(f,"VER",i.ka),Yn(i,f),f}function oc(i,c,u){if(c&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Aa&&!i.ma?new te(new Ei({ab:u})):new te(i.ma),c.Fa(i.L),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ac(){}n=ac.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function $r(){}$r.prototype.g=function(i,c){return new ke(i,c)};function ke(i,c){ve.call(this),this.g=new Xa(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(i?i["X-WebChannel-Client-Profile"]=c.sa:i={"X-WebChannel-Client-Profile":c.sa}),this.g.U=i,(i=c&&c.Qb)&&!_(i)&&(this.g.u=i),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!_(c)&&(this.g.G=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new nn(this)}g(ke,ve),ke.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ke.prototype.close=function(){Ii(this.g)},ke.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var u={};u.__data__=i,i=u}else this.v&&(u={},u.__data__=li(i),i=u);c.i.push(new Fd(c.Ya++,i)),c.I==3&&jr(c)},ke.prototype.N=function(){this.g.l=null,delete this.j,Ii(this.g),delete this.g,ke.Z.N.call(this)};function cc(i){ui.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){e:{for(const u in c){i=u;break e}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}g(cc,ui);function lc(){hi.call(this),this.status=1}g(lc,hi);function nn(i){this.g=i}g(nn,ac),nn.prototype.ra=function(){Ae(this.g,"a")},nn.prototype.qa=function(i){Ae(this.g,new cc(i))},nn.prototype.pa=function(i){Ae(this.g,new lc)},nn.prototype.oa=function(){Ae(this.g,"b")},$r.prototype.createWebChannel=$r.prototype.g,ke.prototype.send=ke.prototype.o,ke.prototype.open=ke.prototype.m,ke.prototype.close=ke.prototype.close,Uu=function(){return new $r},Fu=function(){return xr()},Lu=Ot,Hi={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Or.NO_ERROR=0,Or.TIMEOUT=8,Or.HTTP_ERROR=6,rs=Or,Aa.COMPLETE="complete",Mu=Aa,Ea.EventType=Fn,Fn.OPEN="a",Fn.CLOSE="b",Fn.ERROR="c",Fn.MESSAGE="d",ve.prototype.listen=ve.prototype.J,Zn=Ea,te.prototype.listenOnce=te.prototype.K,te.prototype.getLastError=te.prototype.Ha,te.prototype.getLastErrorCode=te.prototype.ya,te.prototype.getStatus=te.prototype.ca,te.prototype.getResponseJson=te.prototype.La,te.prototype.getResponseText=te.prototype.la,te.prototype.send=te.prototype.ea,te.prototype.setWithCredentials=te.prototype.Fa,Ou=te}).apply(typeof Wr<"u"?Wr:typeof self<"u"?self:typeof window<"u"?window:{});const qc="@firebase/firestore",$c="4.9.2";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Te{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Te.UNAUTHENTICATED=new Te(null),Te.GOOGLE_CREDENTIALS=new Te("google-credentials-uid"),Te.FIRST_PARTY=new Te("first-party-uid"),Te.MOCK_USER=new Te("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vn="12.3.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kt=new uo("@firebase/firestore");function sn(){return Kt.logLevel}function x(n,...e){if(Kt.logLevel<=$.DEBUG){const t=e.map(wo);Kt.debug(`Firestore (${Vn}): ${n}`,...t)}}function st(n,...e){if(Kt.logLevel<=$.ERROR){const t=e.map(wo);Kt.error(`Firestore (${Vn}): ${n}`,...t)}}function yn(n,...e){if(Kt.logLevel<=$.WARN){const t=e.map(wo);Kt.warn(`Firestore (${Vn}): ${n}`,...t)}}function wo(n){if(typeof n=="string")return n;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function M(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,Bu(n,r,t)}function Bu(n,e,t){let r=`FIRESTORE (${Vn}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw st(r),new Error(r)}function W(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||Bu(e,s,r)}function U(n,e){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends ot{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ju{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class $g{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Te.UNAUTHENTICATED)))}shutdown(){}}class zg{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Hg{constructor(e){this.t=e,this.currentUser=Te.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){W(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,t(h)):Promise.resolve();let o=new We;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new We,e.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const h=o;e.enqueueRetryable((async()=>{await h.promise,await s(this.currentUser)}))},l=h=>{x("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((h=>l(h))),setTimeout((()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?l(h):(x("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new We)}}),0),a()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.i!==e?(x("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(W(typeof r.accessToken=="string",31837,{l:r}),new ju(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return W(e===null||typeof e=="string",2055,{h:e}),new Te(e)}}class Gg{constructor(e,t,r){this.P=e,this.T=t,this.I=r,this.type="FirstParty",this.user=Te.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Wg{constructor(e,t,r){this.P=e,this.T=t,this.I=r}getToken(){return Promise.resolve(new Gg(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(Te.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class zc{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Kg{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,ze(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){W(this.o===void 0,3512);const r=o=>{o.error!=null&&x("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,x("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?t(o.token):Promise.resolve()};this.o=o=>{e.enqueueRetryable((()=>r(o)))};const s=o=>{x("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>s(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):x("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new zc(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(W(typeof t.token=="string",44558,{tokenResult:t}),this.m=t.token,new zc(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qg(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Qg(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<t&&(r+=e.charAt(s[o]%62))}return r}}function z(n,e){return n<e?-1:n>e?1:0}function Gi(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),o=e.charAt(r);if(s!==o)return Di(s)===Di(o)?z(s,o):Di(s)?1:-1}return z(n.length,e.length)}const Xg=55296,Jg=57343;function Di(n){const e=n.charCodeAt(0);return e>=Xg&&e<=Jg}function vn(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hc="__name__";class $e{constructor(e,t,r){t===void 0?t=0:t>e.length&&M(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&M(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return $e.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof $e?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const o=$e.compareSegments(e.get(s),t.get(s));if(o!==0)return o}return z(e.length,t.length)}static compareSegments(e,t){const r=$e.isNumericId(e),s=$e.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?$e.extractNumericId(e).compare($e.extractNumericId(t)):Gi(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return wt.fromString(e.substring(4,e.length-2))}}class Q extends $e{construct(e,t,r){return new Q(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(S.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new Q(t)}static emptyPath(){return new Q([])}}const Yg=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class _e extends $e{construct(e,t,r){return new _e(e,t,r)}static isValidIdentifier(e){return Yg.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),_e.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Hc}static keyField(){return new _e([Hc])}static fromServerFormat(e){const t=[];let r="",s=0;const o=()=>{if(r.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let a=!1;for(;s<e.length;){const l=e[s];if(l==="\\"){if(s+1===e.length)throw new N(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const h=e[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new N(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=h,s+=2}else l==="`"?(a=!a,s++):l!=="."||a?(r+=l,s++):(o(),s++)}if(o(),a)throw new N(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new _e(t)}static emptyPath(){return new _e([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e){this.path=e}static fromPath(e){return new O(Q.fromString(e))}static fromName(e){return new O(Q.fromString(e).popFirst(5))}static empty(){return new O(Q.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Q.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Q.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new O(new Q(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qu(n,e,t){if(!t)throw new N(S.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function Zg(n,e,t,r){if(e===!0&&r===!0)throw new N(S.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function Gc(n){if(!O.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Wc(n){if(O.isDocumentKey(n))throw new N(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function $u(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Ls(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":M(12329,{type:typeof n})}function Ie(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ls(n);throw new N(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ae(n,e){const t={typeString:n};return e&&(t.value=e),t}function Er(n,e){if(!$u(n))throw new N(S.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,o="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){t=`Expected '${r}' field to equal '${o.value}'`;break}}if(t)throw new N(S.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kc=-62135596800,Qc=1e6;class Y{static now(){return Y.fromMillis(Date.now())}static fromDate(e){return Y.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Qc);return new Y(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Kc)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Qc}_compareTo(e){return this.seconds===e.seconds?z(this.nanoseconds,e.nanoseconds):z(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:Y._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Er(e,Y._jsonSchema))return new Y(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Kc;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}Y._jsonSchemaVersion="firestore/timestamp/1.0",Y._jsonSchema={type:ae("string",Y._jsonSchemaVersion),seconds:ae("number"),nanoseconds:ae("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static fromTimestamp(e){return new L(e)}static min(){return new L(new Y(0,0))}static max(){return new L(new Y(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hr=-1;function e_(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=L.fromTimestamp(r===1e9?new Y(t+1,0):new Y(t,r));return new Rt(s,O.empty(),e)}function t_(n){return new Rt(n.readTime,n.key,hr)}class Rt{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new Rt(L.min(),O.empty(),hr)}static max(){return new Rt(L.max(),O.empty(),hr)}}function n_(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=O.comparator(n.documentKey,e.documentKey),t!==0?t:z(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const r_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class s_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function kn(n){if(n.code!==S.FAILED_PRECONDITION||n.message!==r_)throw n;x("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&M(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new P(((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(e,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(t,o).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof P?t:P.resolve(t)}catch(t){return P.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):P.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):P.reject(t)}static resolve(e){return new P(((t,r)=>{t(e)}))}static reject(e){return new P(((t,r)=>{r(e)}))}static waitFor(e){return new P(((t,r)=>{let s=0,o=0,a=!1;e.forEach((l=>{++s,l.next((()=>{++o,a&&o===s&&t()}),(h=>r(h)))})),a=!0,o===s&&t()}))}static or(e){let t=P.resolve(!1);for(const r of e)t=t.next((s=>s?P.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,o)=>{r.push(t.call(this,s,o))})),this.waitFor(r)}static mapArray(e,t){return new P(((r,s)=>{const o=e.length,a=new Array(o);let l=0;for(let h=0;h<o;h++){const d=h;t(e[d]).next((m=>{a[d]=m,++l,l===o&&r(a)}),(m=>s(m)))}}))}static doWhile(e,t){return new P(((r,s)=>{const o=()=>{e()===!0?t().next((()=>{o()}),s):r()};o()}))}}function i_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}function Nn(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fs{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>t.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Fs.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ao=-1;function Tr(n){return n==null}function _s(n){return n===0&&1/n==-1/0}function o_(n){return typeof n=="number"&&Number.isInteger(n)&&!_s(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zu="";function a_(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=Xc(e)),e=c_(n.get(t),e);return Xc(e)}function c_(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":t+="";break;case zu:t+="";break;default:t+=o}}return t}function Xc(n){return n+zu+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jc(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Nt(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function Hu(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ee{constructor(e,t){this.comparator=e,this.root=t||ge.EMPTY}insert(e,t){return new ee(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ge.BLACK,null,null))}remove(e){return new ee(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ge.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Kr(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Kr(this.root,e,this.comparator,!1)}getReverseIterator(){return new Kr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Kr(this.root,e,this.comparator,!0)}}class Kr{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!e.isEmpty();)if(o=t?r(e.key,t):1,t&&s&&(o*=-1),o<0)e=this.isReverse?e.left:e.right;else{if(o===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ge{constructor(e,t,r,s,o){this.key=e,this.value=t,this.color=r??ge.RED,this.left=s??ge.EMPTY,this.right=o??ge.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,o){return new ge(e??this.key,t??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const o=r(e,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(e,t,r),null):o===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ge.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return ge.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ge.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ge.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw M(43730,{key:this.key,value:this.value});if(this.right.isRed())throw M(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw M(27949);return e+(this.isRed()?0:1)}}ge.EMPTY=null,ge.RED=!0,ge.BLACK=!1;ge.EMPTY=new class{constructor(){this.size=0}get key(){throw M(57766)}get value(){throw M(16141)}get color(){throw M(16727)}get left(){throw M(29726)}get right(){throw M(36894)}copy(e,t,r,s,o){return this}insert(e,t,r){return new ge(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ue{constructor(e){this.comparator=e,this.data=new ee(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Yc(this.data.getIterator())}getIteratorFrom(e){return new Yc(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof ue)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ue(this.comparator);return t.data=e,t}}class Yc{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{constructor(e){this.fields=e,e.sort(_e.comparator)}static empty(){return new xe([])}unionWith(e){let t=new ue(_e.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new xe(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return vn(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Gu("Invalid base64 string: "+o):o}})(e);return new ye(t)}static fromUint8Array(e){const t=(function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o})(e);return new ye(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return z(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ye.EMPTY_BYTE_STRING=new ye("");const l_=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function St(n){if(W(!!n,39018),typeof n=="string"){let e=0;const t=l_.exec(n);if(W(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:ne(n.seconds),nanos:ne(n.nanos)}}function ne(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function Pt(n){return typeof n=="string"?ye.fromBase64String(n):ye.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wu="server_timestamp",Ku="__type__",Qu="__previous_value__",Xu="__local_write_time__";function Ro(n){return(n?.mapValue?.fields||{})[Ku]?.stringValue===Wu}function Us(n){const e=n.mapValue.fields[Qu];return Ro(e)?Us(e):e}function dr(n){const e=St(n.mapValue.fields[Xu].timestampValue);return new Y(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class u_{constructor(e,t,r,s,o,a,l,h,d,m){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=l,this.longPollingOptions=h,this.useFetchStreams=d,this.isUsingEmulator=m}}const ys="(default)";class fr{constructor(e,t){this.projectId=e,this.database=t||ys}static empty(){return new fr("","")}get isDefaultDatabase(){return this.database===ys}isEqual(e){return e instanceof fr&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ju="__type__",h_="__max__",Qr={mapValue:{}},Yu="__vector__",vs="value";function Ct(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?Ro(n)?4:f_(n)?9007199254740991:d_(n)?10:11:M(28295,{value:n})}function Je(n,e){if(n===e)return!0;const t=Ct(n);if(t!==Ct(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return dr(n).isEqual(dr(e));case 3:return(function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=St(s.timestampValue),l=St(o.timestampValue);return a.seconds===l.seconds&&a.nanos===l.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(s,o){return Pt(s.bytesValue).isEqual(Pt(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(s,o){return ne(s.geoPointValue.latitude)===ne(o.geoPointValue.latitude)&&ne(s.geoPointValue.longitude)===ne(o.geoPointValue.longitude)})(n,e);case 2:return(function(s,o){if("integerValue"in s&&"integerValue"in o)return ne(s.integerValue)===ne(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=ne(s.doubleValue),l=ne(o.doubleValue);return a===l?_s(a)===_s(l):isNaN(a)&&isNaN(l)}return!1})(n,e);case 9:return vn(n.arrayValue.values||[],e.arrayValue.values||[],Je);case 10:case 11:return(function(s,o){const a=s.mapValue.fields||{},l=o.mapValue.fields||{};if(Jc(a)!==Jc(l))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(l[h]===void 0||!Je(a[h],l[h])))return!1;return!0})(n,e);default:return M(52216,{left:n})}}function mr(n,e){return(n.values||[]).find((t=>Je(t,e)))!==void 0}function En(n,e){if(n===e)return 0;const t=Ct(n),r=Ct(e);if(t!==r)return z(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return z(n.booleanValue,e.booleanValue);case 2:return(function(o,a){const l=ne(o.integerValue||o.doubleValue),h=ne(a.integerValue||a.doubleValue);return l<h?-1:l>h?1:l===h?0:isNaN(l)?isNaN(h)?0:-1:1})(n,e);case 3:return Zc(n.timestampValue,e.timestampValue);case 4:return Zc(dr(n),dr(e));case 5:return Gi(n.stringValue,e.stringValue);case 6:return(function(o,a){const l=Pt(o),h=Pt(a);return l.compareTo(h)})(n.bytesValue,e.bytesValue);case 7:return(function(o,a){const l=o.split("/"),h=a.split("/");for(let d=0;d<l.length&&d<h.length;d++){const m=z(l[d],h[d]);if(m!==0)return m}return z(l.length,h.length)})(n.referenceValue,e.referenceValue);case 8:return(function(o,a){const l=z(ne(o.latitude),ne(a.latitude));return l!==0?l:z(ne(o.longitude),ne(a.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return el(n.arrayValue,e.arrayValue);case 10:return(function(o,a){const l=o.fields||{},h=a.fields||{},d=l[vs]?.arrayValue,m=h[vs]?.arrayValue,g=z(d?.values?.length||0,m?.values?.length||0);return g!==0?g:el(d,m)})(n.mapValue,e.mapValue);case 11:return(function(o,a){if(o===Qr.mapValue&&a===Qr.mapValue)return 0;if(o===Qr.mapValue)return 1;if(a===Qr.mapValue)return-1;const l=o.fields||{},h=Object.keys(l),d=a.fields||{},m=Object.keys(d);h.sort(),m.sort();for(let g=0;g<h.length&&g<m.length;++g){const v=Gi(h[g],m[g]);if(v!==0)return v;const R=En(l[h[g]],d[m[g]]);if(R!==0)return R}return z(h.length,m.length)})(n.mapValue,e.mapValue);default:throw M(23264,{he:t})}}function Zc(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return z(n,e);const t=St(n),r=St(e),s=z(t.seconds,r.seconds);return s!==0?s:z(t.nanos,r.nanos)}function el(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const o=En(t[s],r[s]);if(o)return o}return z(t.length,r.length)}function Tn(n){return Wi(n)}function Wi(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=St(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return Pt(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return O.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const o of t.values||[])s?s=!1:r+=",",r+=Wi(o);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Wi(t.fields[a])}`;return s+"}"})(n.mapValue):M(61005,{value:n})}function ss(n){switch(Ct(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Us(n);return e?16+ss(e):16;case 5:return 2*n.stringValue.length;case 6:return Pt(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,o)=>s+ss(o)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return Nt(r.fields,((o,a)=>{s+=o.length+ss(a)})),s})(n.mapValue);default:throw M(13486,{value:n})}}function tl(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function Ki(n){return!!n&&"integerValue"in n}function So(n){return!!n&&"arrayValue"in n}function nl(n){return!!n&&"nullValue"in n}function rl(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function is(n){return!!n&&"mapValue"in n}function d_(n){return(n?.mapValue?.fields||{})[Ju]?.stringValue===Yu}function sr(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Nt(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=sr(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=sr(n.arrayValue.values[t]);return e}return{...n}}function f_(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===h_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Se{constructor(e){this.value=e}static empty(){return new Se({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!is(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=sr(t)}setAll(e){let t=_e.emptyPath(),r={},s=[];e.forEach(((a,l)=>{if(!t.isImmediateParentOf(l)){const h=this.getFieldsMap(t);this.applyChanges(h,r,s),r={},s=[],t=l.popLast()}a?r[l.lastSegment()]=sr(a):s.push(l.lastSegment())}));const o=this.getFieldsMap(t);this.applyChanges(o,r,s)}delete(e){const t=this.field(e.popLast());is(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Je(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];is(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Nt(t,((s,o)=>e[s]=o));for(const s of r)delete e[s]}clone(){return new Se(sr(this.value))}}function Zu(n){const e=[];return Nt(n.fields,((t,r)=>{const s=new _e([t]);if(is(r)){const o=Zu(r.mapValue).fields;if(o.length===0)e.push(s);else for(const a of o)e.push(s.child(a))}else e.push(s)})),new xe(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e,t,r,s,o,a,l){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=l}static newInvalidDocument(e){return new me(e,0,L.min(),L.min(),L.min(),Se.empty(),0)}static newFoundDocument(e,t,r,s){return new me(e,1,t,L.min(),r,s,0)}static newNoDocument(e,t){return new me(e,2,t,L.min(),L.min(),Se.empty(),0)}static newUnknownDocument(e,t){return new me(e,3,t,L.min(),L.min(),Se.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Se.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Se.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof me&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new me(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Es{constructor(e,t){this.position=e,this.inclusive=t}}function sl(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const o=e[s],a=n.position[s];if(o.field.isKeyField()?r=O.comparator(O.fromName(a.referenceValue),t.key):r=En(a,t.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function il(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!Je(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ts{constructor(e,t="asc"){this.field=e,this.dir=t}}function m_(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eh{}class ie extends eh{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new g_(e,t,r):t==="array-contains"?new v_(e,r):t==="in"?new E_(e,r):t==="not-in"?new T_(e,r):t==="array-contains-any"?new I_(e,r):new ie(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new __(e,r):new y_(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(En(t,this.value)):t!==null&&Ct(this.value)===Ct(t)&&this.matchesComparison(En(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return M(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Ue extends eh{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new Ue(e,t)}matches(e){return th(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function th(n){return n.op==="and"}function nh(n){return p_(n)&&th(n)}function p_(n){for(const e of n.filters)if(e instanceof Ue)return!1;return!0}function Qi(n){if(n instanceof ie)return n.field.canonicalString()+n.op.toString()+Tn(n.value);if(nh(n))return n.filters.map((e=>Qi(e))).join(",");{const e=n.filters.map((t=>Qi(t))).join(",");return`${n.op}(${e})`}}function rh(n,e){return n instanceof ie?(function(r,s){return s instanceof ie&&r.op===s.op&&r.field.isEqual(s.field)&&Je(r.value,s.value)})(n,e):n instanceof Ue?(function(r,s){return s instanceof Ue&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((o,a,l)=>o&&rh(a,s.filters[l])),!0):!1})(n,e):void M(19439)}function sh(n){return n instanceof ie?(function(t){return`${t.field.canonicalString()} ${t.op} ${Tn(t.value)}`})(n):n instanceof Ue?(function(t){return t.op.toString()+" {"+t.getFilters().map(sh).join(" ,")+"}"})(n):"Filter"}class g_ extends ie{constructor(e,t,r){super(e,t,r),this.key=O.fromName(r.referenceValue)}matches(e){const t=O.comparator(e.key,this.key);return this.matchesComparison(t)}}class __ extends ie{constructor(e,t){super(e,"in",t),this.keys=ih("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class y_ extends ie{constructor(e,t){super(e,"not-in",t),this.keys=ih("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function ih(n,e){return(e.arrayValue?.values||[]).map((t=>O.fromName(t.referenceValue)))}class v_ extends ie{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return So(t)&&mr(t.arrayValue,this.value)}}class E_ extends ie{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&mr(this.value.arrayValue,t)}}class T_ extends ie{constructor(e,t){super(e,"not-in",t)}matches(e){if(mr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!mr(this.value.arrayValue,t)}}class I_ extends ie{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!So(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>mr(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w_{constructor(e,t=null,r=[],s=[],o=null,a=null,l=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=l,this.Te=null}}function ol(n,e=null,t=[],r=[],s=null,o=null,a=null){return new w_(n,e,t,r,s,o,a)}function Po(n){const e=U(n);if(e.Te===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Qi(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(o){return o.field.canonicalString()+o.dir})(r))).join(","),Tr(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>Tn(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>Tn(r))).join(",")),e.Te=t}return e.Te}function Co(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!m_(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!rh(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!il(n.startAt,e.startAt)&&il(n.endAt,e.endAt)}function Xi(n){return O.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e,t=null,r=[],s=[],o=null,a="F",l=null,h=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=l,this.endAt=h,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function b_(n,e,t,r,s,o,a,l){return new Ir(n,e,t,r,s,o,a,l)}function Bs(n){return new Ir(n)}function al(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function oh(n){return n.collectionGroup!==null}function ir(n){const e=U(n);if(e.Ie===null){e.Ie=[];const t=new Set;for(const o of e.explicitOrderBy)e.Ie.push(o),t.add(o.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(a){let l=new ue(_e.comparator);return a.filters.forEach((h=>{h.getFlattenedFilters().forEach((d=>{d.isInequality()&&(l=l.add(d.field))}))})),l})(e).forEach((o=>{t.has(o.canonicalString())||o.isKeyField()||e.Ie.push(new Ts(o,r))})),t.has(_e.keyField().canonicalString())||e.Ie.push(new Ts(_e.keyField(),r))}return e.Ie}function Ke(n){const e=U(n);return e.Ee||(e.Ee=A_(e,ir(n))),e.Ee}function A_(n,e){if(n.limitType==="F")return ol(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const o=s.dir==="desc"?"asc":"desc";return new Ts(s.field,o)}));const t=n.endAt?new Es(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Es(n.startAt.position,n.startAt.inclusive):null;return ol(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Ji(n,e){const t=n.filters.concat([e]);return new Ir(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function Yi(n,e,t){return new Ir(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function js(n,e){return Co(Ke(n),Ke(e))&&n.limitType===e.limitType}function ah(n){return`${Po(Ke(n))}|lt:${n.limitType}`}function on(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>sh(s))).join(", ")}]`),Tr(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>Tn(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>Tn(s))).join(",")),`Target(${r})`})(Ke(n))}; limitType=${n.limitType})`}function qs(n,e){return e.isFoundDocument()&&(function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):O.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)})(n,e)&&(function(r,s){for(const o of ir(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(a,l,h){const d=sl(a,l,h);return a.inclusive?d<=0:d<0})(r.startAt,ir(r),s)||r.endAt&&!(function(a,l,h){const d=sl(a,l,h);return a.inclusive?d>=0:d>0})(r.endAt,ir(r),s))})(n,e)}function R_(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function ch(n){return(e,t)=>{let r=!1;for(const s of ir(n)){const o=S_(s,e,t);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function S_(n,e,t){const r=n.field.isKeyField()?O.comparator(e.key,t.key):(function(o,a,l){const h=a.data.field(o),d=l.data.field(o);return h!==null&&d!==null?En(h,d):M(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return M(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,e))return o}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],e))return void(s[o]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Nt(this.inner,((t,r)=>{for(const[s,o]of r)e(s,o)}))}isEmpty(){return Hu(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const P_=new ee(O.comparator);function it(){return P_}const lh=new ee(O.comparator);function er(...n){let e=lh;for(const t of n)e=e.insert(t.key,t);return e}function uh(n){let e=lh;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function jt(){return or()}function hh(){return or()}function or(){return new Xt((n=>n.toString()),((n,e)=>n.isEqual(e)))}const C_=new ee(O.comparator),V_=new ue(O.comparator);function H(...n){let e=V_;for(const t of n)e=e.add(t);return e}const k_=new ue(z);function N_(){return k_}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vo(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:_s(e)?"-0":e}}function dh(n){return{integerValue:""+n}}function D_(n,e){return o_(e)?dh(e):Vo(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $s{constructor(){this._=void 0}}function x_(n,e,t){return n instanceof Is?(function(s,o){const a={fields:{[Ku]:{stringValue:Wu},[Xu]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&Ro(o)&&(o=Us(o)),o&&(a.fields[Qu]=o),{mapValue:a}})(t,e):n instanceof In?mh(n,e):n instanceof wn?ph(n,e):(function(s,o){const a=fh(s,o),l=cl(a)+cl(s.Ae);return Ki(a)&&Ki(s.Ae)?dh(l):Vo(s.serializer,l)})(n,e)}function O_(n,e,t){return n instanceof In?mh(n,e):n instanceof wn?ph(n,e):t}function fh(n,e){return n instanceof ws?(function(r){return Ki(r)||(function(o){return!!o&&"doubleValue"in o})(r)})(e)?e:{integerValue:0}:null}class Is extends $s{}class In extends $s{constructor(e){super(),this.elements=e}}function mh(n,e){const t=gh(e);for(const r of n.elements)t.some((s=>Je(s,r)))||t.push(r);return{arrayValue:{values:t}}}class wn extends $s{constructor(e){super(),this.elements=e}}function ph(n,e){let t=gh(e);for(const r of n.elements)t=t.filter((s=>!Je(s,r)));return{arrayValue:{values:t}}}class ws extends $s{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function cl(n){return ne(n.integerValue||n.doubleValue)}function gh(n){return So(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(e,t){this.field=e,this.transform=t}}function M_(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof In&&s instanceof In||r instanceof wn&&s instanceof wn?vn(r.elements,s.elements,Je):r instanceof ws&&s instanceof ws?Je(r.Ae,s.Ae):r instanceof Is&&s instanceof Is})(n.transform,e.transform)}class L_{constructor(e,t){this.version=e,this.transformResults=t}}class oe{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new oe}static exists(e){return new oe(void 0,e)}static updateTime(e){return new oe(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function os(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class zs{}function yh(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new br(n.key,oe.none()):new wr(n.key,n.data,oe.none());{const t=n.data,r=Se.empty();let s=new ue(_e.comparator);for(let o of e.fields)if(!s.has(o)){let a=t.field(o);a===null&&o.length>1&&(o=o.popLast(),a=t.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new Dt(n.key,r,new xe(s.toArray()),oe.none())}}function F_(n,e,t){n instanceof wr?(function(s,o,a){const l=s.value.clone(),h=ul(s.fieldTransforms,o,a.transformResults);l.setAll(h),o.convertToFoundDocument(a.version,l).setHasCommittedMutations()})(n,e,t):n instanceof Dt?(function(s,o,a){if(!os(s.precondition,o))return void o.convertToUnknownDocument(a.version);const l=ul(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(vh(s)),h.setAll(l),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()})(n,e,t):(function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()})(0,e,t)}function ar(n,e,t,r){return n instanceof wr?(function(o,a,l,h){if(!os(o.precondition,a))return l;const d=o.value.clone(),m=hl(o.fieldTransforms,h,a);return d.setAll(m),a.convertToFoundDocument(a.version,d).setHasLocalMutations(),null})(n,e,t,r):n instanceof Dt?(function(o,a,l,h){if(!os(o.precondition,a))return l;const d=hl(o.fieldTransforms,h,a),m=a.data;return m.setAll(vh(o)),m.setAll(d),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),l===null?null:l.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((g=>g.field)))})(n,e,t,r):(function(o,a,l){return os(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):l})(n,e,t)}function U_(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),o=fh(r.transform,s||null);o!=null&&(t===null&&(t=Se.empty()),t.set(r.field,o))}return t||null}function ll(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&vn(r,s,((o,a)=>M_(o,a)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class wr extends zs{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class Dt extends zs{constructor(e,t,r,s,o=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function vh(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function ul(n,e,t){const r=new Map;W(n.length===t.length,32656,{Re:t.length,Ve:n.length});for(let s=0;s<t.length;s++){const o=n[s],a=o.transform,l=e.data.field(o.field);r.set(o.field,O_(a,l,t[s]))}return r}function hl(n,e,t){const r=new Map;for(const s of n){const o=s.transform,a=t.data.field(s.field);r.set(s.field,x_(o,a,e))}return r}class br extends zs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Eh extends zs{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class B_{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(e.key)&&F_(o,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=ar(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=ar(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=hh();return this.mutations.forEach((s=>{const o=e.get(s.key),a=o.overlayedDocument;let l=this.applyToLocalView(a,o.mutatedFields);l=t.has(s.key)?null:l;const h=yh(a,l);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(L.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),H())}isEqual(e){return this.batchId===e.batchId&&vn(this.mutations,e.mutations,((t,r)=>ll(t,r)))&&vn(this.baseMutations,e.baseMutations,((t,r)=>ll(t,r)))}}class ko{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){W(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let s=(function(){return C_})();const o=e.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new ko(e,t,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j_{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q_{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var se,G;function Th(n){switch(n){case S.OK:return M(64938);case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0;default:return M(15467,{code:n})}}function Ih(n){if(n===void 0)return st("GRPC error has no .code"),S.UNKNOWN;switch(n){case se.OK:return S.OK;case se.CANCELLED:return S.CANCELLED;case se.UNKNOWN:return S.UNKNOWN;case se.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case se.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case se.INTERNAL:return S.INTERNAL;case se.UNAVAILABLE:return S.UNAVAILABLE;case se.UNAUTHENTICATED:return S.UNAUTHENTICATED;case se.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case se.NOT_FOUND:return S.NOT_FOUND;case se.ALREADY_EXISTS:return S.ALREADY_EXISTS;case se.PERMISSION_DENIED:return S.PERMISSION_DENIED;case se.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case se.ABORTED:return S.ABORTED;case se.OUT_OF_RANGE:return S.OUT_OF_RANGE;case se.UNIMPLEMENTED:return S.UNIMPLEMENTED;case se.DATA_LOSS:return S.DATA_LOSS;default:return M(39323,{code:n})}}(G=se||(se={}))[G.OK=0]="OK",G[G.CANCELLED=1]="CANCELLED",G[G.UNKNOWN=2]="UNKNOWN",G[G.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",G[G.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",G[G.NOT_FOUND=5]="NOT_FOUND",G[G.ALREADY_EXISTS=6]="ALREADY_EXISTS",G[G.PERMISSION_DENIED=7]="PERMISSION_DENIED",G[G.UNAUTHENTICATED=16]="UNAUTHENTICATED",G[G.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",G[G.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",G[G.ABORTED=10]="ABORTED",G[G.OUT_OF_RANGE=11]="OUT_OF_RANGE",G[G.UNIMPLEMENTED=12]="UNIMPLEMENTED",G[G.INTERNAL=13]="INTERNAL",G[G.UNAVAILABLE=14]="UNAVAILABLE",G[G.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $_(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z_=new wt([4294967295,4294967295],0);function dl(n){const e=$_().encode(n),t=new xu;return t.update(e),new Uint8Array(t.digest())}function fl(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),o=e.getUint32(12,!0);return[new wt([t,r],0),new wt([s,o],0)]}class No{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new tr(`Invalid padding: ${t}`);if(r<0)throw new tr(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new tr(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new tr(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=wt.fromNumber(this.ge)}ye(e,t,r){let s=e.add(t.multiply(wt.fromNumber(r)));return s.compare(z_)===1&&(s=new wt([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const t=dl(e),[r,s]=fl(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,o=new Uint8Array(Math.ceil(e/8)),a=new No(o,s,t);return r.forEach((l=>a.insert(l))),a}insert(e){if(this.ge===0)return;const t=dl(e),[r,s]=fl(t);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class tr extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hs{constructor(e,t,r,s,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,Ar.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Hs(L.min(),s,new ee(z),it(),H())}}class Ar{constructor(e,t,r,s,o){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new Ar(r,t,H(),H(),H())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class as{constructor(e,t,r,s){this.be=e,this.removedTargetIds=t,this.key=r,this.De=s}}class wh{constructor(e,t){this.targetId=e,this.Ce=t}}class bh{constructor(e,t,r=ye.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class ml{constructor(){this.ve=0,this.Fe=pl(),this.Me=ye.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=H(),t=H(),r=H();return this.Fe.forEach(((s,o)=>{switch(o){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:M(38017,{changeType:o})}})),new Ar(this.Me,this.xe,e,t,r)}qe(){this.Oe=!1,this.Fe=pl()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,W(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class H_{constructor(e){this.Ge=e,this.ze=new Map,this.je=it(),this.Je=Xr(),this.He=Xr(),this.Ye=new ee(z)}Ze(e){for(const t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(const t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,(t=>{const r=this.nt(t);switch(e.state){case 0:this.rt(t)&&r.Le(e.resumeToken);break;case 1:r.Ke(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.Ke(),r.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(r.We(),r.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),r.Le(e.resumeToken));break;default:M(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach(((r,s)=>{this.rt(s)&&t(s)}))}st(e){const t=e.targetId,r=e.Ce.count,s=this.ot(t);if(s){const o=s.target;if(Xi(o))if(r===0){const a=new O(o.path);this.et(t,a,me.newNoDocument(a,L.min()))}else W(r===1,20013,{expectedCount:r});else{const a=this._t(t);if(a!==r){const l=this.ut(e),h=l?this.ct(l,e,a):1;if(h!==0){this.it(t);const d=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ye=this.Ye.insert(t,d)}}}}}ut(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=t;let a,l;try{a=Pt(r).toUint8Array()}catch(h){if(h instanceof Gu)return yn("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{l=new No(a,s,o)}catch(h){return yn(h instanceof tr?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return l.ge===0?null:l}ct(e,t,r){return t.Ce.count===r-this.Pt(e,t.targetId)?0:2}Pt(e,t){const r=this.Ge.getRemoteKeysForTarget(t);let s=0;return r.forEach((o=>{const a=this.Ge.ht(),l=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;e.mightContain(l)||(this.et(t,o,null),s++)})),s}Tt(e){const t=new Map;this.ze.forEach(((o,a)=>{const l=this.ot(a);if(l){if(o.current&&Xi(l.target)){const h=new O(l.target.path);this.It(h).has(a)||this.Et(a,h)||this.et(a,h,me.newNoDocument(h,e))}o.Be&&(t.set(a,o.ke()),o.qe())}}));let r=H();this.He.forEach(((o,a)=>{let l=!0;a.forEachWhile((h=>{const d=this.ot(h);return!d||d.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)})),l&&(r=r.add(o))})),this.je.forEach(((o,a)=>a.setReadTime(e)));const s=new Hs(e,t,this.Ye,this.je,r);return this.je=it(),this.Je=Xr(),this.He=Xr(),this.Ye=new ee(z),s}Xe(e,t){if(!this.rt(e))return;const r=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,r),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,r){if(!this.rt(e))return;const s=this.nt(e);this.Et(e,t)?s.Qe(t,1):s.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),r&&(this.je=this.je.insert(t,r))}removeTarget(e){this.ze.delete(e)}_t(e){const t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new ml,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new ue(z),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new ue(z),this.Je=this.Je.insert(e,t)),t}rt(e){const t=this.ot(e)!==null;return t||x("WatchChangeAggregator","Detected inactive target",e),t}ot(e){const t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new ml),this.Ge.getRemoteKeysForTarget(e).forEach((t=>{this.et(e,t,null)}))}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function Xr(){return new ee(O.comparator)}function pl(){return new ee(O.comparator)}const G_={asc:"ASCENDING",desc:"DESCENDING"},W_={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},K_={and:"AND",or:"OR"};class Q_{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Zi(n,e){return n.useProto3Json||Tr(e)?e:{value:e}}function bs(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Ah(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function X_(n,e){return bs(n,e.toTimestamp())}function Oe(n){return W(!!n,49232),L.fromTimestamp((function(t){const r=St(t);return new Y(r.seconds,r.nanos)})(n))}function Do(n,e){return eo(n,e).canonicalString()}function eo(n,e){const t=(function(s){return new Q(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Rh(n){const e=Q.fromString(n);return W(Nh(e),10190,{key:e.toString()}),e}function As(n,e){return Do(n.databaseId,e.path)}function cr(n,e){const t=Rh(e);if(t.get(1)!==n.databaseId.projectId)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new N(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new O(Ph(t))}function Sh(n,e){return Do(n.databaseId,e)}function J_(n){const e=Rh(n);return e.length===4?Q.emptyPath():Ph(e)}function to(n){return new Q(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Ph(n){return W(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function gl(n,e,t){return{name:As(n,e),fields:t.value.mapValue.fields}}function Y_(n,e){return"found"in e?(function(r,s){W(!!s.found,43571),s.found.name,s.found.updateTime;const o=cr(r,s.found.name),a=Oe(s.found.updateTime),l=s.found.createTime?Oe(s.found.createTime):L.min(),h=new Se({mapValue:{fields:s.found.fields}});return me.newFoundDocument(o,a,l,h)})(n,e):"missing"in e?(function(r,s){W(!!s.missing,3894),W(!!s.readTime,22933);const o=cr(r,s.missing),a=Oe(s.readTime);return me.newNoDocument(o,a)})(n,e):M(7234,{result:e})}function Z_(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(d){return d==="NO_CHANGE"?0:d==="ADD"?1:d==="REMOVE"?2:d==="CURRENT"?3:d==="RESET"?4:M(39313,{state:d})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],o=(function(d,m){return d.useProto3Json?(W(m===void 0||typeof m=="string",58123),ye.fromBase64String(m||"")):(W(m===void 0||m instanceof Buffer||m instanceof Uint8Array,16193),ye.fromUint8Array(m||new Uint8Array))})(n,e.targetChange.resumeToken),a=e.targetChange.cause,l=a&&(function(d){const m=d.code===void 0?S.UNKNOWN:Ih(d.code);return new N(m,d.message||"")})(a);t=new bh(r,s,o,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=cr(n,r.document.name),o=Oe(r.document.updateTime),a=r.document.createTime?Oe(r.document.createTime):L.min(),l=new Se({mapValue:{fields:r.document.fields}}),h=me.newFoundDocument(s,o,a,l),d=r.targetIds||[],m=r.removedTargetIds||[];t=new as(d,m,h.key,h)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=cr(n,r.document),o=r.readTime?Oe(r.readTime):L.min(),a=me.newNoDocument(s,o),l=r.removedTargetIds||[];t=new as([],l,a.key,a)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=cr(n,r.document),o=r.removedTargetIds||[];t=new as([],o,s,null)}else{if(!("filter"in e))return M(11601,{Rt:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new q_(s,o),l=r.targetId;t=new wh(l,a)}}return t}function Ch(n,e){let t;if(e instanceof wr)t={update:gl(n,e.key,e.value)};else if(e instanceof br)t={delete:As(n,e.key)};else if(e instanceof Dt)t={update:gl(n,e.key,e.data),updateMask:cy(e.fieldMask)};else{if(!(e instanceof Eh))return M(16599,{Vt:e.type});t={verify:As(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(o,a){const l=a.transform;if(l instanceof Is)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof In)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof wn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof ws)return{fieldPath:a.field.canonicalString(),increment:l.Ae};throw M(20930,{transform:a.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,o){return o.updateTime!==void 0?{updateTime:X_(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:M(27497)})(n,e.precondition)),t}function ey(n,e){return n&&n.length>0?(W(e!==void 0,14353),n.map((t=>(function(s,o){let a=s.updateTime?Oe(s.updateTime):Oe(o);return a.isEqual(L.min())&&(a=Oe(o)),new L_(a,s.transformResults||[])})(t,e)))):[]}function ty(n,e){return{documents:[Sh(n,e.path)]}}function ny(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Sh(n,s);const o=(function(d){if(d.length!==0)return kh(Ue.create(d,"and"))})(e.filters);o&&(t.structuredQuery.where=o);const a=(function(d){if(d.length!==0)return d.map((m=>(function(v){return{field:an(v.field),direction:iy(v.dir)}})(m)))})(e.orderBy);a&&(t.structuredQuery.orderBy=a);const l=Zi(n,e.limit);return l!==null&&(t.structuredQuery.limit=l),e.startAt&&(t.structuredQuery.startAt=(function(d){return{before:d.inclusive,values:d.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(d){return{before:!d.inclusive,values:d.position}})(e.endAt)),{ft:t,parent:s}}function ry(n){let e=J_(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){W(r===1,65062);const m=t.from[0];m.allDescendants?s=m.collectionId:e=e.child(m.collectionId)}let o=[];t.where&&(o=(function(g){const v=Vh(g);return v instanceof Ue&&nh(v)?v.getFilters():[v]})(t.where));let a=[];t.orderBy&&(a=(function(g){return g.map((v=>(function(V){return new Ts(cn(V.field),(function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(V.direction))})(v)))})(t.orderBy));let l=null;t.limit&&(l=(function(g){let v;return v=typeof g=="object"?g.value:g,Tr(v)?null:v})(t.limit));let h=null;t.startAt&&(h=(function(g){const v=!!g.before,R=g.values||[];return new Es(R,v)})(t.startAt));let d=null;return t.endAt&&(d=(function(g){const v=!g.before,R=g.values||[];return new Es(R,v)})(t.endAt)),b_(e,s,a,o,l,"F",h,d)}function sy(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return M(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function Vh(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=cn(t.unaryFilter.field);return ie.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=cn(t.unaryFilter.field);return ie.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=cn(t.unaryFilter.field);return ie.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=cn(t.unaryFilter.field);return ie.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return M(61313);default:return M(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ie.create(cn(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return M(58110);default:return M(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return Ue.create(t.compositeFilter.filters.map((r=>Vh(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return M(1026)}})(t.compositeFilter.op))})(n):M(30097,{filter:n})}function iy(n){return G_[n]}function oy(n){return W_[n]}function ay(n){return K_[n]}function an(n){return{fieldPath:n.canonicalString()}}function cn(n){return _e.fromServerFormat(n.fieldPath)}function kh(n){return n instanceof ie?(function(t){if(t.op==="=="){if(rl(t.value))return{unaryFilter:{field:an(t.field),op:"IS_NAN"}};if(nl(t.value))return{unaryFilter:{field:an(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(rl(t.value))return{unaryFilter:{field:an(t.field),op:"IS_NOT_NAN"}};if(nl(t.value))return{unaryFilter:{field:an(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:an(t.field),op:oy(t.op),value:t.value}}})(n):n instanceof Ue?(function(t){const r=t.getFilters().map((s=>kh(s)));return r.length===1?r[0]:{compositeFilter:{op:ay(t.op),filters:r}}})(n):M(54877,{filter:n})}function cy(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function Nh(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,t,r,s,o=L.min(),a=L.min(),l=ye.EMPTY_BYTE_STRING,h=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=l,this.expectedCount=h}withSequenceNumber(e){return new yt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new yt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new yt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new yt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(e){this.yt=e}}function uy(n){const e=ry({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Yi(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hy{constructor(){this.Cn=new dy}addToCollectionParentIndex(e,t){return this.Cn.add(t),P.resolve()}getCollectionParents(e,t){return P.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return P.resolve()}deleteFieldIndex(e,t){return P.resolve()}deleteAllFieldIndexes(e){return P.resolve()}createTargetIndexes(e,t){return P.resolve()}getDocumentsMatchingTarget(e,t){return P.resolve(null)}getIndexType(e,t){return P.resolve(0)}getFieldIndexes(e,t){return P.resolve([])}getNextCollectionGroupToUpdate(e){return P.resolve(null)}getMinOffset(e,t){return P.resolve(Rt.min())}getMinOffsetFromCollectionGroup(e,t){return P.resolve(Rt.min())}updateCollectionGroup(e,t,r){return P.resolve()}updateIndexEntries(e,t){return P.resolve()}}class dy{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ue(Q.comparator),o=!s.has(r);return this.index[t]=s.add(r),o}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ue(Q.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _l={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Dh=41943040;class Ve{static withCacheSize(e){return new Ve(e,Ve.DEFAULT_COLLECTION_PERCENTILE,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Ve.DEFAULT_COLLECTION_PERCENTILE=10,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Ve.DEFAULT=new Ve(Dh,Ve.DEFAULT_COLLECTION_PERCENTILE,Ve.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Ve.DISABLED=new Ve(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new bn(0)}static cr(){return new bn(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yl="LruGarbageCollector",fy=1048576;function vl([n,e],[t,r]){const s=z(n,t);return s===0?z(e,r):s}class my{constructor(e){this.Ir=e,this.buffer=new ue(vl),this.Er=0}dr(){return++this.Er}Ar(e){const t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();vl(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class py{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Vr(e){x(yl,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Nn(t)?x(yl,"Ignoring IndexedDB error during garbage collection: ",t):await kn(t)}await this.Vr(3e5)}))}}class gy{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return P.resolve(Fs.ce);const r=new my(t);return this.mr.forEachTarget(e,(s=>r.Ar(s.sequenceNumber))).next((()=>this.mr.pr(e,(s=>r.Ar(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.mr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(x("LruGarbageCollector","Garbage collection skipped; disabled"),P.resolve(_l)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(x("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),_l):this.yr(e,t)))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let r,s,o,a,l,h,d;const m=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((g=>(g>this.params.maximumSequenceNumbersToCollect?(x("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${g}`),s=this.params.maximumSequenceNumbersToCollect):s=g,a=Date.now(),this.nthSequenceNumber(e,s)))).next((g=>(r=g,l=Date.now(),this.removeTargets(e,r,t)))).next((g=>(o=g,h=Date.now(),this.removeOrphanedDocuments(e,r)))).next((g=>(d=Date.now(),sn()<=$.DEBUG&&x("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${s} in `+(l-a)+`ms
	Removed ${o} targets in `+(h-l)+`ms
	Removed ${g} documents in `+(d-h)+`ms
Total Duration: ${d-m}ms`),P.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:g}))))}}function _y(n,e){return new gy(n,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yy{constructor(){this.changes=new Xt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,me.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?P.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vy{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ey{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&ar(r.mutation,s,xe.empty(),Y.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,H()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=H()){const s=jt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((o=>{let a=er();return o.forEach(((l,h)=>{a=a.insert(l,h.overlayedDocument)})),a}))))}getOverlayedDocuments(e,t){const r=jt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,H())))}populateOverlays(e,t,r){const s=[];return r.forEach((o=>{t.has(o)||s.push(o)})),this.documentOverlayCache.getOverlays(e,s).next((o=>{o.forEach(((a,l)=>{t.set(a,l)}))}))}computeViews(e,t,r,s){let o=it();const a=or(),l=(function(){return or()})();return t.forEach(((h,d)=>{const m=r.get(d.key);s.has(d.key)&&(m===void 0||m.mutation instanceof Dt)?o=o.insert(d.key,d):m!==void 0?(a.set(d.key,m.mutation.getFieldMask()),ar(m.mutation,d,m.mutation.getFieldMask(),Y.now())):a.set(d.key,xe.empty())})),this.recalculateAndSaveOverlays(e,o).next((h=>(h.forEach(((d,m)=>a.set(d,m))),t.forEach(((d,m)=>l.set(d,new vy(m,a.get(d)??null)))),l)))}recalculateAndSaveOverlays(e,t){const r=or();let s=new ee(((a,l)=>a-l)),o=H();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((a=>{for(const l of a)l.keys().forEach((h=>{const d=t.get(h);if(d===null)return;let m=r.get(h)||xe.empty();m=l.applyToLocalView(d,m),r.set(h,m);const g=(s.get(l.batchId)||H()).add(h);s=s.insert(l.batchId,g)}))})).next((()=>{const a=[],l=s.getReverseIterator();for(;l.hasNext();){const h=l.getNext(),d=h.key,m=h.value,g=hh();m.forEach((v=>{if(!o.has(v)){const R=yh(t.get(v),r.get(v));R!==null&&g.set(v,R),o=o.add(v)}})),a.push(this.documentOverlayCache.saveOverlays(e,d,g))}return P.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return(function(a){return O.isDocumentKey(a.path)&&a.collectionGroup===null&&a.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):oh(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-o.size):P.resolve(jt());let l=hr,h=o;return a.next((d=>P.forEach(d,((m,g)=>(l<g.largestBatchId&&(l=g.largestBatchId),o.get(m)?P.resolve():this.remoteDocumentCache.getEntry(e,m).next((v=>{h=h.insert(m,v)}))))).next((()=>this.populateOverlays(e,d,o))).next((()=>this.computeViews(e,h,d,H()))).next((m=>({batchId:l,changes:uh(m)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new O(t)).next((r=>{let s=er();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const o=t.collectionGroup;let a=er();return this.indexManager.getCollectionParents(e,o).next((l=>P.forEach(l,(h=>{const d=(function(g,v){return new Ir(v,null,g.explicitOrderBy.slice(),g.filters.slice(),g.limit,g.limitType,g.startAt,g.endAt)})(t,h.child(o));return this.getDocumentsMatchingCollectionQuery(e,d,r,s).next((m=>{m.forEach(((g,v)=>{a=a.insert(g,v)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,o,s)))).next((a=>{o.forEach(((h,d)=>{const m=d.getKey();a.get(m)===null&&(a=a.insert(m,me.newInvalidDocument(m)))}));let l=er();return a.forEach(((h,d)=>{const m=o.get(h);m!==void 0&&ar(m.mutation,d,xe.empty(),Y.now()),qs(t,d)&&(l=l.insert(h,d))})),l}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ty{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return P.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:Oe(s.createTime)}})(t)),P.resolve()}getNamedQuery(e,t){return P.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,(function(s){return{name:s.name,query:uy(s.bundledQuery),readTime:Oe(s.readTime)}})(t)),P.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iy{constructor(){this.overlays=new ee(O.comparator),this.qr=new Map}getOverlay(e,t){return P.resolve(this.overlays.get(t))}getOverlays(e,t){const r=jt();return P.forEach(t,(s=>this.getOverlay(e,s).next((o=>{o!==null&&r.set(s,o)})))).next((()=>r))}saveOverlays(e,t,r){return r.forEach(((s,o)=>{this.St(e,t,o)})),P.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.qr.get(r);return s!==void 0&&(s.forEach((o=>this.overlays=this.overlays.remove(o))),this.qr.delete(r)),P.resolve()}getOverlaysForCollection(e,t,r){const s=jt(),o=t.length+1,a=new O(t.child("")),l=this.overlays.getIteratorFrom(a);for(;l.hasNext();){const h=l.getNext().value,d=h.getKey();if(!t.isPrefixOf(d.path))break;d.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return P.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let o=new ee(((d,m)=>d-m));const a=this.overlays.getIterator();for(;a.hasNext();){const d=a.getNext().value;if(d.getKey().getCollectionGroup()===t&&d.largestBatchId>r){let m=o.get(d.largestBatchId);m===null&&(m=jt(),o=o.insert(d.largestBatchId,m)),m.set(d.getKey(),d)}}const l=jt(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach(((d,m)=>l.set(d,m))),!(l.size()>=s)););return P.resolve(l)}St(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.qr.get(s.largestBatchId).delete(r.key);this.qr.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new j_(t,r));let o=this.qr.get(t);o===void 0&&(o=H(),this.qr.set(t,o)),this.qr.set(t,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wy{constructor(){this.sessionToken=ye.EMPTY_BYTE_STRING}getSessionToken(e){return P.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,P.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xo{constructor(){this.Qr=new ue(fe.$r),this.Ur=new ue(fe.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){const r=new fe(e,t);this.Qr=this.Qr.add(r),this.Ur=this.Ur.add(r)}Wr(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Gr(new fe(e,t))}zr(e,t){e.forEach((r=>this.removeReference(r,t)))}jr(e){const t=new O(new Q([])),r=new fe(t,e),s=new fe(t,e+1),o=[];return this.Ur.forEachInRange([r,s],(a=>{this.Gr(a),o.push(a.key)})),o}Jr(){this.Qr.forEach((e=>this.Gr(e)))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){const t=new O(new Q([])),r=new fe(t,e),s=new fe(t,e+1);let o=H();return this.Ur.forEachInRange([r,s],(a=>{o=o.add(a.key)})),o}containsKey(e){const t=new fe(e,0),r=this.Qr.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class fe{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return O.comparator(e.key,t.key)||z(e.Yr,t.Yr)}static Kr(e,t){return z(e.Yr,t.Yr)||O.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class by{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new ue(fe.$r)}checkEmpty(e){return P.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const o=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new B_(o,t,r,s);this.mutationQueue.push(a);for(const l of s)this.Zr=this.Zr.add(new fe(l.key,o)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return P.resolve(a)}lookupMutationBatch(e,t){return P.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.ei(r),o=s<0?0:s;return P.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return P.resolve(this.mutationQueue.length===0?Ao:this.tr-1)}getAllMutationBatches(e){return P.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new fe(t,0),s=new fe(t,Number.POSITIVE_INFINITY),o=[];return this.Zr.forEachInRange([r,s],(a=>{const l=this.Xr(a.Yr);o.push(l)})),P.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ue(z);return t.forEach((s=>{const o=new fe(s,0),a=new fe(s,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([o,a],(l=>{r=r.add(l.Yr)}))})),P.resolve(this.ti(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let o=r;O.isDocumentKey(o)||(o=o.child(""));const a=new fe(new O(o),0);let l=new ue(z);return this.Zr.forEachWhile((h=>{const d=h.key.path;return!!r.isPrefixOf(d)&&(d.length===s&&(l=l.add(h.Yr)),!0)}),a),P.resolve(this.ti(l))}ti(e){const t=[];return e.forEach((r=>{const s=this.Xr(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){W(this.ni(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Zr;return P.forEach(t.mutations,(s=>{const o=new fe(s.key,t.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.Zr=r}))}ir(e){}containsKey(e,t){const r=new fe(t,0),s=this.Zr.firstAfterOrEqual(r);return P.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,P.resolve()}ni(e,t){return this.ei(e)}ei(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Xr(e){const t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ay{constructor(e){this.ri=e,this.docs=(function(){return new ee(O.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),o=s?s.size:0,a=this.ri(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return P.resolve(r?r.document.mutableCopy():me.newInvalidDocument(t))}getEntries(e,t){let r=it();return t.forEach((s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():me.newInvalidDocument(s))})),P.resolve(r)}getDocumentsMatchingQuery(e,t,r,s){let o=it();const a=t.path,l=new O(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(l);for(;h.hasNext();){const{key:d,value:{document:m}}=h.getNext();if(!a.isPrefixOf(d.path))break;d.path.length>a.length+1||n_(t_(m),r)<=0||(s.has(m.key)||qs(t,m))&&(o=o.insert(m.key,m.mutableCopy()))}return P.resolve(o)}getAllFromCollectionGroup(e,t,r,s){M(9500)}ii(e,t){return P.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Ry(this)}getSize(e){return P.resolve(this.size)}}class Ry extends yy{constructor(e){super(),this.Nr=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.Nr.addEntry(e,s)):this.Nr.removeEntry(r)})),P.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sy{constructor(e){this.persistence=e,this.si=new Xt((t=>Po(t)),Co),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.oi=0,this._i=new xo,this.targetCount=0,this.ai=bn.ur()}forEachTarget(e,t){return this.si.forEach(((r,s)=>t(s))),P.resolve()}getLastRemoteSnapshotVersion(e){return P.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return P.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),P.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.oi&&(this.oi=t),P.resolve()}Pr(e){this.si.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ai=new bn(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,P.resolve()}updateTargetData(e,t){return this.Pr(t),P.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,P.resolve()}removeTargets(e,t,r){let s=0;const o=[];return this.si.forEach(((a,l)=>{l.sequenceNumber<=t&&r.get(l.targetId)===null&&(this.si.delete(a),o.push(this.removeMatchingKeysForTargetId(e,l.targetId)),s++)})),P.waitFor(o).next((()=>s))}getTargetCount(e){return P.resolve(this.targetCount)}getTargetData(e,t){const r=this.si.get(t)||null;return P.resolve(r)}addMatchingKeys(e,t,r){return this._i.Wr(t,r),P.resolve()}removeMatchingKeys(e,t,r){this._i.zr(t,r);const s=this.persistence.referenceDelegate,o=[];return s&&t.forEach((a=>{o.push(s.markPotentiallyOrphaned(e,a))})),P.waitFor(o)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),P.resolve()}getMatchingKeysForTargetId(e,t){const r=this._i.Hr(t);return P.resolve(r)}containsKey(e,t){return P.resolve(this._i.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xh{constructor(e,t){this.ui={},this.overlays={},this.ci=new Fs(0),this.li=!1,this.li=!0,this.hi=new wy,this.referenceDelegate=e(this),this.Pi=new Sy(this),this.indexManager=new hy,this.remoteDocumentCache=(function(s){return new Ay(s)})((r=>this.referenceDelegate.Ti(r))),this.serializer=new ly(t),this.Ii=new Ty(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Iy,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.ui[e.toKey()];return r||(r=new by(t,this.referenceDelegate),this.ui[e.toKey()]=r),r}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,r){x("MemoryPersistence","Starting transaction:",e);const s=new Py(this.ci.next());return this.referenceDelegate.Ei(),r(s).next((o=>this.referenceDelegate.di(s).next((()=>o)))).toPromise().then((o=>(s.raiseOnCommittedEvent(),o)))}Ai(e,t){return P.or(Object.values(this.ui).map((r=>()=>r.containsKey(e,t))))}}class Py extends s_{constructor(e){super(),this.currentSequenceNumber=e}}class Oo{constructor(e){this.persistence=e,this.Ri=new xo,this.Vi=null}static mi(e){return new Oo(e)}get fi(){if(this.Vi)return this.Vi;throw M(60996)}addReference(e,t,r){return this.Ri.addReference(r,t),this.fi.delete(r.toString()),P.resolve()}removeReference(e,t,r){return this.Ri.removeReference(r,t),this.fi.add(r.toString()),P.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),P.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach((s=>this.fi.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((o=>this.fi.add(o.toString())))})).next((()=>r.removeTargetData(e,t)))}Ei(){this.Vi=new Set}di(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return P.forEach(this.fi,(r=>{const s=O.fromPath(r);return this.gi(e,s).next((o=>{o||t.removeEntry(s,L.min())}))})).next((()=>(this.Vi=null,t.apply(e))))}updateLimboDocument(e,t){return this.gi(e,t).next((r=>{r?this.fi.delete(t.toString()):this.fi.add(t.toString())}))}Ti(e){return 0}gi(e,t){return P.or([()=>P.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class Rs{constructor(e,t){this.persistence=e,this.pi=new Xt((r=>a_(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=_y(this,t)}static mi(e,t){return new Rs(e,t)}Ei(){}di(e){return P.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){const t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}wr(e){let t=0;return this.pr(e,(r=>{t++})).next((()=>t))}pr(e,t){return P.forEach(this.pi,((r,s)=>this.br(e,r,s).next((o=>o?P.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ii(e,(a=>this.br(e,a,t).next((l=>{l||(r++,o.removeEntry(a,L.min()))})))).next((()=>o.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),P.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.pi.set(r,e.currentSequenceNumber),P.resolve()}removeReference(e,t,r){return this.pi.set(r,e.currentSequenceNumber),P.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),P.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=ss(e.data.value)),t}br(e,t,r){return P.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.pi.get(t);return P.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Es=r,this.ds=s}static As(e,t){let r=H(),s=H();for(const o of t.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Mo(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cy{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vy{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(function(){return wf()?8:i_(we())>0?6:4})()}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,r,s){const o={result:null};return this.ys(e,t).next((a=>{o.result=a})).next((()=>{if(!o.result)return this.ws(e,t,s,r).next((a=>{o.result=a}))})).next((()=>{if(o.result)return;const a=new Cy;return this.Ss(e,t,a).next((l=>{if(o.result=l,this.Vs)return this.bs(e,t,a,l.size)}))})).next((()=>o.result))}bs(e,t,r,s){return r.documentReadCount<this.fs?(sn()<=$.DEBUG&&x("QueryEngine","SDK will not create cache indexes for query:",on(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),P.resolve()):(sn()<=$.DEBUG&&x("QueryEngine","Query:",on(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.gs*s?(sn()<=$.DEBUG&&x("QueryEngine","The SDK decides to create cache indexes for query:",on(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ke(t))):P.resolve())}ys(e,t){if(al(t))return P.resolve(null);let r=Ke(t);return this.indexManager.getIndexType(e,r).next((s=>s===0?null:(t.limit!==null&&s===1&&(t=Yi(t,null,"F"),r=Ke(t)),this.indexManager.getDocumentsMatchingTarget(e,r).next((o=>{const a=H(...o);return this.ps.getDocuments(e,a).next((l=>this.indexManager.getMinOffset(e,r).next((h=>{const d=this.Ds(t,l);return this.Cs(t,d,a,h.readTime)?this.ys(e,Yi(t,null,"F")):this.vs(e,d,t,h)}))))})))))}ws(e,t,r,s){return al(t)||s.isEqual(L.min())?P.resolve(null):this.ps.getDocuments(e,r).next((o=>{const a=this.Ds(t,o);return this.Cs(t,a,r,s)?P.resolve(null):(sn()<=$.DEBUG&&x("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),on(t)),this.vs(e,a,t,e_(s,hr)).next((l=>l)))}))}Ds(e,t){let r=new ue(ch(e));return t.forEach(((s,o)=>{qs(e,o)&&(r=r.add(o))})),r}Cs(e,t,r,s){if(e.limit===null)return!1;if(r.size!==t.size)return!0;const o=e.limitType==="F"?t.last():t.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}Ss(e,t,r){return sn()<=$.DEBUG&&x("QueryEngine","Using full collection scan to execute query:",on(t)),this.ps.getDocumentsMatchingQuery(e,t,Rt.min(),r)}vs(e,t,r,s){return this.ps.getDocumentsMatchingQuery(e,r,s).next((o=>(t.forEach((a=>{o=o.insert(a.key,a)})),o)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lo="LocalStore",ky=3e8;class Ny{constructor(e,t,r,s){this.persistence=e,this.Fs=t,this.serializer=s,this.Ms=new ee(z),this.xs=new Xt((o=>Po(o)),Co),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(r)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Ey(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Ms)))}}function Dy(n,e,t,r){return new Ny(n,e,t,r)}async function Oh(n,e){const t=U(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((o=>(s=o,t.Bs(e),t.mutationQueue.getAllMutationBatches(r)))).next((o=>{const a=[],l=[];let h=H();for(const d of s){a.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}for(const d of o){l.push(d.batchId);for(const m of d.mutations)h=h.add(m.key)}return t.localDocuments.getDocuments(r,h).next((d=>({Ls:d,removedBatchIds:a,addedBatchIds:l})))}))}))}function xy(n,e){const t=U(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),o=t.Ns.newChangeBuffer({trackRemovals:!0});return(function(l,h,d,m){const g=d.batch,v=g.keys();let R=P.resolve();return v.forEach((V=>{R=R.next((()=>m.getEntry(h,V))).next((D=>{const C=d.docVersions.get(V);W(C!==null,48541),D.version.compareTo(C)<0&&(g.applyToRemoteDocument(D,d),D.isValidDocument()&&(D.setReadTime(d.commitVersion),m.addEntry(D)))}))})),R.next((()=>l.mutationQueue.removeMutationBatch(h,g)))})(t,r,e,o).next((()=>o.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(l){let h=H();for(let d=0;d<l.mutationResults.length;++d)l.mutationResults[d].transformResults.length>0&&(h=h.add(l.batch.mutations[d].key));return h})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function Mh(n){const e=U(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.Pi.getLastRemoteSnapshotVersion(t)))}function Oy(n,e){const t=U(n),r=e.snapshotVersion;let s=t.Ms;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const a=t.Ns.newChangeBuffer({trackRemovals:!0});s=t.Ms;const l=[];e.targetChanges.forEach(((m,g)=>{const v=s.get(g);if(!v)return;l.push(t.Pi.removeMatchingKeys(o,m.removedDocuments,g).next((()=>t.Pi.addMatchingKeys(o,m.addedDocuments,g))));let R=v.withSequenceNumber(o.currentSequenceNumber);e.targetMismatches.get(g)!==null?R=R.withResumeToken(ye.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):m.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(m.resumeToken,r)),s=s.insert(g,R),(function(D,C,B){return D.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=ky?!0:B.addedDocuments.size+B.modifiedDocuments.size+B.removedDocuments.size>0})(v,R,m)&&l.push(t.Pi.updateTargetData(o,R))}));let h=it(),d=H();if(e.documentUpdates.forEach((m=>{e.resolvedLimboDocuments.has(m)&&l.push(t.persistence.referenceDelegate.updateLimboDocument(o,m))})),l.push(My(o,a,e.documentUpdates).next((m=>{h=m.ks,d=m.qs}))),!r.isEqual(L.min())){const m=t.Pi.getLastRemoteSnapshotVersion(o).next((g=>t.Pi.setTargetsMetadata(o,o.currentSequenceNumber,r)));l.push(m)}return P.waitFor(l).next((()=>a.apply(o))).next((()=>t.localDocuments.getLocalViewOfDocuments(o,h,d))).next((()=>h))})).then((o=>(t.Ms=s,o)))}function My(n,e,t){let r=H(),s=H();return t.forEach((o=>r=r.add(o))),e.getEntries(n,r).next((o=>{let a=it();return t.forEach(((l,h)=>{const d=o.get(l);h.isFoundDocument()!==d.isFoundDocument()&&(s=s.add(l)),h.isNoDocument()&&h.version.isEqual(L.min())?(e.removeEntry(l,h.readTime),a=a.insert(l,h)):!d.isValidDocument()||h.version.compareTo(d.version)>0||h.version.compareTo(d.version)===0&&d.hasPendingWrites?(e.addEntry(h),a=a.insert(l,h)):x(Lo,"Ignoring outdated watch update for ",l,". Current version:",d.version," Watch version:",h.version)})),{ks:a,qs:s}}))}function Ly(n,e){const t=U(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Ao),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function Fy(n,e){const t=U(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.Pi.getTargetData(r,e).next((o=>o?(s=o,P.resolve(s)):t.Pi.allocateTargetId(r).next((a=>(s=new yt(e,a,"TargetPurposeListen",r.currentSequenceNumber),t.Pi.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.Ms.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.Ms=t.Ms.insert(r.targetId,r),t.xs.set(e,r.targetId)),r}))}async function no(n,e,t){const r=U(n),s=r.Ms.get(e),o=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",o,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!Nn(a))throw a;x(Lo,`Failed to update sequence numbers for target ${e}: ${a}`)}r.Ms=r.Ms.remove(e),r.xs.delete(s.target)}function El(n,e,t){const r=U(n);let s=L.min(),o=H();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(h,d,m){const g=U(h),v=g.xs.get(m);return v!==void 0?P.resolve(g.Ms.get(v)):g.Pi.getTargetData(d,m)})(r,a,Ke(e)).next((l=>{if(l)return s=l.lastLimboFreeSnapshotVersion,r.Pi.getMatchingKeysForTargetId(a,l.targetId).next((h=>{o=h}))})).next((()=>r.Fs.getDocumentsMatchingQuery(a,e,t?s:L.min(),t?o:H()))).next((l=>(Uy(r,R_(e),l),{documents:l,Qs:o})))))}function Uy(n,e,t){let r=n.Os.get(e)||L.min();t.forEach(((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)})),n.Os.set(e,r)}class Tl{constructor(){this.activeTargetIds=N_()}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class By{constructor(){this.Mo=new Tl,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,r){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new Tl,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jy{Oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Il="ConnectivityMonitor";class wl{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){x(Il,"Network connectivity changed: AVAILABLE");for(const e of this.qo)e(0)}ko(){x(Il,"Network connectivity changed: UNAVAILABLE");for(const e of this.qo)e(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Jr=null;function ro(){return Jr===null?Jr=(function(){return 268435456+Math.round(2147483648*Math.random())})():Jr++,"0x"+Jr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xi="RestConnection",qy={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class $y{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${r}/databases/${s}`,this.Wo=this.databaseId.database===ys?`project_id=${r}`:`project_id=${r}&database_id=${s}`}Go(e,t,r,s,o){const a=ro(),l=this.zo(e,t.toUriEncodedString());x(xi,`Sending RPC '${e}' ${a}:`,l,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(h,s,o);const{host:d}=new URL(l),m=Sn(d);return this.Jo(e,l,h,r,m).then((g=>(x(xi,`Received RPC '${e}' ${a}: `,g),g)),(g=>{throw yn(xi,`RPC '${e}' ${a} failed with error: `,g,"url: ",l,"request:",r),g}))}Ho(e,t,r,s,o,a){return this.Go(e,t,r,s,o)}jo(e,t,r){e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Vn})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,o)=>e[o]=s)),r&&r.headers.forEach(((s,o)=>e[o]=s))}zo(e,t){const r=qy[e];return`${this.Uo}/v1/${t}:${r}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zy{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ee="WebChannelConnection";class Hy extends $y{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,r,s,o){const a=ro();return new Promise(((l,h)=>{const d=new Ou;d.setWithCredentials(!0),d.listenOnce(Mu.COMPLETE,(()=>{try{switch(d.getLastErrorCode()){case rs.NO_ERROR:const g=d.getResponseJson();x(Ee,`XHR for RPC '${e}' ${a} received:`,JSON.stringify(g)),l(g);break;case rs.TIMEOUT:x(Ee,`RPC '${e}' ${a} timed out`),h(new N(S.DEADLINE_EXCEEDED,"Request time out"));break;case rs.HTTP_ERROR:const v=d.getStatus();if(x(Ee,`RPC '${e}' ${a} failed with status:`,v,"response text:",d.getResponseText()),v>0){let R=d.getResponseJson();Array.isArray(R)&&(R=R[0]);const V=R?.error;if(V&&V.status&&V.message){const D=(function(B){const q=B.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(q)>=0?q:S.UNKNOWN})(V.status);h(new N(D,V.message))}else h(new N(S.UNKNOWN,"Server responded with status "+d.getStatus()))}else h(new N(S.UNAVAILABLE,"Connection failed."));break;default:M(9055,{l_:e,streamId:a,h_:d.getLastErrorCode(),P_:d.getLastError()})}}finally{x(Ee,`RPC '${e}' ${a} completed.`)}}));const m=JSON.stringify(s);x(Ee,`RPC '${e}' ${a} sending request:`,s),d.send(t,"POST",m,r,15)}))}T_(e,t,r){const s=ro(),o=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=Uu(),l=Fu(),h={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},d=this.longPollingOptions.timeoutSeconds;d!==void 0&&(h.longPollingTimeout=Math.round(1e3*d)),this.useFetchStreams&&(h.useFetchStreams=!0),this.jo(h.initMessageHeaders,t,r),h.encodeInitMessageHeaders=!0;const m=o.join("");x(Ee,`Creating RPC '${e}' stream ${s}: ${m}`,h);const g=a.createWebChannel(m,h);this.I_(g);let v=!1,R=!1;const V=new zy({Yo:C=>{R?x(Ee,`Not sending because RPC '${e}' stream ${s} is closed:`,C):(v||(x(Ee,`Opening RPC '${e}' stream ${s} transport.`),g.open(),v=!0),x(Ee,`RPC '${e}' stream ${s} sending:`,C),g.send(C))},Zo:()=>g.close()}),D=(C,B,q)=>{C.listen(B,(K=>{try{q(K)}catch(be){setTimeout((()=>{throw be}),0)}}))};return D(g,Zn.EventType.OPEN,(()=>{R||(x(Ee,`RPC '${e}' stream ${s} transport opened.`),V.o_())})),D(g,Zn.EventType.CLOSE,(()=>{R||(R=!0,x(Ee,`RPC '${e}' stream ${s} transport closed`),V.a_(),this.E_(g))})),D(g,Zn.EventType.ERROR,(C=>{R||(R=!0,yn(Ee,`RPC '${e}' stream ${s} transport errored. Name:`,C.name,"Message:",C.message),V.a_(new N(S.UNAVAILABLE,"The operation could not be completed")))})),D(g,Zn.EventType.MESSAGE,(C=>{if(!R){const B=C.data[0];W(!!B,16349);const q=B,K=q?.error||q[0]?.error;if(K){x(Ee,`RPC '${e}' stream ${s} received error:`,K);const be=K.status;let Pe=(function(p){const y=se[p];if(y!==void 0)return Ih(y)})(be),he=K.message;Pe===void 0&&(Pe=S.INTERNAL,he="Unknown error status: "+be+" with message "+K.message),R=!0,V.a_(new N(Pe,he)),g.close()}else x(Ee,`RPC '${e}' stream ${s} received:`,B),V.u_(B)}})),D(l,Lu.STAT_EVENT,(C=>{C.stat===Hi.PROXY?x(Ee,`RPC '${e}' stream ${s} detected buffering proxy`):C.stat===Hi.NOPROXY&&x(Ee,`RPC '${e}' stream ${s} detected no buffering proxy`)})),setTimeout((()=>{V.__()}),0),V}terminate(){this.c_.forEach((e=>e.close())),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter((t=>t===e))}}function Oi(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gs(n){return new Q_(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fo{constructor(e,t,r=1e3,s=1.5,o=6e4){this.Mi=e,this.timerId=t,this.d_=r,this.A_=s,this.R_=o,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();const t=Math.floor(this.V_+this.y_()),r=Math.max(0,Date.now()-this.f_),s=Math.max(0,t-r);s>0&&x("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,s,(()=>(this.f_=Date.now(),e()))),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bl="PersistentStream";class Lh{constructor(e,t,r,s,o,a,l,h){this.Mi=e,this.S_=r,this.b_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=l,this.listener=h,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new Fo(e,t)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,(()=>this.k_())))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(st(t.toString()),st("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;const e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.D_===t&&this.G_(r,s)}),(r=>{e((()=>{const s=new N(S.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(s)}))}))}G_(e,t){const r=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo((()=>{r((()=>this.listener.Xo()))})),this.stream.t_((()=>{r((()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,(()=>(this.O_()&&(this.state=3),Promise.resolve()))),this.listener.t_())))})),this.stream.r_((s=>{r((()=>this.z_(s)))})),this.stream.onMessage((s=>{r((()=>++this.F_==1?this.J_(s):this.onNext(s)))}))}N_(){this.state=5,this.M_.p_((async()=>{this.state=0,this.start()}))}z_(e){return x(bl,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget((()=>this.D_===e?t():(x(bl,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class Gy extends Lh{constructor(e,t,r,s,o,a){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const t=Z_(this.serializer,e),r=(function(o){if(!("targetChange"in o))return L.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?Oe(a.readTime):L.min()})(e);return this.listener.H_(t,r)}Y_(e){const t={};t.database=to(this.serializer),t.addTarget=(function(o,a){let l;const h=a.target;if(l=Xi(h)?{documents:ty(o,h)}:{query:ny(o,h).ft},l.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){l.resumeToken=Ah(o,a.resumeToken);const d=Zi(o,a.expectedCount);d!==null&&(l.expectedCount=d)}else if(a.snapshotVersion.compareTo(L.min())>0){l.readTime=bs(o,a.snapshotVersion.toTimestamp());const d=Zi(o,a.expectedCount);d!==null&&(l.expectedCount=d)}return l})(this.serializer,e);const r=sy(this.serializer,e);r&&(t.labels=r),this.q_(t)}Z_(e){const t={};t.database=to(this.serializer),t.removeTarget=e,this.q_(t)}}class Wy extends Lh{constructor(e,t,r,s,o,a){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,a),this.serializer=o}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return W(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,W(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){W(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const t=ey(e.writeResults,e.commitTime),r=Oe(e.commitTime);return this.listener.na(r,t)}ra(){const e={};e.database=to(this.serializer),this.q_(e)}ea(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Ch(this.serializer,r)))};this.q_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ky{}class Qy extends Ky{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.ia=!1}sa(){if(this.ia)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,r,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.Go(e,eo(t,r),s,o,a))).catch((o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(S.UNKNOWN,o.toString())}))}Ho(e,t,r,s,o){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,l])=>this.connection.Ho(e,eo(t,r),s,a,l,o))).catch((a=>{throw a.name==="FirebaseError"?(a.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new N(S.UNKNOWN,a.toString())}))}terminate(){this.ia=!0,this.connection.terminate()}}class Xy{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve()))))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(st(t),this.aa=!1):x("OnlineStateTracker",t)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qt="RemoteStore";class Jy{constructor(e,t,r,s,o){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=o,this.Aa.Oo((a=>{r.enqueueAndForget((async()=>{Jt(this)&&(x(Qt,"Restarting streams for network reachability change."),await(async function(h){const d=U(h);d.Ea.add(4),await Rr(d),d.Ra.set("Unknown"),d.Ea.delete(4),await Ws(d)})(this))}))})),this.Ra=new Xy(r,s)}}async function Ws(n){if(Jt(n))for(const e of n.da)await e(!0)}async function Rr(n){for(const e of n.da)await e(!1)}function Fh(n,e){const t=U(n);t.Ia.has(e.targetId)||(t.Ia.set(e.targetId,e),qo(t)?jo(t):Dn(t).O_()&&Bo(t,e))}function Uo(n,e){const t=U(n),r=Dn(t);t.Ia.delete(e),r.O_()&&Uh(t,e),t.Ia.size===0&&(r.O_()?r.L_():Jt(t)&&t.Ra.set("Unknown"))}function Bo(n,e){if(n.Va.Ue(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(L.min())>0){const t=n.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Dn(n).Y_(e)}function Uh(n,e){n.Va.Ue(e),Dn(n).Z_(e)}function jo(n){n.Va=new H_({getRemoteKeysForTarget:e=>n.remoteSyncer.getRemoteKeysForTarget(e),At:e=>n.Ia.get(e)||null,ht:()=>n.datastore.serializer.databaseId}),Dn(n).start(),n.Ra.ua()}function qo(n){return Jt(n)&&!Dn(n).x_()&&n.Ia.size>0}function Jt(n){return U(n).Ea.size===0}function Bh(n){n.Va=void 0}async function Yy(n){n.Ra.set("Online")}async function Zy(n){n.Ia.forEach(((e,t)=>{Bo(n,e)}))}async function ev(n,e){Bh(n),qo(n)?(n.Ra.ha(e),jo(n)):n.Ra.set("Unknown")}async function tv(n,e,t){if(n.Ra.set("Online"),e instanceof bh&&e.state===2&&e.cause)try{await(async function(s,o){const a=o.cause;for(const l of o.targetIds)s.Ia.has(l)&&(await s.remoteSyncer.rejectListen(l,a),s.Ia.delete(l),s.Va.removeTarget(l))})(n,e)}catch(r){x(Qt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Ss(n,r)}else if(e instanceof as?n.Va.Ze(e):e instanceof wh?n.Va.st(e):n.Va.tt(e),!t.isEqual(L.min()))try{const r=await Mh(n.localStore);t.compareTo(r)>=0&&await(function(o,a){const l=o.Va.Tt(a);return l.targetChanges.forEach(((h,d)=>{if(h.resumeToken.approximateByteSize()>0){const m=o.Ia.get(d);m&&o.Ia.set(d,m.withResumeToken(h.resumeToken,a))}})),l.targetMismatches.forEach(((h,d)=>{const m=o.Ia.get(h);if(!m)return;o.Ia.set(h,m.withResumeToken(ye.EMPTY_BYTE_STRING,m.snapshotVersion)),Uh(o,h);const g=new yt(m.target,h,d,m.sequenceNumber);Bo(o,g)})),o.remoteSyncer.applyRemoteEvent(l)})(n,t)}catch(r){x(Qt,"Failed to raise snapshot:",r),await Ss(n,r)}}async function Ss(n,e,t){if(!Nn(e))throw e;n.Ea.add(1),await Rr(n),n.Ra.set("Offline"),t||(t=()=>Mh(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{x(Qt,"Retrying IndexedDB access"),await t(),n.Ea.delete(1),await Ws(n)}))}function jh(n,e){return e().catch((t=>Ss(n,t,e)))}async function Ks(n){const e=U(n),t=Vt(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:Ao;for(;nv(e);)try{const s=await Ly(e.localStore,r);if(s===null){e.Ta.length===0&&t.L_();break}r=s.batchId,rv(e,s)}catch(s){await Ss(e,s)}qh(e)&&$h(e)}function nv(n){return Jt(n)&&n.Ta.length<10}function rv(n,e){n.Ta.push(e);const t=Vt(n);t.O_()&&t.X_&&t.ea(e.mutations)}function qh(n){return Jt(n)&&!Vt(n).x_()&&n.Ta.length>0}function $h(n){Vt(n).start()}async function sv(n){Vt(n).ra()}async function iv(n){const e=Vt(n);for(const t of n.Ta)e.ea(t.mutations)}async function ov(n,e,t){const r=n.Ta.shift(),s=ko.from(r,e,t);await jh(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await Ks(n)}async function av(n,e){e&&Vt(n).X_&&await(async function(r,s){if((function(a){return Th(a)&&a!==S.ABORTED})(s.code)){const o=r.Ta.shift();Vt(r).B_(),await jh(r,(()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s))),await Ks(r)}})(n,e),qh(n)&&$h(n)}async function Al(n,e){const t=U(n);t.asyncQueue.verifyOperationInProgress(),x(Qt,"RemoteStore received new credentials");const r=Jt(t);t.Ea.add(3),await Rr(t),r&&t.Ra.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.Ea.delete(3),await Ws(t)}async function cv(n,e){const t=U(n);e?(t.Ea.delete(2),await Ws(t)):e||(t.Ea.add(2),await Rr(t),t.Ra.set("Unknown"))}function Dn(n){return n.ma||(n.ma=(function(t,r,s){const o=U(t);return o.sa(),new Gy(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)})(n.datastore,n.asyncQueue,{Xo:Yy.bind(null,n),t_:Zy.bind(null,n),r_:ev.bind(null,n),H_:tv.bind(null,n)}),n.da.push((async e=>{e?(n.ma.B_(),qo(n)?jo(n):n.Ra.set("Unknown")):(await n.ma.stop(),Bh(n))}))),n.ma}function Vt(n){return n.fa||(n.fa=(function(t,r,s){const o=U(t);return o.sa(),new Wy(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)})(n.datastore,n.asyncQueue,{Xo:()=>Promise.resolve(),t_:sv.bind(null,n),r_:av.bind(null,n),ta:iv.bind(null,n),na:ov.bind(null,n)}),n.da.push((async e=>{e?(n.fa.B_(),await Ks(n)):(await n.fa.stop(),n.Ta.length>0&&(x(Qt,`Stopping write stream with ${n.Ta.length} pending writes`),n.Ta=[]))}))),n.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $o{constructor(e,t,r,s,o){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new We,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,o){const a=Date.now()+r,l=new $o(e,t,a,s,o);return l.start(r),l}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function zo(n,e){if(st("AsyncQueue",`${e}: ${n}`),Nn(n))return new N(S.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pn{static emptySet(e){return new pn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||O.comparator(t.key,r.key):(t,r)=>O.comparator(t.key,r.key),this.keyedMap=er(),this.sortedSet=new ee(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof pn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const r=new pn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rl{constructor(){this.ga=new ee(O.comparator)}track(e){const t=e.doc.key,r=this.ga.get(t);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(t,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(t):e.type===1&&r.type===2?this.ga=this.ga.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):M(63341,{Rt:e,pa:r}):this.ga=this.ga.insert(t,e)}ya(){const e=[];return this.ga.inorderTraversal(((t,r)=>{e.push(r)})),e}}class An{constructor(e,t,r,s,o,a,l,h,d){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=l,this.excludesMetadataChanges=h,this.hasCachedResults=d}static fromInitialDocuments(e,t,r,s,o){const a=[];return t.forEach((l=>{a.push({type:0,doc:l})})),new An(e,t,pn.emptySet(t),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&js(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lv{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some((e=>e.Da()))}}class uv{constructor(){this.queries=Sl(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(t,r){const s=U(t),o=s.queries;s.queries=Sl(),o.forEach(((a,l)=>{for(const h of l.Sa)h.onError(r)}))})(this,new N(S.ABORTED,"Firestore shutting down"))}}function Sl(){return new Xt((n=>ah(n)),js)}async function Ho(n,e){const t=U(n);let r=3;const s=e.query;let o=t.queries.get(s);o?!o.ba()&&e.Da()&&(r=2):(o=new lv,r=e.Da()?0:1);try{switch(r){case 0:o.wa=await t.onListen(s,!0);break;case 1:o.wa=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(a){const l=zo(a,`Initialization of query '${on(e.query)}' failed`);return void e.onError(l)}t.queries.set(s,o),o.Sa.push(e),e.va(t.onlineState),o.wa&&e.Fa(o.wa)&&Wo(t)}async function Go(n,e){const t=U(n),r=e.query;let s=3;const o=t.queries.get(r);if(o){const a=o.Sa.indexOf(e);a>=0&&(o.Sa.splice(a,1),o.Sa.length===0?s=e.Da()?0:1:!o.ba()&&e.Da()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function hv(n,e){const t=U(n);let r=!1;for(const s of e){const o=s.query,a=t.queries.get(o);if(a){for(const l of a.Sa)l.Fa(s)&&(r=!0);a.wa=s}}r&&Wo(t)}function dv(n,e,t){const r=U(n),s=r.queries.get(e);if(s)for(const o of s.Sa)o.onError(t);r.queries.delete(e)}function Wo(n){n.Ca.forEach((e=>{e.next()}))}var so,Pl;(Pl=so||(so={})).Ma="default",Pl.Cache="cache";class Ko{constructor(e,t,r){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new An(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){if(!e.fromCache||!this.Da())return!0;const r=t!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}ka(e){e=An.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==so.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zh{constructor(e){this.key=e}}class Hh{constructor(e){this.key=e}}class fv{constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=H(),this.mutatedKeys=H(),this.eu=ch(e),this.tu=new pn(this.eu)}get nu(){return this.Ya}ru(e,t){const r=t?t.iu:new Rl,s=t?t.tu:this.tu;let o=t?t.mutatedKeys:this.mutatedKeys,a=s,l=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,d=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(e.inorderTraversal(((m,g)=>{const v=s.get(m),R=qs(this.query,g)?g:null,V=!!v&&this.mutatedKeys.has(v.key),D=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;v&&R?v.data.isEqual(R.data)?V!==D&&(r.track({type:3,doc:R}),C=!0):this.su(v,R)||(r.track({type:2,doc:R}),C=!0,(h&&this.eu(R,h)>0||d&&this.eu(R,d)<0)&&(l=!0)):!v&&R?(r.track({type:0,doc:R}),C=!0):v&&!R&&(r.track({type:1,doc:v}),C=!0,(h||d)&&(l=!0)),C&&(R?(a=a.add(R),o=D?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{tu:a,iu:r,Cs:l,mutatedKeys:o}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const o=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const a=e.iu.ya();a.sort(((m,g)=>(function(R,V){const D=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return M(20277,{Rt:C})}};return D(R)-D(V)})(m.type,g.type)||this.eu(m.doc,g.doc))),this.ou(r),s=s??!1;const l=t&&!s?this._u():[],h=this.Xa.size===0&&this.current&&!s?1:0,d=h!==this.Za;return this.Za=h,a.length!==0||d?{snapshot:new An(this.query,e.tu,o,a,e.mutatedKeys,h===0,d,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new Rl,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach((t=>this.Ya=this.Ya.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ya=this.Ya.delete(t))),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Xa;this.Xa=H(),this.tu.forEach((r=>{this.uu(r.key)&&(this.Xa=this.Xa.add(r.key))}));const t=[];return e.forEach((r=>{this.Xa.has(r)||t.push(new Hh(r))})),this.Xa.forEach((r=>{e.has(r)||t.push(new zh(r))})),t}cu(e){this.Ya=e.Qs,this.Xa=H();const t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return An.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Za===0,this.hasCachedResults)}}const Qo="SyncEngine";class mv{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class pv{constructor(e){this.key=e,this.hu=!1}}class gv{constructor(e,t,r,s,o,a){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Pu={},this.Tu=new Xt((l=>ah(l)),js),this.Iu=new Map,this.Eu=new Set,this.du=new ee(O.comparator),this.Au=new Map,this.Ru=new xo,this.Vu={},this.mu=new Map,this.fu=bn.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function _v(n,e,t=!0){const r=Jh(n);let s;const o=r.Tu.get(e);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.lu()):s=await Gh(r,e,t,!0),s}async function yv(n,e){const t=Jh(n);await Gh(t,e,!0,!1)}async function Gh(n,e,t,r){const s=await Fy(n.localStore,Ke(e)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,t);let l;return r&&(l=await vv(n,e,o,a==="current",s.resumeToken)),n.isPrimaryClient&&t&&Fh(n.remoteStore,s),l}async function vv(n,e,t,r,s){n.pu=(g,v,R)=>(async function(D,C,B,q){let K=C.view.ru(B);K.Cs&&(K=await El(D.localStore,C.query,!1).then((({documents:T})=>C.view.ru(T,K))));const be=q&&q.targetChanges.get(C.targetId),Pe=q&&q.targetMismatches.get(C.targetId)!=null,he=C.view.applyChanges(K,D.isPrimaryClient,be,Pe);return Vl(D,C.targetId,he.au),he.snapshot})(n,g,v,R);const o=await El(n.localStore,e,!0),a=new fv(e,o.Qs),l=a.ru(o.documents),h=Ar.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),d=a.applyChanges(l,n.isPrimaryClient,h);Vl(n,t,d.au);const m=new mv(e,t,a);return n.Tu.set(e,m),n.Iu.has(t)?n.Iu.get(t).push(e):n.Iu.set(t,[e]),d.snapshot}async function Ev(n,e,t){const r=U(n),s=r.Tu.get(e),o=r.Iu.get(s.targetId);if(o.length>1)return r.Iu.set(s.targetId,o.filter((a=>!js(a,e)))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await no(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Uo(r.remoteStore,s.targetId),io(r,s.targetId)})).catch(kn)):(io(r,s.targetId),await no(r.localStore,s.targetId,!0))}async function Tv(n,e){const t=U(n),r=t.Tu.get(e),s=t.Iu.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Uo(t.remoteStore,r.targetId))}async function Iv(n,e,t){const r=Cv(n);try{const s=await(function(a,l){const h=U(a),d=Y.now(),m=l.reduce(((R,V)=>R.add(V.key)),H());let g,v;return h.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let V=it(),D=H();return h.Ns.getEntries(R,m).next((C=>{V=C,V.forEach(((B,q)=>{q.isValidDocument()||(D=D.add(B))}))})).next((()=>h.localDocuments.getOverlayedDocuments(R,V))).next((C=>{g=C;const B=[];for(const q of l){const K=U_(q,g.get(q.key).overlayedDocument);K!=null&&B.push(new Dt(q.key,K,Zu(K.value.mapValue),oe.exists(!0)))}return h.mutationQueue.addMutationBatch(R,d,B,l)})).next((C=>{v=C;const B=C.applyToLocalDocumentSet(g,D);return h.documentOverlayCache.saveOverlays(R,C.batchId,B)}))})).then((()=>({batchId:v.batchId,changes:uh(g)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(a,l,h){let d=a.Vu[a.currentUser.toKey()];d||(d=new ee(z)),d=d.insert(l,h),a.Vu[a.currentUser.toKey()]=d})(r,s.batchId,t),await Sr(r,s.changes),await Ks(r.remoteStore)}catch(s){const o=zo(s,"Failed to persist write");t.reject(o)}}async function Wh(n,e){const t=U(n);try{const r=await Oy(t.localStore,e);e.targetChanges.forEach(((s,o)=>{const a=t.Au.get(o);a&&(W(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.hu=!0:s.modifiedDocuments.size>0?W(a.hu,14607):s.removedDocuments.size>0&&(W(a.hu,42227),a.hu=!1))})),await Sr(t,r,e)}catch(r){await kn(r)}}function Cl(n,e,t){const r=U(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.Tu.forEach(((o,a)=>{const l=a.view.va(e);l.snapshot&&s.push(l.snapshot)})),(function(a,l){const h=U(a);h.onlineState=l;let d=!1;h.queries.forEach(((m,g)=>{for(const v of g.Sa)v.va(l)&&(d=!0)})),d&&Wo(h)})(r.eventManager,e),s.length&&r.Pu.H_(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function wv(n,e,t){const r=U(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Au.get(e),o=s&&s.key;if(o){let a=new ee(O.comparator);a=a.insert(o,me.newNoDocument(o,L.min()));const l=H().add(o),h=new Hs(L.min(),new Map,new ee(z),a,l);await Wh(r,h),r.du=r.du.remove(o),r.Au.delete(e),Xo(r)}else await no(r.localStore,e,!1).then((()=>io(r,e,t))).catch(kn)}async function bv(n,e){const t=U(n),r=e.batch.batchId;try{const s=await xy(t.localStore,e);Qh(t,r,null),Kh(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await Sr(t,s)}catch(s){await kn(s)}}async function Av(n,e,t){const r=U(n);try{const s=await(function(a,l){const h=U(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",(d=>{let m;return h.mutationQueue.lookupMutationBatch(d,l).next((g=>(W(g!==null,37113),m=g.keys(),h.mutationQueue.removeMutationBatch(d,g)))).next((()=>h.mutationQueue.performConsistencyCheck(d))).next((()=>h.documentOverlayCache.removeOverlaysForBatchId(d,m,l))).next((()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(d,m))).next((()=>h.localDocuments.getDocuments(d,m)))}))})(r.localStore,e);Qh(r,e,t),Kh(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await Sr(r,s)}catch(s){await kn(s)}}function Kh(n,e){(n.mu.get(e)||[]).forEach((t=>{t.resolve()})),n.mu.delete(e)}function Qh(n,e,t){const r=U(n);let s=r.Vu[r.currentUser.toKey()];if(s){const o=s.get(e);o&&(t?o.reject(t):o.resolve(),s=s.remove(e)),r.Vu[r.currentUser.toKey()]=s}}function io(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Iu.get(e))n.Tu.delete(r),t&&n.Pu.yu(r,t);n.Iu.delete(e),n.isPrimaryClient&&n.Ru.jr(e).forEach((r=>{n.Ru.containsKey(r)||Xh(n,r)}))}function Xh(n,e){n.Eu.delete(e.path.canonicalString());const t=n.du.get(e);t!==null&&(Uo(n.remoteStore,t),n.du=n.du.remove(e),n.Au.delete(t),Xo(n))}function Vl(n,e,t){for(const r of t)r instanceof zh?(n.Ru.addReference(r.key,e),Rv(n,r)):r instanceof Hh?(x(Qo,"Document no longer in limbo: "+r.key),n.Ru.removeReference(r.key,e),n.Ru.containsKey(r.key)||Xh(n,r.key)):M(19791,{wu:r})}function Rv(n,e){const t=e.key,r=t.path.canonicalString();n.du.get(t)||n.Eu.has(r)||(x(Qo,"New document in limbo: "+t),n.Eu.add(r),Xo(n))}function Xo(n){for(;n.Eu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const e=n.Eu.values().next().value;n.Eu.delete(e);const t=new O(Q.fromString(e)),r=n.fu.next();n.Au.set(r,new pv(t)),n.du=n.du.insert(t,r),Fh(n.remoteStore,new yt(Ke(Bs(t.path)),r,"TargetPurposeLimboResolution",Fs.ce))}}async function Sr(n,e,t){const r=U(n),s=[],o=[],a=[];r.Tu.isEmpty()||(r.Tu.forEach(((l,h)=>{a.push(r.pu(h,e,t).then((d=>{if((d||t)&&r.isPrimaryClient){const m=d?!d.fromCache:t?.targetChanges.get(h.targetId)?.current;r.sharedClientState.updateQueryState(h.targetId,m?"current":"not-current")}if(d){s.push(d);const m=Mo.As(h.targetId,d);o.push(m)}})))})),await Promise.all(a),r.Pu.H_(s),await(async function(h,d){const m=U(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",(g=>P.forEach(d,(v=>P.forEach(v.Es,(R=>m.persistence.referenceDelegate.addReference(g,v.targetId,R))).next((()=>P.forEach(v.ds,(R=>m.persistence.referenceDelegate.removeReference(g,v.targetId,R)))))))))}catch(g){if(!Nn(g))throw g;x(Lo,"Failed to update sequence numbers: "+g)}for(const g of d){const v=g.targetId;if(!g.fromCache){const R=m.Ms.get(v),V=R.snapshotVersion,D=R.withLastLimboFreeSnapshotVersion(V);m.Ms=m.Ms.insert(v,D)}}})(r.localStore,o))}async function Sv(n,e){const t=U(n);if(!t.currentUser.isEqual(e)){x(Qo,"User change. New user:",e.toKey());const r=await Oh(t.localStore,e);t.currentUser=e,(function(o,a){o.mu.forEach((l=>{l.forEach((h=>{h.reject(new N(S.CANCELLED,a))}))})),o.mu.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Sr(t,r.Ls)}}function Pv(n,e){const t=U(n),r=t.Au.get(e);if(r&&r.hu)return H().add(r.key);{let s=H();const o=t.Iu.get(e);if(!o)return s;for(const a of o){const l=t.Tu.get(a);s=s.unionWith(l.view.nu)}return s}}function Jh(n){const e=U(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=Wh.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=Pv.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=wv.bind(null,e),e.Pu.H_=hv.bind(null,e.eventManager),e.Pu.yu=dv.bind(null,e.eventManager),e}function Cv(n){const e=U(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=bv.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Av.bind(null,e),e}class Ps{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Gs(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){return Dy(this.persistence,new Vy,e.initialUser,this.serializer)}Cu(e){return new xh(Oo.mi,this.serializer)}Du(e){return new By}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ps.provider={build:()=>new Ps};class Vv extends Ps{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){W(this.persistence.referenceDelegate instanceof Rs,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new py(r,e.asyncQueue,t)}Cu(e){const t=this.cacheSizeBytes!==void 0?Ve.withCacheSize(this.cacheSizeBytes):Ve.DEFAULT;return new xh((r=>Rs.mi(r,t)),this.serializer)}}class oo{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Cl(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Sv.bind(null,this.syncEngine),await cv(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new uv})()}createDatastore(e){const t=Gs(e.databaseInfo.databaseId),r=(function(o){return new Hy(o)})(e.databaseInfo);return(function(o,a,l,h){return new Qy(o,a,l,h)})(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,o,a,l){return new Jy(r,s,o,a,l)})(this.localStore,this.datastore,e.asyncQueue,(t=>Cl(this.syncEngine,t,0)),(function(){return wl.v()?new wl:new jy})())}createSyncEngine(e,t){return(function(s,o,a,l,h,d,m){const g=new gv(s,o,a,l,h,d);return m&&(g.gu=!0),g})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await(async function(t){const r=U(t);x(Qt,"RemoteStore shutting down."),r.Ea.add(5),await Rr(r),r.Aa.shutdown(),r.Ra.set("Unknown")})(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}oo.provider={build:()=>new oo};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):st("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kv{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new N(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,o){const a=U(s),l={documents:o.map((g=>As(a.serializer,g)))},h=await a.Ho("BatchGetDocuments",a.serializer.databaseId,Q.emptyPath(),l,o.length),d=new Map;h.forEach((g=>{const v=Y_(a.serializer,g);d.set(v.key.toString(),v)}));const m=[];return o.forEach((g=>{const v=d.get(g.toString());W(!!v,55234,{key:g}),m.push(v)})),m})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new br(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{const s=O.fromPath(r);this.mutations.push(new Eh(s,this.precondition(s)))})),await(async function(r,s){const o=U(r),a={writes:s.map((l=>Ch(o.serializer,l)))};await o.Go("Commit",o.serializer.databaseId,Q.emptyPath(),a)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw M(50498,{Gu:e.constructor.name});t=L.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new N(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(L.min())?oe.exists(!1):oe.updateTime(t):oe.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(L.min()))throw new N(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return oe.updateTime(t)}return oe.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nv{constructor(e,t,r,s,o){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=o,this.zu=r.maxAttempts,this.M_=new Fo(this.asyncQueue,"transaction_retry")}ju(){this.zu-=1,this.Ju()}Ju(){this.M_.p_((async()=>{const e=new kv(this.datastore),t=this.Hu(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.Yu(s)}))))})).catch((r=>{this.Yu(r)}))}))}Hu(e){try{const t=this.updateFunction(e);return!Tr(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Yu(e){this.zu>0&&this.Zu(e)?(this.zu-=1,this.asyncQueue.enqueueAndForget((()=>(this.Ju(),Promise.resolve())))):this.deferred.reject(e)}Zu(e){if(e?.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Th(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kt="FirestoreClient";class Dv{constructor(e,t,r,s,o){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this.databaseInfo=s,this.user=Te.UNAUTHENTICATED,this.clientId=bo.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,(async a=>{x(kt,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(x(kt,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new We;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=zo(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function Mi(n,e){n.asyncQueue.verifyOperationInProgress(),x(kt,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await Oh(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function kl(n,e){n.asyncQueue.verifyOperationInProgress();const t=await xv(n);x(kt,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Al(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Al(e.remoteStore,s))),n._onlineComponents=e}async function xv(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){x(kt,"Using user provided OfflineComponentProvider");try{await Mi(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===S.FAILED_PRECONDITION||s.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;yn("Error using user provided cache. Falling back to memory cache: "+t),await Mi(n,new Ps)}}else x(kt,"Using default OfflineComponentProvider"),await Mi(n,new Vv(void 0));return n._offlineComponents}async function Yo(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(x(kt,"Using user provided OnlineComponentProvider"),await kl(n,n._uninitializedComponentsProvider._online)):(x(kt,"Using default OnlineComponentProvider"),await kl(n,new oo))),n._onlineComponents}function Ov(n){return Yo(n).then((e=>e.syncEngine))}function Mv(n){return Yo(n).then((e=>e.datastore))}async function Cs(n){const e=await Yo(n),t=e.eventManager;return t.onListen=_v.bind(null,e.syncEngine),t.onUnlisten=Ev.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=yv.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=Tv.bind(null,e.syncEngine),t}function Lv(n,e,t={}){const r=new We;return n.asyncQueue.enqueueAndForget((async()=>(function(o,a,l,h,d){const m=new Jo({next:v=>{m.Nu(),a.enqueueAndForget((()=>Go(o,g)));const R=v.docs.has(l);!R&&v.fromCache?d.reject(new N(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&v.fromCache&&h&&h.source==="server"?d.reject(new N(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):d.resolve(v)},error:v=>d.reject(v)}),g=new Ko(Bs(l.path),m,{includeMetadataChanges:!0,qa:!0});return Ho(o,g)})(await Cs(n),n.asyncQueue,e,t,r))),r.promise}function Fv(n,e,t={}){const r=new We;return n.asyncQueue.enqueueAndForget((async()=>(function(o,a,l,h,d){const m=new Jo({next:v=>{m.Nu(),a.enqueueAndForget((()=>Go(o,g))),v.fromCache&&h.source==="server"?d.reject(new N(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):d.resolve(v)},error:v=>d.reject(v)}),g=new Ko(l,m,{includeMetadataChanges:!0,qa:!0});return Ho(o,g)})(await Cs(n),n.asyncQueue,e,t,r))),r.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yh(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nl=new Map;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zh="firestore.googleapis.com",Dl=!0;class xl{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new N(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=Zh,this.ssl=Dl}else this.host=e.host,this.ssl=e.ssl??Dl;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=Dh;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<fy)throw new N(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}Zg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Yh(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(S.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class Qs{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new xl({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new xl(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new $g;switch(r.type){case"firstParty":return new Wg(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Nl.get(t);r&&(x("ComponentProvider","Removing Datastore"),Nl.delete(t),r.terminate())})(this),Promise.resolve()}}function Uv(n,e,t,r={}){n=Ie(n,Qs);const s=Sn(e),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},l=`${e}:${t}`;s&&(Ql(`https://${l}`),Xl("Firestore",!0)),o.host!==Zh&&o.host!==l&&yn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:l,ssl:s,emulatorOptions:r};if(!et(h,a)&&(n._setSettings(h),r.mockUserToken)){let d,m;if(typeof r.mockUserToken=="string")d=r.mockUserToken,m=Te.MOCK_USER;else{d=mf(r.mockUserToken,n._app?.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new N(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");m=new Te(g)}n._authCredentials=new zg(new ju(d,m))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Yt(this.firestore,e,this._query)}}class Z{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new bt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Z(this.firestore,e,this._key)}toJSON(){return{type:Z._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Er(t,Z._jsonSchema))return new Z(e,r||null,new O(Q.fromString(t.referencePath)))}}Z._jsonSchemaVersion="firestore/documentReference/1.0",Z._jsonSchema={type:ae("string",Z._jsonSchemaVersion),referencePath:ae("string")};class bt extends Yt{constructor(e,t,r){super(e,t,Bs(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Z(this.firestore,null,new O(e))}withConverter(e){return new bt(this.firestore,e,this._path)}}function Rn(n,e,...t){if(n=re(n),qu("collection","path",e),n instanceof Qs){const r=Q.fromString(e,...t);return Wc(r),new bt(n,null,r)}{if(!(n instanceof Z||n instanceof bt))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(e,...t));return Wc(r),new bt(n.firestore,null,r)}}function Le(n,e,...t){if(n=re(n),arguments.length===1&&(e=bo.newId()),qu("doc","path",e),n instanceof Qs){const r=Q.fromString(e,...t);return Gc(r),new Z(n,null,new O(r))}{if(!(n instanceof Z||n instanceof bt))throw new N(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(Q.fromString(e,...t));return Gc(r),new Z(n.firestore,n instanceof bt?n.converter:null,new O(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ol="AsyncQueue";class Ml{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new Fo(this,"async_queue_retry"),this._c=()=>{const r=Oi();r&&x(Ol,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const t=Oi();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const t=Oi();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise((()=>{}));const t=new We;return this.cc((()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Xu.push(e),this.lc())))}async lc(){if(this.Xu.length!==0){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!Nn(e))throw e;x(Ol,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_((()=>this.lc()))}}cc(e){const t=this.ac.then((()=>(this.rc=!0,e().catch((r=>{throw this.nc=r,this.rc=!1,st("INTERNAL UNHANDLED ERROR: ",Ll(r)),r})).then((r=>(this.rc=!1,r))))));return this.ac=t,t}enqueueAfterDelay(e,t,r){this.uc(),this.oc.indexOf(e)>-1&&(t=0);const s=$o.createAndSchedule(this,e,t,r,(o=>this.hc(o)));return this.tc.push(s),s}uc(){this.nc&&M(47125,{Pc:Ll(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(const t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then((()=>{this.tc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.tc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Tc()}))}dc(e){this.oc.push(e)}hc(e){const t=this.tc.indexOf(e);this.tc.splice(t,1)}}function Ll(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fl(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1})(n,["next","error","complete"])}class Be extends Qs{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Ml,this._persistenceKey=s?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Ml(e),this._firestoreClient=void 0,await e}}}function Bv(n,e){const t=typeof n=="object"?n:eu(),r=typeof n=="string"?n:ys,s=fo(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=df("firestore");o&&Uv(s,...o)}return s}function xn(n){if(n._terminated)throw new N(S.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||jv(n),n._firestoreClient}function jv(n){const e=n._freezeSettings(),t=(function(s,o,a,l){return new u_(s,o,a,l.host,l.ssl,l.experimentalForceLongPolling,l.experimentalAutoDetectLongPolling,Yh(l.experimentalLongPollingOptions),l.useFetchStreams,l.isUsingEmulator)})(n._databaseId,n._app?.options.appId||"",n._persistenceKey,e);n._componentsProvider||e.localCache?._offlineComponentProvider&&e.localCache?._onlineComponentProvider&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new Dv(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(s){const o=s?._online.build();return{_offline:s?._offline.build(o),_online:o}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{constructor(e){this._byteString=e}static fromBase64String(e){try{return new De(ye.fromBase64String(e))}catch(t){throw new N(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new De(ye.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:De._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Er(e,De._jsonSchema))return De.fromBase64String(e.bytes)}}De._jsonSchemaVersion="firestore/bytes/1.0",De._jsonSchema={type:ae("string",De._jsonSchemaVersion),bytes:ae("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class On{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new _e(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qe{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return z(this._lat,e._lat)||z(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Qe._jsonSchemaVersion}}static fromJSON(e){if(Er(e,Qe._jsonSchema))return new Qe(e.latitude,e.longitude)}}Qe._jsonSchemaVersion="firestore/geoPoint/1.0",Qe._jsonSchema={type:ae("string",Qe._jsonSchemaVersion),latitude:ae("number"),longitude:ae("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Xe._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Er(e,Xe._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Xe(e.vectorValues);throw new N(S.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Xe._jsonSchemaVersion="firestore/vectorValue/1.0",Xe._jsonSchema={type:ae("string",Xe._jsonSchemaVersion),vectorValues:ae("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qv=/^__.*__$/;class $v{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new Dt(e,this.data,this.fieldMask,t,this.fieldTransforms):new wr(e,this.data,t,this.fieldTransforms)}}class ed{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new Dt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function td(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw M(40011,{Ac:n})}}class Xs{constructor(e,t,r,s,o,a){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.Rc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new Xs({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){const t=this.path?.child(e),r=this.Vc({path:t,fc:!1});return r.gc(e),r}yc(e){const t=this.path?.child(e),r=this.Vc({path:t,fc:!1});return r.Rc(),r}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return Vs(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(e.length===0)throw this.Sc("Document fields must not be empty");if(td(this.Ac)&&qv.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class zv{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Gs(e)}Cc(e,t,r,s=!1){return new Xs({Ac:e,methodName:t,Dc:r,path:_e.emptyPath(),fc:!1,bc:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Mn(n){const e=n._freezeSettings(),t=Gs(n._databaseId);return new zv(n._databaseId,!!e.ignoreUndefinedProperties,t)}function Js(n,e,t,r,s,o={}){const a=n.Cc(o.merge||o.mergeFields?2:0,e,t,s);ra("Data must be an object, but it was:",a,r);const l=rd(r,a);let h,d;if(o.merge)h=new xe(a.fieldMask),d=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const g of o.mergeFields){const v=ao(e,g,t);if(!a.contains(v))throw new N(S.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);id(m,v)||m.push(v)}h=new xe(m),d=a.fieldTransforms.filter((g=>h.covers(g.field)))}else h=null,d=a.fieldTransforms;return new $v(new Se(l),h,d)}class Ys extends Pr{_toFieldTransform(e){if(e.Ac!==2)throw e.Ac===1?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Ys}}function nd(n,e,t){return new Xs({Ac:3,Dc:e.settings.Dc,methodName:n._methodName,fc:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Zo extends Pr{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=nd(this,e,!0),r=this.vc.map((o=>Zt(o,t))),s=new In(r);return new _h(e.path,s)}isEqual(e){return e instanceof Zo&&et(this.vc,e.vc)}}class ea extends Pr{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){const t=nd(this,e,!0),r=this.vc.map((o=>Zt(o,t))),s=new wn(r);return new _h(e.path,s)}isEqual(e){return e instanceof ea&&et(this.vc,e.vc)}}function ta(n,e,t,r){const s=n.Cc(1,e,t);ra("Data must be an object, but it was:",s,r);const o=[],a=Se.empty();Nt(r,((h,d)=>{const m=sa(e,h,t);d=re(d);const g=s.yc(m);if(d instanceof Ys)o.push(m);else{const v=Zt(d,g);v!=null&&(o.push(m),a.set(m,v))}}));const l=new xe(o);return new ed(a,l,s.fieldTransforms)}function na(n,e,t,r,s,o){const a=n.Cc(1,e,t),l=[ao(e,r,t)],h=[s];if(o.length%2!=0)throw new N(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<o.length;v+=2)l.push(ao(e,o[v])),h.push(o[v+1]);const d=[],m=Se.empty();for(let v=l.length-1;v>=0;--v)if(!id(d,l[v])){const R=l[v];let V=h[v];V=re(V);const D=a.yc(R);if(V instanceof Ys)d.push(R);else{const C=Zt(V,D);C!=null&&(d.push(R),m.set(R,C))}}const g=new xe(d);return new ed(m,g,a.fieldTransforms)}function Hv(n,e,t,r=!1){return Zt(t,n.Cc(r?4:3,e))}function Zt(n,e){if(sd(n=re(n)))return ra("Unsupported field value:",e,n),rd(n,e);if(n instanceof Pr)return(function(r,s){if(!td(s.Ac))throw s.Sc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.Sc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.fc&&e.Ac!==4)throw e.Sc("Nested arrays are not supported");return(function(r,s){const o=[];let a=0;for(const l of r){let h=Zt(l,s.wc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}})(n,e)}return(function(r,s){if((r=re(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return D_(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=Y.fromDate(r);return{timestampValue:bs(s.serializer,o)}}if(r instanceof Y){const o=new Y(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:bs(s.serializer,o)}}if(r instanceof Qe)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof De)return{bytesValue:Ah(s.serializer,r._byteString)};if(r instanceof Z){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.Sc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Do(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Xe)return(function(a,l){return{mapValue:{fields:{[Ju]:{stringValue:Yu},[vs]:{arrayValue:{values:a.toArray().map((d=>{if(typeof d!="number")throw l.Sc("VectorValues must only contain numeric values.");return Vo(l.serializer,d)}))}}}}}})(r,s);throw s.Sc(`Unsupported field value: ${Ls(r)}`)})(n,e)}function rd(n,e){const t={};return Hu(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Nt(n,((r,s)=>{const o=Zt(s,e.mc(r));o!=null&&(t[r]=o)})),{mapValue:{fields:t}}}function sd(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof Y||n instanceof Qe||n instanceof De||n instanceof Z||n instanceof Pr||n instanceof Xe)}function ra(n,e,t){if(!sd(t)||!$u(t)){const r=Ls(t);throw r==="an object"?e.Sc(n+" a custom object"):e.Sc(n+" "+r)}}function ao(n,e,t){if((e=re(e))instanceof On)return e._internalPath;if(typeof e=="string")return sa(n,e);throw Vs("Field path arguments must be of type string or ",n,!1,void 0,t)}const Gv=new RegExp("[~\\*/\\[\\]]");function sa(n,e,t){if(e.search(Gv)>=0)throw Vs(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new On(...e.split("."))._internalPath}catch{throw Vs(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Vs(n,e,t,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let l=`Function ${e}() called with invalid data`;t&&(l+=" (via `toFirestore()`)"),l+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new N(S.INVALID_ARGUMENT,l+n+h)}function id(n,e){return n.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(e,t,r,s,o){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new Z(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new Wv(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(ia("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class Wv extends ks{data(){return super.data()}}function ia(n,e){return typeof e=="string"?sa(n,e):e instanceof On?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function od(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class oa{}class Kv extends oa{}function un(n,e,...t){let r=[];e instanceof oa&&r.push(e),r=r.concat(t),(function(o){const a=o.filter((h=>h instanceof aa)).length,l=o.filter((h=>h instanceof Zs)).length;if(a>1||a>0&&l>0)throw new N(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class Zs extends Kv{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new Zs(e,t,r)}_apply(e){const t=this._parse(e);return ad(e._query,t),new Yt(e.firestore,e.converter,Ji(e._query,t))}_parse(e){const t=Mn(e.firestore);return(function(o,a,l,h,d,m,g){let v;if(d.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new N(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){Bl(g,m);const V=[];for(const D of g)V.push(Ul(h,o,D));v={arrayValue:{values:V}}}else v=Ul(h,o,g)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||Bl(g,m),v=Hv(l,a,g,m==="in"||m==="not-in");return ie.create(d,m,v)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function Me(n,e,t){const r=e,s=ia("where",n);return Zs._create(s,r,t)}class aa extends oa{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new aa(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:Ue.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,o){let a=s;const l=o.getFlattenedFilters();for(const h of l)ad(a,h),a=Ji(a,h)})(e._query,t),new Yt(e.firestore,e.converter,Ji(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function Ul(n,e,t){if(typeof(t=re(t))=="string"){if(t==="")throw new N(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!oh(e)&&t.indexOf("/")!==-1)throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(Q.fromString(t));if(!O.isDocumentKey(r))throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return tl(n,new O(r))}if(t instanceof Z)return tl(n,t._key);throw new N(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ls(t)}.`)}function Bl(n,e){if(!Array.isArray(n)||n.length===0)throw new N(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function ad(n,e){const t=(function(s,o){for(const a of s)for(const l of a.getFlattenedFilters())if(o.indexOf(l.op)>=0)return l.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}class cd{convertValue(e,t="none"){switch(Ct(e)){case 0:return null;case 1:return e.booleanValue;case 2:return ne(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(Pt(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw M(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Nt(e,((s,o)=>{r[s]=this.convertValue(o,t)})),r}convertVectorValue(e){const t=e.fields?.[vs].arrayValue?.values?.map((r=>ne(r.doubleValue)));return new Xe(t)}convertGeoPoint(e){return new Qe(ne(e.latitude),ne(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=Us(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(dr(e));default:return null}}convertTimestamp(e){const t=St(e);return new Y(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=Q.fromString(e);W(Nh(r),9688,{name:e});const s=new fr(r.get(1),r.get(3)),o=new O(r.popFirst(5));return s.isEqual(t)||st(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),o}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ei(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class Qv extends cd{constructor(e){super(),this.firestore=e}convertBytes(e){return new De(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Z(this.firestore,null,t)}}class hn{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class At extends ks{constructor(e,t,r,s,o,a){super(e,t,r,s,a),this._firestore=e,this._firestoreImpl=e,this.metadata=o}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new cs(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(ia("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=At._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}At._jsonSchemaVersion="firestore/documentSnapshot/1.0",At._jsonSchema={type:ae("string",At._jsonSchemaVersion),bundleSource:ae("string","DocumentSnapshot"),bundleName:ae("string"),bundle:ae("string")};class cs extends At{data(e={}){return super.data(e)}}class $t{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new hn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new cs(this._firestore,this._userDataWriter,r.key,r,new hn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((l=>{const h=new cs(s._firestore,s._userDataWriter,l.doc.key,l.doc,new hn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);return l.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((l=>o||l.type!==3)).map((l=>{const h=new cs(s._firestore,s._userDataWriter,l.doc.key,l.doc,new hn(s._snapshot.mutatedKeys.has(l.doc.key),s._snapshot.fromCache),s.query.converter);let d=-1,m=-1;return l.type!==0&&(d=a.indexOf(l.doc.key),a=a.delete(l.doc.key)),l.type!==1&&(a=a.add(l.doc),m=a.indexOf(l.doc.key)),{type:Xv(l.type),doc:h,oldIndex:d,newIndex:m}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(S.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=$t._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=bo.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((o=>{o._document!==null&&(t.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function Xv(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return M(61501,{type:n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ns(n){n=Ie(n,Z);const e=Ie(n.firestore,Be);return Lv(xn(e),n._key).then((t=>ud(e,n,t)))}$t._jsonSchemaVersion="firestore/querySnapshot/1.0",$t._jsonSchema={type:ae("string",$t._jsonSchemaVersion),bundleSource:ae("string","QuerySnapshot"),bundleName:ae("string"),bundle:ae("string")};class ti extends cd{constructor(e){super(),this.firestore=e}convertBytes(e){return new De(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Z(this.firestore,null,t)}}function Yr(n){n=Ie(n,Yt);const e=Ie(n.firestore,Be),t=xn(e),r=new ti(e);return od(n._query),Fv(t,n._query).then((s=>new $t(e,r,n,s)))}function _E(n,e,t){n=Ie(n,Z);const r=Ie(n.firestore,Be),s=ei(n.converter,e,t);return Cr(r,[Js(Mn(r),"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,oe.none())])}function zt(n,e,t,...r){n=Ie(n,Z);const s=Ie(n.firestore,Be),o=Mn(s);let a;return a=typeof(e=re(e))=="string"||e instanceof On?na(o,"updateDoc",n._key,e,t,r):ta(o,"updateDoc",n._key,e),Cr(s,[a.toMutation(n._key,oe.exists(!0))])}function yE(n){return Cr(Ie(n.firestore,Be),[new br(n._key,oe.none())])}function co(n,e){const t=Ie(n.firestore,Be),r=Le(n),s=ei(n.converter,e);return Cr(t,[Js(Mn(n.firestore),"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,oe.exists(!1))]).then((()=>r))}function ld(n,...e){n=re(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||Fl(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(Fl(e[r])){const h=e[r];e[r]=h.next?.bind(h),e[r+1]=h.error?.bind(h),e[r+2]=h.complete?.bind(h)}let o,a,l;if(n instanceof Z)a=Ie(n.firestore,Be),l=Bs(n._key.path),o={next:h=>{e[r]&&e[r](ud(a,n,h))},error:e[r+1],complete:e[r+2]};else{const h=Ie(n,Yt);a=Ie(h.firestore,Be),l=h._query;const d=new ti(a);o={next:m=>{e[r]&&e[r](new $t(a,d,h,m))},error:e[r+1],complete:e[r+2]},od(n._query)}return(function(d,m,g,v){const R=new Jo(v),V=new Ko(m,R,g);return d.asyncQueue.enqueueAndForget((async()=>Ho(await Cs(d),V))),()=>{R.Nu(),d.asyncQueue.enqueueAndForget((async()=>Go(await Cs(d),V)))}})(xn(a),l,s,o)}function Cr(n,e){return(function(r,s){const o=new We;return r.asyncQueue.enqueueAndForget((async()=>Iv(await Ov(r),s,o))),o.promise})(xn(n),e)}function ud(n,e,t){const r=t.docs.get(e._key),s=new ti(n);return new At(n,s,e._key,r,new hn(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jv={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yv{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=Mn(e)}set(e,t,r){this._verifyNotCommitted();const s=vt(e,this._firestore),o=ei(s.converter,t,r),a=Js(this._dataReader,"WriteBatch.set",s._key,o,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,oe.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const o=vt(e,this._firestore);let a;return a=typeof(t=re(t))=="string"||t instanceof On?na(this._dataReader,"WriteBatch.update",o._key,t,r,s):ta(this._dataReader,"WriteBatch.update",o._key,t),this._mutations.push(a.toMutation(o._key,oe.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=vt(e,this._firestore);return this._mutations=this._mutations.concat(new br(t._key,oe.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function vt(n,e){if((n=re(n)).firestore!==e)throw new N(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zv{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=Mn(e)}get(e){const t=vt(e,this._firestore),r=new Qv(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return M(24041);const o=s[0];if(o.isFoundDocument())return new ks(this._firestore,r,o.key,o,t.converter);if(o.isNoDocument())return new ks(this._firestore,r,t._key,null,t.converter);throw M(18433,{doc:o})}))}set(e,t,r){const s=vt(e,this._firestore),o=ei(s.converter,t,r),a=Js(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,r);return this._transaction.set(s._key,a),this}update(e,t,r,...s){const o=vt(e,this._firestore);let a;return a=typeof(t=re(t))=="string"||t instanceof On?na(this._dataReader,"Transaction.update",o._key,t,r,s):ta(this._dataReader,"Transaction.update",o._key,t),this._transaction.update(o._key,a),this}delete(e){const t=vt(e,this._firestore);return this._transaction.delete(t._key),this}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE extends Zv{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=vt(e,this._firestore),r=new ti(this._firestore);return super.get(e).then((s=>new At(this._firestore,r,t._key,s._document,new hn(!1,!1),t.converter)))}}function vE(n,e,t){n=Ie(n,Be);const r={...Jv,...t};return(function(o){if(o.maxAttempts<1)throw new N(S.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r),(function(o,a,l){const h=new We;return o.asyncQueue.enqueueAndForget((async()=>{const d=await Mv(o);new Nv(o.asyncQueue,d,l,a,h).ju()})),h.promise})(xn(n),(s=>e(new eE(n,s))),r)}function jl(...n){return new Zo("arrayUnion",n)}function EE(...n){return new ea("arrayRemove",n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TE(n){return xn(n=Ie(n,Be)),new Yv(n,(e=>Cr(n,e)))}(function(e,t=!0){(function(s){Vn=s})(Pn),gn(new Gt("firestore",((r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),l=new Be(new Hg(r.getProvider("auth-internal")),new Kg(a,r.getProvider("app-check-internal")),(function(d,m){if(!Object.prototype.hasOwnProperty.apply(d.options,["projectId"]))throw new N(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new fr(d.options.projectId,m)})(a,s),a);return o={useFetchStreams:t,...o},l._setSettings(o),l}),"PUBLIC").setMultipleInstances(!0)),It(qc,$c,e),It(qc,$c,"esm2020")})();const tE={apiKey:"AIzaSyAf2Fmg5SBU6zpZ9r-VP_eTF49r-e1go7Q",authDomain:"gustoplan-dev.firebaseapp.com",projectId:"gustoplan-dev",storageBucket:"gustoplan-dev.firebasestorage.app",messagingSenderId:"554162135180",appId:"1:554162135180:web:f5addf322a0977ffe31ba9"},ca=Zl(tE),pe=Bv(ca),lo=Ug(ca),nE=Object.freeze(Object.defineProperty({__proto__:null,auth:lo,db:pe,firebaseApp:ca},Symbol.toStringTag,{value:"Module"}));let Ds=null;function hd(){return new Promise(n=>{Sp(lo,e=>{if(Ds=e,e){console.log("User is logged in:",e.uid);const t=document.getElementById("logout-btn"),r=document.getElementById("profile-btn");t&&t.classList.remove("hidden"),r&&r.classList.remove("hidden"),t&&!t.hasAttribute("data-listener-attached")&&(t.addEventListener("click",()=>{Pp(lo).catch(s=>{console.error("Sign Out Error",s)})}),t.setAttribute("data-listener-attached","true")),n(e)}else{console.log("User not logged in. Redirecting to login.html");const t=window.location.origin+"/login.html";window.location.href!==t&&(window.location.href=t),n(null)}})})}function Ht(){return Ds?Ds.uid:null}function dd(){return Ds}const rE=Object.freeze(Object.defineProperty({__proto__:null,getCurrentUser:dd,getCurrentUserId:Ht,protectPage:hd},Symbol.toStringTag,{value:"Module"}));async function fd(n,e){const t=Ht();if(!t||!e)return;const r=Le(pe,"friend_requests",n),s=Le(pe,"users",t),o=Le(pe,"users",e);try{await zt(r,{status:"accepted"}),await zt(s,{friends:jl(e)}),await zt(o,{friends:jl(t)})}catch(a){throw console.error("Erreur lors de l'acceptation de l'invitation : ",a),a}}async function md(n){const e=Le(pe,"friend_requests",n);try{await zt(e,{status:"declined"})}catch(t){throw console.error("Erreur lors du refus de l'invitation : ",t),t}}function sE(){const n=document.getElementById("search-friends-input"),e=document.getElementById("search-friends-btn"),t=document.getElementById("search-results-container");e.addEventListener("click",()=>{const l=n.value.trim();l?r(l):t.innerHTML=""});async function r(l){const h=Ht();if(!h)return;t.innerHTML='<p class="text-gray-500">Recherche en cours...</p>';const d=l.toLowerCase();try{const m=Rn(pe,"users"),g=un(m,Me("displayName_lowercase",">=",d),Me("displayName_lowercase","<=",d+"")),v=un(m,Me("email",">=",d),Me("email","<=",d+"")),[R,V]=await Promise.all([Yr(g),Yr(v)]),D=new Map;R.forEach(C=>{C.id!==h&&D.set(C.id,{id:C.id,...C.data()})}),V.forEach(C=>{C.id!==h&&!D.has(C.id)&&D.set(C.id,{id:C.id,...C.data()})}),s(Array.from(D.values()))}catch(m){console.error("Erreur lors de la recherche d'utilisateurs : ",m),t.innerHTML='<p class="text-red-500">Une erreur est survenue.</p>'}}function s(l){if(t.innerHTML="",l.length===0){t.innerHTML='<p class="text-gray-500">Aucun utilisateur trouvé.</p>';return}l.forEach(h=>{const d=document.createElement("div");d.className="flex items-center justify-between p-2 bg-gray-100 rounded-lg";const m=document.createElement("div");m.className="flex items-center";const g=document.createElement("img");g.src=h.photoURL||"https://placehold.co/40x40",g.alt=h.displayName,g.className="w-8 h-8 rounded-full mr-3",m.appendChild(g);const v=document.createElement("span");v.className="font-medium",v.textContent=h.displayName||h.email,m.appendChild(v),d.appendChild(m);const R=document.createElement("button");R.className="btn btn-primary btn-sm",R.innerHTML='<i class="fas fa-user-plus"></i>',R.title="Envoyer une invitation",R.addEventListener("click",()=>a(h.id,R)),d.appendChild(R),t.appendChild(d)})}async function o(){const l=Ht();if(!l)return;const h=document.getElementById("friends-list-container");if(h){h.innerHTML='<p class="text-gray-500">Chargement...</p>';try{const d=await Ns(Le(pe,"users",l));if(d.exists()){const g=d.data().friends||[];if(g.length===0){h.innerHTML=`<p class="text-gray-500">Vous n'avez pas encore d'amis.</p>`;return}h.innerHTML="";for(const v of g){const R=await Ns(Le(pe,"users",v));if(R.exists()){const V=R.data(),D=document.createElement("div");D.className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm";const C=document.createElement("div");C.className="flex items-center";const B=document.createElement("img");B.src=V.photoURL||"https://placehold.co/40x40",B.alt=V.displayName,B.className="w-10 h-10 rounded-full mr-4",C.appendChild(B);const q=document.createElement("span");q.className="font-bold text-gray-700",q.textContent=V.displayName||V.email,C.appendChild(q),D.appendChild(C);const K=document.createElement("div");D.appendChild(K),h.appendChild(D)}}}}catch(d){console.error("Erreur lors du chargement des amis : ",d),h.innerHTML='<p class="text-red-500">Une erreur est survenue.</p>'}}}o();async function a(l,h){const d=Ht();if(!(!d||!l||d===l)){h.disabled=!0,h.innerHTML='<i class="fas fa-check"></i>';try{const m=Rn(pe,"friend_requests"),g=un(m,Me("senderId","==",d),Me("receiverId","==",l)),v=un(m,Me("senderId","==",l),Me("receiverId","==",d)),[R,V]=await Promise.all([Yr(g),Yr(v)]);if(!R.empty||!V.empty){console.log("Une demande d'ami existe déjà.");return}await co(m,{senderId:d,receiverId:l,status:"pending",createdAt:new Date})}catch(m){console.error("Erreur lors de l'envoi de la demande d'ami : ",m),h.disabled=!1,h.innerHTML='<i class="fas fa-user-plus"></i>'}}}}const iE=Object.freeze(Object.defineProperty({__proto__:null,acceptFriendRequest:fd,declineFriendRequest:md,default:sE},Symbol.toStringTag,{value:"Module"}));let pd=[],gd=[],_d=()=>{},yd=()=>{};const le={btn:null,badge:null,dropdown:null,list:null};async function oE(n,e,t){const r=Ht();if(r)try{const s=Le(pe,"shares",n);if(await zt(s,{status:"accepted"}),e.plan){const o=t.displayName||"Inconnu",a=`Copie de "${e.plan.name}" (de ${o})`,l={...e.plan,userId:r,name:a,isShared:!0,originalOwnerId:e.senderId,sharedAt:new Date,collaborators:[]};delete l.id,await co(Rn(pe,"plans"),l)}e.shoppingList&&await co(Rn(pe,"shopping_lists"),{name:`${e.shoppingList.name} (de ${t.displayName})`,ingredients:e.shoppingList.ingredients,userId:r,isShared:!0,originalOwner:t.uid,sharedAt:new Date})}catch(s){console.error("Erreur lors de l'acceptation du partage : ",s),alert("Une erreur est survenue.")}}async function aE(n){try{const e=Le(pe,"shares",n);await zt(e,{status:"accepted"})}catch(e){console.error("Erreur lors de l'acceptation de l'invitation : ",e),alert("Une erreur est survenue.")}}async function ql(n){try{const e=Le(pe,"shares",n);await zt(e,{status:"declined"})}catch(e){console.error("Erreur lors du refus du partage : ",e),alert("Une erreur est survenue.")}}async function cE(n,e){try{await fd(n,e)}catch{alert("Erreur lors de l'acceptation.")}}async function lE(n){try{await md(n)}catch{alert("Erreur lors du refus.")}}function vd(){if(!le.list)return;const n=[...pd,...gd];n.sort((e,t)=>t.createdAt.toMillis()-e.createdAt.toMillis()),n.length>0?(le.badge.textContent=n.length,le.badge.classList.remove("hidden")):le.badge.classList.add("hidden"),le.list.innerHTML="",n.length===0?le.list.innerHTML='<p class="text-gray-500 text-center p-4">Aucune nouvelle notification.</p>':n.forEach(e=>{const t=uE(e);le.list.appendChild(t)})}function uE(n){const e=document.createElement("div");e.className="p-3 border-b border-gray-100 hover:bg-gray-50";const t=document.createElement("p");t.className="text-sm font-medium text-gray-800";const r=document.createElement("p");r.className="text-xs text-gray-500 mb-3";const s=document.createElement("div");if(s.className="flex space-x-2 justify-end",n.data.type==="collaborative_plan_invite"){t.textContent="Invitation à collaborer",r.textContent=`${n.sender.displayName} vous invite à modifier son plan "${n.data.planName}".`;const o=rn("Accepter","btn-secondary",l=>{l.target.textContent="...",l.target.disabled=!0,aE(n.id)}),a=rn("Refuser","btn-ghost text-red-500",l=>{l.target.disabled=!0,ql(n.id)});s.append(o,a)}else if(n.type==="share"){t.textContent=`Partage de ${n.sender.displayName||n.sender.email}`;let o=[];n.data.plan&&o.push("planification"),n.data.shoppingList&&o.push("liste de courses"),r.textContent=`Contenu : ${o.join(" et ")}`;const a=rn("Accepter","btn-secondary",h=>{h.target.textContent="...",h.target.disabled=!0,oE(n.id,n.data,n.sender)}),l=rn("Refuser","btn-ghost text-red-500",h=>{h.target.disabled=!0,ql(n.id)});s.append(a,l)}else if(n.type==="friend_request"){t.textContent="Invitation d'ami",r.textContent=`${n.sender.displayName||n.sender.email} vous a envoyé une invitation.`;const o=rn("Accepter","btn-secondary",l=>{l.target.textContent="...",l.target.disabled=!0,cE(n.id,n.data.senderId)}),a=rn("Refuser","btn-ghost text-red-500",l=>{l.target.disabled=!0,lE(n.id)});s.append(o,a)}return e.append(t,r,s),e}function rn(n,e,t){const r=document.createElement("button");return r.className=`btn btn-xs ${e}`,r.textContent=n,r.addEventListener("click",s=>{s.stopPropagation(),t(s)}),r}function hE(n){const e=Rn(pe,"shares"),t=un(e,Me("receiverId","==",n),Me("status","==","pending"));_d=ld(t,async r=>{const s=[];for(const o of r.docs){const a=o.data(),l=await Ns(Le(pe,"users",a.senderId));l.exists()&&s.push({type:"share",id:o.id,data:a,sender:l.data(),createdAt:a.createdAt})}pd=s,vd()},r=>{console.error("Erreur d'écoute des partages:",r)})}function dE(n){const e=Rn(pe,"friend_requests"),t=un(e,Me("receiverId","==",n),Me("status","==","pending"));yd=ld(t,async r=>{const s=[];for(const o of r.docs){const a=o.data(),l=await Ns(Le(pe,"users",a.senderId));l.exists()&&s.push({type:"friend_request",id:o.id,data:a,sender:l.data(),createdAt:a.createdAt})}gd=s,vd()},r=>{console.error("Erreur d'écoute des invitations d'amis:",r)})}function Ed(){if(le.btn=document.getElementById("notifications-btn"),le.badge=document.getElementById("notifications-badge"),le.dropdown=document.getElementById("notifications-dropdown"),le.list=document.getElementById("notifications-list"),!le.btn)return;const n=Ht();n&&(_d(),yd(),hE(n),dE(n),le.btn.addEventListener("click",e=>{e.stopPropagation(),le.dropdown.classList.toggle("hidden")}),document.addEventListener("click",e=>{le.dropdown&&!le.dropdown.classList.contains("hidden")&&!le.btn.contains(e.target)&&!le.dropdown.contains(e.target)&&le.dropdown.classList.add("hidden")}))}const fE=Object.freeze(Object.defineProperty({__proto__:null,initNotifications:Ed},Symbol.toStringTag,{value:"Module"}));function mE(){const n=dd();if(n){const t=document.getElementById("user-display-name");t&&(t.textContent=n.displayName||n.email)}const e=document.querySelectorAll(".nav-btn");e.forEach(t=>{t.addEventListener("click",r=>{const s=r.currentTarget.dataset.path;dc(s),e.forEach(o=>{o.classList.remove("bg-tomato","text-white"),o.classList.add("bg-white","text-tomato")}),r.currentTarget.classList.add("bg-tomato","text-white"),r.currentTarget.classList.remove("bg-white","text-tomato")})}),dc("menu"),Ed()}document.addEventListener("DOMContentLoaded",()=>{hd().then(n=>{n&&mE()})});const pE=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"}));export{Le as a,co as b,Rn as c,pe as d,TE as e,yE as f,Yr as g,Ht as h,Bv as i,dd as j,EE as k,Ns as l,ld as o,un as q,vE as r,_E as s,zt as u,Me as w};

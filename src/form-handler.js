import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from './firebase-config.js';

class RecipeFormHandler {
    constructor() {
        this.db = db;
        this.functions = getFunctions();
        this.masterIngredientList = [];
        this.activityUpdater = null;
        this.onSaveCallback = null;

        // State for listeners
        this.listenersAttached = false;
        this.currentIngredientsArray = []; // Reference to the active ingredients array

        // IDs map (hardcoded as they are unique in index.html)
        this.elementIds = {
            modal: 'edit-recipe-form-modal',
            form: 'edit-recipe-form',
            title: 'edit-recipe-modal-title',
            idInput: 'edit-recipe-id',
            nameInput: 'edit-recipe-name',
            categoryInput: 'edit-recipe-category',
            servingsInput: 'edit-recipe-servings',
            prepTimeInput: 'edit-recipe-prep-time',
            difficultyInput: 'edit-recipe-difficulty',
            stepsTextarea: 'edit-recipe-steps',
            ingredientsList: 'edit-ingredients-list',
            addIngredientBtn: 'edit-add-ingredient-btn',
            saveBtn: 'edit-save-recipe-btn',
            closeBtn: 'close-edit-recipe-modal',
            cancelBtn: 'edit-cancel-recipe-btn',
            imageUrlInput: 'edit-recipe-image-url',
            // Magic Import
            magicImportUrl: 'magic-import-url',
            magicImportBtn: 'btn-magic-import',
            magicImportStatus: 'magic-import-status',
            // AI Generator
            aiGeneratePrompt: 'ai-generate-prompt',
            aiGenerateBtn: 'btn-ai-generate',
            aiGenerateStatus: 'ai-generate-status'
        };

        this.boundHandleMagicImport = this.handleMagicImport.bind(this);
        this.boundHandleAiGenerate = this.handleAiGenerate.bind(this);
        // Bind existing methods for consistent event listener removal/addition
        this.boundCloseForm = this.closeForm.bind(this);
        this.boundHandleSubmit = null; // Will be bound in openForm
        this.boundAddIngredient = null;

        this.init();
    }

    init() {
        this.bindElements();
        if (this.modal) {
            this.attachListeners();
        }
    }

    bindElements() {
        this.modal = document.getElementById(this.elementIds.modal);
        if (!this.modal) return;

        this.form = document.getElementById(this.elementIds.form);
        this.title = document.getElementById(this.elementIds.title);
        this.recipeIdInput = document.getElementById(this.elementIds.idInput);
        this.recipeNameInput = document.getElementById(this.elementIds.nameInput);
        this.recipeCategoryInput = document.getElementById(this.elementIds.categoryInput);
        this.recipeServingsInput = document.getElementById(this.elementIds.servingsInput);
        this.recipePrepTimeInput = document.getElementById(this.elementIds.prepTimeInput);
        this.recipeDifficultyInput = document.getElementById(this.elementIds.difficultyInput);
        this.recipeStepsTextarea = document.getElementById(this.elementIds.stepsTextarea);
        this.ingredientsListDiv = document.getElementById(this.elementIds.ingredientsList);
        this.addIngredientBtn = document.getElementById(this.elementIds.addIngredientBtn);
        this.saveRecipeBtn = document.getElementById(this.elementIds.saveBtn);
        this.closeButton = document.getElementById(this.elementIds.closeBtn);
        this.cancelButton = document.getElementById(this.elementIds.cancelBtn);
        this.recipeImageUrlInput = document.getElementById(this.elementIds.imageUrlInput);

        // Magic Import
        this.magicImportUrl = document.getElementById(this.elementIds.magicImportUrl);
        this.magicImportBtn = document.getElementById(this.elementIds.magicImportBtn);
        this.magicImportStatus = document.getElementById(this.elementIds.magicImportStatus);

        // AI Generator
        this.aiGeneratePrompt = document.getElementById(this.elementIds.aiGeneratePrompt);
        this.aiGenerateBtn = document.getElementById(this.elementIds.aiGenerateBtn);
        this.aiGenerateStatus = document.getElementById(this.elementIds.aiGenerateStatus);
    }

    attachListeners() {
        if (this.listenersAttached) return;

        this.closeButton.addEventListener('click', this.boundCloseForm);
        this.cancelButton.addEventListener('click', this.boundCloseForm);

        if (this.magicImportBtn) {
            this.magicImportBtn.addEventListener('click', this.boundHandleMagicImport);
        }
        if (this.aiGenerateBtn) {
            this.aiGenerateBtn.addEventListener('click', this.boundHandleAiGenerate);
        }

        // --- NEW BINDINGS ---
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        if (this.addIngredientBtn) {
            this.addIngredientBtn.addEventListener('click', () => {
                this.addIngredientInput(undefined, this.currentIngredientsArray);
            });
        }
        // --------------------

        this.initSeasonalityListeners();
        this.listenersAttached = true;
    }

    async handleAiGenerate() {
        const prompt = this.aiGeneratePrompt.value.trim();
        if (!prompt) {
            alert("Veuillez décrire votre envie ou vos ingrédients.");
            return;
        }

        this.aiGenerateStatus.classList.remove('hidden');
        this.aiGenerateBtn.disabled = true;
        this.aiGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const generateRecipe = httpsCallable(this.functions, 'generateRecipe');
            const result = await generateRecipe({ prompt });
            const data = result.data.data || result.data;

            if (data.error) throw new Error(data.error);

            this.populateFormFromAi(data);

            this.aiGenerateStatus.classList.add('hidden');
            alert("Recette générée avec succès !");

        } catch (error) {
            console.error("Generation failed", error);
            alert("Erreur de génération : " + error.message);
            this.aiGenerateStatus.classList.add('hidden');
        } finally {
            this.aiGenerateBtn.disabled = false;
            this.aiGenerateBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Créer';
        }
    }

    async handleMagicImport() {
        const url = this.magicImportUrl.value.trim();
        if (!url) {
            alert("Veuillez entrer une URL valide.");
            return;
        }

        this.magicImportStatus.classList.remove('hidden');
        this.magicImportBtn.disabled = true;
        this.magicImportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        try {
            const extractRecipe = httpsCallable(this.functions, 'extractRecipeFromUrl');
            const result = await extractRecipe({ url });
            const data = result.data.data || result.data;

            if (data.error) throw new Error(data.error);

            this.populateFormFromAi(data);

            this.magicImportStatus.classList.add('hidden');
            alert("Recette importée avec succès !");

        } catch (error) {
            console.error("Import failed", error);
            alert("Erreur lors de l'import : " + error.message);
            this.magicImportStatus.classList.add('hidden');
        } finally {
            this.magicImportBtn.disabled = false;
            this.magicImportBtn.innerHTML = '<i class="fas fa-magic mr-2"></i> Importer';
        }
    }

    async askAiForConversion(name, quantity, fromUnit, toUnit) {
        const prompt = `Convertis cette quantité d'ingrédient de son unité actuelle vers l'unité cible.
        Ingrédient: ${name}
        Quantité d'origine: ${quantity}
        Unité d'origine: ${fromUnit}
        Unité cible: ${toUnit}
        
        Réponds UNIQUEMENT avec le chiffre (nombre ou fraction) correspondant à la nouvelle quantité. Pas de texte, pas d'unité. Ex: "3" ou "0.5".`;

        try {
            const generateRecipe = httpsCallable(this.functions, 'generateRecipe'); // Reuse generic generation
            const result = await generateRecipe({ prompt });
            // The result will be a JSON, but we asked for just a number in the prompt. 
            // We might need a more specialized function or just parse the text.
            // Let's assume the prompt returns a JSON or text we can clean.
            const response = result.data.data || result.data;
            const text = response.steps || response.toString(); // Fallback to steps if it's the recipe object

            // Clean non-numeric characters except . and /
            const cleaned = text.replace(/[^0-9./]/g, '').trim();
            return cleaned;
        } catch (error) {
            console.error("AI Conversion error:", error);
            return null;
        }
    }

    populateFormFromAi(data) {
        if (data.name) this.recipeNameInput.value = data.name;
        if (data.servings) this.recipeServingsInput.value = data.servings;
        if (data.prepTime) this.recipePrepTimeInput.value = data.prepTime;
        if (data.steps) this.recipeStepsTextarea.value = Array.isArray(data.steps) ? data.steps.join('\n') : data.steps;

        if (data.category) {
            const options = Array.from(this.recipeCategoryInput.options).map(o => o.value);
            const upperCat = data.category.toUpperCase();
            if (options.includes(upperCat)) this.recipeCategoryInput.value = upperCat;
        }

        if (this.currentIngredientsArray && data.ingredients) {
            this.currentIngredientsArray.length = 0;
            this.ingredientsListDiv.innerHTML = '';

            data.ingredients.forEach(ing => {
                const name = ing.name;
                // Check if known
                const isKnown = this.masterIngredientList.some(
                    known => known.name.toLowerCase() === name.toLowerCase()
                );

                this.addIngredientInput({
                    name: name,
                    quantity: ing.quantity,
                    unit: ing.unit || 'pièce',
                    originalUnit: ing.unit || 'pièce', // Store for AI Unit Adapter
                    originalName: name // Store the AI's original suggestion
                }, this.currentIngredientsArray, !isKnown);
            });
        }
    }

    initSeasonalityListeners() {
        const seasonCheckboxes = document.querySelectorAll('.recipe-season-checkbox');
        const monthCheckboxes = document.querySelectorAll('.recipe-month-checkbox');

        seasonCheckboxes.forEach(sc => {
            sc.addEventListener('change', (e) => {
                const season = e.target.value;
                const relatedMonths = document.querySelectorAll(`.recipe-month-checkbox[data-season="${season}"]`);
                relatedMonths.forEach(mc => mc.checked = e.target.checked);
            });
        });

        monthCheckboxes.forEach(mc => {
            mc.addEventListener('change', (e) => {
                const season = e.target.dataset.season;
                const seasonCheckbox = document.querySelector(`.recipe-season-checkbox[value="${season}"]`);

                if (e.target.checked) {
                    if (seasonCheckbox) seasonCheckbox.checked = true;
                } else {
                    const relatedMonths = document.querySelectorAll(`.recipe-month-checkbox[data-season="${season}"]:checked`);
                    if (seasonCheckbox && relatedMonths.length === 0) {
                        seasonCheckbox.checked = false;
                    }
                }
            });
        });
    }

    setActivityUpdater(updaterFn) {
        this.activityUpdater = updaterFn;
    }

    async openForm(recipe = null, title = 'Ajouter une recette') {
        this.bindElements();
        if (!this.modal) return;

        if (this.activityUpdater) {
            this.activityUpdater('editing_recipe');
        }

        await this.fetchMasterIngredients(); // Charger les ingrédients de base

        console.log("openForm called with recipe:", recipe, "and title:", title);
        this.form.reset();
        this.ingredientsListDiv.innerHTML = '';
        this.title.textContent = title;

        // Reset Magic Import
        if (this.magicImportUrl) this.magicImportUrl.value = '';
        if (this.magicImportStatus) this.magicImportStatus.classList.add('hidden');
        // Reset AI Generator
        if (this.aiGeneratePrompt) this.aiGeneratePrompt.value = '';
        if (this.aiGenerateStatus) this.aiGenerateStatus.classList.add('hidden');

        let ingredients = [];
        this.form.ingredients = ingredients;
        this.currentIngredientsArray = ingredients;

        if (recipe) {
            this.recipeIdInput.value = recipe.id || '';
            this.recipeNameInput.value = recipe.name || '';
            const categoryToSelect = recipe.category || 'Plat';
            for (const option of this.recipeCategoryInput.options) {
                if (option.value.toLowerCase() === categoryToSelect.toLowerCase()) {
                    option.selected = true;
                    break;
                }
            }
            this.recipeServingsInput.value = parseInt(recipe.servings) || '';
            this.recipePrepTimeInput.value = parseInt(recipe.prepTime) || '';
            this.recipeDifficultyInput.value = recipe.difficulty || 'Moyen';
            this.recipeImageUrlInput.value = recipe.imageUrl || '';
            this.recipeStepsTextarea.value = recipe.steps || '';

            // Handle Seasonality
            const seasons = recipe.seasons || [];
            ['Printemps', 'Eté', 'Automne', 'Hiver'].forEach(season => {
                // Note: ID logic must match what was added to router.js
                // In router.js I added IDs: recipe-season-printemps, recipe-season-ete, recipe-season-automne, recipe-season-hiver
                const seasonId = `recipe-season-${season.toLowerCase().replace('é', 'e')}`;
                const checkbox = document.getElementById(seasonId);
                if (checkbox) checkbox.checked = seasons.includes(season);
            });

            // Handle Months
            const months = recipe.months || [];
            document.querySelectorAll('.recipe-month-checkbox').forEach(cb => {
                cb.checked = months.includes(cb.value);
            });

            if (recipe.ingredients && recipe.ingredients.length > 0) {
                recipe.ingredients.forEach(ing => this.addIngredientInput({ ...ing }, ingredients));
            } else {
                this.addIngredientInput(undefined, ingredients);
            }
        } else {
            this.recipeIdInput.value = '';
            // Reset Seasonality
            ['Printemps', 'Eté', 'Automne', 'Hiver'].forEach(season => {
                const seasonId = `recipe-season-${season.toLowerCase().replace('é', 'e')}`;
                const checkbox = document.getElementById(seasonId);
                if (checkbox) checkbox.checked = false;
            });
            document.querySelectorAll('.recipe-month-checkbox').forEach(cb => cb.checked = false);
            this.addIngredientInput(undefined, ingredients);
        }
        this.modal.classList.remove('hidden');
    }

    closeForm() {
        if (this.activityUpdater) {
            this.activityUpdater('idle');
        }
        this.modal.classList.add('hidden');
    }

    async fetchMasterIngredients() {
        this.masterIngredientList = [];
        if (!this.db) return;
        try {
            const querySnapshot = await getDocs(collection(this.db, "ingredients"));
            this.masterIngredientList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            this.masterIngredientList.sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error("Erreur lors de la récupération de la liste des ingrédients: ", error);
            alert("Impossible de charger la liste des ingrédients de base. La recherche ne fonctionnera pas.");
        }
    }

    addIngredientInput(ingredient = { quantity: '', name: '', unit: '', originalName: '' }, ingredientsArray, isWarning = false) {
        const ingredientRow = document.createElement('div');
        ingredientRow.className = 'relative flex items-stretch space-x-2 ingredient-row';

        const newIngredient = { ...ingredient };
        ingredientsArray.push(newIngredient);
        const index = ingredientsArray.length - 1;

        // --- Quantity Input ---
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.className = 'ingredient-quantity mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm';
        quantityInput.placeholder = 'Qté';
        quantityInput.value = newIngredient.quantity;
        quantityInput.addEventListener('change', (e) => {
            ingredientsArray[index].quantity = e.target.value;
        });

        // --- Unit Display (replaces select) ---
        const unitDisplay = document.createElement('input');
        unitDisplay.type = 'text';
        unitDisplay.className = 'ingredient-unit mt-1 block w-1/4 rounded-md border-gray-300 shadow-sm bg-gray-100';
        unitDisplay.placeholder = 'Unité';
        unitDisplay.readOnly = true;
        unitDisplay.value = newIngredient.unit || '';
        unitDisplay.addEventListener('change', (e) => {
            ingredientsArray[index].unit = e.target.value;
        });

        const nameInputContainer = document.createElement('div');
        nameInputContainer.className = 'w-1/2 flex items-center space-x-1';

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'relative flex-1'; // Wrapper for relative positioning

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'ingredient-name mt-1 block w-full rounded-md border-gray-300 shadow-sm transition-all duration-200';
        nameInput.placeholder = 'Chercher un ingrédient...';
        nameInput.value = newIngredient.name;

        // Auto-select text on focus
        nameInput.addEventListener('focus', () => {
            nameInput.select();
        });

        const updateValidity = async (val) => {
            const lowVal = val.toLowerCase();
            const exists = this.masterIngredientList.some(i => i.name.toLowerCase() === lowVal);

            if (exists) {
                nameInput.classList.remove('border-orange-500', 'bg-orange-50');
                nameInput.title = "";
                createBtn.classList.add('hidden');

                // Also update unit if possible
                const k = this.masterIngredientList.find(i => i.name.toLowerCase() === lowVal);
                if (k) {
                    unitDisplay.value = k.unit;
                    unitDisplay.readOnly = true;
                    unitDisplay.classList.add('bg-gray-100');
                    ingredientsArray[index].id = k.id;
                    ingredientsArray[index].unit = k.unit;

                    // --- AI Unit Adapter Logic ---
                    // If ingredient came from AI and had a different unit, show convert button
                    if (newIngredient.originalUnit && newIngredient.originalUnit !== k.unit && newIngredient.quantity) {
                        convertBtn.classList.remove('hidden');
                        convertBtn.title = `L'IA suggère ${newIngredient.quantity} ${newIngredient.originalUnit}, mais votre unité standard est ${k.unit}. Cliquer pour convertir.`;
                        nameInput.classList.add('border-orange-500', 'bg-orange-50'); // Keep orange to force conversion
                    } else {
                        convertBtn.classList.add('hidden');
                    }
                }
            } else if (val.trim() !== "") {
                nameInput.classList.add('border-orange-500', 'bg-orange-50');
                nameInput.title = "Ingrédient inconnu. Cliquez sur '+' pour créer ou restaurez l'original.";
                createBtn.classList.remove('hidden');
                convertBtn.classList.add('hidden');

                // Allow editing unit for unknown ingredients
                unitDisplay.readOnly = false;
                unitDisplay.classList.remove('bg-gray-100');
            } else {
                nameInput.classList.remove('border-orange-500', 'bg-orange-50');
                createBtn.classList.add('hidden');
                convertBtn.classList.add('hidden');
                unitDisplay.readOnly = false;
                unitDisplay.classList.remove('bg-gray-100');
            }

            // Show/Hide Restore button
            if (newIngredient.originalName && val !== newIngredient.originalName) {
                restoreBtn.classList.remove('hidden');
            } else {
                restoreBtn.classList.add('hidden');
            }
        };

        if (isWarning) {
            nameInput.classList.add('border-orange-500', 'bg-orange-50');
        }

        // Structure the elements
        inputWrapper.appendChild(nameInput);
        nameInputContainer.appendChild(inputWrapper);

        // Convert Button (AI Unit Adapter)
        const convertBtn = document.createElement('button');
        convertBtn.type = 'button';
        convertBtn.className = 'ml-1 p-1 rounded-full text-tomato bg-tomato/10 hover:bg-tomato/20 border border-tomato/30 hidden transition-all';
        convertBtn.innerHTML = '<i class="fas fa-calculator"></i>';
        convertBtn.addEventListener('click', async () => {
            const currentName = nameInput.value;
            const targetUnit = unitDisplay.value;
            const sourceQty = quantityInput.value;
            const sourceUnit = newIngredient.originalUnit;

            convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            convertBtn.disabled = true;

            try {
                const suggestion = await this.askAiForConversion(currentName, sourceQty, sourceUnit, targetUnit);
                if (suggestion) {
                    quantityInput.value = suggestion;
                    ingredientsArray[index].quantity = suggestion;
                    alert(`Conversion effectuée : ${sourceQty} ${sourceUnit} de ${currentName} vaut environ ${suggestion} ${targetUnit}.`);

                    // Now matches standard, clear warning
                    newIngredient.originalUnit = targetUnit;
                    updateValidity(currentName);
                }
            } catch (e) {
                console.error("Conversion failed", e);
                alert("Échec de la conversion IA.");
            } finally {
                convertBtn.innerHTML = '<i class="fas fa-calculator"></i>';
                convertBtn.disabled = false;
            }
        });
        nameInputContainer.appendChild(convertBtn);

        // Restore Original Button
        const restoreBtn = document.createElement('button');
        restoreBtn.type = 'button';
        restoreBtn.className = 'ml-1 p-1 rounded-full text-blue-500 hover:bg-blue-50 hidden transition-opacity';
        restoreBtn.innerHTML = '<i class="fas fa-undo"></i>';
        restoreBtn.title = `Restaurer l'original: ${newIngredient.originalName}`;
        restoreBtn.addEventListener('click', () => {
            nameInput.value = newIngredient.originalName;
            updateValidity(newIngredient.originalName);
            ingredientsArray[index].name = newIngredient.originalName;
        });
        nameInputContainer.appendChild(restoreBtn);

        // Warning/Create Button for unknown ingredients
        const createBtn = document.createElement('button');
        createBtn.type = 'button';
        createBtn.className = `ml-1 p-1 rounded-full text-white bg-orange-500 hover:bg-orange-600 shadow-sm transition-opacity ${isWarning ? '' : 'hidden'}`;
        createBtn.innerHTML = '<i class="fas fa-plus"></i>';
        createBtn.title = "Créer cet ingrédient";
        createBtn.addEventListener('click', () => {
            const newName = nameInput.value;
            import('./ingredient-modal.js').then(({ ingredientModalManager }) => {
                ingredientModalManager.open(newName, (createdIngredient) => {
                    this.fetchMasterIngredients().then(() => {
                        nameInput.value = createdIngredient.name;
                        updateValidity(createdIngredient.name);
                    });
                });
            });
        });
        nameInputContainer.appendChild(createBtn);

        // --- Search Results ---
        const resultsDiv = document.createElement('div');
        // Added top-full and z-50 to ensure it's below input and doesn't overlap
        resultsDiv.className = 'absolute z-50 left-0 right-0 top-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 hidden max-h-48 overflow-y-auto';
        inputWrapper.appendChild(resultsDiv);

        nameInput.addEventListener('input', () => {
            const searchTerm = nameInput.value;
            updateValidity(searchTerm);

            if (!searchTerm) {
                resultsDiv.classList.add('hidden');
                return;
            }

            const lowSearch = searchTerm.toLowerCase();
            const filtered = this.masterIngredientList.filter(i => i.name.toLowerCase().includes(lowSearch));
            resultsDiv.innerHTML = '';

            filtered.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'p-2 ingredient-search-item cursor-pointer';
                resultItem.textContent = item.name;
                resultItem.addEventListener('click', () => {
                    nameInput.value = item.name;
                    unitDisplay.value = item.unit; // Update the display
                    resultsDiv.classList.add('hidden');
                    // Update validity and array
                    updateValidity(item.name);
                    ingredientsArray[index].name = item.name;
                    ingredientsArray[index].unit = item.unit;
                    ingredientsArray[index].id = item.id; // Store ID
                });
                resultsDiv.appendChild(resultItem);
            });

            // Option to create new
            const createItem = document.createElement('div');
            createItem.className = 'p-2 bg-blue-50 hover:bg-blue-200 cursor-pointer font-bold text-blue-700';
            createItem.textContent = `+ Créer "${nameInput.value}"`;
            createItem.addEventListener('click', () => {
                const newName = nameInput.value;
                import('./ingredient-modal.js').then(({ ingredientModalManager }) => {
                    ingredientModalManager.open(newName, (newIngredient) => {
                        // On success callback
                        this.fetchMasterIngredients().then(() => {
                            nameInput.value = newIngredient.name;
                            unitDisplay.value = newIngredient.unit;
                            resultsDiv.classList.add('hidden');

                            ingredientsArray[index].name = newIngredient.name;
                            ingredientsArray[index].unit = newIngredient.unit;
                            ingredientsArray[index].id = newIngredient.id;
                        });
                    });
                });
            });
            resultsDiv.appendChild(createItem);

            resultsDiv.classList.remove('hidden');
        });

        // --- Remove Button ---
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'text-red-500 hover:bg-red-50 text-sm px-3 py-1 rounded-md mt-1';
        removeBtn.innerHTML = '<i class="fas fa-trash"></i>';
        removeBtn.addEventListener('click', () => {
            ingredientRow.remove();
            ingredientsArray[index] = null;
        });

        ingredientRow.appendChild(nameInputContainer);
        ingredientRow.appendChild(quantityInput);
        ingredientRow.appendChild(unitDisplay);
        ingredientRow.appendChild(removeBtn);
        this.ingredientsListDiv.appendChild(ingredientRow);
    }

    async handleSubmit(event) {
        event.preventDefault();

        // Check for unresolved (orange) ingredients by looking for the warning class
        const unknownIngredients = this.ingredientsListDiv.querySelectorAll('.border-orange-500');
        if (unknownIngredients.length > 0) {
            alert("Impossible d'enregistrer : vous avez des ingrédients inconnus (en orange).\n\nVeuillez les créer (+), les remplacer par des ingrédients existants, ou les supprimer.");
            return;
        }

        this.saveRecipeBtn.disabled = true;
        this.saveRecipeBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sauvegarde...';

        // Retrieve ingredients from the array stored on the form
        console.log("Ingredients array from form before filter:", this.form.ingredients); // New log
        const ingredients = this.form.ingredients.filter(ing => ing !== null && ing.quantity && ing.name);

        // Collect checked seasons
        const selectedSeasons = [];
        ['Printemps', 'Eté', 'Automne', 'Hiver'].forEach(season => {
            const seasonId = `recipe-season-${season.toLowerCase().replace('é', 'e')}`;
            const checkbox = document.getElementById(seasonId);
            if (checkbox && checkbox.checked) selectedSeasons.push(season);
        });

        const selectedMonths = [];
        document.querySelectorAll('.recipe-month-checkbox:checked').forEach(cb => {
            selectedMonths.push(cb.value);
        });

        const recipeData = {
            name: this.recipeNameInput.value,
            category: this.recipeCategoryInput.value,
            servings: parseInt(this.recipeServingsInput.value) || 0,
            prepTime: parseInt(this.recipePrepTimeInput.value) || 0,
            difficulty: this.recipeDifficultyInput.value,
            seasons: selectedSeasons,
            months: selectedMonths,
            steps: this.recipeStepsTextarea.value,
            ingredients: ingredients,
            imageUrl: this.recipeImageUrlInput.value || `https://tse2.mm.bing.net/th?q=${encodeURIComponent(this.recipeNameInput.value)}%20recette&w=400&h=300&c=7&rs=1&p=0`
        };
        console.log("Recipe data being sent to Firebase:", recipeData);

        const id = this.recipeIdInput.value;
        try {
            if (id) {
                await setDoc(doc(this.db, "recipes", id), recipeData);
            } else {
                await addDoc(collection(this.db, "recipes"), recipeData);
            }
            this.closeForm();
            console.log("Recipe saved successfully!");
            // This is where a callback from the calling module would be useful to trigger a refresh
            if (this.onSaveCallback) {
                this.onSaveCallback();
            }
        } catch (error) {
            console.error("Erreur de sauvegarde: ", error);
            alert("Une erreur est survenue lors de la sauvegarde.");
        } finally {
            this.saveRecipeBtn.disabled = false;
            this.saveRecipeBtn.textContent = 'Sauvegarder';
        }
    }

    setOnSaveCallback(callback) {
        this.onSaveCallback = callback;
    }
}

export const recipeFormHandler = new RecipeFormHandler();
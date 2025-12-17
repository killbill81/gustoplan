import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { db } from './firebase-config.js';

class RecipeFormHandler {
    constructor(db, modalId, formId, titleId, recipeIdInputId, recipeNameInputId, recipeCategoryInputId, recipeServingsInputId, recipePrepTimeInputId, recipeDifficultyInputId, recipeStepsTextareaId, ingredientsListDivId, addIngredientBtnId, saveRecipeBtnId, closeButtonId, cancelButtonId) {
        this.db = db;
        this.modal = document.getElementById(modalId);
        this.form = document.getElementById(formId);
        this.modalTitle = document.getElementById(titleId);
        this.recipeIdInput = document.getElementById(recipeIdInputId);
        this.recipeNameInput = document.getElementById(recipeNameInputId);
        this.recipeCategoryInput = document.getElementById(recipeCategoryInputId);
        this.recipeServingsInput = document.getElementById(recipeServingsInputId);
        this.recipePrepTimeInput = document.getElementById(recipePrepTimeInputId);
        this.recipeDifficultyInput = document.getElementById(recipeDifficultyInputId);
        this.recipeImageUrlInput = document.getElementById('edit-recipe-image-url'); // Ajout de l'input pour l'URL de l'image
        this.recipeStepsTextarea = document.getElementById(recipeStepsTextareaId);
        this.ingredientsListDiv = document.getElementById(ingredientsListDivId);
        this.addIngredientBtn = document.getElementById(addIngredientBtnId);
        this.saveRecipeBtn = document.getElementById(saveRecipeBtnId);
        this.closeButton = document.getElementById(closeButtonId);
        this.cancelButton = document.getElementById(cancelButtonId);

        this.masterIngredientList = [];
        this.activityUpdater = null; // Pour le suivi d'activité

        // Bind methods to ensure 'this' context is correct and allow for removal
        this.boundAddIngredient = () => this.addIngredientInput(undefined, this.form.ingredients);
        this.boundCloseForm = () => this.closeForm();
        this.boundHandleSubmit = (e) => this.handleSubmit(e);

        this.addIngredientBtn.addEventListener('click', this.boundAddIngredient);
        this.closeButton.addEventListener('click', this.boundCloseForm);
        this.cancelButton.addEventListener('click', this.boundCloseForm);
        this.saveRecipeBtn.addEventListener('click', this.boundHandleSubmit);

        this.initSeasonalityListeners();
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
                    // If unchecked, check if any other month of this season is checked
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

    destroy() {
        this.addIngredientBtn.removeEventListener('click', this.boundAddIngredient);
        this.closeButton.removeEventListener('click', this.boundCloseForm);
        this.cancelButton.removeEventListener('click', this.boundCloseForm);
        this.saveRecipeBtn.removeEventListener('click', this.boundHandleSubmit);
    }

    async openForm(recipe = null, title = 'Ajouter une recette') {
        if (this.activityUpdater) {
            this.activityUpdater('editing_recipe');
        }

        await this.fetchMasterIngredients(); // Charger les ingrédients de base

        console.log("openForm called with recipe:", recipe, "and title:", title);
        this.form.reset();
        this.ingredientsListDiv.innerHTML = '';
        this.modalTitle.textContent = title;

        // New: Create a local ingredients array and store it on the form element
        const ingredients = [];
        this.form.ingredients = ingredients; // Attach to form for access in handleSubmit

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

    addIngredientInput(ingredient = { quantity: '', name: '', unit: '' }, ingredientsArray) {
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

        // --- Name Search Input ---
        const nameInputContainer = document.createElement('div');
        nameInputContainer.className = 'relative w-1/2';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.className = 'ingredient-name mt-1 block w-full rounded-md border-gray-300 shadow-sm';
        nameInput.placeholder = 'Chercher un ingrédient...';
        nameInput.value = newIngredient.name;
        nameInputContainer.appendChild(nameInput);

        // --- Search Results ---
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 hidden max-h-48 overflow-y-auto';
        nameInputContainer.appendChild(resultsDiv);

        nameInput.addEventListener('input', () => {
            const searchTerm = nameInput.value.toLowerCase();
            if (!searchTerm) {
                resultsDiv.classList.add('hidden');
                return;
            }

            const filtered = this.masterIngredientList.filter(i => i.name.toLowerCase().includes(searchTerm));
            resultsDiv.innerHTML = '';

            filtered.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.className = 'p-2 ingredient-search-item cursor-pointer';
                resultItem.textContent = item.name;
                resultItem.addEventListener('click', () => {
                    nameInput.value = item.name;
                    unitDisplay.value = item.unit; // Update the display
                    resultsDiv.classList.add('hidden');
                    // Update the array
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
            createItem.addEventListener('click', async () => {
                const newName = nameInput.value;
                const newUnit = 'pièce(s)'; // Default unit for on-the-fly creation
                try {
                    const docRef = await addDoc(collection(this.db, "ingredients"), { name: newName, unit: newUnit });
                    await this.fetchMasterIngredients(); // Refresh master list
                    nameInput.value = newName;
                    unitDisplay.value = newUnit;
                    resultsDiv.classList.add('hidden');
                    ingredientsArray[index].name = newName;
                    ingredientsArray[index].unit = newUnit;
                    ingredientsArray[index].id = docRef.id;
                } catch (error) {
                    console.error("Erreur d'ajout d'ingrédient", error);
                    alert("L'ingrédient n'a pas pu être créé.");
                }
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

export { RecipeFormHandler };
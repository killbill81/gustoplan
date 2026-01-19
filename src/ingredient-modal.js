import { db } from './firebase-config.js';
import { collection, doc, setDoc, addDoc, getDocs } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';

export class IngredientModalManager {
    constructor() {
        this.units = ['g', 'kg', 'ml', 'l', 'pièce(s)', 'c.à.s.', 'c.à.c.', 'pincée(s)'];
        this.onSuccessCallback = null;

        this.bindElements();
        this.init();
    }

    bindElements() {
        if (this.modal) return; // Already bound
        this.modal = document.getElementById('ingredient-form-modal');

        // Hoist modal to body to ensure it's not in a hidden container
        if (this.modal && this.modal.parentElement !== document.body) {
            document.body.appendChild(this.modal);
            console.log("DEBUG: Hoisted ingredient-form-modal to body");
        }

        this.form = document.getElementById('ingredient-form');
        this.title = document.getElementById('ingredient-modal-title');
        this.idInput = document.getElementById('ingredient-id');
        this.nameInput = document.getElementById('ingredient-name');
        this.unitSelect = document.getElementById('ingredient-unit');
        this.categorySelect = document.getElementById('ingredient-category');
        this.imageUrlInput = document.getElementById('ingredient-image-url');
        this.closeBtn = document.getElementById('close-ingredient-modal');
        this.cancelBtn = document.getElementById('cancel-ingredient-btn');
    }

    init() {
        this.eventsAttached = false;
        this.attachEvents();
    }

    attachEvents() {
        if (!this.modal || this.eventsAttached) return;

        // Event Listeners
        this.closeBtn?.addEventListener('click', () => this.close());
        this.cancelBtn?.addEventListener('click', () => this.close());
        this.form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // Seasonality Bindings
        this.setupSeasonalityBindings();

        this.eventsAttached = true;
    }

    setupSeasonalityBindings() {
        const seasonCheckboxes = this.modal.querySelectorAll('.season-checkbox');
        const monthCheckboxes = this.modal.querySelectorAll('.month-checkbox');

        seasonCheckboxes.forEach(sc => {
            sc.addEventListener('change', (e) => {
                const season = e.target.value;
                const isChecked = e.target.checked;
                const relatedMonths = this.modal.querySelectorAll(`.month-checkbox[data-season="${season}"]`);
                relatedMonths.forEach(mc => mc.checked = isChecked);
            });
        });

        monthCheckboxes.forEach(mc => {
            mc.addEventListener('change', (e) => {
                const season = e.target.dataset.season;
                const seasonCheckbox = this.modal.querySelector(`.season-checkbox[value="${season}"]`);

                if (e.target.checked) {
                    if (seasonCheckbox) seasonCheckbox.checked = true;
                } else {
                    const relatedMonths = this.modal.querySelectorAll(`.month-checkbox[data-season="${season}"]:checked`);
                    if (seasonCheckbox && relatedMonths.length === 0) {
                        seasonCheckbox.checked = false;
                    }
                }
            });
        });
    }

    async open(ingredientOrName = null, onSuccess = null) {
        console.log("DEBUG: IngredientModalManager.open called", { ingredientOrName });
        try {
            this.bindElements();
            if (!this.form) {
                console.error("Ingredient Modal elements not found!");
                // Try to search again if DOM was updated
                this.modal = document.getElementById('ingredient-form-modal');
                this.form = document.getElementById('ingredient-form');
                if (!this.form) {
                    alert("Erreur système : Le formulaire d'ingrédient est introuvable dans la page.");
                    return;
                }
            }

            // Re-bind events if they were missed in init because elements were missing
            if (!this.eventsAttached) {
                this.attachEvents();
            }

            this.onSuccessCallback = onSuccess;
            this.form.reset();

            // Populate Units
            this.unitSelect.innerHTML = '';
            this.units.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = unit;
                this.unitSelect.appendChild(option);
            });

            // Populate Categories (Don't let this block the modal indefinitely)
            this.populateCategories().catch(err => {
                console.error("Non-blocking error in populateCategories:", err);
            });

            if (typeof ingredientOrName === 'string') {
                // New ingredient with pre-filled name
                this.prepareNew(ingredientOrName);
            } else if (ingredientOrName && typeof ingredientOrName === 'object') {
                // Edit existing
                this.prepareEdit(ingredientOrName);
            } else {
                // New empty
                this.prepareNew();
            }

            this.modal.classList.remove('hidden');
            // Force visibility in case of CSS class issues
            this.modal.style.display = 'flex';
            this.modal.classList.remove('hidden');
            this.modal.style.display = 'flex'; // Ensure flex layout
            this.modal.style.zIndex = '9999'; // Ensure top z-index
            this.modal.ariaHidden = 'false';

            console.log("DEBUG: IngredientModalManager modal shown (Hoisted + Display Flex)");
        } catch (error) {
            console.error("CRITICAL ERROR in IngredientModalManager.open:", error);
            alert("Une erreur est survenue lors de l'ouverture du formulaire : " + error.message);
        }
    }

    async populateCategories() {
        try {
            // We fetch categories here. optimization: cache this if needed
            const querySnapshot = await getDocs(collection(db, "ingredient_categories"));
            const categories = querySnapshot.docs.map(doc => doc.data().name).sort();

            // Also get used categories from ingredients collection? 
            // For simplicity and avoiding massive reads, we stick to defined categories for now
            // OR we can assume 'ingredient-modal.js' is primarily used where categorization matters.

            this.categorySelect.innerHTML = '';
            categories.forEach(catName => {
                const option = document.createElement('option');
                option.value = catName;
                option.textContent = catName;
                this.categorySelect.appendChild(option);
            });
        } catch (e) {
            console.error("Error fetching categories for modal", e);
        }
    }

    prepareNew(name = '') {
        this.title.textContent = "Ajouter un ingrédient";
        this.idInput.value = '';
        this.nameInput.value = name;
        this.unitSelect.value = this.units[0]; // Default

        // Clear checkboxes
        this.modal.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    }

    prepareEdit(ingredient) {
        this.title.textContent = "Modifier l'ingrédient";
        this.currentIngredientOwnerId = ingredient.userId;
        this.idInput.value = ingredient.id;
        this.nameInput.value = ingredient.name;
        this.unitSelect.value = ingredient.unit || '';
        this.categorySelect.value = ingredient.category || '';
        this.imageUrlInput.value = ingredient.imageUrl || '';

        // Checkboxes
        const seasons = ingredient.seasons || [];
        const months = ingredient.months || [];

        ['Printemps', 'Eté', 'Automne', 'Hiver'].forEach(season => {
            const id = `season-${season.toLowerCase().replace('é', 'e')}`;
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = seasons.includes(season);
        });

        this.modal.querySelectorAll('.month-checkbox').forEach(cb => {
            cb.checked = months.includes(cb.value);
        });
    }

    close() {
        this.modal.classList.add('hidden');
        // Clear forced inline styles to allow hiding
        this.modal.style.display = '';
        this.modal.style.zIndex = '';
        this.modal.ariaHidden = 'true';
        console.log("DEBUG: IngredientModalManager closed and styles cleared");
    }

    async handleSubmit(e) {
        e.preventDefault();
        const id = this.idInput.value;

        const selectedSeasons = [];
        this.modal.querySelectorAll('.season-checkbox:checked').forEach(cb => {
            selectedSeasons.push(cb.value);
        });

        const selectedMonths = [];
        this.modal.querySelectorAll('.month-checkbox:checked').forEach(cb => {
            selectedMonths.push(cb.value);
        });

        this.modal.querySelectorAll('.month-checkbox:checked').forEach(cb => {
            selectedMonths.push(cb.value);
        });

        const userId = this.currentIngredientOwnerId || getCurrentUserId();

        const ingredientData = {
            userId: userId,
            name: this.nameInput.value,
            unit: this.unitSelect.value,
            category: this.categorySelect.value,
            seasons: selectedSeasons,
            months: selectedMonths,
            imageUrl: this.imageUrlInput.value || `https://tse2.mm.bing.net/th?q=${encodeURIComponent(this.nameInput.value)}%20ingredient&w=400&h=300&c=7&rs=1&p=0`
        };

        if (!ingredientData.name || !ingredientData.category) {
            alert("Le nom et la catégorie sont requis.");
            return;
        }

        try {
            if (id) {
                await setDoc(doc(db, "ingredients", id), ingredientData);
            } else {
                await addDoc(collection(db, "ingredients"), ingredientData);
            }

            this.close();
            if (this.onSuccessCallback) await this.onSuccessCallback(ingredientData.name);
        } catch (error) {
            console.error("Erreur de sauvegarde de l'ingrédient: ", error);
        }
    }
}

export const ingredientModalManager = new IngredientModalManager();

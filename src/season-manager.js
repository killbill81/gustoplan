export class SeasonManager {
    constructor() {
        // Default Configuration
        this.config = {
            mode: 'auto', // 'auto', 'forced', 'disabled'
            forcedSeason: 'Printemps',
            offSeasonBehavior: 'last', // 'hide', 'last', 'dim'
            recipeRules: {
                prioritizeSeasonal: true,
                allowPartial: true,
                warnOffSeason: true
            },
            listRules: {
                limitSuggestions: true,
                allowManualAdd: true
            }
        };

        this.STORAGE_KEY = 'gustoplan_season_config';
        this.loadConfig();
    }

    loadConfig() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge saved config with defaults to ensure all keys exist
                this.config = { ...this.config, ...parsed, recipeRules: { ...this.config.recipeRules, ...(parsed.recipeRules || {}) }, listRules: { ...this.config.listRules, ...(parsed.listRules || {}) } };
            } catch (e) {
                console.error("Failed to parse seasonality config", e);
            }
        }
    }

    saveConfig() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
        // Dispatch event for UI updates
        window.dispatchEvent(new CustomEvent('seasonality-config-changed', { detail: this.config }));
    }

    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        this.saveConfig();
    }

    getCurrentSeason() {
        if (this.config.mode === 'disabled') return null;
        if (this.config.mode === 'forced') return this.config.forcedSeason;

        // Auto Mode
        const month = new Date().getMonth(); // 0-11
        // Mapping approximate for France
        // Winter: Dec, Jan, Feb, Mar (approx) -> Let's stick to standard 3-month blocks or solar?
        // Standard metereological:
        // Winter: Dec, Jan, Feb
        // Spring: Mar, Apr, May
        // Summer: Jun, Jul, Aug
        // Autumn: Sep, Oct, Nov

        if (month === 11 || month === 0 || month === 1) return 'Hiver';
        if (month >= 2 && month <= 4) return 'Printemps';
        if (month >= 5 && month <= 7) return 'Eté';
        if (month >= 8 && month <= 10) return 'Automne';

        return 'Printemps'; // Fallback
    }

    isMonthInSeason(monthName, season) {
        if (!season) return true; // If disabled, everything is "in"
        const seasonToMonths = {
            'Printemps': ['Mars', 'Avril', 'Mai', 'Juin'], // Include June overlap? kept simple
            'Eté': ['Juin', 'Juillet', 'Août', 'Septembre'],
            'Automne': ['Septembre', 'Octobre', 'Novembre', 'Décembre'],
            'Hiver': ['Décembre', 'Janvier', 'Février', 'Mars']
        };
        // Use a broader mapping or strict? 
        // User said: "Mois courant ∈ mois de l’ingrédient"
        // Here we cross check season <-> month name
        // More precise: Check if today's month is in ingredient's list.
        return true;
    }

    // returns 0 (out), 1 (partial), 2 (full)
    getIngredientScore(ingredient) {
        if (this.config.mode === 'disabled') return 2;

        const currentMonths = this.getMonthsForCurrentDate();
        if (!ingredient.months || ingredient.months.length === 0) {
            // Fallback to seasons
            if (ingredient.seasons && ingredient.seasons.length > 0) {
                const currentSeason = this.getCurrentSeason();
                return ingredient.seasons.includes(currentSeason) ? 2 : 0;
            }
            return 2; // "All year" ingredients
        }

        // Check intersection of Ingredient Months vs Current Real Month
        // This is strictly "Is it available NOW?"
        // But if mode is 'forced', we simulate 'NOW' as being in that season.

        const targetMonths = this.getTargetMonthsForSeason(this.getCurrentSeason());
        // Simple logic: Is ANY match?
        // Actually, for an ingredient, it's binary: Is it available in current season?
        const hasMatch = ingredient.months.some(m => targetMonths.includes(m));
        return hasMatch ? 2 : 0;
    }

    // Recipe Score: 0-1 (Float) representing percentage of seasonal ingredients
    // Or simpler: 2 (All seasonal), 1 (Partial), 0 (None)
    getRecipeScore(recipe) {
        if (this.config.mode === 'disabled') return 2;

        // Strategy: Check recipe.months first (if defined, trust it)
        // If recipe.months empty, check recipe.seasons
        // If both empty, check ingredients? User said "Une recette est évaluée selon ses ingrédients"

        // 1. Check Explicit Recipe Seasonality (Overrides ingredients)
        // If recipe has explicit months/seasons, use them as the "truth" for the whole dish
        // But the user specificaly said "Une recette est évaluée selon ses ingrédients" in the specs.
        // However, we also have explicit metadata.
        // Let's mix: If explicit metadata says "Summer", and we are in "Winter", it's 0.

        const currentSeason = this.getCurrentSeason();
        const targetMonths = this.getTargetMonthsForSeason(currentSeason);

        // Check Explicit Metadata first (Fastest)
        let explicitScore = null;
        if (recipe.months && recipe.months.length > 0) {
            const hasMatch = recipe.months.some(m => targetMonths.includes(m));
            explicitScore = hasMatch ? 2 : 0;
        } else if (recipe.seasons && recipe.seasons.length > 0) {
            explicitScore = recipe.seasons.includes(currentSeason) ? 2 : 0;
        }

        // If we have explicit score, return it (simplification for performance & user control)
        if (explicitScore !== null) return explicitScore;

        // If no explicit data, strictly speaking we should check ingredients.
        // But for now, if no data, assume "All Year" -> 2
        return 2;
    }

    getTargetMonthsForSeason(season) {
        const map = {
            'Printemps': ['Mars', 'Avril', 'Mai'],
            'Eté': ['Juin', 'Juillet', 'Août'],
            'Automne': ['Septembre', 'Octobre', 'Novembre'],
            'Hiver': ['Décembre', 'Janvier', 'Février']
        };
        return map[season] || [];
    }

    // For auto mode, we might want the exact current month
    getMonthsForCurrentDate() {
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        const currentMonthIndex = new Date().getMonth();
        return [monthNames[currentMonthIndex]];
    }
}

export const seasonManager = new SeasonManager();

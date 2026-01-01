import { Recipe, Season, Month } from "@/types/recipe"

export const SEASONS: Season[] = ['Printemps', 'Eté', 'Automne', 'Hiver']
export const MONTHS: Month[] = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

export const SEASON_TO_MONTHS: Record<Season, Month[]> = {
    'Printemps': ['Mars', 'Avril', 'Mai'],
    'Eté': ['Juin', 'Juillet', 'Août'],
    'Automne': ['Septembre', 'Octobre', 'Novembre'],
    'Hiver': ['Décembre', 'Janvier', 'Février']
}

export function getCurrentSeason(): Season {
    const month = new Date().getMonth() // 0-11
    if (month === 11 || month === 0 || month === 1) return 'Hiver'
    if (month >= 2 && month <= 4) return 'Printemps'
    if (month >= 5 && month <= 7) return 'Eté'
    return 'Automne'
}

export function getCurrentMonth(): Month {
    return MONTHS[new Date().getMonth()]
}

/**
 * Returns a score for a recipe based on current date.
 * @returns 2 (De saison), 0 (Hors saison)
 */
export function getRecipeSeasonScore(recipe: Recipe): number {
    const currentSeason = getCurrentSeason()
    const targetMonths = SEASON_TO_MONTHS[currentSeason]

    if (recipe.months && recipe.months.length > 0) {
        const hasMatch = recipe.months.some(m => targetMonths.includes(m))
        return hasMatch ? 2 : 0
    } else if (recipe.seasons && recipe.seasons.length > 0) {
        return recipe.seasons.includes(currentSeason) ? 2 : 0
    }

    // Fallback: If no seasonality info, assume "all year"
    return 2
}

export type Category = 'ENTREE' | 'PLAT' | 'ACCOMPAGNEMENT' | 'DESSERT' | 'AUTRE';
export type Season = 'Printemps' | 'Eté' | 'Automne' | 'Hiver';
export type Month = 'Janvier' | 'Février' | 'Mars' | 'Avril' | 'Mai' | 'Juin' | 'Juillet' | 'Août' | 'Septembre' | 'Octobre' | 'Novembre' | 'Décembre';

export interface Ingredient {
    id?: string;
    name: string;
    quantity: number;
    unit: string;
    category?: string;
}

export interface IngredientCategory {
    id: string;
    name: string;
}

export interface Recipe {
    id: string;
    name: string;
    imageUrl?: string;
    category: string;
    servings: number;
    prepTime: number;
    difficulty: string;
    ingredients: Ingredient[];
    steps: string;
    isFavorite?: boolean;
    seasons?: Season[];
    months?: Month[];
    createdAt?: any;
    updatedAt?: any;
}

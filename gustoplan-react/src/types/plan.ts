export type MealType = 'lunch' | 'dinner';

export interface PlanMeal {
    id: string; // Recipe ID
    servings?: number;
}

export interface PlanSlot {
    [index: string]: PlanMeal[]; // index 0-3 for Entry, Main, Side, Dessert
}

export interface WeekData {
    menuData: {
        [slotId: string]: PlanMeal[]; // slotId format: "dayIndex-mealType-categoryIndex"
    };
    servingsData: {
        [servingsKey: string]: number; // servingsKey: "dayIndex-mealType"
    };
    remarksData: {
        [slotId: string]: string; // slotId for remarks: "dayIndex-mealType-4"
    };
}

export interface Plan {
    id: string;
    name: string;
    userId: string;
    type: 'personal' | 'collaborative';
    collaborators?: string[];
    weeks?: Record<string, WeekData>;
    defaultNumPeople?: number;
    startDay: string;
    lastUpdated?: any; // Firestore Timestamp
    archivedBy?: string[];
    // Shopping List fields
    manualItems?: Array<{
        name: string;
        totalQuantity: number;
        unit: string;
        category: string;
    }>;
    checkedItems?: Record<string, boolean>;
    hiddenTrashItems?: string[];
}

export interface PlanHistoryEntry {
    id: string;
    planState: Plan;
    timestamp: any;
    modifiedBy: string;
    modifiedByName: string;
    description: string;
}

export interface UserPresence {
    uid: string;
    displayName: string;
    photoURL?: string;
    status: 'idle' | string; // e.g. "editing:0-lunch-4"
    last_seen: number;
}

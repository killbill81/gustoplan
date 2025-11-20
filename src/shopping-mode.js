import { getFirestore, doc, getDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getCurrentUserId } from './auth.js';
import { getUserPlans } from './plans.js';

const db = getFirestore();
let currentUnsubscribe = null;
let currentPlan = null;
let availableMeals = [];
let masterIngredientList = [];
let checkedItems = {}; // Key: itemName_unit, Value: boolean

export default function init() {
    const container = document.getElementById('shopping-mode-container');
    const planSelect = document.getElementById('shopping-mode-plan-select');
    const backBtn = document.getElementById('shopping-mode-back-btn');

    // Load checked items from Plan Data (Firestore)
    // No need to load from LocalStorage anymore, data comes via onSnapshot

    // Back button logic (simple history back or nav to menu)
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            window.location.hash = '#menu'; // Or use router navigateTo if available globally or dispatch event
            const menuBtn = document.querySelector('button[data-path="menu"]');
            if (menuBtn) menuBtn.click();
        });
    }

    async function fetchData() {
        // 1. Fetch Master Ingredients
        try {
            const ingSnap = await getDocs(collection(db, "ingredients"));
            masterIngredientList = ingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching ingredients", e);
        }

        // 2. Fetch All Recipes (availableMeals)
        try {
            const recipesSnap = await getDocs(collection(db, "recipes"));
            availableMeals = recipesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (e) {
            console.error("Error fetching recipes", e);
        }

        // 3. Fetch Plans
        const unsubscribePlans = getUserPlans((plans) => {
            if (!planSelect) return;
            planSelect.innerHTML = '';
            
            if (plans.length === 0) {
                container.innerHTML = '<p class="text-center p-4">Aucun plan trouvé.</p>';
                return;
            }

            plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = plan.name;
                planSelect.appendChild(option);
            });

            // Select the first plan by default or restore selection
            const lastActivePlanId = localStorage.getItem('lastActivePlanId');
            
            if (lastActivePlanId && plans.some(p => p.id === lastActivePlanId)) {
                planSelect.value = lastActivePlanId;
                loadPlan(lastActivePlanId);
            } else if (plans.length > 0) {
                loadPlan(plans[0].id);
            }
            
            // Listen for change
            planSelect.addEventListener('change', (e) => {
                const newPlanId = e.target.value;
                localStorage.setItem('lastActivePlanId', newPlanId);
                loadPlan(newPlanId);
            });
        });
    }

    function loadPlan(planId) {
        if (currentUnsubscribe) {
            currentUnsubscribe();
            currentUnsubscribe = null;
        }

        const planRef = doc(db, 'plans', planId);
        currentUnsubscribe = onSnapshot(planRef, (docSnap) => {
            if (docSnap.exists()) {
                currentPlan = { id: docSnap.id, ...docSnap.data() };
                // Initialize checkedItems from plan data
                checkedItems = currentPlan.checkedItems || {};
                renderShoppingList();
            } else {
                container.innerHTML = '<p class="text-center p-4 text-red-500">Plan introuvable.</p>';
            }
        });
    }

    function renderShoppingList() {
        if (!currentPlan || !container) return;

        const shoppingList = generateList(currentPlan);
        
        container.innerHTML = '';
        
        if (shoppingList.length === 0) {
            container.innerHTML = '<p class="text-center p-10 text-gray-500">Votre liste de courses est vide pour ce plan.</p>';
            return;
        }

        // Group by category
        const grouped = shoppingList.reduce((acc, item) => {
            const cat = item.category || 'Inconnue';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});

        const categories = Object.keys(grouped).sort((a, b) => {
             if (a === 'Inconnue') return 1;
             if (b === 'Inconnue') return -1;
             return a.localeCompare(b);
        });

        categories.forEach(cat => {
            const catHeader = document.createElement('h3');
            catHeader.className = 'font-bold text-lg text-gray-700 mt-6 mb-3 border-b border-gray-200 pb-1 sticky top-0 bg-white z-10';
            catHeader.textContent = cat;
            container.appendChild(catHeader);

            const ul = document.createElement('ul');
            ul.className = 'space-y-3';
            
            grouped[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
                // The key logic needs to match how we access it.
                // In generateList we don't have plan ID in the item key, but we need a unique key for storage.
                // Let's use "itemName_unit" as the key within the checkedItems object of THIS plan.
                const key = `${item.name}_${item.unit || ''}`;
                const isChecked = checkedItems[key] || false;

                const li = document.createElement('li');
                li.className = `flex flex-col p-3 rounded-lg transition-colors duration-200 ${isChecked ? 'bg-gray-100' : 'bg-white shadow-sm border border-gray-100'}`;
                
                const mainContent = document.createElement('div');
                mainContent.className = 'flex items-center w-full';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-checkbox h-6 w-6 text-tomato rounded-full border-gray-300 focus:ring-tomato cursor-pointer transition duration-150 ease-in-out';
                checkbox.checked = isChecked;
                
                const textDiv = document.createElement('div');
                textDiv.className = 'ml-3 flex-grow cursor-pointer select-none';
                
                const quantityDisplay = Number.isInteger(item.totalQuantity) ? item.totalQuantity : parseFloat(item.totalQuantity.toFixed(2));
                
                const nameSpan = document.createElement('span');
                nameSpan.className = `font-medium text-base ${isChecked ? 'line-through text-gray-400' : 'text-gray-800'}`;
                nameSpan.textContent = item.name;
                
                const qtySpan = document.createElement('span');
                qtySpan.className = `ml-2 font-bold text-base ${isChecked ? 'text-gray-400' : 'text-gray-800'}`;
                qtySpan.textContent = ` - ${quantityDisplay} ${item.unit || ''}`.trim();

                textDiv.appendChild(nameSpan);
                textDiv.appendChild(qtySpan);

                // Click on row toggles checkbox
                const toggle = () => {
                    const newState = !checkbox.checked;
                    checkbox.checked = newState;
                    updateItemState(key, newState, li, checkbox, nameSpan, qtySpan);
                };

                checkbox.addEventListener('change', (e) => {
                    updateItemState(key, e.target.checked, li, checkbox, nameSpan, qtySpan);
                });
                textDiv.addEventListener('click', toggle);

                mainContent.appendChild(checkbox);
                mainContent.appendChild(textDiv);
                li.appendChild(mainContent);

                // Add annotations if available
                if (item.sources && item.sources.length > 0) {
                    const annotationsDiv = document.createElement('div');
                    annotationsDiv.className = 'mt-2 ml-9 text-xs text-gray-500 space-y-1'; // Adjusted margin to align with text
                    
                    // Group sources by recipe and day
                    const groupedSources = item.sources.reduce((acc, source) => {
                        const key = `${source.recipeName} (${source.day} ${source.time})`;
                        if (!acc[key]) {
                            acc[key] = 0;
                        }
                        acc[key] += source.quantity;
                        return acc;
                    }, {});

                    for (const key in groupedSources) {
                        const annotationSpan = document.createElement('div');
                        annotationSpan.textContent = `↳ ${key}`;
                        annotationsDiv.appendChild(annotationSpan);
                    }
                    li.appendChild(annotationsDiv);
                }

                ul.appendChild(li);
            });
            container.appendChild(ul);
        });
    }

    function updateItemState(key, isChecked, li, checkbox, nameSpan, qtySpan) {
        if (!currentPlan) return;
        
        // Optimistic UI update
        if (isChecked) {
            li.classList.remove('bg-white', 'shadow-sm', 'border', 'border-gray-100');
            li.classList.add('bg-gray-100');
            nameSpan.classList.add('line-through', 'text-gray-400');
            nameSpan.classList.remove('text-gray-800');
            qtySpan.classList.add('text-gray-400');
            qtySpan.classList.remove('text-gray-800');
        } else {
            li.classList.add('bg-white', 'shadow-sm', 'border', 'border-gray-100');
            li.classList.remove('bg-gray-100');
            nameSpan.classList.remove('line-through', 'text-gray-400');
            nameSpan.classList.add('text-gray-800');
            qtySpan.classList.remove('text-gray-400');
            qtySpan.classList.add('text-gray-800');
        }

        const planRef = doc(db, 'plans', currentPlan.id);
        const updateData = {};
        updateData[`checkedItems.${key}`] = isChecked;
        updateData['lastUpdated'] = new Date();
        
        import('firebase/firestore').then(module => {
            module.updateDoc(planRef, updateData);
        }).catch(error => {
            console.error("Error updating checked item:", error);
        });
    }

    // Copied and adapted from shopping.js
    function generateList(plan) {
        const list = [];
        const combinedIngredients = new Map();
        const manualItems = plan.manualItems || [];

        // 1. Add Manual Items
        manualItems.forEach(item => {
             const key = `${item.name.trim().toLowerCase()}_${item.unit || ''}`;
             combinedIngredients.set(key, {
                 name: item.name.trim(),
                 totalQuantity: item.totalQuantity,
                 unit: item.unit,
                 category: item.category || 'Inconnue'
             });
        });

        // 2. Process Weeks
        const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        if (plan.weeks) {
            for (const weekNumber in plan.weeks) {
                const weekData = plan.weeks[weekNumber];
                const menu = weekData.menuData || {};
                const servings = weekData.servingsData || {};

                for (const slotId in menu) {
                     const mealsInSlot = menu[slotId];
                     if (!Array.isArray(mealsInSlot)) continue;

                     const [dayIndexStr, mealType] = slotId.split('-');
                     const servingsKey = `${dayIndexStr}-${mealType}`;
                     const numPeople = parseInt(servings[servingsKey] || plan.defaultNumPeople || 1, 10);

                     mealsInSlot.forEach(mealRef => {
                         // Resolve meal from availableMeals
                         const fullMeal = availableMeals.find(m => m.id === mealRef.id) || mealRef;
                         if (!fullMeal || !fullMeal.ingredients) return;

                         const baseServings = fullMeal.servings || 1;
                         
                         fullMeal.ingredients.forEach(ing => {
                             if (!ing.name || !ing.quantity) return;

                             const masterIng = masterIngredientList.find(i => i.name.toLowerCase() === ing.name.toLowerCase());
                             const category = masterIng ? masterIng.category : 'Inconnue';
                             const baseQty = parseFloat(String(ing.quantity).replace(',', '.'));
                             if (isNaN(baseQty)) return;

                             const qtyPerPerson = baseQty / baseServings;
                             const finalQty = qtyPerPerson * numPeople;
                             const displayUnit = ing.unit || '';
                             const key = `${ing.name.trim().toLowerCase()}_${displayUnit}`;

                             if (combinedIngredients.has(key)) {
                                 const existing = combinedIngredients.get(key);
                                 existing.totalQuantity += finalQty;
                                 if (!existing.sources) existing.sources = [];
                                 existing.sources.push({
                                     recipeName: fullMeal.name,
                                     day: allDays[parseInt(dayIndexStr, 10)],
                                     time: mealType === 'lunch' ? 'Midi' : 'Soir',
                                     quantity: finalQty
                                 });
                             } else {
                                 combinedIngredients.set(key, {
                                     name: ing.name.trim(),
                                     totalQuantity: finalQty,
                                     unit: displayUnit,
                                     category: category,
                                     sources: [{
                                         recipeName: fullMeal.name,
                                         day: allDays[parseInt(dayIndexStr, 10)],
                                         time: mealType === 'lunch' ? 'Midi' : 'Soir',
                                         quantity: finalQty
                                     }]
                                 });
                             }
                         });
                     });
                }
            }
        }

        combinedIngredients.forEach(item => {
            if (item.totalQuantity > 0) {
                list.push(item);
            }
        });

        return list;
    }

    fetchData();

    return () => {
        if (currentUnsubscribe) currentUnsubscribe();
    };
}

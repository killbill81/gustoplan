import { getFirestore, doc, getDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getCurrentUserId } from './auth.js';
import { getUserPlans } from './plans.js';

const db = getFirestore();
let currentUnsubscribe = null;
let currentPlan = null;
let availableMeals = [];
let masterIngredientList = [];
let checkedItems = {}; // Key: itemName_unit, Value: boolean

function sanitizeForFirebaseKey(str) {
    if (!str) return '';
    return str.replace(/\./g, '_');
}

export default function init() {
    const container = document.getElementById('shopping-mode-container');
    const planSelect = document.getElementById('shopping-mode-plan-select');

    // --- Scroll to Top Button Logic ---
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-to-top-btn';
    scrollTopBtn.className = 'hidden fixed bottom-20 right-5 bg-tomato text-white rounded-full w-12 h-12 shadow-lg z-50';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollTopBtn.classList.remove('hidden');
        } else {
            scrollTopBtn.classList.add('hidden');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Load checked items from Plan Data (Firestore)
    // No need to load from LocalStorage anymore, data comes via onSnapshot

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

        const { active: shoppingList, deleted: deletedItems } = generateList(currentPlan);
        
        container.innerHTML = '';

        // --- Split items into checked and unchecked lists ---
        const uncheckedItems = [];
        const checkedItemsList = [];
        shoppingList.forEach(item => {
            const unsanitizedKey = `${item.name}_${item.unit || ''}`;
            const key = sanitizeForFirebaseKey(unsanitizedKey);
            const isChecked = checkedItems.hasOwnProperty(key) ? checkedItems[key] : (checkedItems[unsanitizedKey] || false);
            if (isChecked) {
                checkedItemsList.push(item);
            } else {
                uncheckedItems.push(item);
            }
        });
        
        if (uncheckedItems.length === 0 && checkedItemsList.length === 0) {
            container.innerHTML = '<p class="text-center p-10 text-gray-500">Votre liste de courses est vide pour ce plan.</p>';
            return;
        }

        // Group by category for UNCHECKED items
        const grouped = uncheckedItems.reduce((acc, item) => {
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

        // Create and inject the tabs container at the top of the main list container
        const tabsContainer = document.createElement('div');
        tabsContainer.id = 'shopping-category-tabs';
        tabsContainer.className = 'flex overflow-x-auto space-x-2 py-2 bg-white z-20 mb-4';
        container.appendChild(tabsContainer);

        const sanitizeForId = (text) => 'category-' + text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

        // --- Create and add category tabs ---
        categories.forEach(cat => {
            const tab = document.createElement('button');
            tab.className = 'btn btn-sm btn-outline flex-shrink-0';
            tab.textContent = cat;
            tab.onclick = () => {
                const headerElement = document.getElementById(sanitizeForId(cat));
                if (headerElement) {
                    const mainHeader = document.querySelector('header');
                    const headerOffset = mainHeader ? mainHeader.offsetHeight : 0;
                    const elementPosition = headerElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 40; // 40px for extra padding

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            };
            tabsContainer.appendChild(tab);
        });

        categories.forEach(cat => {
            const catHeader = document.createElement('h3');
            catHeader.className = 'font-bold text-lg text-gray-700 mt-6 mb-3 border-b border-gray-200 pb-1 sticky top-0 bg-white z-10';
            catHeader.textContent = cat;
            catHeader.id = sanitizeForId(cat); // Assign ID for anchor link
            container.appendChild(catHeader);

            const ul = document.createElement('ul');
            ul.className = 'space-y-3';
            
            grouped[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
                // The key logic needs to match how we access it.
                // In generateList we don't have plan ID in the item key, but we need a unique key for storage.
                // Let's use "itemName_unit" as the key within the checkedItems object of THIS plan.
                const unsanitizedKey = `${item.name}_${item.unit || ''}`;
                const key = sanitizeForFirebaseKey(unsanitizedKey);
                const isChecked = checkedItems.hasOwnProperty(key) ? checkedItems[key] : (checkedItems[unsanitizedKey] || false);

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

        // --- Render separator and CHECKED items ---
        if (checkedItemsList.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'my-8 border-t-2 border-dashed border-gray-300 pt-4 text-center';
            const separatorTitle = document.createElement('h3');
            separatorTitle.className = 'text-lg font-semibold text-gray-500';
            separatorTitle.textContent = 'Articles cochés';
            separator.appendChild(separatorTitle);
            container.appendChild(separator);

            const groupedChecked = checkedItemsList.reduce((acc, item) => {
                const cat = item.category || 'Inconnue';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
            }, {});

            const checkedCategories = Object.keys(groupedChecked).sort((a, b) => {
                if (a === 'Inconnue') return 1;
                if (b === 'Inconnue') return -1;
                return a.localeCompare(b);
            });

            checkedCategories.forEach(cat => {
                const catHeader = document.createElement('h3');
                catHeader.className = 'font-bold text-lg text-gray-700 mt-6 mb-3 border-b border-gray-200 pb-1';
                catHeader.textContent = cat;
                container.appendChild(catHeader);

                const ul = document.createElement('ul');
                ul.className = 'space-y-3';
                
                groupedChecked[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
                    const unsanitizedKey = `${item.name}_${item.unit || ''}`;
                    const key = sanitizeForFirebaseKey(unsanitizedKey);
                    const isChecked = true; // All items in this section are checked

                    const li = document.createElement('li');
                    li.className = `flex flex-col p-3 rounded-lg transition-colors duration-200 bg-gray-100`;
                    
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
                    nameSpan.className = `font-medium text-base line-through text-gray-400`;
                    nameSpan.textContent = item.name;
                    
                    const qtySpan = document.createElement('span');
                    qtySpan.className = `ml-2 font-bold text-base text-gray-400`;
                    qtySpan.textContent = ` - ${quantityDisplay} ${item.unit || ''}`.trim();

                    textDiv.appendChild(nameSpan);
                    textDiv.appendChild(qtySpan);

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

                    ul.appendChild(li);
                });
                container.appendChild(ul);
            });
        }

        // --- Update Trash Button & Modal ---
        const trashBtn = document.getElementById('shopping-mode-trash-btn');
        const trashCount = document.getElementById('shopping-mode-trash-count');
        const trashModal = document.getElementById('shopping-trash-modal');
        const trashList = document.getElementById('shopping-trash-list');
        const closeTrashBtn = document.getElementById('close-shopping-trash-modal');
        const emptyTrashBtn = document.getElementById('shopping-empty-trash-btn');

        // Ensure trash button is hidden
        if (trashBtn) {
            trashBtn.classList.add('hidden');
        }

        if (trashModal && closeTrashBtn) {
             closeTrashBtn.onclick = () => trashModal.classList.add('hidden');
             trashModal.addEventListener('click', (e) => {
                if (e.target === trashModal) trashModal.classList.add('hidden');
            });
        }

        if (deletedItems && deletedItems.length > 0) {
            if (emptyTrashBtn) {
                emptyTrashBtn.classList.remove('hidden');
                // Replace to clear old listeners
                const newEmptyBtn = emptyTrashBtn.cloneNode(true);
                emptyTrashBtn.parentNode.replaceChild(newEmptyBtn, emptyTrashBtn);
                
                newEmptyBtn.addEventListener('click', async () => {
                    if (!currentPlan || !confirm("Tout supprimer définitivement ?")) return;
                    const planRef = doc(db, "plans", currentPlan.id);
                    const itemsToHide = deletedItems.map(i => sanitizeForFirebaseKey(`${i.name}_${i.unit || ''}`));
                    
                    try {
                        await import('firebase/firestore').then(module => {
                            module.updateDoc(planRef, {
                                hiddenTrashItems: module.arrayUnion(...itemsToHide),
                                lastUpdated: new Date()
                            });
                        });
                         trashModal.classList.add('hidden');
                    } catch (error) {
                        console.error("Erreur vidage corbeille:", error);
                    }
                });
            }

            if (trashList) {
                trashList.innerHTML = '';
                const deletedUl = document.createElement('ul');
                deletedUl.className = 'space-y-3';

                deletedItems.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center p-3 rounded-lg bg-gray-100 shadow-inner justify-between';
                    
                    const textDiv = document.createElement('div');
                    textDiv.className = 'flex-grow ml-2 overflow-hidden';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'font-medium text-base text-gray-500 line-through block truncate';
                    nameSpan.textContent = item.name;
                    
                    textDiv.appendChild(nameSpan);

                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'flex items-center space-x-2 flex-shrink-0';

                    const restoreBtn = document.createElement('button');
                    restoreBtn.className = 'text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1 border border-blue-300 rounded-full hover:bg-blue-50 transition-colors';
                    restoreBtn.innerHTML = '<i class="fas fa-undo"></i>';
                    restoreBtn.addEventListener('click', async () => {
                        if (!currentPlan) return;
                        const planRef = doc(db, "plans", currentPlan.id);
                        try {
                            await import('firebase/firestore').then(async module => {
                                await module.runTransaction(db, async (transaction) => {
                                    const planDoc = await transaction.get(planRef);
                                    if (!planDoc.exists()) return;

                                    const currentItems = planDoc.data().manualItems || [];
                                    const finalItems = currentItems.filter(i => !(i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit));
                                    
                                    transaction.update(planRef, { manualItems: finalItems, lastUpdated: new Date() });
                                });
                                // If last item, close modal
                                if (deletedItems.length <= 1) trashModal.classList.add('hidden');
                            });
                        } catch (error) {
                            console.error("Erreur lors de la restauration :", error);
                        }
                    });

                    const deleteForeverBtn = document.createElement('button');
                    deleteForeverBtn.className = 'text-gray-400 hover:text-red-600 font-medium text-sm px-2 py-1';
                    deleteForeverBtn.innerHTML = '<i class="fas fa-times text-lg"></i>';
                    deleteForeverBtn.addEventListener('click', async () => {
                        if (!currentPlan) return;
                        const planRef = doc(db, "plans", currentPlan.id);
                        const key = sanitizeForFirebaseKey(`${item.name}_${item.unit || ''}`);
                        try {
                             await import('firebase/firestore').then(module => {
                                module.updateDoc(planRef, {
                                    hiddenTrashItems: module.arrayUnion(key),
                                    lastUpdated: new Date()
                                });
                            });
                             // If last item, close modal
                            if (deletedItems.length <= 1) trashModal.classList.add('hidden');
                        } catch (error) {
                            console.error("Erreur suppression définitive:", error);
                        }
                    });

                    actionsDiv.appendChild(restoreBtn);
                    actionsDiv.appendChild(deleteForeverBtn);

                    li.appendChild(textDiv);
                    li.appendChild(actionsDiv);
                    deletedUl.appendChild(li);
                });
                trashList.appendChild(deletedUl);
            }
        } else {
             if (trashList) trashList.innerHTML = '<p class="text-center text-gray-500 italic py-4">La corbeille est vide.</p>';
             if (emptyTrashBtn) emptyTrashBtn.classList.add('hidden');
        }
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

        const activeList = [];
        const deletedList = [];
        const hiddenTrashItems = plan.hiddenTrashItems || [];

        combinedIngredients.forEach(item => {
            if (item.totalQuantity > 0) {
                activeList.push(item);
            } else if (item.totalQuantity <= 0 && item.sources && item.sources.length > 0) {
                const unsanitizedKey = `${item.name}_${item.unit || ''}`;
                const key = sanitizeForFirebaseKey(unsanitizedKey);
                if (!hiddenTrashItems.includes(key) && !hiddenTrashItems.includes(unsanitizedKey)) {
                    deletedList.push(item);
                }
            }
        });

        return { active: activeList, deleted: deletedList };
    }

    fetchData();

    return () => {
        if (currentUnsubscribe) currentUnsubscribe();
    };
}

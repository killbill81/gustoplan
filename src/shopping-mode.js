import { getFirestore, doc, getDoc, onSnapshot, collection, getDocs, query, where } from 'firebase/firestore';
import { getCurrentUserId } from './auth.js';
import { getUserPlans } from './plans.js';

const db = getFirestore();
let currentUnsubscribe = null;
let currentPlan = null;
let availableMeals = [];
let masterIngredientList = [];
let checkedItems = {}; // Key: itemName_unit, Value: boolean
let customCategoryOrder = []; // Ordered list of category names

const categoryIcons = {
    'fruits & légumes': 'fa-carrot',
    'produits laitiers': 'fa-cheese',
    'fromagerie': 'fa-cheese',
    'boucherie': 'fa-drumstick-bite',
    'viande': 'fa-drumstick-bite',
    'poissonnerie': 'fa-fish',
    'poisson': 'fa-fish',
    'épicerie': 'fa-box',
    'boissons': 'fa-wine-glass',
    'boulangerie': 'fa-bread-slice',
    'pain': 'fa-bread-slice',
    'dph': 'fa-soap',
    'hygiène': 'fa-soap',
    'surgelés': 'fa-snowflake',
    'entrée': 'fa-utensils',
    'plat': 'fa-concierge-bell',
    'accompagnement': 'fa-plate-wheat',
    'dessert': 'fa-ice-cream',
    'inconnue': 'fa-question'
};

function sanitizeForFirebaseKey(str) {
    if (!str) return '';
    return str.replace(/\./g, '_');
}

export default function init() {
    let container = document.getElementById('shopping-mode-container');
    const planSelect = document.getElementById('shopping-mode-plan-select');
    const trashBtn = document.getElementById('shopping-mode-trash-btn'); // Local ref for listener
    const trashModal = document.getElementById('shopping-trash-modal');
    let activePlanId = null;

    // --- Helper Functions defined inside init to access container ---

    function updateTrashUI(deletedItems) {
        console.log(`[DEBUG] updateTrashUI called with ${deletedItems ? deletedItems.length : 'null'} items`);
        const trashBtn = document.getElementById('shopping-mode-trash-btn');
        const trashCount = document.getElementById('shopping-mode-trash-count');
        const trashModal = document.getElementById('shopping-trash-modal');
        const trashList = document.getElementById('shopping-trash-list');
        const closeTrashBtn = document.getElementById('close-shopping-trash-modal');
        const emptyTrashBtn = document.getElementById('shopping-empty-trash-btn');

        // Update trash button visibility and count
        if (trashBtn) {
            if (deletedItems && deletedItems.length > 0) {
                trashBtn.classList.remove('hidden');
                if (trashCount) trashCount.textContent = deletedItems.length;
            } else {
                trashBtn.classList.add('hidden');
                if (trashCount) trashCount.textContent = '0'; // Ensure count is reset
            }
        }

        if (trashModal && closeTrashBtn) {
            closeTrashBtn.onclick = () => trashModal.classList.add('hidden');
            trashModal.onclick = (e) => {
                if (e.target === trashModal) trashModal.classList.add('hidden');
            };
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
                        } catch (error) { console.error(error); }
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
                        } catch (error) { console.error(error); }
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

    function resetUI() {
        console.log('[DEBUG] Resetting UI and State');
        currentPlan = null;
        if (container) {
            container.innerHTML = '<div class="flex justify-center p-10"><i class="fas fa-spinner fa-spin text-tomato text-2xl"></i></div>';
        }
        // Force hide modal to prevent ghost data
        if (trashModal) trashModal.classList.add('hidden');
        updateTrashUI([]);
    }

    // LISTENER FOR TRASH BUTTON
    if (trashBtn && trashModal) {
        trashBtn.addEventListener('click', () => {
            trashModal.classList.remove('hidden');
        });
    }

    function loadPlan(planId) {
        console.log(`[DEBUG] loadPlan called for: ${planId}`);
        activePlanId = planId;

        if (currentUnsubscribe) {
            console.log('[DEBUG] Unsubscribing from previous plan');
            currentUnsubscribe();
            currentUnsubscribe = null;
        }

        resetUI();

        const planRef = doc(db, 'plans', planId);
        currentUnsubscribe = onSnapshot(planRef, (docSnap) => {
            console.log(`[DEBUG] Snapshot received for doc: ${docSnap.id}`);

            // Race condition check
            if (activePlanId !== planId) {
                console.warn(`[DEBUG] Ignored snapshot for ${planId} because active is ${activePlanId}`);
                return;
            }

            if (docSnap.exists()) {
                console.log(`[DEBUG] Plan data found for ID: ${docSnap.id}`);
                currentPlan = { id: docSnap.id, ...docSnap.data() };
                // Initialize checkedItems from plan data
                checkedItems = currentPlan.checkedItems || {};
                renderShoppingList();
            } else {
                console.log('[DEBUG] Plan not found');
                if (container) container.innerHTML = '<p class="text-center p-4 text-red-500">Menu introuvable.</p>';
            }
        });
    }

    function renderShoppingList() {
        if (!currentPlan || !container) {
            console.log('[DEBUG] renderShoppingList aborted: missing plan or container');
            return;
        }

        console.log(`[DEBUG] Rendering shopping list for menu: ${currentPlan.name} (${currentPlan.id})`);
        const { active: shoppingList, deleted: deletedItems } = generateList(currentPlan);

        console.log(`[DEBUG] Computed deletedItems: ${deletedItems.length} items`);

        // Always update trash UI first
        updateTrashUI(deletedItems);

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
            container.innerHTML = '<p class="text-center p-10 text-gray-500">Votre liste de courses est vide pour ce menu.</p>';
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
            if (customCategoryOrder && customCategoryOrder.length > 0) {
                const indexA = customCategoryOrder.indexOf(a);
                const indexB = customCategoryOrder.indexOf(b);

                // If both in custom order, use that
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                // If only one in custom order, it comes first
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
            }

            // Fallback to alphabetical
            if (a === 'Inconnue') return 1;
            if (b === 'Inconnue') return -1;
            return a.localeCompare(b);
        });

        // --- Category Management UI ---
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'flex justify-end px-4 mb-4 space-x-2';

        // Wake Lock Button
        const wakeLockBtn = document.createElement('button');
        wakeLockBtn.className = 'text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex items-center shadow-sm border border-gray-200';
        wakeLockBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Écran';
        wakeLockBtn.title = "Garder l'écran allumé";

        let wakeLock = null;
        wakeLockBtn.onclick = async () => {
            if ('wakeLock' in navigator) {
                if (wakeLock) {
                    await wakeLock.release();
                    wakeLock = null;
                    wakeLockBtn.classList.remove('text-yellow-600', 'bg-yellow-50', 'border-yellow-200');
                    wakeLockBtn.classList.add('text-gray-500', 'bg-white', 'border-gray-200');
                    wakeLockBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Écran';
                } else {
                    try {
                        wakeLock = await navigator.wakeLock.request('screen');
                        wakeLockBtn.classList.remove('text-gray-500', 'bg-white', 'border-gray-200');
                        wakeLockBtn.classList.add('text-yellow-600', 'bg-yellow-50', 'border-yellow-200');
                        wakeLockBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Actif';

                        wakeLock.addEventListener('release', () => {
                            console.log('Wake Lock released');
                            // If released externally (e.g. system), reset UI
                            wakeLock = null;
                            if (!wakeLockBtn.classList.contains('text-gray-500')) {
                                wakeLockBtn.classList.remove('text-yellow-600', 'bg-yellow-50', 'border-yellow-200');
                                wakeLockBtn.classList.add('text-gray-500', 'bg-white', 'border-gray-200');
                                wakeLockBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Écran';
                            }
                        });
                    } catch (err) {
                        console.error(`${err.name}, ${err.message}`);
                        alert("Impossible de garder l'écran allumé (Batterie faible ?)");
                    }
                }
            } else {
                alert("Votre navigateur ne supporte pas le verrouillage d'écran.");
            }
        };

        // Re-acquire lock on visibility change
        document.addEventListener('visibilitychange', async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                } catch (e) {
                    console.error("Re-acquire wake lock failed", e);
                    wakeLock = null;
                    wakeLockBtn.classList.remove('text-yellow-600', 'bg-yellow-50', 'border-yellow-200');
                    wakeLockBtn.classList.add('text-gray-500', 'bg-white', 'border-gray-200');
                    wakeLockBtn.innerHTML = '<i class="fas fa-lightbulb mr-2"></i> Écran';
                }
            }
        });

        const organizeBtn = document.createElement('button');
        organizeBtn.className = 'text-sm font-medium text-tomato bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-lg transition-colors flex items-center shadow-sm border border-orange-100';
        organizeBtn.innerHTML = '<i class="fas fa-sort mr-2"></i> Organiser';
        organizeBtn.onclick = () => showCategorySortModal(categories);

        // Calculator Button
        const calcBtn = document.createElement('button');
        calcBtn.className = 'text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex items-center shadow-sm border border-gray-200';
        calcBtn.innerHTML = '<i class="fas fa-calculator mr-2"></i> Prix';
        calcBtn.onclick = () => {
            calculatorMode = !calculatorMode;
            if (calculatorMode) {
                calcBtn.classList.remove('text-gray-500', 'bg-white', 'border-gray-200');
                calcBtn.classList.add('text-tomato', 'bg-orange-50', 'border-orange-200');
            } else {
                calcBtn.classList.remove('text-tomato', 'bg-orange-50', 'border-orange-200');
                calcBtn.classList.add('text-gray-500', 'bg-white', 'border-gray-200');
            }
            renderShoppingList(); // Re-render to show/hide inputs
        };

        controlsContainer.appendChild(wakeLockBtn);
        controlsContainer.appendChild(calcBtn);
        controlsContainer.appendChild(organizeBtn);
        container.appendChild(controlsContainer);

        function showCategorySortModal(currentCategories) {
            // Create Modal
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[200] p-4';

            const modalContent = document.createElement('div');
            modalContent.className = 'bg-white rounded-xl w-full max-w-md max-h-[85vh] flex flex-col shadow-2xl overflow-hidden';

            // Header
            const header = document.createElement('div');
            header.className = 'p-4 border-b flex justify-between items-center bg-gray-50';
            header.innerHTML = '<h3 class="font-bold text-lg text-gray-800">Ordre des Rayons</h3>';
            const closeBtn = document.createElement('button');
            closeBtn.className = 'text-gray-400 hover:text-gray-600';
            closeBtn.innerHTML = '<i class="fas fa-times text-xl"></i>';
            closeBtn.onclick = () => modalOverlay.remove();
            header.appendChild(closeBtn);
            modalContent.appendChild(header);

            // List Container
            const listContainer = document.createElement('div');
            listContainer.className = 'overflow-y-auto p-2 flex-grow bg-gray-50';
            const sortList = document.createElement('ul');
            sortList.className = 'space-y-2';

            currentCategories.forEach(cat => {
                const li = document.createElement('li');
                li.className = 'flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-tomato transition-colors';
                li.dataset.category = cat;

                const iconClass = categoryIcons[cat.toLowerCase()] || 'fa-tag';

                li.innerHTML = `
                    <div class="text-gray-400 mr-3 cursor-grab"><i class="fas fa-grip-lines"></i></div>
                    <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3 text-tomato">
                        <i class="fas ${iconClass} text-sm"></i>
                    </div>
                    <span class="font-medium text-gray-700 flex-grow">${cat}</span>
                `;
                sortList.appendChild(li);
            });
            listContainer.appendChild(sortList);
            modalContent.appendChild(listContainer);

            // Footer
            const footer = document.createElement('div');
            footer.className = 'p-4 border-t bg-white flex justify-end space-x-3';

            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium';
            cancelBtn.textContent = 'Annuler';
            cancelBtn.onclick = () => modalOverlay.remove();

            const saveBtn = document.createElement('button');
            saveBtn.className = 'px-6 py-2 bg-tomato text-white rounded-lg font-medium shadow-md hover:bg-tomato-dark transition-transform active:scale-95';
            saveBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Valider';

            saveBtn.onclick = async () => {
                const newOrder = Array.from(sortList.children).map(li => li.dataset.category);
                console.log("[DEBUG] New manual category order:", newOrder);

                customCategoryOrder = newOrder; // Update local state immediately

                // Persist to Firebase
                const uid = getCurrentUserId();
                if (uid) {
                    const userRef = doc(db, "users", uid);
                    try {
                        await import('firebase/firestore').then(module => {
                            module.updateDoc(userRef, {
                                shoppingCategoryOrder: newOrder,
                                lastUpdated: new Date()
                            });
                        });
                    } catch (e) {
                        console.error("Error saving category order", e);
                    }
                }

                modalOverlay.remove();
                renderShoppingList(); // Re-render main list
            };

            footer.appendChild(cancelBtn);
            footer.appendChild(saveBtn);
            modalContent.appendChild(footer);

            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);

            // Init Sortable
            if (window.Sortable) {
                new Sortable(sortList, {
                    animation: 150,
                    handle: '.cursor-grab', // Drag handle
                    ghostClass: 'opacity-50',
                    chosenClass: 'bg-orange-50'
                });
            }
        }

        categories.forEach(cat => {
            const catHeader = document.createElement('h3');
            catHeader.className = 'font-bold text-lg text-gray-700 mt-6 mb-3 border-b border-gray-200 pb-1'; // Removed scroll-mt-24
            catHeader.textContent = cat;
            // Removed ID and dataset for Scroll Spy
            container.appendChild(catHeader);

            // observer.observe(catHeader); // Removed observer

            const ul = document.createElement('ul');
            ul.className = 'space-y-3';

            grouped[cat].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
                // The key logic needs to match how we access it.
                // In generateList we don't have plan ID in the item key, but we need a unique key for storage.
                // Let's use "itemName_unit" as the key within the checkedItems object of THIS plan.
                const unsanitizedKey = `${item.name}_${item.unit || ''}`;
                const key = sanitizeForFirebaseKey(unsanitizedKey);
                const isChecked = checkedItems.hasOwnProperty(key) ? checkedItems[key] : (checkedItems[unsanitizedKey] || false);
                const isManual = item.hasManualEntry === true || (!item.sources || item.sources.length === 0);

                const li = document.createElement('li');
                if (isManual) {
                    li.dataset.isManual = "true";
                    li.style.backgroundColor = "#ffedd5"; // Force orange background
                }

                const bgClass = isChecked ? 'bg-gray-100' : (isManual ? 'bg-orange-100 shadow-sm border border-orange-200' : 'bg-white shadow-sm border border-gray-100');
                li.className = `flex flex-col p-3 rounded-lg transition-colors duration-200 ${bgClass}`;

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

                // Price Input (Active Items)
                if (calculatorMode) {
                    const priceContainer = createPriceInput(key, itemPrices[key]);
                    mainContent.appendChild(priceContainer);
                }

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
                        const servingsText = source.servings ? ` - ${source.servings} pers.` : '';
                        const key = `${source.recipeName} (${source.day} ${source.time})${servingsText}`;
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
                    const isManual = item.hasManualEntry === true || (!item.sources || item.sources.length === 0);

                    const li = document.createElement('li');
                    if (isManual) li.dataset.isManual = "true";
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

                    // Price Input (Checked Items)
                    if (calculatorMode) {
                        const priceContainer = createPriceInput(key, itemPrices[key]);
                        mainContent.appendChild(priceContainer);
                    }

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

                    // Add annotations if available (Copied logic)
                    if (item.sources && item.sources.length > 0) {
                        const annotationsDiv = document.createElement('div');
                        annotationsDiv.className = 'mt-2 ml-9 text-xs text-gray-400 space-y-1'; // text-gray-400 for checked items

                        // Group sources by recipe and day
                        const groupedSources = item.sources.reduce((acc, source) => {
                            const servingsText = source.servings ? ` - ${source.servings} pers.` : '';
                            const key = `${source.recipeName} (${source.day} ${source.time})${servingsText}`;
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
        // Sticky Footer for Calculator
        if (calculatorMode) {
            const footer = document.createElement('div');
            footer.id = 'shopping-total-display';
            footer.className = 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg text-lg flex justify-between items-center z-50 pb-safe'; // pb-safe for iPhone Home bar
            footer.innerHTML = '<span class="text-gray-500">Total:</span> 0.00€ <span class="mx-2">|</span> <span class="font-bold text-tomato">Panier: 0.00€</span>';
            document.body.appendChild(footer);
            // Trigger initial calculation
            setTimeout(updateTotals, 0);

            // Add padding to container so footer doesn't hide content
            container.style.paddingBottom = '80px';
        } else {
            container.style.paddingBottom = '20px';
            // Remove footer if exists (cleanup handled by container.innerHTML='' at start of render, but footer is attached to body)
            const existingFooter = document.getElementById('shopping-total-display');
            if (existingFooter) existingFooter.remove();
        }
    }

    let calculatorMode = false;
    let itemPrices = {}; // Key: itemName_unit, Value: number

    function updateItemPrice(key, price) {
        if (!currentPlan) return;

        itemPrices[key] = price;
        updateTotals();

        const planRef = doc(db, 'plans', currentPlan.id);
        const updateData = {};
        updateData[`itemPrices.${key}`] = price;
        updateData['lastUpdated'] = new Date();

        import('firebase/firestore').then(module => {
            module.updateDoc(planRef, updateData).catch(err => console.error("Error saving price", err));
        });
    }

    function updateTotals() {
        const totalSpan = document.getElementById('shopping-total-display');
        if (!totalSpan) return;

        let total = 0;
        let cart = 0;

        // Iterate over all known prices
        // Note: We need the quantity from the list to calculate total correctly if price is per unit?
        // User request "Champ saisie prix". Usually user inputs TOTAL price of the item package. 
        // e.g. "Pack of milk" -> 6€.
        // Simple fallback: The input IS the price added to total.

        Object.values(itemPrices).forEach(p => total += (parseFloat(p) || 0));

        // Calculate Cart Total (Checked items)
        // We need to know which items are checked. itemPrices keys match checkedItems keys.
        Object.keys(itemPrices).forEach(key => {
            const price = parseFloat(itemPrices[key]) || 0;
            if (checkedItems[key]) {
                cart += price;
            }
        });

        totalSpan.innerHTML = `<span class="text-gray-500">Total:</span> ${total.toFixed(2)}€ <span class="mx-2">|</span> <span class="font-bold text-tomato">Panier: ${cart.toFixed(2)}€</span>`;
    }

    function createPriceInput(key, initialValue) {
        const container = document.createElement('div');
        container.className = 'ml-auto flex items-center border rounded-lg border-gray-300 bg-white focus-within:ring-2 focus-within:ring-tomato focus-within:border-tomato';

        const input = document.createElement('input');
        input.type = 'number';
        input.step = '0.01';
        input.className = 'w-16 p-1 text-right text-sm border-none focus:ring-0 rounded-l-lg appearance-none';
        input.value = initialValue || '';
        input.onclick = (e) => e.stopPropagation();
        input.onchange = (e) => updateItemPrice(key, parseFloat(e.target.value));

        const symbol = document.createElement('span');
        symbol.className = 'text-gray-500 text-sm pr-2 pl-1 bg-gray-50 h-full flex items-center rounded-r-lg border-l border-gray-100';
        symbol.textContent = '€';

        container.appendChild(input);
        container.appendChild(symbol);

        return container;
    }

    // Lets also add the Price Input logic in a separate step or via DOM update function to avoid loop complexity?
    // Actually, I need to restore the updateItemState function signature here first.

    function updateItemState(key, isChecked, li, checkbox, nameSpan, qtySpan) {
        if (!currentPlan) return;

        const isManual = li.dataset.isManual === "true";

        function createPriceInput(key, initialValue) {
            const container = document.createElement('div');
            container.className = 'ml-auto flex items-center border rounded-lg border-gray-300 bg-white focus-within:ring-2 focus-within:ring-tomato focus-within:border-tomato ml-4'; // Added ml-4 for spacing

            const input = document.createElement('input');
            input.type = 'number';
            input.step = '0.01';
            input.className = 'w-16 p-1 text-right text-sm border-none focus:ring-0 rounded-l-lg appearance-none'; // Remove default borders
            input.value = initialValue || '';
            input.onclick = (e) => e.stopPropagation();
            input.onchange = (e) => updateItemPrice(key, parseFloat(e.target.value));

            const symbol = document.createElement('span');
            symbol.className = 'text-gray-500 text-sm pr-2 pl-1 bg-gray-50 h-full flex items-center rounded-r-lg border-l border-gray-100';
            symbol.textContent = '€';

            container.appendChild(input);
            container.appendChild(symbol);

            return container;
        }

        // ... inside UpdateItemState ...
        // Note: I will need to call this helper in the Active/Checked loops.
        // Since I cannot rewrite the whole file, I will define the function globally (inside renderShoppingList) 
        // and then use regex replace for the usage sites in the next steps.

        // HOWEVER, I am editing the file now. I will insert the helper function before generateList (?) 
        // NO, 'renderShoppingList' is a closure. I should put it next to 'updateItemPrice'.

        // This replace_file_content call is tricky because I need to insert the function AND replace usage.
        // I'll stick to inserting the helper first near 'updateItemPrice'.

        if (isChecked) {
            li.classList.remove('bg-white', 'bg-orange-100', 'shadow-sm', 'border', 'border-gray-100', 'border-orange-200');
            li.classList.add('bg-gray-100');
            li.style.backgroundColor = ""; // Clear manual color when checked
            nameSpan.classList.add('line-through', 'text-gray-400');
            nameSpan.classList.remove('text-gray-800');
            qtySpan.classList.add('text-gray-400');
            qtySpan.classList.remove('text-gray-800');
        } else {
            li.classList.remove('bg-gray-100');
            if (isManual) {
                li.classList.add('bg-orange-100', 'shadow-sm', 'border', 'border-orange-200');
                li.style.backgroundColor = "#ffedd5"; // Restore manual color
            } else {
                li.classList.add('bg-white', 'shadow-sm', 'border', 'border-gray-100');
                li.style.backgroundColor = ""; // Ensure white/default
            }
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
                category: item.category || 'Inconnue',
                hasManualEntry: true
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
                                    quantity: finalQty,
                                    servings: numPeople
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
                                        quantity: finalQty,
                                        servings: numPeople
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

    // Setup Plan Select Listener ONCE
    if (planSelect) {
        // Clone to remove existing listeners (nuclear option to be safe if init runs multiple times without full cleanup)
        const newSelect = planSelect.cloneNode(true);
        planSelect.parentNode.replaceChild(newSelect, planSelect);

        newSelect.addEventListener('change', (e) => {
            const newPlanId = e.target.value;
            localStorage.setItem('lastActivePlanId', newPlanId);
            loadPlan(newPlanId);
        });
    }

    async function fetchData() {
        // 0. Fetch User Preferences (Category Order)
        const uid = getCurrentUserId();
        if (uid) {
            try {
                const userSnap = await getDoc(doc(db, "users", uid));
                if (userSnap.exists()) {
                    customCategoryOrder = userSnap.data().shoppingCategoryOrder || [];
                }
            } catch (e) {
                console.error("Error fetching user preferences", e);
            }
        }
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
            const currentSelect = document.getElementById('shopping-mode-plan-select'); // Get fresh ref
            if (!currentSelect) return;

            const currentVal = currentSelect.value;
            currentSelect.innerHTML = '';

            if (plans.length === 0) {
                if (container) container.innerHTML = '<p class="text-center p-4">Aucun menu trouvé.</p>';
                return;
            }

            plans.forEach(plan => {
                const option = document.createElement('option');
                option.value = plan.id;
                option.textContent = plan.name;
                currentSelect.appendChild(option);
            });

            // Select logic
            const lastActivePlanId = localStorage.getItem('lastActivePlanId');
            let targetId = null;

            if (lastActivePlanId && plans.some(p => p.id === lastActivePlanId)) {
                targetId = lastActivePlanId;
            } else if (plans.length > 0) {
                targetId = plans[0].id;
            }

            if (targetId) {
                if (currentVal && plans.some(p => p.id === currentVal)) {
                    currentSelect.value = currentVal;
                    if (!currentPlan) loadPlan(currentVal);
                } else {
                    currentSelect.value = targetId;
                    loadPlan(targetId);
                }
            }
        });
    }

    fetchData();

    return () => {
        if (currentUnsubscribe) currentUnsubscribe();
        if (scrollTopBtn) scrollTopBtn.remove();
    };
}

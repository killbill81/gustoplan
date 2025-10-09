import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDoc, arrayRemove } from 'firebase/firestore';
import { getCurrentUser } from './auth.js';

const db = getFirestore();

// --- DOM Element variables (declared but not assigned) ---
let createPlanModal, closeCreatePlanModalBtn, cancelCreatePlanBtn, createPlanForm, planSelect;
let renamePlanModal, closeRenamePlanModalBtn, cancelRenamePlanBtn, renamePlanForm, newPlanNameInput;
let deleteConfirmModal, cancelDeleteBtn, confirmDeleteBtn, deleteConfirmTitle, deleteConfirmMessage;

let planToDeleteId = null;
let planToRenameId = null;

// --- Modal Handling ---
function openCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.remove('hidden');
}

function closeCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.add('hidden');
    if (createPlanForm) createPlanForm.reset();
}

function openRenamePlanModal(planId, currentName) {
    planToRenameId = planId;
    if (newPlanNameInput) newPlanNameInput.value = currentName;
    if (renamePlanModal) renamePlanModal.classList.remove('hidden');
    if (newPlanNameInput) newPlanNameInput.focus();
}

function closeRenamePlanModal() {
    planToRenameId = null;
    if (renamePlanModal) renamePlanModal.classList.add('hidden');
    if (renamePlanForm) renamePlanForm.reset();
}

function openDeleteConfirmModal(planId, planName) {
    planToDeleteId = planId;
    if (deleteConfirmTitle) deleteConfirmTitle.textContent = 'Confirmer la suppression';
    if (deleteConfirmMessage) deleteConfirmMessage.textContent = `Êtes-vous sûr de vouloir supprimer le plan "${planName}" ? Cette action est irréversible.`;
    if (deleteConfirmModal) deleteConfirmModal.classList.remove('hidden');
}

function closeDeleteConfirmModal() {
    planToDeleteId = null;
    if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
}

// --- Firestore Functions ---
async function createPlan(name) {
    const user = getCurrentUser();
    if (!user) return;

    try {
        await addDoc(collection(db, 'plans'), {
            userId: user.uid,
            name: name,
            type: 'personal',
            weeks: {},
            manualItems: [],
            defaultNumPeople: 1,
            startDay: 'Lundi',
            lastUpdated: new Date()
        });
        closeCreatePlanModal();
    } catch (error) {
        console.error("Error creating plan: ", error);
        alert("Erreur lors de la création du plan.");
    }
}

async function renamePlan(planId, newName) {
    if (!planId || !newName) return;
    try {
        const planRef = doc(db, 'plans', planId);
        await updateDoc(planRef, { name: newName });
        closeRenamePlanModal();
    } catch (error) {
        console.error("Error renaming plan: ", error);
        alert("Erreur lors du renommage du plan.");
    }
}

async function leavePlan(planId) {
    const userId = getCurrentUser()?.uid;
    if (!planId || !userId) return;

    if (confirm("Voulez-vous vraiment quitter ce plan partagé ? Il n'apparaîtra plus dans votre liste.")) {
        try {
            const planRef = doc(db, 'plans', planId);
            await updateDoc(planRef, {
                collaborators: arrayRemove(userId)
            });
            // The onSnapshot listener will automatically remove the plan from the list.
        } catch (error) {
            console.error("Erreur pour quitter le plan: ", error);
            alert("Une erreur est survenue.");
        }
    }
}

async function deletePlan(planId) {
    if (!planId) return;
    try {
        await deleteDoc(doc(db, 'plans', planId));
    } catch (error) {
        console.error("Error deleting plan: ", error);
        alert("Erreur lors de la suppression du plan.");
    }
}

function getUserPlans(callback) {
    const user = getCurrentUser();
    if (!user) return () => {};

    let allPlans = new Map();

    const processAndCallback = () => {
        callback(Array.from(allPlans.values()).sort((a, b) => a.name.localeCompare(b.name)));
    };

    // Query 1: Plans owned by the user
    const qOwned = query(collection(db, 'plans'), where('userId', '==', user.uid));
    const unsubscribeOwned = onSnapshot(qOwned, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "removed") {
                allPlans.delete(change.doc.id);
            } else {
                allPlans.set(change.doc.id, { id: change.doc.id, ...change.doc.data(), isOwner: true });
            }
        });
        processAndCallback();
    });

    // Query 2: Plans where the user is a collaborator
    const qCollab = query(collection(db, 'plans'), where('collaborators', 'array-contains', user.uid));
    const unsubscribeCollab = onSnapshot(qCollab, async (snapshot) => {
        const changes = snapshot.docChanges();

        // Handle removals synchronously
        changes.forEach(change => {
            if (change.type === "removed") {
                allPlans.delete(change.doc.id);
            }
        });

        // Handle additions/modifications asynchronously (because we need to fetch owner names)
        const promises = changes.filter(c => c.type !== 'removed').map(async (change) => {
            const planDoc = change.doc; // Renamed variable to avoid shadowing
            const planData = planDoc.data();
            let ownerName = 'Inconnu';
            try {
                const ownerDoc = await getDoc(doc(db, 'users', planData.userId));
                if (ownerDoc.exists()) {
                    ownerName = ownerDoc.data().displayName || 'Inconnu';
                }
            } catch (e) {
                console.error("Erreur lors de la récupération du nom du propriétaire", e);
            }
            allPlans.set(planDoc.id, { id: planDoc.id, ...planData, isOwner: false, ownerName: ownerName });
        });

        if (promises.length > 0) {
            await Promise.all(promises);
        }
        
        processAndCallback();
    });

    // Return a function that unsubscribes from both listeners
    return () => {
        unsubscribeOwned();
        unsubscribeCollab();
    };
}

// --- UI Rendering ---
function populatePlanSelector(plans) {
    if (!planSelect) return;

    const selectedValue = planSelect.value;
    planSelect.innerHTML = '';

    if (plans.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Aucun plan personnel';
        option.disabled = true;
        planSelect.appendChild(option);
        return;
    }

    plans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.id;

        let displayName = plan.name;
        // For collaborative plans, append the owner's name and a tag
        if (plan.isOwner === false && plan.ownerName) {
            displayName = `${plan.name} [Collab] (de ${plan.ownerName})`;
        }
        // For copied plans, the name is already formatted upon creation

        option.textContent = displayName;
        planSelect.appendChild(option);
    });

    if (selectedValue && planSelect.querySelector(`option[value="${selectedValue}"]`)) {
        planSelect.value = selectedValue;
    } else {
        planSelect.selectedIndex = 0;
    }
}

// --- Initialization ---
export function initPlanManagement() {
    // Assign DOM elements now that the HTML is loaded
    createPlanModal = document.getElementById('create-plan-modal');
    closeCreatePlanModalBtn = document.getElementById('close-create-plan-modal');
    cancelCreatePlanBtn = document.getElementById('cancel-create-plan-btn');
    createPlanForm = document.getElementById('create-plan-form');
    planSelect = document.getElementById('plan-select');
    
    renamePlanModal = document.getElementById('rename-plan-modal');
    closeRenamePlanModalBtn = document.getElementById('close-rename-plan-modal');
    cancelRenamePlanBtn = document.getElementById('cancel-rename-plan-btn');
    renamePlanForm = document.getElementById('rename-plan-form');
    newPlanNameInput = document.getElementById('new-plan-name');

    deleteConfirmModal = document.getElementById('delete-confirm-modal');
    cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    deleteConfirmTitle = document.getElementById('delete-confirm-title');
    deleteConfirmMessage = document.getElementById('delete-confirm-message');

    const createPlanBtn = document.getElementById('create-plan-btn');
    const renamePlanBtn = document.getElementById('rename-plan-btn');
    const leavePlanBtn = document.getElementById('leave-plan-btn');
    const deletePlanBtn = document.getElementById('delete-plan-btn');

    if (createPlanBtn) {
        createPlanBtn.addEventListener('click', openCreatePlanModal);
    }

    if (renamePlanBtn) {
        renamePlanBtn.addEventListener('click', () => {
            if (planSelect && planSelect.value) {
                const selectedOption = planSelect.options[planSelect.selectedIndex];
                openRenamePlanModal(planSelect.value, selectedOption.text);
            } else {
                alert("Veuillez sélectionner un plan à renommer.");
            }
        });
    }

    if (leavePlanBtn) {
        leavePlanBtn.addEventListener('click', () => {
            if (planSelect && planSelect.value) {
                leavePlan(planSelect.value);
            } else {
                alert("Veuillez sélectionner un plan.");
            }
        });
    }

    if (deletePlanBtn) {
        deletePlanBtn.addEventListener('click', () => {
            if (planSelect && planSelect.value) {
                const selectedPlanName = planSelect.options[planSelect.selectedIndex].text;
                openDeleteConfirmModal(planSelect.value, selectedPlanName);
            } else {
                alert("Veuillez sélectionner un plan à supprimer.");
            }
        });
    }

    // Modal event listeners
    if (closeCreatePlanModalBtn) closeCreatePlanModalBtn.addEventListener('click', closeCreatePlanModal);
    if (cancelCreatePlanBtn) cancelCreatePlanBtn.addEventListener('click', closeCreatePlanModal);
    if (createPlanForm) {
        createPlanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('plan-name');
            if (nameInput && nameInput.value) {
                createPlan(nameInput.value);
            }
        });
    }

    if (closeRenamePlanModalBtn) closeRenamePlanModalBtn.addEventListener('click', closeRenamePlanModal);
    if (cancelRenamePlanBtn) cancelRenamePlanBtn.addEventListener('click', closeRenamePlanModal);
    if (renamePlanForm) {
        renamePlanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (planToRenameId && newPlanNameInput.value) {
                renamePlan(planToRenameId, newPlanNameInput.value);
            }
        });
    }

    if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (planToDeleteId) {
                deletePlan(planToDeleteId).then(() => {
                    closeDeleteConfirmModal();
                });
            }
        });
    }
}

export { getUserPlans, populatePlanSelector };

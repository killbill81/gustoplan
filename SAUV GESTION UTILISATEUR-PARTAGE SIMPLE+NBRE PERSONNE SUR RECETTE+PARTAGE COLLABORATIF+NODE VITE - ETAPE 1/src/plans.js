import { db } from './firebase-config.js';
import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { getCurrentUser } from './auth.js';

// --- DOM Element variables (declared but not assigned) ---
let createPlanModal, closeCreatePlanModalBtn, cancelCreatePlanBtn, createPlanForm, planSelect;
let deleteConfirmModal, cancelDeleteBtn, confirmDeleteBtn, deleteConfirmTitle, deleteConfirmMessage;

let planToDeleteId = null;

// --- Modal Handling ---
function openCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.remove('hidden');
}

function closeCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.add('hidden');
    if (createPlanForm) createPlanForm.reset();
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

    const q = query(collection(db, 'plans'), where('userId', '==', user.uid), where('type', '==', 'personal'));

    return onSnapshot(q, (querySnapshot) => {
        const plans = [];
        querySnapshot.forEach((doc) => {
            plans.push({ id: doc.id, ...doc.data() });
        });
        callback(plans);
    });
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
        option.textContent = plan.name;
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
    deleteConfirmModal = document.getElementById('delete-confirm-modal');
    cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    deleteConfirmTitle = document.getElementById('delete-confirm-title');
    deleteConfirmMessage = document.getElementById('delete-confirm-message');

    const createPlanBtn = document.getElementById('create-plan-btn');
    const deletePlanBtn = document.getElementById('delete-plan-btn');

    if (createPlanBtn) {
        createPlanBtn.addEventListener('click', openCreatePlanModal);
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

    if (closeCreatePlanModalBtn) {
        closeCreatePlanModalBtn.addEventListener('click', closeCreatePlanModal);
    }

    if (cancelCreatePlanBtn) {
        cancelCreatePlanBtn.addEventListener('click', closeCreatePlanModal);
    }

    if (createPlanForm) {
        createPlanForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('plan-name');
            if (nameInput && nameInput.value) {
                createPlan(nameInput.value);
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
    }
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

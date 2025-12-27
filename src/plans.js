import { getFirestore, collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc, getDoc, arrayRemove, arrayUnion, serverTimestamp, getDocs } from 'firebase/firestore';
import { getCurrentUser } from './auth.js';
import { updateProfileIncremental } from './ia-utils.js';

const db = getFirestore();

// --- DOM Element variables (declared but not assigned) ---
let createPlanModal, closeCreatePlanModalBtn, cancelCreatePlanBtn, createPlanForm, planSelect;
let renamePlanModal, closeRenamePlanModalBtn, cancelRenamePlanBtn, renamePlanForm, newPlanNameInput;
let deleteConfirmModal, cancelDeleteBtn, confirmDeleteBtn, deleteConfirmTitle, deleteConfirmMessage;

let planToDeleteId = null;
let planToRenameId = null;

// --- Modal Handling (now exported) ---
export function openCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.remove('hidden');
}

function closeCreatePlanModal() {
    if (createPlanModal) createPlanModal.classList.add('hidden');
    if (createPlanForm) createPlanForm.reset();
}

export function openRenamePlanModal(planId, currentName) {
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

export function openDeleteConfirmModal(planId, planName) {
    planToDeleteId = planId;
    if (deleteConfirmTitle) deleteConfirmTitle.textContent = 'Confirmer la suppression';
    if (deleteConfirmMessage) deleteConfirmMessage.textContent = `Êtes-vous sûr de vouloir supprimer le menu "${planName}" ? Cette action est irréversible.`;
    if (deleteConfirmModal) deleteConfirmModal.classList.remove('hidden');
}

function closeDeleteConfirmModal() {
    planToDeleteId = null;
    if (deleteConfirmModal) deleteConfirmModal.classList.add('hidden');
}

// --- Firestore Functions ---
export async function createPlan(name) {
    const user = getCurrentUser();
    if (!user) return null;

    try {
        const docRef = await addDoc(collection(db, 'plans'), {
            userId: user.uid,
            name: name,
            type: 'personal',
            weeks: {},
            manualItems: [],
            checkedItems: {},
            defaultNumPeople: 1,
            startDay: 'Lundi',
            archivedBy: [],
            lastUpdated: new Date()
        });
        closeCreatePlanModal();
        return docRef.id;
    } catch (error) {
        console.error("Error creating plan: ", error);
        alert("Erreur lors de la création du menu.");
        return null;
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
        alert("Erreur lors du renommage du menu.");
    }
}

async function leavePlan(planId) {
    const userId = getCurrentUser()?.uid;
    if (!planId || !userId) return;

    if (confirm("Voulez-vous vraiment quitter ce menu partagé ? Il n'apparaîtra plus dans votre liste.")) {
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
        alert("Erreur lors de la suppression du menu.");
    }
}

async function archivePlan(planId, isArchived = true) {
    if (!planId) return;
    const user = getCurrentUser();
    if (!user) return;

    try {
        const planRef = doc(db, 'plans', planId);
        if (isArchived) {
            await updateDoc(planRef, { archivedBy: arrayUnion(user.uid) });
        } else {
            await updateDoc(planRef, { archivedBy: arrayRemove(user.uid) });
        }
    } catch (error) {
        console.error("Error archiving plan: ", error);
        alert("Erreur lors de l'archivage du menu.");
    }
}

function getUserPlans(callback) {
    const user = getCurrentUser();
    if (!user) return () => { };

    let allPlans = new Map();

    const processAndCallback = () => {
        callback(Array.from(allPlans.values()).sort((a, b) => a.name.localeCompare(b.name)));
    };

    const fetchParticipants = async (planData) => {
        const participantIds = [planData.userId, ...(planData.collaborators || [])];
        const participantPromises = participantIds.map(id => getDoc(doc(db, 'users', id)));
        const participantDocs = await Promise.all(participantPromises);
        return participantDocs.map(doc => doc.exists() ? doc.data() : { uid: doc.id, displayName: 'Inconnu' });
    };

    // Query 1: Plans owned by the user
    const qOwned = query(collection(db, 'plans'), where('userId', '==', user.uid));
    const unsubscribeOwned = onSnapshot(qOwned, async (snapshot) => {
        const changes = snapshot.docChanges();
        const promises = changes.map(async (change) => {
            if (change.type === "removed") {
                allPlans.delete(change.doc.id);
            } else {
                const planData = change.doc.data();
                const participants = await fetchParticipants(planData);
                allPlans.set(change.doc.id, { id: change.doc.id, ...planData, isOwner: true, participants });
            }
        });
        await Promise.all(promises);
        processAndCallback();
    });

    // Query 2: Plans where the user is a collaborator
    const qCollab = query(collection(db, 'plans'), where('collaborators', 'array-contains', user.uid));
    const unsubscribeCollab = onSnapshot(qCollab, async (snapshot) => {
        const changes = snapshot.docChanges();
        const promises = changes.map(async (change) => {
            if (change.type === "removed") {
                allPlans.delete(change.doc.id);
            } else {
                const planData = change.doc.data();
                const participants = await fetchParticipants(planData);
                const owner = participants.find(p => p.uid === planData.userId);
                allPlans.set(change.doc.id, { id: change.doc.id, ...planData, isOwner: false, ownerName: owner?.displayName || 'Inconnu', participants });
            }
        });
        await Promise.all(promises);
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
        option.textContent = 'Aucun menu personnel';
        option.disabled = true;
        planSelect.appendChild(option);
        return;
    }

    const user = getCurrentUser();
    plans.forEach(plan => {
        if (plan.isArchived) return; // Legacy support
        if (user && plan.archivedBy && plan.archivedBy.includes(user.uid)) return;
        const option = document.createElement('option');
        option.value = plan.id;

        let displayName = plan.name;
        if (plan.collaborators && plan.collaborators.length > 0) {
            if (plan.isOwner) {
                displayName = `👑 ${plan.name} [Collab]`;
            } else {
                displayName = `👥 ${plan.name} [Collab] (de ${plan.ownerName})`;
            }
        }

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

    // --- Event Handlers ---
    const handleCreatePlanSubmit = (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('plan-name');
        if (nameInput && nameInput.value) {
            createPlan(nameInput.value);
        }
    };

    const handleRenamePlanSubmit = (e) => {
        e.preventDefault();
        if (planToRenameId && newPlanNameInput.value) {
            renamePlan(planToRenameId, newPlanNameInput.value);
        }
    };

    const handleConfirmDelete = () => {
        if (planToDeleteId) {
            deletePlan(planToDeleteId).then(() => {
                closeDeleteConfirmModal();
            });
        }
    };

    const handleRenameClick = () => {
        if (planSelect && planSelect.value) {
            const selectedOption = planSelect.options[planSelect.selectedIndex];
            openRenamePlanModal(planSelect.value, selectedOption.text);
        } else {
            alert("Veuillez sélectionner un menu à renommer.");
        }
    };

    const handleLeaveClick = () => {
        if (planSelect && planSelect.value) {
            leavePlan(planSelect.value);
        } else {
            alert("Veuillez sélectionner un menu.");
        }
    };

    const handleDeleteClick = () => {
        if (planSelect && planSelect.value) {
            const selectedPlanName = planSelect.options[planSelect.selectedIndex].text;
            openDeleteConfirmModal(planSelect.value, selectedPlanName);
        } else {
            alert("Veuillez sélectionner un menu à supprimer.");
        }
    };

    // --- Attach Listeners ---
    createPlanBtn?.addEventListener('click', openCreatePlanModal);
    renamePlanBtn?.addEventListener('click', handleRenameClick);
    leavePlanBtn?.addEventListener('click', handleLeaveClick);
    deletePlanBtn?.addEventListener('click', handleDeleteClick);
    closeCreatePlanModalBtn?.addEventListener('click', closeCreatePlanModal);
    cancelCreatePlanBtn?.addEventListener('click', closeCreatePlanModal);
    createPlanForm?.addEventListener('submit', handleCreatePlanSubmit);
    closeRenamePlanModalBtn?.addEventListener('click', closeRenamePlanModal);
    cancelRenamePlanBtn?.addEventListener('click', closeRenamePlanModal);
    renamePlanForm?.addEventListener('submit', handleRenamePlanSubmit);
    cancelDeleteBtn?.addEventListener('click', closeDeleteConfirmModal);
    confirmDeleteBtn?.addEventListener('click', handleConfirmDelete);

    // --- Return Cleanup Function ---
    return () => {
        createPlanBtn?.removeEventListener('click', openCreatePlanModal);
        renamePlanBtn?.removeEventListener('click', handleRenameClick);
        leavePlanBtn?.removeEventListener('click', handleLeaveClick);
        deletePlanBtn?.removeEventListener('click', handleDeleteClick);
        closeCreatePlanModalBtn?.removeEventListener('click', closeCreatePlanModal);
        cancelCreatePlanBtn?.removeEventListener('click', closeCreatePlanModal);
        createPlanForm?.removeEventListener('submit', handleCreatePlanSubmit);
        closeRenamePlanModalBtn?.removeEventListener('click', closeRenamePlanModal);
        cancelRenamePlanBtn?.removeEventListener('click', closeRenamePlanModal);
        renamePlanForm?.removeEventListener('submit', handleRenamePlanSubmit);
        cancelDeleteBtn?.removeEventListener('click', closeDeleteConfirmModal);
        confirmDeleteBtn?.removeEventListener('click', handleConfirmDelete);
    };
}

export { getUserPlans, populatePlanSelector, archivePlan, deletePlan };

export async function addCollaborator(planId, userId) {
    if (!planId || !userId) return;
    try {
        const planRef = doc(db, 'plans', planId);
        await updateDoc(planRef, {
            collaborators: arrayUnion(userId),
            type: 'collaborative' // Ensure plan type is set to collaborative
        });
    } catch (error) {
        console.error("Error adding collaborator: ", error);
        // Handle the error appropriately
    }
}

export async function saveHistory(planId, planObject, description = 'Modification diverse') {
    if (!planId || !planObject) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        const historyRef = collection(db, 'plans', planId, 'history');
        // Create a deep copy to avoid saving proxies or complex objects
        const planStateToSave = JSON.parse(JSON.stringify(planObject));

        await addDoc(historyRef, {
            planState: planStateToSave,
            timestamp: serverTimestamp(),
            modifiedBy: user.uid,
            modifiedByName: user.displayName || user.email,
            description: description
        });
    } catch (error) {
        console.error("Error saving history:", error);
    }
}

export async function saveOrUpdatePlanSaveByName(saveName, planData) {
    const user = getCurrentUser();
    if (!user || !saveName || !planData) return;

    try {
        const savesRef = collection(db, 'plan_saves');
        const q = query(savesRef, where("userId", "==", user.uid), where("name", "==", saveName));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update existing save
            const existingSaveId = querySnapshot.docs[0].id;
            const saveRef = doc(db, 'plan_saves', existingSaveId);
            await updateDoc(saveRef, {
                planData: planData,
                savedAt: serverTimestamp()
            });
        } else {
            // Create new save
            await addDoc(savesRef, {
                userId: user.uid,
                name: saveName,
                savedAt: serverTimestamp(),
                planData: planData
            });
        }

        // --- MISE À JOUR IA INC RÉMENTALE ---
        // On met à jour le profil IA avec les données du plan sauvegardé
        await updateProfileIncremental(user.uid, planData);

    } catch (error) {
        console.error("Error saving or updating plan save:", error);
        alert("Erreur lors de la sauvegarde.");
    }
}

export async function savePlanWeek(planId, weekNumber, weekData) {
    if (!planId || !weekNumber || !weekData) return;

    const planRef = doc(db, 'plans', planId);
    try {
        await updateDoc(planRef, {
            [`weeks.${weekNumber}`]: weekData,
            lastUpdated: new Date()
        });
        console.log(`Week ${weekNumber} of plan ${planId} saved successfully.`);
        // On pourrait aussi appeler saveHistory ici si nécessaire
    } catch (error) {
        console.error("Error saving plan week:", error);
        alert("Erreur lors de la sauvegarde du menu.");
    }
}

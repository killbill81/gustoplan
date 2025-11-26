import { db } from './firebase-config.js';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getCurrentUserId } from './auth.js';
import { navigateTo } from './router.js';

// Fonction pour charger une sauvegarde dans le plan de travail principal
async function loadSaveIntoActivePlan(saveId) {
    if (!confirm("Voulez-vous charger cette sauvegarde ? Attention, cela écrasera la planification de la semaine correspondante dans votre plan de travail actuel.")) return;

    try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("Utilisateur non trouvé");

        // 1. Récupérer les données de la sauvegarde
        const saveRef = doc(db, 'plan_saves', saveId);
        const saveSnap = await getDoc(saveRef);
        if (!saveSnap.exists()) throw new Error("Sauvegarde non trouvée.");
        const saveData = saveSnap.data();
        const weekNumber = saveData.weekData.weekNumber;

        // 2. Récupérer le premier plan de travail de l'utilisateur (le plan "live")
        // Note: cette logique suppose que l'utilisateur a au moins un plan de travail.
        const plansQuery = query(collection(db, 'plans'), where("userId", "==", userId));
        const plansSnap = await getDocs(plansQuery);
        if (plansSnap.empty) throw new Error("Aucun plan de travail trouvé pour y charger la sauvegarde.");
        const livePlanDoc = plansSnap.docs[0]; // On prend le premier plan trouvé

        // 3. Mettre à jour le plan de travail avec les données de la sauvegarde pour la semaine concernée
        const livePlanRef = doc(db, 'plans', livePlanDoc.id);
        await updateDoc(livePlanRef, {
            [`weeks.${weekNumber}`]: saveData.weekData
        });

        // 4. Rediriger vers la page du menu pour voir le résultat
        localStorage.setItem('selectedPlanId', livePlanDoc.id);
        navigateTo('menu');

    } catch (error) {
        console.error("Erreur lors du chargement de la sauvegarde:", error);
        alert(error.message);
    }
}

// Fonction pour supprimer une sauvegarde
async function deletePlanSave(saveId) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette sauvegarde ? Cette action est définitive.")) return;
    try {
        await deleteDoc(doc(db, "plan_saves", saveId));
    } catch (error) {
        console.error("Erreur lors de la suppression de la sauvegarde:", error);
        alert("La suppression a échoué.");
    }
}

export default function initAllPlansPage() {
    const allSavesListContainer = document.getElementById('all-plans-list');
    const userId = getCurrentUserId();

    if (!userId || !allSavesListContainer) {
        allSavesListContainer.innerHTML = '<p>Erreur de chargement.</p>';
        return () => {};
    }

    const q = query(collection(db, "plan_saves"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        allSavesListContainer.innerHTML = '';
        if (snapshot.empty) {
            allSavesListContainer.innerHTML = '<p class="text-center text-gray-500 p-10 col-span-full">Vous n\'avez aucune sauvegarde.</p>';
            return;
        }

        const saves = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        saves.sort((a, b) => b.savedAt.toMillis() - a.savedAt.toMillis()); // Trier par date, plus récent en premier

        saves.forEach(save => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-xl shadow-md p-4 flex flex-col justify-between';

            const saveDate = save.savedAt?.toDate().toLocaleString('fr-FR') || 'Date inconnue';

            const planData = save.planData;
            let weeksInfo = 'Plan vide ou sans données.';
            if (planData && planData.weeks) {
                const weekCount = Object.keys(planData.weeks).length;
                if (weekCount > 0) {
                    weeksInfo = `Contient ${weekCount} semaine(s).`;
                }
            }

            const info = document.createElement('div');
            info.innerHTML = `
                <h3 class="text-lg font-bold text-gray-800 mb-2">${save.name}</h3>
                <p class="text-sm text-gray-500">Sauvegardé le : ${saveDate}</p>
                <p class="text-sm text-gray-600 mt-2">${weeksInfo}</p>
            `;

            const footer = document.createElement('div');
            footer.className = 'mt-4 pt-4 border-t border-gray-200 flex items-center justify-end space-x-2';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn-secondary btn-sm';
            viewBtn.textContent = 'Voir';
            viewBtn.addEventListener('click', () => {
                localStorage.setItem('selectedPlanId', save.id); // The ID is the save ID
                navigateTo('view-plan');
            });

            const loadBtn = document.createElement('button');
            loadBtn.className = 'btn btn-primary btn-sm';
            loadBtn.textContent = 'Charger';
            loadBtn.addEventListener('click', () => loadSaveIntoActivePlan(save.id));
            loadBtn.style.display = 'none'; // Temporarily hide the button as logic needs rework for multi-week plans

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-red-500 hover:bg-red-100 text-sm px-3 py-1 rounded-md';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Supprimer la sauvegarde';
            deleteBtn.addEventListener('click', () => deletePlanSave(save.id));

            footer.appendChild(deleteBtn);
            footer.appendChild(viewBtn);
            footer.appendChild(loadBtn);

            card.appendChild(info);
            card.appendChild(footer);

            allSavesListContainer.appendChild(card);
        });
    });

    return () => {
        unsubscribe();
    };
}


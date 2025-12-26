import { db } from './firebase-config.js';
import { doc, getDoc } from "firebase/firestore";
import { navigateTo } from './router.js';

// NOTE: Much of this is simplified and duplicated from script.js for this specific view.
// In a larger application, this rendering logic would be shared in a separate module.

export default function initViewPlanPage() {
    const planId = localStorage.getItem('selectedPlanId');
    const planCollection = localStorage.getItem('selectedPlanCollection') || 'plan_saves';
    const planViewName = document.getElementById('plan-view-name');
    const mealPlanGrid = document.getElementById('meal-plan-grid');
    const closeBtn = document.getElementById('close-view-plan-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            localStorage.removeItem('selectedPlanId');
            localStorage.removeItem('selectedPlanCollection');
            navigateTo('plans');
        });
    }

    if (!planId) {
        if (planViewName) planViewName.textContent = "Aucun plan sélectionné";
        if (mealPlanGrid) mealPlanGrid.innerHTML = '<p class="text-center text-red-500">Erreur : Aucun ID trouvé. Veuillez retourner à la page \'Mes Plans\' et en sélectionner un.</p>';
        return () => { };
    }

    async function fetchAndRenderPlan() {
        try {
            const planRef = doc(db, planCollection, planId);
            const planSnap = await getDoc(planRef);

            if (!planSnap.exists()) {
                throw new Error("Plan non trouvé");
            }

            const data = planSnap.data();
            let planData = data;
            let displayName = data.name;

            // Adapte selon la collection (plan_saves encapsule dans planData)
            if (planCollection === 'plan_saves') {
                planData = data.planData;
                displayName = `Sauvegarde : ${data.name}`;
            }

            if (!planData || !planData.weeks) {
                // If the live plan is empty (no weeks yet)
                if (planViewName) planViewName.textContent = displayName;
                mealPlanGrid.innerHTML = '<p class="text-center text-gray-500 p-10 col-span-full">Ce plan ne contient aucune planification enregistrée.</p>';
                return;
            }

            if (planViewName) planViewName.textContent = displayName;
            renderFullPlanner(mealPlanGrid, planData);

        } catch (error) {
            console.error("Error fetching plan:", error);
            if (planViewName) planViewName.textContent = "Erreur";
            if (mealPlanGrid) mealPlanGrid.innerHTML = `<p class="text-center text-red-500">${error.message}</p>`;
        }
    }

    fetchAndRenderPlan();

    return () => {
        localStorage.removeItem('selectedPlanId');
        localStorage.removeItem('selectedPlanCollection');
    };
}

function renderFullPlanner(container, planData) {
    if (!container) return;
    container.innerHTML = ''; // Clear loading message

    const sortedWeeks = Object.keys(planData.weeks || {}).sort((a, b) => parseInt(a) - parseInt(b));

    if (sortedWeeks.length === 0) {
        container.innerHTML = '<p class="text-center text-gray-500 p-10 col-span-full">Ce plan est vide.</p>';
        return;
    }

    sortedWeeks.forEach(weekNumber => {
        const weekData = planData.weeks[weekNumber];

        const weekHeader = document.createElement('h3');
        weekHeader.className = 'text-lg font-bold text-gray-700 mt-6 mb-2 col-span-full';
        weekHeader.textContent = `Semaine ${weekNumber}`;
        container.appendChild(weekHeader);

        const weekGrid = document.createElement('div');
        renderPlannerForWeek(weekGrid, weekData, planData.startDay, planData.defaultNumPeople);
        container.appendChild(weekGrid);
    });
}

function renderPlannerForWeek(container, weekData, startDay, defaultNumPeople) {
    const allDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const startDayIndex = allDays.indexOf(startDay || 'Lundi');
    const weekDays = [...allDays.slice(startDayIndex), ...allDays.slice(0, startDayIndex)];

    const planMenuData = weekData.menuData || {};
    const planServingsData = weekData.servingsData || {};
    const planRemarksData = weekData.remarksData || {};

    weekDays.forEach(dayName => {
        const dayOriginalIndex = allDays.indexOf(dayName);
        const dayRow = document.createElement('div');
        dayRow.className = 'grid grid-cols-[100px_35px_repeat(5,_minmax(0,_1fr))_35px_repeat(5,_minmax(0,_1fr))] items-stretch border-b border-gray-300';

        const dayHeader = document.createElement('div');
        dayHeader.className = 'font-bold p-2 flex items-center justify-center bg-gray-100 text-sm border-r border-gray-300';
        dayHeader.textContent = dayName.toUpperCase();
        dayRow.appendChild(dayHeader);

        ['lunch', 'dinner'].forEach(mealType => {
            const servingsKey = `${dayOriginalIndex}-${mealType}`;
            const numPeople = planServingsData[servingsKey] || defaultNumPeople || 1;

            const servingsCell = document.createElement('div');
            servingsCell.className = 'border-r border-gray-300 flex items-center justify-center';
            servingsCell.innerHTML = `<div class="text-center"><i class="fas fa-users fa-xs mb-1"></i><br>${numPeople}</div>`;
            dayRow.appendChild(servingsCell);

            for (let i = 0; i < 5; i++) {
                const slotId = `${dayOriginalIndex}-${mealType}-${i}`;
                const mealSlotDiv = document.createElement('div');
                mealSlotDiv.className = 'meal-slot p-1 min-h-[50px] border-r border-gray-300';

                if (i === 4) { // Remark slot
                    mealSlotDiv.textContent = planRemarksData[slotId] || '';
                    mealSlotDiv.classList.add('text-xs', 'italic', 'text-gray-600');
                } else {
                    const mealsInSlot = planMenuData[slotId];
                    if (Array.isArray(mealsInSlot) && mealsInSlot.length > 0) {
                        mealsInSlot.forEach(meal => {
                            const card = document.createElement('div');
                            card.className = 'p-1 bg-white rounded shadow-sm text-center text-xs font-medium';
                            card.textContent = meal.name;
                            mealSlotDiv.appendChild(card);
                        });
                    }
                }
                dayRow.appendChild(mealSlotDiv);
            }
        });
        container.appendChild(dayRow);
    });
}

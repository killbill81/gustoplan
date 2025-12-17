import { seasonManager } from './season-manager.js';

export function initSettingsUI() {
    const modeRadios = document.getElementsByName('season-mode');
    const forcedSeasonSelector = document.getElementById('forced-season-selector');
    const forcedSeasonSelect = document.getElementById('forced-season-select');
    const offSeasonBehaviorSelect = document.getElementById('off-season-behavior');
    const rulePrioritizeSeasonal = document.getElementById('rule-prioritize-seasonal');
    const ruleWarnOffSeason = document.getElementById('rule-warn-off-season');

    // Modal Elements
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-modal');
    const headerSettingsBtn = document.getElementById('header-settings-btn');
    const mobileSettingsBtn = document.getElementById('mobile-settings-btn'); // If exists

    // Open/Close Logic
    function openSettings() {
        if (settingsModal) settingsModal.classList.remove('hidden');
    }

    function closeSettings() {
        if (settingsModal) settingsModal.classList.add('hidden');
    }

    if (headerSettingsBtn) headerSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    // 1. Initial State from Config
    const config = seasonManager.config;

    // Set Mode
    Array.from(modeRadios).forEach(radio => {
        if (radio.value === config.mode) radio.checked = true;

        radio.addEventListener('change', (e) => {
            updateUIVisibility(e.target.value);
            seasonManager.updateConfig({ mode: e.target.value });
        });
    });

    // Set Forced Season
    if (config.forcedSeason) forcedSeasonSelect.value = config.forcedSeason;
    forcedSeasonSelect.addEventListener('change', (e) => {
        seasonManager.updateConfig({ forcedSeason: e.target.value });
    });

    // Set Off-Season Behavior
    if (config.offSeasonBehavior) offSeasonBehaviorSelect.value = config.offSeasonBehavior;
    offSeasonBehaviorSelect.addEventListener('change', (e) => {
        seasonManager.updateConfig({ offSeasonBehavior: e.target.value });
    });

    // Set Recipe Rules
    if (rulePrioritizeSeasonal) {
        rulePrioritizeSeasonal.checked = config.recipeRules.prioritizeSeasonal;
        rulePrioritizeSeasonal.addEventListener('change', (e) => {
            seasonManager.updateConfig({
                recipeRules: { ...seasonManager.config.recipeRules, prioritizeSeasonal: e.target.checked }
            });
        });
    }

    if (ruleWarnOffSeason) {
        ruleWarnOffSeason.checked = config.recipeRules.warnOffSeason;
        ruleWarnOffSeason.addEventListener('change', (e) => {
            seasonManager.updateConfig({
                recipeRules: { ...seasonManager.config.recipeRules, warnOffSeason: e.target.checked }
            });
        });
    }

    // Initial UI Visibility
    updateUIVisibility(config.mode);

    function updateUIVisibility(mode) {
        if (mode === 'forced') {
            forcedSeasonSelector.classList.remove('hidden');
        } else {
            forcedSeasonSelector.classList.add('hidden');
        }
    }
}

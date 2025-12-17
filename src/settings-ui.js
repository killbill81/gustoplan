import { seasonManager } from './season-manager.js';

export function initSettingsUI() {
    // Elements
    const modeRadios = document.getElementsByName('season-mode');
    const forcedSeasonSelector = document.getElementById('forced-season-selector');
    const forcedSeasonSelect = document.getElementById('forced-season-select');
    const offSeasonBehaviorSelect = document.getElementById('off-season-behavior');
    const rulePrioritizeSeasonal = document.getElementById('rule-prioritize-seasonal');
    const ruleWarnOffSeason = document.getElementById('rule-warn-off-season');

    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-modal');
    const headerSettingsBtn = document.getElementById('header-settings-btn');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // Pending State
    let pendingConfig = {};

    // Open/Close Logic
    function openSettings() {
        if (settingsModal) {
            // Load current config into pending state on open
            pendingConfig = { ...seasonManager.config };
            syncUIToConfig(pendingConfig);
            settingsModal.classList.remove('hidden');
        }
    }

    function closeSettings() {
        if (settingsModal) settingsModal.classList.add('hidden');
    }

    function saveAndClose() {
        seasonManager.updateConfig(pendingConfig);
        closeSettings();
        // Optional: Show feedback or reload if needed (seasonManager handles broadcasts usually)
    }

    // Listeners
    if (headerSettingsBtn) headerSettingsBtn.addEventListener('click', openSettings);
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettings);
    if (saveSettingsBtn) saveSettingsBtn.addEventListener('click', saveAndClose);

    if (settingsModal) {
        settingsModal.addEventListener('click', (e) => {
            if (e.target === settingsModal) closeSettings();
        });
    }

    // --- UI Sync Helper ---
    function syncUIToConfig(config) {
        // Mode
        Array.from(modeRadios).forEach(radio => {
            if (radio.value === config.mode) radio.checked = true;
        });
        updateUIVisibility(config.mode);

        // Forced Season
        if (config.forcedSeason) forcedSeasonSelect.value = config.forcedSeason;

        // Behavior
        if (config.offSeasonBehavior) offSeasonBehaviorSelect.value = config.offSeasonBehavior;

        // Rules
        if (rulePrioritizeSeasonal) rulePrioritizeSeasonal.checked = config.recipeRules?.prioritizeSeasonal || false;
        if (ruleWarnOffSeason) ruleWarnOffSeason.checked = config.recipeRules?.warnOffSeason || false;
    }

    // --- Change Listeners (Update Pending State ONLY) ---

    // Mode
    Array.from(modeRadios).forEach(radio => {
        radio.addEventListener('change', (e) => {
            pendingConfig.mode = e.target.value;
            updateUIVisibility(e.target.value);
        });
    });

    // Forced Season
    forcedSeasonSelect.addEventListener('change', (e) => {
        pendingConfig.forcedSeason = e.target.value;
    });

    // Off-Season Behavior
    offSeasonBehaviorSelect.addEventListener('change', (e) => {
        pendingConfig.offSeasonBehavior = e.target.value;
    });

    // Rules
    if (rulePrioritizeSeasonal) {
        rulePrioritizeSeasonal.addEventListener('change', (e) => {
            pendingConfig.recipeRules = { ...pendingConfig.recipeRules, prioritizeSeasonal: e.target.checked };
        });
    }

    if (ruleWarnOffSeason) {
        ruleWarnOffSeason.addEventListener('change', (e) => {
            pendingConfig.recipeRules = { ...pendingConfig.recipeRules, warnOffSeason: e.target.checked };
        });
    }

    function updateUIVisibility(mode) {
        if (mode === 'forced') {
            forcedSeasonSelector.classList.remove('hidden');
        } else {
            forcedSeasonSelector.classList.add('hidden');
        }
    }
}

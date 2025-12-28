const functions = require("firebase-functions");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = functions.logger;

// Initialize Google Gemini with API Key from environment variables
// Use: firebase functions:config:set google.key="AIza..."

// Gen 1 syntax
exports.helloWorld = functions.https.onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Gustoplan AI!");
});

// Use onCall for client SDK compatibility (Gen 1)
exports.extractRecipeFromUrl = functions.https.onCall(async (data, context) => {
    // In Gen 1, first arg is data, second is context
    const { url } = data;
    logger.info("extractRecipeFromUrl input:", data);

    // Robust extraction: handle if data is nested or direct
    const actualUrl = url || (data.data && data.data.url);

    if (!actualUrl) {
        logger.error("URL missing in data object", { keys: Object.keys(data) });
        throw new functions.https.HttpsError('invalid-argument', 'URL manquante');
    }

    try {
        // 1. Fetch HTML
        logger.info("Fetching URL...", { url: actualUrl });
        let response;
        try {
            response = await fetch(actualUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
        } catch (fetchErr) {
            logger.error("Fetch failed (network/DNS)", fetchErr);
            throw new functions.https.HttpsError('aborted', "Impossible de contacter le site (Erreur réseau)");
        }

        if (!response.ok) {
            logger.error("Fetch returned non-200", { status: response.status });
            throw new functions.https.HttpsError('aborted', `Le site a refusé l'accès (Code ${response.status})`);
        }

        const html = await response.text();
        logger.info("HTML fetched, length:", html.length);

        // Limit HTML size to avoid token overflow
        const truncatedHtml = html.substring(0, 50000);

        // 2. Analyze with Gemini
        // functions.config() is removed in v7. Using hardcoded fallback or env var.
        const hardcodedKey = "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18";
        const apiKey = process.env.GOOGLE_API_KEY || hardcodedKey;

        if (!apiKey) {
            console.error("API Key completely missing");
            throw new functions.https.HttpsError('failed-precondition', "Clé API Google manquante");
        } else {
            logger.info("API Key found (masked):", apiKey.substring(0, 4) + "...");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        Tu es un expert en extraction de données culinaires. 
        Analyse le texte HTML fourni ci-après et extrais la recette au format JSON strict pour Gustoplan.
        
        Schéma attendu:
        {
            "name": "Titre",
            "description": "Description courte",
            "servings": 4,
            "prepTime": "20 min",
            "cookTime": "30 min",
            "difficulty": "Facile",
            "ingredients": [
                { "name": "Tomates", "quantity": "3", "unit": "pièces" }
            ],
            "steps": "1. Couper...\\n2. Cuire...",
            "category": "PLAT" (Enum: ENTREE, PLAT, DESSERT, ACCOMPAGNEMENT),
            "seasons": ["Eté"],
            "months": ["Juillet"]
        }
        Si tu ne trouves pas d'info, laisse vide ou null.
        
        HTML Content:
        ${truncatedHtml}
        `;

        logger.info("Asking Gemini...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        logger.info("Gemini response length:", text.length);

        let recipeData;
        try {
            recipeData = JSON.parse(text);
        } catch (e) {
            logger.warn("JSON parse failed, trying cleanup", e);
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '');
            recipeData = JSON.parse(cleaned);
        }

        logger.info("Success! Returning data.");
        return recipeData;

    } catch (error) {
        logger.error("Erreur extraction recette CRITICAL", error);
        // Ensure we throw an HttpsError
        if (error instanceof functions.https.HttpsError) throw error;
        throw new functions.https.HttpsError('internal', error.message);
    }
});

exports.generateRecipe = functions.https.onCall(async (data, context) => {
    logger.info("generateRecipe input:", data);
    const userPrompt = data.prompt || (data.data && data.data.prompt);

    if (!userPrompt) {
        logger.error("Prompt missing in data object", { keys: Object.keys(data) });
        throw new functions.https.HttpsError('invalid-argument', 'Prompt vide');
    }

    try {
        // functions.config() is removed in v7. Using hardcoded fallback or env var.
        const hardcodedKey = "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18";
        const apiKey = process.env.GOOGLE_API_KEY || hardcodedKey;

        if (!apiKey) throw new functions.https.HttpsError('failed-precondition', "Clé API Google manquante");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const systemPrompt = `
        Tu es un chef cuisinier créatif. Crée une recette complète basée sur la demande suivante : "${userPrompt}".
        
        Règles :
        1. Sois précis sur les quantités.
        2. Format JSON strict compatible Gustoplan.
        3. Si la demande est vague, sois créatif mais cohérent.
        
        Schéma attendu:
        {
            "name": "Nom créatif de la recette",
            "description": "Pourquoi cette recette correspond à la demande",
            "servings": 4,
            "prepTime": "XX min",
            "cookTime": "XX min",
            "difficulty": "Moyen",
            "ingredients": [
                { "name": "Ingrédient", "quantity": "Nb", "unit": "unité" }
            ],
            "steps": [ "Étape 1", "Étape 2" ],
            "category": "PLAT",
            "seasons": ["Printemps", "Eté"],
            "months": ["Juin"]
        }
        `;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        let recipeData;
        try {
            recipeData = JSON.parse(text);
        } catch (e) {
            const cleaned = text.replace(/```json/g, '').replace(/```/g, '');
            recipeData = JSON.parse(cleaned);
        }

        return recipeData;

    } catch (error) {
        logger.error("Erreur génération recette", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
exports.debugFetch = functions.https.onCall(async (data, context) => {
    const { url } = data;
    logger.info("Debug fetch called", { url });
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 GustavoDebug' }
        });
        const text = await response.text();
        return {
            status: response.status,
            length: text.length,
            preview: text.substring(0, 100)
        };
    } catch (e) {
        logger.error("Debug fetch error", e);
        throw new functions.https.HttpsError('internal', e.message);
    }
});
// --- Ingredient Audit Function ---
exports.auditIngredients = functions.https.onCall(async (data, context) => {
    logger.info("auditIngredients raw input:", data);

    // Robust extraction: onCall might wrap data in data.data or data
    const ingredients = data?.ingredients || (data?.data && data.data.ingredients);

    if (!ingredients || !Array.isArray(ingredients)) {
        logger.error("auditIngredients: Missing ingredients in payload", data);
        throw new functions.https.HttpsError('invalid-argument', 'Liste d\'ingrédients manquante ou invalide');
    }

    const hardcodedKey = "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18";
    const apiKey = process.env.GOOGLE_API_KEY || hardcodedKey;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Analyze this ingredient list. For each, suggest the most appropriate standard unit for a shopping list and its supermarket category.
    
    Allowed Units: 'g', 'kg', 'ml', 'l', 'pièce(s)', 'c.à.s.', 'c.à.c.', 'pincée(s)'.
    Rule: Prefer 'g' for solids, 'pièce(s)' for fruits/veg sold individually.
    
    Data: ${JSON.stringify(ingredients.map(i => ({ name: i.name, u: i.unit, c: i.category })))}

    CRITICAL: ONLY respond with valid JSON. NO markdown.
    Format:
    {
        "suggestions": [
            { "name": "original name", "unit": "unit", "cat": "category", "reason": "why" }
        ]
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown backticks if AI ignores prompt instructions
        text = text.replace(/```json\n?|```/g, '').trim();

        try {
            return JSON.parse(text);
        } catch (parseError) {
            logger.error("JSON Parse Error. Raw text snippet:", text.substring(0, 500));
            throw parseError;
        }
    } catch (error) {
        logger.error("Audit failed", error);
        throw new functions.https.HttpsError('internal', 'Échec de l\'audit IA: ' + error.message);
    }
});

// --- Smart Plan Suggestion Function ---
exports.suggestMenu = functions.https.onCall(async (data, context) => {
    logger.info("suggestMenu called", data);

    const recipes = data?.recipes || (data?.data && data.data.recipes);
    const history = data?.history || (data?.data && data.data.history); // Last 3 weeks of names
    const currentSeason = data?.season || (data?.data && data.data.season);

    if (!recipes || !Array.isArray(recipes)) {
        throw new functions.https.HttpsError('invalid-argument', 'Liste de recettes manquante');
    }

    const hardcodedKey = "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18";
    const apiKey = process.env.GOOGLE_API_KEY || hardcodedKey;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Tu es Chef Gusto, un expert en planification de repas. 
    Génère un menu hebdomadaire (7 jours : Lundi à Dimanche) avec 1 repas (PLAT) pour le MIDI et 1 pour le SOIR par jour.
    
    CONTRAINTES :
    1. Utilise UNIQUEMENT les noms de recettes fournis dans la "Liste de Recettes".
    2. Évite les recettes présentes dans l'historique récent pour assurer la variété.
    3. Respecte la saison "${currentSeason}" si précisé (priorise les recettes de saison).
    4. Propose un menu équilibré.
    
    DONNÉES :
    - Liste de Recettes : ${JSON.stringify(recipes.map(r => ({ name: r.name, cat: r.category, s: r.seasonScore })))}
    - Historique Récent (à éviter) : ${JSON.stringify(history)}
    - Saison Actuelle : ${currentSeason}

    CRITICAL: ONLY respond with valid JSON. NO markdown.
    Format attendu :
    {
        "menu": {
            "Lundi": { "MIDI": "Nom Recette", "SOIR": "Nom Recette" },
            "Mardi": { "MIDI": "Nom Recette", "SOIR": "Nom Recette" },
            ...
        },
        "description": "Bref résumé de l'esprit du menu"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;

        // Handle potential blockage or empty response
        if (!response) {
            throw new Error("Gemini a retourné une réponse vide.");
        }

        let text = response.text();
        logger.info("Raw Gemini response:", text);

        // Sanitize response: remove markdown and trim
        text = text.replace(/```json\n?|```/g, '').trim();

        try {
            return JSON.parse(text);
        } catch (parseErr) {
            logger.error("Failed to parse Gemini JSON:", text);
            throw new functions.https.HttpsError('internal', 'La réponse de Chef Gusto n\'est pas un JSON valide.');
        }

    } catch (error) {
        logger.error("Erreur suggestMenu CRITICAL", error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});

// --- Habit Analysis Function (v2) ---
exports.analyzeHistory = onCall(async (request) => {
    const { data, auth } = request;
    logger.info("analyzeHistory called", data);

    const profile = data?.profile || (data?.data && data.data.profile);

    if (!profile || !profile.global_stats) {
        throw new HttpsError('invalid-argument', 'Profil de données manquant');
    }

    const hardcodedKey = "AIzaSyBHhs6Vq2UFGXDRjEBIuihx9KWFswvMI18";
    const apiKey = process.env.GOOGLE_API_KEY || hardcodedKey;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    Tu es Chef Gusto, coach en nutrition et expert en habitudes alimentaires. 
    Analyse les statistiques suivantes d'un utilisateur de GustoPlan et fournis un résumé personnalisé.
    
    STATISTIQUES :
    - Nombre total de repas planifiés : ${profile.global_stats.total_meals_planned}
    - Nombre de convives moyen : ${profile.global_stats.avg_servings.toFixed(1)}
    - Diversité (nombre de recettes différentes) : ${Object.keys(profile.recipe_frequency || {}).length}
    - Top recettes (IDs et fréquences) : ${JSON.stringify(Object.entries(profile.recipe_frequency || {}).sort(([, a], [, b]) => b - a).slice(0, 3))}
    
    TON OBJECTIF :
    1. Décris le "Style de Chef" de l'utilisateur (ex: Expert du batch-cooking, Explorateur culinaire, Routine rassurante).
    2. Donne 2 conseils concrets pour améliorer son équilibre ou sa diversité.
    3. Sois encourageant et chaleureux.
    
    FORMAT JSON UNIQUEMENT :
    {
        "summary": "Texte du résumé en Markdown (utilise des emojis, des gras, des listes)",
        "style_name": "Nom du style"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().replace(/```json\n?|```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        logger.error("Erreur analyzeHistory CRITICAL", error);
        throw new HttpsError('internal', error.message);
    }
});

const admin = require("firebase-admin");
try { admin.initializeApp(); } catch (e) { }

// --- Full Sync Function ---
// --- Full Sync Function (v2) ---
exports.syncAIProfile = onCall(async (request) => {
    const { auth } = request;
    // Vérification auth
    if (!auth) {
        logger.error("Sync Error: Unauthenticated");
        throw new HttpsError('unauthenticated', 'User must be logged in');
    }

    const uid = auth.uid;
    const db = admin.firestore();
    logger.info(`Starting full sync for user: ${uid}`);

    const profileData = {
        global_stats: { total_meals_planned: 0, top_categories: {} },
        recipe_frequency: {},
    };

    const debug_details = [];
    const countMealsRecursive = (data, path = 'root', sourceId = 'unknown', weekData = {}, defaultNum = 1) => {
        if (!data) return;

        // Si c'est un tableau de recettes non vide, c'est UN repas (un créneau rempli)
        if (Array.isArray(data)) {
            if (data.length > 0) {
                const fullPath = `[${sourceId}] ${path}`;
                // Extraction du nombre de convives pour ce créneau
                // path ressemble à "menu.0-lunch-0", on veut "0-lunch"
                const pathParts = path.split('.');
                const slotId = pathParts[pathParts.length - 1]; // "0-lunch-0"
                const servingsKey = slotId.split('-').slice(0, 2).join('-'); // "0-lunch"

                const numPeople = Math.max(1, (weekData.servingsData && weekData.servingsData[servingsKey])
                    ? parseInt(weekData.servingsData[servingsKey], 10)
                    : defaultNum);

                const mealInfo = {
                    path: fullPath,
                    items: data.map(m => ({
                        name: m.name || 'Sans nom',
                        id: m.id || 'mano'
                    }))
                };
                debug_details.push(mealInfo);

                data.forEach(m => {
                    if (m) {
                        profileData.global_stats.total_meals_planned++;
                        const key = m.id || m.name;
                        if (key) {
                            profileData.recipe_frequency[key] = (profileData.recipe_frequency[key] || 0) + 1;
                        }
                    }
                });
            }
            return;
        }

        // Si c'est un objet, on descend d'un niveau (jour, créneau, etc.)
        if (typeof data === 'object') {
            if (data._seconds !== undefined || data.toDate !== undefined) return;
            Object.entries(data).forEach(([key, val]) => countMealsRecursive(val, `${path}.${key}`, sourceId, weekData));
        }
    };

    const processPlanData = (planObject, sourceId) => {
        if (!planObject || !planObject.weeks) return;

        Object.values(planObject.weeks).forEach(week => {
            if (week.menuData) {
                countMealsRecursive(week.menuData, 'menu', sourceId, week);
            }
        });
    };

    try {
        // 2. Tous les plans archivés par l'utilisateur (Propriétaire ou Collaborateur)
        const archivedSnap = await db.collection('plans').where("archivedBy", "array-contains", uid).get();
        logger.info(`[IA-Sync] Trouvé ${archivedSnap.size} plans archivés.`);
        archivedSnap.forEach(doc => {
            processPlanData(doc.data(), `Archive:${doc.id}`);
        });

        // 3. Anciennes sauvegardes (qui ne sont pas dans la collection 'plans')
        const savesSnap = await db.collection('plan_saves').where("userId", "==", uid).get();
        logger.info(`[IA-Sync] Trouvé ${savesSnap.size} sauvegardes.`);
        savesSnap.forEach(doc => processPlanData(doc.data().planData, `Sauve:${doc.id}`));

        // Inclure debug_info dans l'objet profile pour qu'il soit retourné direct
        profileData.debug_info = {
            meals: debug_details
        };
        profileData.version = "2.5";

        // 3. Update Profile in Firestore
        const profRef = db.collection('ai_profiles').doc(uid);
        await profRef.set({
            ...profileData,
            last_updated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return {
            success: true,
            version: "2.5",
            profile: profileData,
            debug: profileData.debug_info,
            count: profileData.global_stats.total_meals_planned
        };
    } catch (error) {
        logger.error("Sync Error", error);
        throw new HttpsError('internal', error.message);
    }
});

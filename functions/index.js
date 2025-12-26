const functions = require("firebase-functions");
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

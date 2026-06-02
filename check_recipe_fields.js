const admin = require("firebase-admin");
const serviceAccount = require("./NETTOYAGE TABLES  + SAUV BDD COMPLETE/service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gustoplan-dev-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
const uid = "N3xsPHL9pwR2MeLlhYbSycQHVVQ2";

async function checkFields() {
  try {
    const snap = await db.collection("recipes")
      .where("userId", "==", uid)
      .limit(1)
      .get();
      
    if (snap.empty) {
      console.log("Aucune recette trouvée.");
      return;
    }
    
    const doc = snap.docs[0];
    console.log("ID du document:", doc.id);
    console.log("Données brutes de la recette :");
    console.log(JSON.stringify(doc.data(), null, 2));
  } catch (error) {
    console.error(error);
  }
}

checkFields().then(() => process.exit(0));

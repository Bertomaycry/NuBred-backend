import admin from "firebase-admin";
import { readFileSync } from "fs";

const raw = readFileSync("./src/utils/serviceAccountKey.json", "utf-8");
const serviceAccount = JSON.parse(raw);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
export const db = admin.firestore();

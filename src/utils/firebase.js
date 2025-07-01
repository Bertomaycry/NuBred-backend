import admin from "firebase-admin";
console.log(process.env.FIREBASE_KEY_B64)
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_KEY_B64, "base64").toString("utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
export const db = admin.firestore();

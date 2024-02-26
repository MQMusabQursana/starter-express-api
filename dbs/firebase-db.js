
const serviceAccount = require("../dbs/firebase_service_account_key.json");
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
console.log("firebase admin initializeApp . . . . .");
module.exports = admin;
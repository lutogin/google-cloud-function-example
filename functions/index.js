// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.addMessage = functions
  .https
  .onRequest(async (req, res) => {
    const original = req.query.text;

    const writeResult = await admin
      .firestore()
      .collection('message')
      .add({ original });

    res.json({
      result: `Message with ID: ${writeResult.id} added.`,
    });
  });

exports.makeUppercase = functions
  .firestore
  .document('/message/{documentId}')
  .onCreate(((snapshot, context) => {
    const original = snapshot.data().original;

    functions.logger.log('Uppercasing', context.params.documentId, original);

    const uppercaseOriginal = original.toUpperCase();

    return snapshot.ref.set({ original: uppercaseOriginal }, { merge: true });
  }));

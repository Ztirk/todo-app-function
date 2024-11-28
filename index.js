// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addTodo = onRequest(async (req, res) => {
  try {
    const body = req.body;
    const result = await getFirestore().collection("todo").add(body);

    res.status(201).json({ id: result.id });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

exports.getTodo = onRequest(async (req, res) => {
  try {
    const col = await getFirestore().collection("todo").get();
    const result = {};
    for (const doc of col.docs) {
      result[doc.id] = doc.data();
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

exports.updateTodo = onRequest(async (req, res) => {
  try {
    const docId = req.params["0"];
    const body = req.body;
    const result = await getFirestore()
      .doc("todo/" + docId)
      .update(body);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// // Listens for new messages added to /messages/:documentId/original
// // and saves an uppercased version of the message
// // to /messages/:documentId/uppercase
// exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
//   // Grab the current value of what was written to Firestore.
//   const original = event.data.data().original;

//   // Access the parameter `{documentId}` with `event.params`
//   logger.log("Uppercasing", event.params.documentId, original);

//   const uppercase = original.toUpperCase();

//   // You must return a Promise when performing
//   // asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({uppercase}, {merge: true});
// });

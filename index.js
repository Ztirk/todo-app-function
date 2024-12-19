// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest, onCall } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addTodo = onRequest(
  { cors: "http://localhost:5173" },
  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    try {
      const body = req.body;
      const result = await getFirestore().collection("todo").add(body);

      res.status(201).json({ id: result.id });
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

exports.getTodo = onRequest(
  { cors: "http://localhost:5173" },
  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    try {
      const col = await getFirestore().collection("todo").get();
      const result = [];
      for (const doc of col.docs) {
        const data = doc.data();
        data["id"] = doc.id;
        result.push(data);
      }

      result.sort((a, b) => a.idx - b.idx);

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

exports.updateTodo = onRequest(
  { cors: "http://localhost:5173" },
  async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
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
  }
);

exports.addTodoV2 = onCall(
  {
    enforceAppCheck: true,
  },
  async (req, res) => {
    try {
      const body = req.body;
      const result = await getFirestore().collection("todo").add(body);

      res.status(201).json({ id: result.id });
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

exports.getTodoV2 = onCall(
  {
    enforceAppCheck: true,
  },
  async (req, res) => {
    try {
      const col = await getFirestore().collection("todo").get();
      const result = [];
      for (const doc of col.docs) {
        const data = doc.data();
        data["id"] = doc.id;
        result.push(data);
      }

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
);

exports.updateTodoV2 = onCall(
  {
    enforceAppCheck: true,
  },
  async (req, res) => {
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
  }
);

// asynchronous tasks inside a function
//   // such as writing to Firestore.
//   // Setting an 'uppercase' field in Firestore document returns a Promise.
//   return event.data.ref.set({uppercase}, {merge: true});
// });

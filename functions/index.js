const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

exports.castVote = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Please sign in to vote.');
  }

  const uid = context.auth.uid;
  const submissionId = data?.submissionId;
  const pollId = data?.pollId || 'current';

  if (!submissionId) {
    throw new functions.https.HttpsError('invalid-argument', 'submissionId is required.');
  }

  const existing = await db
    .collection('votes')
    .where('uid', '==', uid)
    .where('pollId', '==', pollId)
    .limit(1)
    .get();

  if (!existing.empty) {
    throw new functions.https.HttpsError('already-exists', 'User already voted in this poll.');
  }

  await db.collection('votes').add({
    uid,
    submissionId,
    pollId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { success: true };
});

exports.exportSubmissions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
  }

  const userDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!userDoc.exists || userDoc.data().role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Admin required.');
  }

  const snap = await db.collection('submissions').get();
  const payload = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  return { count: payload.length, submissions: payload };
});

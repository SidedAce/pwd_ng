import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { buildActionDocument } from "./actionDefinitions";

export async function listActions() {
  const snapshot = await getDocs(collection(db, "actions"));

  return snapshot.docs.map((actionDoc) => ({
    id: actionDoc.id,
    ...actionDoc.data(),
  }));
}

export async function createAction(payload) {
  const actionsRef = collection(db, "actions");
  return addDoc(actionsRef, payload);
}

export async function submitStructuredAction({ type, formState, user, profile, context }) {
  const payload = buildActionDocument({
    type,
    formState,
    user,
    profile,
    context,
  });

  return createAction({
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getEntity(collectionName, id) {
  const snap = await getDoc(doc(db, collectionName, id));

  if (!snap.exists()) {
    return null;
  }

  return {
    id: snap.id,
    ...snap.data(),
  };
}

export async function upsertEntity(collectionName, id, data, options = { merge: true }) {
  return setDoc(
    doc(db, collectionName, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    options,
  );
}

export async function createEntity(collectionName, id, data) {
  return setDoc(doc(db, collectionName, id), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateAction(actionId, data) {
  return updateDoc(doc(db, "actions", actionId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function createAdjudication({ action, decision, summary, gmUserId, effects }) {
  const adjudicationsRef = collection(db, "adjudications");

  return addDoc(adjudicationsRef, {
    sessionId: action.sessionId,
    actionId: action.id,
    nationId: effects.nationId || action.nationId || null,
    decision,
    summary,
    gmUserId,
    effects,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

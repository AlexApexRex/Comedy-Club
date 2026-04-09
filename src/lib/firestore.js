  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions, isFirebaseConfigured } from '../firebase';
import { mockSiteConfig, mockSubmissions, mockVotes } from '../data/mockData';

export async function getSiteConfig() {
  if (!isFirebaseConfigured) return mockSiteConfig;
  const snap = await getDoc(doc(db, 'metadata', 'siteConfig'));
  return snap.exists() ? snap.data() : mockSiteConfig;
}

export async function getApprovedSubmissions() {
  if (!isFirebaseConfigured) return mockSubmissions;
  const q = query(collection(db, 'submissions'), where('approved', '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createSubmission(payload) {
  if (!isFirebaseConfigured) return { id: `mock-${Date.now()}` };
  return addDoc(collection(db, 'submissions'), {
    ...payload,
    approved: false,
    featured: false,
    viewCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getVoteTotals() {
  if (!isFirebaseConfigured) return mockVotes;
  const snap = await getDocs(collection(db, 'votes'));
  return snap.docs.reduce((acc, d) => {
    const submissionId = d.data().submissionId;
    acc[submissionId] = (acc[submissionId] || 0) + 1;
    return acc;
  }, {});
}

export async function castVote(submissionId, pollId = 'current') {
  if (!isFirebaseConfigured) return { data: { success: true, mock: true } };
  const callable = httpsCallable(functions, 'castVote');
  return callable({ submissionId, pollId });
}

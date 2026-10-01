import { collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewDocument } from '../types';

const COLLECTION_NAME = 'documents';

/**
 * Helper to recursively remove any undefined fields before sending to Firestore
 */
function cleanFirestoreObject(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanFirestoreObject(item));
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        cleaned[key] = cleanFirestoreObject(val);
      }
    }
    return cleaned;
  }
  return obj;
}

export const documentService = {
  async getDocuments(): Promise<NewDocument[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('issueDate', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewDocument));
    } catch (err) {
      console.warn('[documentService] Error fetching documents from Firestore:', err);
      return [];
    }
  },

  async addDocument(docData: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const cleaned = cleanFirestoreObject({
      ...docData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    const docRef = await addDoc(collection(db, COLLECTION_NAME), cleaned);
    return docRef.id;
  },

  async updateDocument(id: string, docData: Partial<Omit<NewDocument, 'id'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const cleaned = cleanFirestoreObject({
      ...docData,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(docRef, cleaned);
  },

  async deleteDocument(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};

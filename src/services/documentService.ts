import { collection, addDoc, updateDoc, deleteDoc, doc, query, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewDocument } from '../types';

const COLLECTION_NAME = 'documents';

export const documentService = {
  async getDocuments(): Promise<NewDocument[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('issueDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewDocument));
  },

  async addDocument(docData: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...docData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  },

  async updateDocument(id: string, docData: Partial<Omit<NewDocument, 'id'>>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...docData,
      updatedAt: new Date().toISOString(),
    });
  },

  async deleteDocument(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  }
};

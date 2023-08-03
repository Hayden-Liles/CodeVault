import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, runTransaction } from "firebase/firestore";
import { auth, db, firestore } from "../firebase";



/**
 * @module FirebaseServices
 * @description is used to manage CRUD operations on Firestore database.
 * The operations include reading, creating, updating, deleting documents and
 * incrementing/decrementing values of specific fields in a document. Also, it
 * helps in generating a new ID.
 */
class FirebaseServices {

    /**
     * @async
     * @description Reads an entire collection from the Firestore database.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @returns {Promise<Array<Object>>} - A promise that resolves to an array of document data.
     */
    readCollection = async (collectionPath) => {
        const collectionRef = collection(db, collectionPath);
        const collectionSnap = await getDocs(collectionRef);

        const data = collectionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return data;
    }

    /**
     * @async
     * @description Updates an entire collection in the Firestore database.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {Array<Object>} newDocs - An array of new documents to be added to the collection.
     * @returns {Promise<void>} A promise that resolves when the batch update is completed.
     */
    updateCollection = async (collectionPath, newDocs) => {
        const batch = firestore.batch();
        const snapshot = await firestore.collection(collectionPath).get();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        newDocs.forEach((docData) => {
            const docRef = firestore.collection(collectionPath).doc();
            batch.set(docRef, docData);
        });
        return batch.commit();
    }

    /**
     * @async
     * @description Creates a new document in a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to create.
     * @param {Object} data - The data to write to the document.
     */
    createDoc = async (collectionPath, docId, data) => {
        try {
            await setDoc(doc(db, collectionPath, docId), data);
        } catch (e) {
            console.error("Error writing document: ", e);
        }
    }

    /**
     * @async
     * @description Reads a document from a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to read.
     * @returns {Promise<Object|null>} - A promise that resolves to the document data or null if the document does not exist.
     */
    readDoc = async (collectionPath, docId) => {
        const docRef = doc(db, collectionPath, docId);

        try {
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.log("No such document!");
            }
        } catch (e) {
            console.error("Error getting document:", e);
        }
    }

    /**
     * @async
     * @description Updates a document in a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to update.
     * @param {Object} data - The data to update in the document.
     */
    updateDoc = async (collectionPath, docId, data) => {
        try {
            await updateDoc(doc(db, collectionPath, docId), data);
        } catch (e) {
            console.error("Error updating document: ", e);
        }
    }

    /**
     * @async
     * @description Deletes a document from a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to delete.
     */
    deleteDoc = async (collectionPath, docId) => {
        try {
            await deleteDoc(doc(db, collectionPath, docId));
        } catch (e) {
            console.error("Error removing document: ", e);
        }
    }

    /**
     * @async
     * @description Increments a numeric value in a document in a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to update.
     * @param {string} fieldToUpdate - The field to increment.
     * @param {number} valueToAdd - The value to add.
     */
    incrementValue = async (collectionPath, docId, fieldToUpdate, valueToAdd) => {
        try {
            const docRef = doc(db, collectionPath, docId);

            await updateDoc(docRef, {
                [fieldToUpdate]: firestore.FieldValue.increment(Number(valueToAdd)),
            });

        } catch (e) {
            console.error("Error incrementing value:", e);
        }
    }

    /**
     * @async
     * @descriptionDecrements a numeric value in a document in a specified Firestore collection.
     * @param {string} collectionPath - The path to the Firestore collection.
     * @param {string} docId - The ID of the document to update.
     * @param {string} fieldToUpdate - The field to decrement.
     * @param {number} valueToSubtract - The value to subtract.
     */
    decrementValue = async (collectionPath, docId, fieldToUpdate, valueToSubtract) => {
        try {
            const docRef = doc(db, collectionPath, docId);

            await updateDoc(docRef, {
                [fieldToUpdate]: firestore.FieldValue.increment(Number(-valueToSubtract)),
            });

        } catch (e) {
            console.error("Error decrementing value:", e);
        }
    }

    /**
     * @async
     * @description Generates a new ID based on the count of a specific dataset.
     * @param {string} dataToCountFor - The name of the dataset to count.
     * @returns {Promise<number>} - A promise that resolves to the new ID.
     */
    getNewId = async (dataToCountFor) => {
        try {
            const userId = auth.currentUser.uid
            let newId;
            await runTransaction(db, async (transaction) => {
                const docRef = doc(db, `/users/${userId}/${dataToCountFor}Counter/counter`);
                const docSnap = await transaction.get(docRef);

                if (!docSnap.exists()) {
                    newId = 0;
                    transaction.set(docRef, { value: newId });
                } else {
                    newId = docSnap.data().value + 1;
                    transaction.update(docRef, { value: newId });
                }
            });

            return String(newId);
        } catch (e) {
            console.error("Error getting new ID: ", e);
        }
    }

}


export const firebaseServices = new FirebaseServices();
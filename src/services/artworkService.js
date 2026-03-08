import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

const COLLECTION_NAME = 'artworks';

export const getArtworks = async () => {
    const artworksCol = collection(db, COLLECTION_NAME);
    const artworkSnapshot = await getDocs(artworksCol);
    const artworkList = artworkSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return artworkList;
};

export const addArtwork = async (artworkData) => {
    const artworksCol = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(artworksCol, artworkData);
    return { id: docRef.id, ...artworkData };
};

export const updateArtwork = async (id, artworkData) => {
    const artworkRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(artworkRef, artworkData);
    return { id, ...artworkData };
};

export const deleteArtwork = async (id) => {
    const artworkRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(artworkRef);
    return id;
};

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBn5fuSbqneBhtNOwn6BPTUV3mM3Q0N5Vg",
  authDomain: "versache-clothing-db.firebaseapp.com",
  projectId: "versache-clothing-db",
  storageBucket: "versache-clothing-db.appspot.com",
  messagingSenderId: "492796702718",
  appId: "1:492796702718:web:322f8f9fc7d666e53b5aaf",
  measurementId: "G-8F9JX4FQ3Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Gives back a provider instance
const googleProvider = new GoogleAuthProvider();

// setCustomParameters takes in certain type of configuration objects and with it we can tell the
// different ways we want this Google Auth provider to behave
// we use 'prompt' bcoz everytime the user interacts with the provider, we want to force them to
// select an account
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// no 'new' keyword since it is to be instantiated only once
export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore();

export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((object) => {
    const docRef = doc(collectionRef, object.title.toLowerCase());
    batch.set(docRef, object);
  })

  // fires off the batch
  await batch.commit();
  // console.log('done');
}


export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  // console.log(userDocRef);

  // this userSnapshot tells us whether an instance of it exists in the database or not
  // and it also allows us to access the data
  const userSnapshot = await getDoc(userDocRef);
  // console.log(userSnapshot);
  // console.log(userSnapshot.exists());

  if (!userSnapshot.exists()) {
    const { name, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        name,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

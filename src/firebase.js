import firebase from 'firebase';

const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyCf15aJrlRPFQN5TPmjWdCQIiewIkhkhRs",
    authDomain: "instagram-clone-d2d7d.firebaseapp.com",
    projectId: "instagram-clone-d2d7d",
    storageBucket: "instagram-clone-d2d7d.appspot.com",
    messagingSenderId: "712280253622",
    appId: "1:712280253622:web:1cc269cf5319a23ab3f217",
    measurementId: "G-PQ00VQGDX3"
  });

const db = firebaseConfig.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db , auth, storage};
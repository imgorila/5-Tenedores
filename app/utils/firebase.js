import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB9fTqK413THLPD2pHMSGhDgxCCaOtz2kE",
    authDomain: "tenedores-be40b.firebaseapp.com",
    databaseURL: "https://tenedores-be40b.firebaseio.com",
    projectId: "tenedores-be40b",
    storageBucket: "tenedores-be40b.appspot.com",
    messagingSenderId: "881368885397",
    appId: "1:881368885397:web:c40b52f829e6d061c0139c"
};

// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
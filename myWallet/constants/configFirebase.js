// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCCtgNR5oBc0gVFYGo00YJDsCQVMMZ3AI8",
    authDomain: "mywallet-98d55.firebaseapp.com",
    databaseURL: "https://mywallet-98d55-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mywallet-98d55",
    storageBucket: "mywallet-98d55.firebasestorage.app",
    messagingSenderId: "373342987808",
    appId: "1:373342987808:web:4c35f4a817446b351d7e45",
    measurementId: "G-F6JTS94ED1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { app, database, storage }
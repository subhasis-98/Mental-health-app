// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwD9iL_ZvJ3L1p2yuFh0dCnlF5MCyAvBM",
  authDomain: "login-form-78f80.firebaseapp.com",
  projectId: "login-form-78f80",
  storageBucket: "login-form-78f80.firebasestorage.app",
  messagingSenderId: "580711089659",
  appId: "1:580711089659:web:1f52051c51d31650dab75e",
  measurementId: "G-SFZVE9JS4H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const signUp = document.getElementById("submitSignUp");
signUp.addEventListener("click", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("Password").value;
  const email = document.getElementById("email").value;
  const auth = getAuth();
  const db = getFirestore();
});

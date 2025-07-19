import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  //YOUR COPIED FIREBASE PART SHOULD BE HERE
  //WATCH THIS VIDEO TO LEARN WHAT TO PUT HERE   https://youtu.be/_Xczf06n6x0

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

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    console.log(user);
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("loggedUserFName").innerText =
            userData.firstName;
          document.getElementById("loggedUserLName").innerText =
            userData.lastName;
          document.getElementById("loggedUserEmail").innerText = userData.email;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("Error getting document");
      });
  } else {
    console.log("User Id not Found in Local storage");
  }
});

const logoutButton = document.getElementById("logout");

logoutButton.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("Error Signing out:", error);
    });
});

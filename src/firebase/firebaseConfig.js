import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjwWbXWdhaiTBSYXcYdOzYqc5Q3qEduWQ",
  authDomain: "astronarhari-admin.firebaseapp.com",
  projectId: "astronarhari-admin",
  storageBucket: "astronarhari-admin.firebasestorage.app",
  messagingSenderId: "105564300783",
  appId: "1:105564300783:web:38485b10fdcc4c5056021a",
  measurementId: "G-124W169YYZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
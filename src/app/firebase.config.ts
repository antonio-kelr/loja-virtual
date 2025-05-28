import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBT622Ra1jAxgoaT0KFoBdTriRgDKhlRI0",
  authDomain: "authentication-apiturbo.firebaseapp.com",
  projectId: "authentication-apiturbo",
  storageBucket: "authentication-apiturbo.firebasestorage.app",
  messagingSenderId: "757828059732",
  appId: "1:757828059732:web:020fc0fe4a1ba002cbe3c1",
  measurementId: "G-XTJRDT6EQL"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

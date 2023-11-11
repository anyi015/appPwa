import firebase from 'firebase/compat/app';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getMessaging} from 'firebase/messaging';


var firebaseConfig = {
    apiKey: "AIzaSyCBaQHpOdzi28k7xpmlZY404WjY1h3g4NY",
    authDomain: "gastos-apw.firebaseapp.com",
    projectId: "gastos-apw",
    storageBucket: "gastos-apw.appspot.com",
    messagingSenderId: "773863082197",
    appId: "1:773863082197:web:3e1329fa335fd99777ba5c"
  };

  // Initialize Firebase
// const fb = firebase.initializeApp(firebaseConfig);
// export const db= fb.firestore();

const app = firebase.initializeApp(firebaseConfig);
export const db= app.firestore();
export const storage = app.storage(); // Exporta el módulo de Firebase Storage
export const messaging = getMessaging(app);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

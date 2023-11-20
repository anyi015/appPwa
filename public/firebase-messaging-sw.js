importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
const firebaseConfig = {
    apiKey: "AIzaSyCBaQHpOdzi28k7xpmlZY404WjY1h3g4NY",
    authDomain: "gastos-apw.firebaseapp.com",
    projectId: "gastos-apw",
    storageBucket: "gastos-apw.appspot.com",
    messagingSenderId: "773863082197",
    appId: "1:773863082197:web:3e1329fa335fd99777ba5c"
  };
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();


  messaging.onBackgroundMessage((payload) => {
    console.log(
       '[firebase-messaging-sw.js] Recibido en segundo plano:',
        payload);
    // Personaliza cómo manejas las notificaciones push en segundo plano aquí
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.image,
    }

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
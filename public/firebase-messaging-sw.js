importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBcdsGBl7_MglgHA58U56DNDw_rR84PfOo",
  authDomain: "fowy-51662.firebaseapp.com",
  projectId: "fowy-51662",
  storageBucket: "fowy-51662.firebasestorage.app",
  messagingSenderId: "566035704332",
  appId: "1:566035704332:web:3d8335c873fac1d5c55c29"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico', // Update this with a proper icon if available
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

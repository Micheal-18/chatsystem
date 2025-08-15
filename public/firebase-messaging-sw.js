importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js");

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon
  });
});

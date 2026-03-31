/* global importScripts */

const FIREBASE_SDK_VERSION = "12.11.0";
const DEFAULT_CLICK_PATH = "/notification";

importScripts(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js`);
importScripts(
  `https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-messaging-compat.js`,
);

function parseFirebaseConfigFromSearch() {
  const search = self.location?.search ?? "";
  const params = new URLSearchParams(search);

  const config = {
    apiKey: params.get("apiKey") ?? "",
    authDomain: params.get("authDomain") ?? "",
    projectId: params.get("projectId") ?? "",
    storageBucket: params.get("storageBucket") ?? "",
    messagingSenderId: params.get("messagingSenderId") ?? "",
    appId: params.get("appId") ?? "",
    measurementId: params.get("measurementId") ?? "",
  };

  const hasRequiredConfig = Boolean(
    config.apiKey &&
    config.authDomain &&
    config.projectId &&
    config.storageBucket &&
    config.messagingSenderId &&
    config.appId,
  );

  return hasRequiredConfig ? config : null;
}

function getNotificationTargetPath(payloadData) {
  const link = payloadData?.link ?? payloadData?.path ?? payloadData?.url;

  if (!link || typeof link !== "string") {
    return DEFAULT_CLICK_PATH;
  }

  return link;
}

function toAbsoluteUrl(pathOrUrl) {
  try {
    return new URL(pathOrUrl, self.location.origin).href;
  } catch {
    return new URL(DEFAULT_CLICK_PATH, self.location.origin).href;
  }
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const firebaseConfig = parseFirebaseConfigFromSearch();

if (firebaseConfig && self.firebase?.apps?.length === 0) {
  self.firebase.initializeApp(firebaseConfig);
}

if (firebaseConfig && self.firebase?.messaging) {
  const messaging = self.firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log("notification payload:", payload);
    console.log("notification arrived:", payload?.notification);
    console.log("if data exists:", payload?.data);
    const notification = payload?.notification ?? {};
    const payloadData = payload?.data ?? {};

    const title = notification.title ?? payloadData.title ?? "새 알림";
    const body = notification.body ?? payloadData.body ?? "";
    const targetPath = getNotificationTargetPath(payloadData);

    self.registration.showNotification(title, {
      body,
      data: {
        ...payloadData,
        targetPath,
      },
    });
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const targetPath = getNotificationTargetPath(event.notification?.data);
      const targetUrl = toAbsoluteUrl(targetPath);
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        const clientUrl = new URL(client.url);

        if (clientUrl.origin !== self.location.origin) {
          continue;
        }

        await client.focus();

        if (client.url !== targetUrl && "navigate" in client) {
          await client.navigate(targetUrl);
        }

        return;
      }

      await self.clients.openWindow(targetUrl);
    })(),
  );
});

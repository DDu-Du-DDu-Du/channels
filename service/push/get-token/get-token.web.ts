import { FirebaseOptions, getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

interface FcmEnv {
  fcmApiKey?: string;
  fcmAuthDomain?: string;
  fcmProjectId?: string;
  fcmStorageBucket?: string;
  fcmMessagingSenderId?: string;
  fcmAppId?: string;
  fcmMeasurementId?: string;
  fcmVapId?: string;
}

const SW_PATH = "/firebase-messaging-sw.js";

const buildServiceWorkerUrl = (env: FcmEnv) => {
  const params = new URLSearchParams({
    apiKey: env.fcmApiKey ?? "",
    authDomain: env.fcmAuthDomain ?? "",
    projectId: env.fcmProjectId ?? "",
    storageBucket: env.fcmStorageBucket ?? "",
    messagingSenderId: env.fcmMessagingSenderId ?? "",
    appId: env.fcmAppId ?? "",
    measurementId: env.fcmMeasurementId ?? "",
  });

  return `${SW_PATH}?${params.toString()}`;
};

const hasRequiredConfig = (env: FcmEnv) => {
  return !!(
    env.fcmApiKey &&
    env.fcmAuthDomain &&
    env.fcmProjectId &&
    env.fcmStorageBucket &&
    env.fcmMessagingSenderId &&
    env.fcmAppId &&
    env.fcmVapId
  );
};

const getFirebaseConfig = (env: FcmEnv): FirebaseOptions => {
  return {
    apiKey: env.fcmApiKey ?? "",
    authDomain: env.fcmAuthDomain ?? "",
    projectId: env.fcmProjectId ?? "",
    storageBucket: env.fcmStorageBucket ?? "",
    messagingSenderId: env.fcmMessagingSenderId ?? "",
    appId: env.fcmAppId ?? "",
    measurementId: env.fcmMeasurementId ?? "",
  };
};

const getEnv = (): FcmEnv => {
  return {
    fcmApiKey: process.env.EXPO_PUBLIC_FCM_API_KEY,
    fcmAuthDomain: process.env.EXPO_PUBLIC_FCM_AUTH_DOMAIN,
    fcmProjectId: process.env.EXPO_PUBLIC_FCM_PROJECT_ID,
    fcmStorageBucket: process.env.EXPO_PUBLIC_FCM_STORAGE_BUCKET,
    fcmMessagingSenderId: process.env.EXPO_PUBLIC_FCM_MESSAGING_SENDER_ID,
    fcmAppId: process.env.EXPO_PUBLIC_FCM_APP_ID,
    fcmMeasurementId: process.env.EXPO_PUBLIC_FCM_MEASUREMENT_ID,
    fcmVapId: process.env.EXPO_PUBLIC_FCM_VAP_ID,
  };
};

export async function getTokenAsync() {
  try {
    const env = getEnv();

    if (!hasRequiredConfig(env)) {
      console.warn("[push] FCM env is missing. Skip device token registration.");

      return null;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      console.warn("[push] notification and serviceWorker should both be in window and navigator");

      return null;
    }

    if (Notification.permission === "denied") {
      console.warn("[push] notification permission denied");

      return null;
    }

    const permission =
      Notification.permission === "granted"
        ? Notification.permission
        : await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn("[push] notification permission is not granted");

      return null;
    }

    const messagingSupported = await isSupported();

    if (!messagingSupported) {
      console.warn("[push] push messaging service is not supported");

      return null;
    }

    const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig(env));
    const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl(env));
    const messaging = getMessaging(app);

    const token = await getToken(messaging, {
      vapidKey: env.fcmVapId,
      serviceWorkerRegistration: registration,
    });

    if (!token) {
      console.warn("[push] no valid token for web push notification");

      return null;
    }

    console.log("[push] device token issued from push server");

    return token;
  } catch (error) {
    console.error("[push] failed to get web FCM token:", error);

    return null;
  }
}

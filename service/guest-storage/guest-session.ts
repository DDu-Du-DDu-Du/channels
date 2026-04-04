import { useAuthStore } from "@/stores";

export const isGuestSession = () => useAuthStore.getState().sessionType === "guest";

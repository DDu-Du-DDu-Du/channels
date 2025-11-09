import type { CreateToastFunc, ToastType } from "@/components/toast/toast-provider.type";

import { v4 as uuidV4 } from "uuid";
import { create } from "zustand";

interface ToastListItemType {
  id: string;
  message: string;
  deleteTime: number;
  type: ToastType;
}

interface UseToastStore {
  toastList: ToastListItemType[];
  removeToast: (toastId: string) => void;
  createToast: CreateToastFunc;
}

const useToastStore = create<UseToastStore>((set, get) => ({
  toastList: [],

  removeToast: (toastId) => {
    set(({ toastList }) => ({ toastList: toastList.filter(({ id }) => id !== toastId) }));
  },

  createToast: (message, options = {}) => {
    const { deleteTime = 3000, type = "alert" } = options;
    const id = uuidV4();

    set(({ toastList, removeToast }) => {
      setTimeout(() => {
        removeToast(id);
      }, deleteTime);

      return { toastList: [...toastList, { id, message, deleteTime, type }] };
    });
  },
}));

export default useToastStore;

import React from "react";
import { Pressable, View } from "react-native";

import { SpoqaText, ToastProvider } from "@/components";
import { useToast } from "@/components/toast/hooks";

function Controls() {
  const { createToast } = useToast();

  return (
    <View className="gap-[0.8rem]">
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-status-warning dark:bg-role-dark-status-warning"
        onPress={() => createToast("알림: 토스트가 표시됩니다.", { type: "alert" })}
      >
        <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
          Show Alert Toast
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-status-success dark:bg-role-dark-status-success"
        onPress={() => createToast("성공: 저장되었습니다.", { type: "safe" })}
      >
        <SpoqaText>Show Safe Toast</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-status-warning dark:bg-role-dark-status-warning"
        onPress={() => createToast("경고: 확인이 필요합니다.", { type: "warning" })}
      >
        <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
          Show Warning Toast
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-status-error dark:bg-role-dark-status-error"
        onPress={() => createToast("오류: 문제가 발생했습니다.", { type: "danger" })}
      >
        <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
          Show Danger Toast
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-surface-muted dark:bg-role-dark-surface-muted"
        onPress={() => {
          for (let i = 1; i <= 5; i++) {
            createToast(`빠른 생성 ${i}`, { deleteTime: 2000 });
          }
        }}
      >
        <SpoqaText className="text-role-text-inverse dark:text-role-dark-text-inverse">
          Spawn 5 (overflow test)
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-role-surface-subtle dark:bg-role-dark-surface-subtle"
        onPress={() => createToast("긴 토스트: 진행바 확인을 위해 5초 유지", { deleteTime: 5000 })}
      >
        <SpoqaText>Show 5s Toast</SpoqaText>
      </Pressable>
    </View>
  );
}

function ToastView() {
  return (
    <ToastProvider>
      <View className="flex-1 items-center justify-center p-4">
        <Controls />
      </View>
    </ToastProvider>
  );
}

export default ToastView;

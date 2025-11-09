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
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_orange_500"
        onPress={() => createToast("알림: 토스트가 표시됩니다.", { type: "alert" })}
      >
        <SpoqaText className="text-white">Show Alert Toast</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_green_100"
        onPress={() => createToast("성공: 저장되었습니다.", { type: "safe" })}
      >
        <SpoqaText>Show Safe Toast</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_yellow_500"
        onPress={() => createToast("경고: 확인이 필요합니다.", { type: "warning" })}
      >
        <SpoqaText className="text-white">Show Warning Toast</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_red_500"
        onPress={() => createToast("오류: 문제가 발생했습니다.", { type: "danger" })}
      >
        <SpoqaText className="text-white">Show Danger Toast</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_gray_700"
        onPress={() => {
          for (let i = 1; i <= 5; i++) {
            createToast(`빠른 생성 ${i}`, { deleteTime: 2000 });
          }
        }}
      >
        <SpoqaText className="text-white">Spawn 5 (overflow test)</SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        className="px-[1.2rem] py-[0.8rem] rounded-radius10 bg-example_gray_300"
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

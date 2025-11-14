import { Pressable, View } from "react-native";

import { SpoqaText } from "@/components";

import { Href, useRouter } from "expo-router";

export interface ReminderNotificationProps {
  id: string | number;
  title: string;
  body: string;
  context: string;
  createdAt: string;
  bgColor?: string;
}

function ReminderNotification({
  id,
  title,
  body,
  context,
  createdAt,
  bgColor = "#F5F5F5",
}: ReminderNotificationProps) {
  const router = useRouter();

  const handlePress = () => {
    if (!id || !context) {
      return;
    }

    const href = `/${context}/${id}`;
    router.push(href as Href);
  };

  return (
    <View className="w-full">
      <Pressable
        className="rounded-radius15 bg-example_gray_100 px-[1.4rem] py-[1.6rem]"
        style={{ backgroundColor: bgColor }}
        onPress={handlePress}
      >
        <SpoqaText className="block text-size13 leading-[1.3rem]">{title}</SpoqaText>
        <SpoqaText className="text-size11 font-light text-example_gray_900">{body}</SpoqaText>
      </Pressable>
    </View>
  );
}

export default ReminderNotification;

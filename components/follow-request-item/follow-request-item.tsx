import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import Avatar from "@/components/avatar/avatar";
import MotionPressable from "@/components/motion/motion-pressable/motion-pressable";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { UserType } from "@/types/response/user/user";
import getRelativeTime from "@/utils/get-relative-time/get-relative-time";

export interface FollowRequestItemProps {
  user: UserType;
  followRequestAt: string;
  onFollowRequestCheck: (isFollow: boolean) => void;
}

function FollowRequestItem({
  user,
  followRequestAt,
  onFollowRequestCheck,
}: FollowRequestItemProps) {
  const timeAge = useMemo(() => getRelativeTime(followRequestAt), [followRequestAt]);
  const denyBackgroundColor = useThemeColorToken("role.surface.card");
  const acceptBackgroundColor = useThemeColorToken("role.surface.muted");

  const handleDenyPress = () => {
    onFollowRequestCheck(false);
  };

  const handleAcceptPress = () => {
    onFollowRequestCheck(true);
  };

  return (
    <View className="w-full">
      <View className="flex-row items-center my-[0.8rem] ml-[1rem]">
        <Avatar user={user} />
        <View className="flex-1 ml-[1rem]">
          <SpoqaText className="text-size13 leading-[1.3rem]">
            <SpoqaText weight="semiBold">{user.userName}</SpoqaText>님이 팔로우를 요청했습니다.
          </SpoqaText>
          <SpoqaText className="text-size11 leading-[1.1rem]">{timeAge}</SpoqaText>
        </View>
      </View>
      <View className="flex-row justify-between gap-[1rem]">
        <MotionPressable
          accessibilityRole="button"
          style={[styles.denyButton, { backgroundColor: denyBackgroundColor }]}
          whileTap={{ scale: 0.95 }}
          onPress={handleDenyPress}
        >
          <SpoqaText className="text-size11">거절</SpoqaText>
        </MotionPressable>
        <MotionPressable
          accessibilityRole="button"
          style={[styles.acceptButton, { backgroundColor: acceptBackgroundColor }]}
          whileTap={{ scale: 0.95 }}
          onPress={handleAcceptPress}
        >
          <SpoqaText className="text-size11 text-role-text-inverse dark:text-role-dark-text-inverse">
            수락
          </SpoqaText>
        </MotionPressable>
      </View>
    </View>
  );
}

export default FollowRequestItem;

const styles = StyleSheet.create({
  baseButton: {
    flex: 1,
    height: 42, // ~3rem
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10, // approx for rounded-radius5 token
  },
  denyButton: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  acceptButton: {
    flex: 1,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

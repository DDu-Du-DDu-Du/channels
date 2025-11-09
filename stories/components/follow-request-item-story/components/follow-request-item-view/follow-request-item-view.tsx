import React from "react";
import { View } from "react-native";

import { FollowRequestItem } from "@/components";
import { UserType } from "@/types/response/user/user";

export interface FollowRequestItemViewProps {
  followRequestAt?: string;
  onFollowRequestCheck?: (isFollow: boolean) => void;
}

const MOCK_USER: UserType = {
  userId: "user-1",
  userName: "홍길동",
  userImage: null,
};

function FollowRequestItemView({
  followRequestAt = new Date().toISOString(),
  onFollowRequestCheck,
}: FollowRequestItemViewProps) {
  return (
    <View className="flex-1 items-center justify-center p-4 w-full max-w-[40rem]">
      <FollowRequestItem
        user={MOCK_USER}
        followRequestAt={followRequestAt}
        onFollowRequestCheck={(v) => onFollowRequestCheck?.(v)}
      />
    </View>
  );
}

export default FollowRequestItemView;

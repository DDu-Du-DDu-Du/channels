import { View } from "react-native";

import { UserListItem } from "@/components";
import { UserType } from "@/types/response/user/user";

export interface UserListItemViewProps {
  isFollowing?: boolean;
  isPrivate?: boolean;
  isRequestFollow?: boolean;
}

function UserListItemView({
  isFollowing = false,
  isPrivate = false,
  isRequestFollow = false,
}: UserListItemViewProps) {
  const user: UserType = {
    userId: "1",
    userName: "홍길동",
    userImage: null,
  };

  return (
    <View className="flex-1 items-center justify-center w-full p-4">
      <UserListItem
        type={isFollowing ? "FOLLOWING" : "FOLLOW"}
        user={user}
        isFollowing={isFollowing}
        isPrivate={isPrivate}
        isRequestFollow={isRequestFollow}
      />
    </View>
  );
}

export default UserListItemView;

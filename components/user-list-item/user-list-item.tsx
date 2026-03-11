import { Pressable, View } from "react-native";

import { Avatar, ConfirmModal, SpoqaText } from "@/components";
import { useToggle } from "@/hooks";
import { UserType } from "@/types/response/user/user";

import { useToggleFollow } from "./hooks";

export interface UserListItemProps {
  type: "FOLLOWING" | "FOLLOW";
  user: UserType;
  isFollowing: boolean;
  isPrivate: boolean;
  isRequestFollow: boolean;
}

function UserListItem({ type, user, isFollowing, isPrivate, isRequestFollow }: UserListItemProps) {
  const {
    isToggle: isShowModal,
    handleToggleOff: closeModal,
    handleToggleOn: openModal,
  } = useToggle();
  const { isFollow, isFollowRequesting, title, message, handleToggleFollow, handleFollowCheck } =
    useToggleFollow({
      isFollowing,
      isPrivate,
      isRequestFollow,
      openModal,
    });

  const buttonLabel = isFollowRequesting
    ? isFollow
      ? "요청중"
      : "팔로우"
    : isFollow
      ? "팔로잉"
      : "팔로우";

  return (
    <View className="flex-row items-center justify-between w-full py-[0.8rem]">
      <View className="flex-row items-center flex-1">
        <Avatar user={user} />
        <SpoqaText className="flex-1 mx-[1.6rem] text-size13">{user.userName}</SpoqaText>
      </View>
      <Pressable
        className={`w-[8rem] h-[3rem] rounded-radius10 items-center justify-center ${
          type === "FOLLOW" && isFollow
            ? "border border-role-border-strong dark:border-role-dark-border-strong"
            : type === "FOLLOWING" && isFollow
              ? "bg-role-surface-panel dark:bg-role-dark-surface-panel"
              : !isFollow
                ? "bg-role-surface-muted dark:bg-role-dark-surface-muted"
                : ""
        }`}
        onPress={handleToggleFollow}
      >
        <SpoqaText className="text-size11">{buttonLabel}</SpoqaText>
      </Pressable>
      <ConfirmModal
        isToggle={isShowModal}
        title={title}
        message={message}
        handleToggleOff={closeModal}
        onCompleteCheck={handleFollowCheck}
      />
    </View>
  );
}

export default UserListItem;

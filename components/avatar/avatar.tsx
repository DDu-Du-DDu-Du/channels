import { Pressable, View } from "react-native";

import { ProfileImage } from "@/components";
import { UserType } from "@/types/response/user/user";

import { AVATAR_SIZE } from "./avatar.constant";
import { AvatarEdit, AvatarList } from "./components";
import { useChangeImage, useClickAvatar } from "./hooks";

import { ImagePickerAsset } from "expo-image-picker";

export type AvatarProps = {
  type?: "view" | "edit";
  size?: "tiny" | "small" | "medium" | "large";
  onChangeAvatar?: (file: ImagePickerAsset | null) => void;
} & ({ user?: UserType; users?: UserType[] } | { users: UserType[]; user?: UserType });

function Avatar({ type = "view", size = "small", user, users, onChangeAvatar }: AvatarProps) {
  const { userId = "", userName = "", userImage = null } = user ?? users?.[0] ?? {};
  const { preview, handleChangeImage } = useChangeImage({ userImage, onChangeAvatar });
  const { handleClickAvatar } = useClickAvatar({ type, userId, handleChangeImage, onChangeAvatar });

  if (users && users.length > 1) {
    return <AvatarList users={users} />;
  }

  if (users && users.length === 0) {
    return null;
  }

  return (
    <View
      className={`relative ${AVATAR_SIZE[size]} ${(userId || type === "edit") && "cursor-pointer"}`}
    >
      <Pressable
        className="w-full h-full"
        onPress={handleClickAvatar}
      >
        <View className="w-full h-full overflow-hidden rounded-circle bg-white_100 shadow-shadow_500">
          <ProfileImage
            className="rounded-circle w-full h-full"
            source={preview}
            alt={`${userName}님의 프로필 이미지`}
            priority="high"
          />
        </View>
        {type === "edit" && <AvatarEdit size={size} />}
      </Pressable>
    </View>
  );
}

export default Avatar;

import { View } from "react-native";

import { AVATAR_ICON } from "../../avatar.constant";

interface AvatarEditProps {
  size: "tiny" | "small" | "medium" | "large";
}

function AvatarEdit({ size }: AvatarEditProps) {
  return (
    <View
      className={`absolute bottom-0 right-0 rounded-full bg-role-surface-canvas dark:bg-role-dark-surface-canvas shadow-shadow_500 ${AVATAR_ICON[size]}`}
    ></View>
  );
}

export default AvatarEdit;

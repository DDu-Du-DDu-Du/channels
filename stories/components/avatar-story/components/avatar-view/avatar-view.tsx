import { View } from "react-native";

import Avatar, { AvatarProps } from "@/components/avatar/avatar";

const AvatarView = (props: AvatarProps) => {
  return (
    <View
      className="py-[5rem]"
      style={{ flex: 1 }}
    >
      <Avatar {...props} />
    </View>
  );
};

export default AvatarView;

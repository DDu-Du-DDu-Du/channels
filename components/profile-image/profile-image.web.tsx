import { defaultProfile } from "@/assets/images/svg";

import { Image, ImageProps } from "expo-image";

function ProfileImage({ source, ...props }: ImageProps) {
  return (
    <Image
      source={source ?? defaultProfile}
      {...props}
    />
  );
}

export default ProfileImage;

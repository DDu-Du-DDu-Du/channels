import { DefaultProfile } from "@/assets/images/svg";

import { Image, ImageProps } from "expo-image";

function ProfileImage({ source, className, ...props }: ImageProps) {
  return (
    <>
      {source ? (
        <Image
          source={source}
          className={className}
          {...props}
        />
      ) : (
        <DefaultProfile className={className} />
      )}
    </>
  );
}

export default ProfileImage;

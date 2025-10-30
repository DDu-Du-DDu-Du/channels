import { useState } from "react";

import * as ImagePicker from "expo-image-picker";

interface UseChangeImageProps {
  userImage: string | null;
  onChangeAvatar?: (asset: ImagePicker.ImagePickerAsset | null) => void;
}

export function useChangeImage({ userImage, onChangeAvatar }: UseChangeImageProps) {
  const [preview, setPreview] = useState<string | undefined>(userImage ?? undefined);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  const handleChangeImage = async () => {
    if (!onChangeAvatar) {
      return;
    }

    if (!status?.granted) {
      const permission = await requestPermission();

      if (!permission.granted) {
        console.warn("권한 없음");

        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      quality: 1,
    });

    if (result.canceled) {
      return;
    }

    const asset = result.assets[0];

    if (!asset) {
      return;
    }

    console.log(asset);
    setPreview(asset.uri);
    onChangeAvatar(asset);
  };

  return { preview, handleChangeImage };
}

export default useChangeImage;

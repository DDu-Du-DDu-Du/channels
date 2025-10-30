import { ImagePickerAsset } from "expo-image-picker";
import { useRouter } from "expo-router";

interface UseClickAvatarProps {
  type: "view" | "edit";
  userId?: string;
  handleChangeImage: () => void;
  onChangeAvatar?: (file: ImagePickerAsset | null) => void;
}

export function useClickAvatar({
  type,
  userId,
  handleChangeImage,
  onChangeAvatar,
}: UseClickAvatarProps) {
  const router = useRouter();

  const handleClickAvatar = () => {
    if (type === "view" && userId) {
      router.push(`/user/${userId}`);
    }

    if (type === "edit" && onChangeAvatar) {
      handleChangeImage();
    }
  };

  return { handleClickAvatar };
}

export default useClickAvatar;

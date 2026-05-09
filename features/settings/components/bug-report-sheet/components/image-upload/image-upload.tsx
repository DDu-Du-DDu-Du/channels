import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Pressable, ScrollView, View } from "react-native";

import { SpoqaText } from "@/components";
import { CloseIcon } from "@/icons";

import { BugReportImageItem } from "../../bug-report-sheet.types";

import * as ImagePicker from "expo-image-picker";

interface ImageUploadProps {
  items: BugReportImageItem[];
  onAddImages: (nextImages: BugReportImageItem[]) => void;
  onRemoveImage: (imageId: string) => void;
  maxCount?: number;
  disabled?: boolean;
}

function ImageUpload({
  items,
  onAddImages,
  onRemoveImage,
  maxCount = 10,
  disabled = false,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handlePressUpload = async () => {
    if (disabled || isLoading || items.length >= maxCount) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: Math.max(1, maxCount - items.length),
      });

      if (result.canceled) {
        return;
      }

      const nextImages: BugReportImageItem[] = result.assets.map((asset, index) => ({
        id: `${Date.now()}-${index}-${asset.assetId ?? "image"}`,
        uri: asset.uri,
        name: asset.fileName ?? `image-${index + 1}`,
      }));

      onAddImages(nextImages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Pressable
        onPress={handlePressUpload}
        disabled={disabled || isLoading || items.length >= maxCount}
        className="h-[4.2rem] items-center justify-center rounded-radius12 border border-role-border-default dark:border-role-dark-border-default bg-role-surface-canvas dark:bg-role-dark-surface-canvas"
      >
        <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
          {isLoading
            ? t("settings.bugReportSheet.uploading")
            : t("settings.bugReportSheet.uploadImage")}
        </SpoqaText>
      </Pressable>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 4, columnGap: 10 }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            className="relative"
          >
            <Image
              source={{ uri: item.uri }}
              className="size-[7.2rem] rounded-radius10 bg-role-surface-subtle dark:bg-role-dark-surface-subtle"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => onRemoveImage(item.id)}
              className="absolute right-[-0.6rem] top-[-0.6rem] size-[1.8rem] items-center justify-center rounded-circle bg-role-surface-inverse dark:bg-role-dark-surface-inverse"
            >
              <CloseIcon
                size={10}
                fill="#FFFFFF"
              />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default ImageUpload;

import { useState } from "react";
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
        className="h-[4.2rem] items-center justify-center rounded-radius12 border border-[#D5D5D5] bg-[#FFFFFF]"
      >
        <SpoqaText className="text-size13 text-black_500">
          {isLoading ? "업로드 중..." : "이미지 업로드"}
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
              className="size-[7.2rem] rounded-radius10 bg-[#EAEAEA]"
              resizeMode="cover"
            />
            <Pressable
              onPress={() => onRemoveImage(item.id)}
              className="absolute right-[-0.6rem] top-[-0.6rem] size-[1.8rem] items-center justify-center rounded-circle bg-black_500"
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

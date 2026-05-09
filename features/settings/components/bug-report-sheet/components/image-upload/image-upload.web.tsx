import { useEffect, useRef } from "react";
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

interface DragEventLike {
  preventDefault: () => void;
  dataTransfer: {
    files: FileList;
  };
}

function ImageUpload({
  items,
  onAddImages,
  onRemoveImage,
  maxCount = 10,
  disabled = false,
}: ImageUploadProps) {
  const { t } = useTranslation();
  const objectUrlSetRef = useRef<Set<string>>(new Set());

  const handleCreateImageItems = (files: File[]) => {
    if (disabled || items.length >= maxCount || files.length === 0) {
      return;
    }

    const remain = Math.max(0, maxCount - items.length);
    const nextFiles = files.slice(0, remain);
    const nextImages = nextFiles.map((file, index) => {
      const uri = URL.createObjectURL(file);
      objectUrlSetRef.current.add(uri);

      return {
        id: `${Date.now()}-${index}-${file.name}`,
        uri,
        name: file.name,
        file,
        isObjectUrl: true,
      } satisfies BugReportImageItem;
    });

    onAddImages(nextImages);
  };

  const handleDrop = (event: DragEventLike) => {
    event.preventDefault();
    handleCreateImageItems(Array.from(event.dataTransfer.files));
  };

  const handleDragOver = (event: DragEventLike) => {
    event.preventDefault();
  };

  const handlePressUpload = async () => {
    if (disabled || items.length >= maxCount) {
      return;
    }

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
  };

  const handleRemoveImage = (imageId: string) => {
    const target = items.find((item) => item.id === imageId);

    if (target?.isObjectUrl && objectUrlSetRef.current.has(target.uri)) {
      URL.revokeObjectURL(target.uri);
      objectUrlSetRef.current.delete(target.uri);
    }

    onRemoveImage(imageId);
  };

  useEffect(() => {
    const currentObjectUrlSet = new Set(
      items.filter((item) => item.isObjectUrl).map((item) => item.uri),
    );

    objectUrlSetRef.current.forEach((uri) => {
      if (!currentObjectUrlSet.has(uri)) {
        URL.revokeObjectURL(uri);
        objectUrlSetRef.current.delete(uri);
      }
    });
  }, [items]);

  useEffect(() => {
    const objectUrlSet = objectUrlSetRef.current;

    return () => {
      objectUrlSet.forEach((uri) => {
        URL.revokeObjectURL(uri);
      });
      objectUrlSet.clear();
    };
  }, []);

  return (
    <View>
      <View
        {...({ onDrop: handleDrop, onDragOver: handleDragOver } as object)}
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#C9C9C9",
          borderRadius: 12,
          padding: 16,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
        }}
      >
        <SpoqaText className="text-size13 text-role-text-secondary dark:text-role-dark-text-secondary">
          {t("settings.bugReportSheet.dropImage")}
        </SpoqaText>
        <Pressable
          onPress={handlePressUpload}
          disabled={disabled || items.length >= maxCount}
          className="mt-[1rem] h-[3.6rem] items-center justify-center rounded-radius10 bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg px-[1.2rem]"
        >
          <SpoqaText className="text-size13 text-role-text-inverse dark:text-role-dark-text-inverse">
            {t("settings.bugReportSheet.upload")}
          </SpoqaText>
        </Pressable>
      </View>

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
              onPress={() => handleRemoveImage(item.id)}
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

import { Platform } from "react-native";

import * as FileSystem from "expo-file-system/legacy";

const handleFormatTimestamp = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
};

export const handleCreateDesignSystemSnapshotFileName = (date = new Date()): string => {
  return `design-systems-${handleFormatTimestamp(date)}.json`;
};

export interface SaveDesignSystemSnapshotResult {
  fileName: string;
  fileUri: string;
}

export const handleSaveDesignSystemSnapshot = async (
  payload: Record<string, unknown>,
): Promise<SaveDesignSystemSnapshotResult> => {
  const fileName = handleCreateDesignSystemSnapshotFileName();
  const serialized = JSON.stringify(payload, null, 2);

  if (Platform.OS === "web") {
    const blob = new Blob([serialized], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(url);

    return {
      fileName,
      fileUri: fileName,
    };
  }

  const writableDirectory = FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!writableDirectory) {
    throw new Error("No writable directory available for snapshot export.");
  }

  const fileUri = `${writableDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(fileUri, serialized, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return {
    fileName,
    fileUri,
  };
};

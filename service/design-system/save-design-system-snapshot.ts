import { Directory, File, Paths } from "expo-file-system";

export interface SaveDesignSystemSnapshotPayload {
  fileName: string;
  content: string;
}

export interface SaveDesignSystemSnapshotResult {
  fileName: string;
  target: string;
}

export async function saveDesignSystemSnapshot({
  fileName,
  content,
}: SaveDesignSystemSnapshotPayload): Promise<SaveDesignSystemSnapshotResult> {
  const directory = new Directory(Paths.document, "design-system-logs");
  directory.create({ idempotent: true, intermediates: true });

  const fullFileName = `${fileName}.json`;
  const file = new File(directory, fullFileName);
  file.create({ intermediates: true, overwrite: true });
  file.write(content);

  return {
    fileName: fullFileName,
    target: file.uri,
  };
}

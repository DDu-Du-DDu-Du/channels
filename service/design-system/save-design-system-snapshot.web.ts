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
  const fullFileName = `${fileName}.json`;
  const blob = new Blob([content], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fullFileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return {
    fileName: fullFileName,
    target: "web-download",
  };
}

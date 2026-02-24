export interface BugReportImageItem {
  id: string;
  uri: string;
  name?: string;
  file?: unknown;
  isObjectUrl?: boolean;
}

export interface BugReportFormValues {
  title: string;
  content: string;
  images: BugReportImageItem[];
}

import type { FileObject } from "@duocrafters/notion-database-zod";

// TODO: Move it somewhere else
export function fileToUrl(
  fileObject: FileObject | null | undefined,
): string | null {
  if (!fileObject) {
    return null;
  } else if (fileObject.type === "file") {
    return fileObject.file.url;
  } else if (fileObject.type === "external") {
    return fileObject.external.url;
  }
  throw new Error("unknown file type");
}

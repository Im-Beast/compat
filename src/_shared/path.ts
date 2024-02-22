import { os } from "../os.ts";

export function posixUrlToPath(url: URL): string {
  return decodeURIComponent(url.pathname);
}

export function windowsUrlToPath(url: URL): string {
  return decodeURIComponent(url.pathname.replace(/\//g, "\\"));
}

export function urlToPath(url: URL): string {
  if (url.protocol !== "file:") {
    throw new Error("URL must be a file URL");
  }

  return os() === "windows" ? windowsUrlToPath(url) : posixUrlToPath(url);
}

export function posixPathToHierarchicalPath(path: string): string[] {
  return path.split("/");
}

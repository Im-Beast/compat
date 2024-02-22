import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { fs } from "./_node/mod.ts";
import { posixUrlToPath } from "./_shared/path.ts";
import { posixPathToHierarchicalPath } from "./_shared/path.ts";

// TODO: normalize errors thrown

interface WriteFileOptions {
  signal?: AbortSignal;
  mode?: number;
}

/**
 * Write `data` to given `path`.
 * The file gets created if it doesn't exist.
 * If a file exists, it gets overwritten.
 *
 * In browsers File System API is used and files are written to OPFS.
 * Keep in mind that OPFS is only available in secure contexts (HTTPS/localhost).
 * Path given to the browser must be POSIX-alike.
 *
 * @throws
 */
export async function writeFile(
  path: string | URL,
  data: Uint8Array,
  options: WriteFileOptions = {},
): Promise<void> {
  options.mode ??= 0o666;

  switch (whichRuntime()) {
    case Runtime.Deno:
      await Deno.writeFile(path, data, options);
      break;
    case Runtime.Node: {
      const fsModule = await fs();
      await fsModule.writeFile(path, data, options);
      break;
    }
    case Runtime.Browser: {
      if (navigator.storage === undefined) {
        throw new Error("FileSystem API is not supported in this environment.");
      }

      const root = await navigator.storage.getDirectory();
      if (path instanceof URL) {
        path = posixUrlToPath(path);
      } else if (path.startsWith(".")) {
        path = path.slice(1);
      }

      const hierarchicalPath = path.split("/");

      let dir = root;
      for (const segment of hierarchicalPath.slice(0, -1)) {
        dir = await dir.getDirectoryHandle(segment);
      }

      const fileHandle = await dir.getFileHandle(path, {
        create: true,
      });

      const writable = await fileHandle.createWritable();

      // We need to truncate the bytes in the file first
      // So that we don't write on top of existing bytes
      await writable.truncate(0);
      await writable.write(data);
      await writable.close();
      break;
    }
  }
}

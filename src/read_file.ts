import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { fs } from "./_node/mod.ts";
import { posixUrlToPath } from "./_shared/path.ts";
import { posixPathToHierarchicalPath } from "./_shared/path.ts";

// TODO: normalize errors thrown

export async function readFile(
  path: string | URL,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return await Deno.readFile(path, { signal });
    case Runtime.Node: {
      const fsModule = await fs();
      const buffer = await fsModule.readFile(path, { signal });
      return new Uint8Array(buffer.buffer);
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

      const fileHandle = await dir.getFileHandle(path);
      const file = await fileHandle.getFile();

      return new Uint8Array(await file.arrayBuffer());
    }
  }
}

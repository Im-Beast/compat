import { Runtime, whichRuntime } from "./which.ts";
import { Permission } from "./permissions.ts";
import {
  IsDirectory,
  MissingTargetImplementation,
  NotFound,
  PermissionDenied,
} from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { fs, isNodeError } from "./_node/mod.ts";
import { posixUrlToPath } from "./_shared/path.ts";

/**
 * Reads the file at given `path` and returns an array of bytes.
 *
 * In browsers File System API is used and files are written to OPFS.
 * Keep in mind that OPFS is only available in secure contexts (HTTPS/localhost).
 * Path given to the browser must be POSIX-alike.
 *
 * @throws {PermissionDenied} when permission to read the file got denied
 * @throws {IsDirectory} when the path points to a directory
 * @throws {NotFound} when the file at given path does not exist
 * @throws {MissingTargetImplementation} when the runtime does not support reading files
 */
export async function readFile(
  path: string | URL,
  signal?: AbortSignal,
): Promise<Uint8Array> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      try {
        return await Deno.readFile(path, { signal });
      } catch (error) {
        if (error instanceof Deno.errors.PermissionDenied) {
          throw new PermissionDenied(Permission.Write, path);
        } else if (error instanceof Deno.errors.IsADirectory) {
          throw new IsDirectory(path);
        } else if (error instanceof Deno.errors.NotFound) {
          throw new NotFound(path);
        }
        throw error;
      }
    case Runtime.Node: {
      try {
        const fsModule = await fs();
        const buffer = await fsModule.readFile(path, { signal });
        return new Uint8Array(buffer.buffer);
      } catch (error) {
        if (isNodeError(error)) {
          if ((error.code === "EACCES" || error.code === "ERR_ACCESS_DENIED")) {
            throw new PermissionDenied(Permission.Write, path);
          } else if (error.code === "EISDIR") {
            throw new IsDirectory(path);
          } else if (error.code === "ENOENT") {
            throw new NotFound(path);
          }
        }
        throw error;
      }
    }
    case Runtime.Browser: {
      if (navigator.storage === undefined) {
        throw new MissingTargetImplementation(
          "readFile",
          navigator.userAgent,
          "\nwriteFile is only supported wherever FileSystem API is.\nIf your browser does support it, please make sure you are in a secure context (https/localhost).",
        );
      }

      const root = await navigator.storage.getDirectory();
      if (path instanceof URL) {
        path = posixUrlToPath(path);
      } else if (path.startsWith(".")) {
        path = path.slice(1);
      }

      const hierarchicalPath = path.split("/");

      let dir = root;
      try {
        for (const segment of hierarchicalPath.slice(0, -1)) {
          dir = await dir.getDirectoryHandle(segment);
        }
      } catch (error) {
        if (error.name === "NotAllowedError") {
          throw new PermissionDenied(Permission.Write, path);
        } else if (error.name === "NotFoundError") {
          throw new NotFound(path);
        }
        throw error;
      }

      try {
        const fileHandle = await dir.getFileHandle(path);
        const file = await fileHandle.getFile();

        return new Uint8Array(await file.arrayBuffer());
      } catch (error) {
        if (error.name === "NotAllowedError") {
          throw new PermissionDenied(Permission.Write, path);
        } else if (error.name === "NotFoundError") {
          throw new NotFound(path);
        }
        throw error;
      }
    }
  }
}

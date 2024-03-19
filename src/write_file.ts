/**
 * Write data to a file.\
 * This module is compatible with Deno, Node and Web.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";
import {
  IsDirectory,
  MissingTargetImplementation,
  NotFound,
  PermissionDenied,
} from "./errors.ts";

import { Permission } from "./_shared/permissions.ts";
import { posixUrlToPath } from "./_shared/path.ts";

import { Deno } from "./_deno/mod.ts";
import { fs, isNodeError } from "./_node/mod.ts";

/** Options for {@linkcode writeFile} */
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
 * @throws {PermissionDenied} when permission to write the file got denied
 * @throws {IsDirectory} when the path points to a directory
 * @throws {NotFound} when the file at given path does not exist
 * @throws {MissingTargetImplementation} when the runtime does not support writing files
 *
 * @example
 * ```ts
 * try {
 *   await writeFile("example.txt", new TextEncoder().encode("Hello, world!"));
 * } catch (error) {
 *   if (error instanceof PermissionDenied) {
 *     console.error(`Permission denied to write to ${error.specific ?? "the file"}`);
 *   } else if (error instanceof IsDirectory) {
 *     console.error(`${error.path} is a directory`);
 *   } else if (error instanceof NotFound) {
 *     console.error(`${error.path} does not exist`);
 *   } else if (error instanceof MissingTargetImplementation) {
 *     console.error(`Your runtime does not support writing files`);
 *   }
 * }
 * ```
 */
export async function writeFile(
  path: string | URL,
  data: Uint8Array,
  options: WriteFileOptions = {},
): Promise<void> {
  options.mode ??= 0o666;

  switch (whichRuntime()) {
    case Runtime.Deno:
      try {
        await Deno.writeFile(path, data, options);
        break;
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
    case Runtime.Node:
      try {
        const fsModule = await fs();
        await fsModule.writeFile(path, data, options);
        break;
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
    case Runtime.Browser: {
      if (navigator.storage === undefined) {
        throw new MissingTargetImplementation(
          "writeFile",
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
        const fileHandle = await dir.getFileHandle(path, {
          create: true,
        });

        const writable = await fileHandle.createWritable();

        // We need to truncate the bytes in the file first
        // So that we don't write on top of existing bytes
        await writable.truncate(0);
        await writable.write(data);
        await writable.close();
      } catch (error) {
        if (error.name === "NotAllowedError") {
          throw new PermissionDenied(Permission.Write, path);
        } else if (error.name === "NotFoundError") {
          throw new NotFound(path);
        }
        throw error;
      }

      break;
    }
  }
}

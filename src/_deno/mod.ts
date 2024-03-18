import type { Command, CommandOptions } from "./command.ts";
import type { PermissionDescriptor, PermissionStatus } from "./permissions.ts";

export * from "./command.ts";
export * from "./permissions.ts";

interface ReadFileOptions {
  signal?: AbortSignal;
}

interface WriteFileOptions {
  append?: boolean;
  create?: boolean;
  createNew?: boolean;
  mode?: number;
  signal?: AbortSignal;
}

interface SetRawOptions {
  cbreak?: boolean;
}

interface Deno {
  env: Map<string, string>;

  stdin: {
    setRaw(mode: boolean, options?: SetRawOptions): void;
    readable: ReadableStream<Uint8Array> & {
      [Symbol.asyncIterator](): AsyncIterableIterator<Uint8Array>;
    };
  };
  stdout: { writable: WritableStream<Uint8Array> };
  stderr: { writable: WritableStream<Uint8Array> };

  permissions: {
    query(desc: PermissionDescriptor): Promise<PermissionStatus>;
  };

  Command: {
    new (command: string | URL, options?: CommandOptions): Command;
  };

  errors: Record<
    "AlreadyExists" | "IsADirectory" | "PermissionDenied" | "NotFound",
    new (...args: unknown[]) => Error
  >;

  build: {
    os:
      | "darwin"
      | "linux"
      | "android"
      | "windows"
      | "freebsd"
      | "netbsd"
      | "aix"
      | "solaris"
      | "illumos";
  };

  readFile(
    path: string | URL,
    options?: ReadFileOptions,
  ): Promise<Uint8Array>;
  writeFile(
    path: string | URL,
    data: Uint8Array,
    options?: WriteFileOptions,
  ): Promise<void>;
}

// deno-lint-ignore no-explicit-any
export const Deno = (globalThis as any)?.Deno as Deno;

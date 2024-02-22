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

interface Deno {
  env: Map<string, string>;

  permissions: {
    query(desc: PermissionDescriptor): Promise<PermissionStatus>;
  };

  Command: {
    new (command: string | URL, options?: CommandOptions): Command;
  };

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

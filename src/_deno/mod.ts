import type { Command, CommandOptions } from "./command.ts";
import type { PermissionDescriptor, PermissionStatus } from "./permissions.ts";

export * from "./command.ts";
export * from "./permissions.ts";

interface Deno {
  env: Map<string, string>;
  permissions: {
    query(desc: PermissionDescriptor): Promise<PermissionStatus>;
  };
  Command: {
    new (command: string | URL, options?: CommandOptions): Command;
  };
  readFile(
    path: string | URL,
    options?: { signal?: AbortSignal },
  ): Promise<Uint8Array>;
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
}

// deno-lint-ignore no-explicit-any
export const Deno = (globalThis as any)?.Deno as Deno;

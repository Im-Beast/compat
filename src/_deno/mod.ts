import type { Command, CommandOptions } from "./command.d.ts";
import type { PermissionDescriptor, PermissionStatus } from "./permissions.ts";

export * from "./command.d.ts";
export * from "./permissions.ts";

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
}

// deno-lint-ignore no-explicit-any
export const Deno = (globalThis as any)?.Deno as Deno;

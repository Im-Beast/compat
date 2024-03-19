/**
 * Returns operating system on which the code is running.\
 * This module is compatible with Deno, Node and Web.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { os as nodeOs, process } from "./_node/mod.ts";

/** Operating system, returned by {@linkcode os} */
export type OS =
  | "darwin"
  | "linux"
  | "android"
  | "windows"
  | "openbsd"
  | "freebsd"
  | "netbsd"
  | "aix"
  | "solaris"
  | "illumos"
  | "unknown";

/**
 * Returns operating system on which the code is running.
 *
 * @example
 * ```ts
 * console.log(os()); // "darwin" | "linux" | "android" | "windows" | "openbsd" | "freebsd" | "netbsd" | "aix" | "solaris" | "illumos" | "unknown"
 * ```
 */
export function os(): OS {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.build.os;
    case Runtime.Node: {
      const { platform } = process;
      switch (platform) {
        case "win32":
          return "windows";
        case "sunos":
          return "solaris";
        default:
          return platform;
      }
    }
    case Runtime.Browser: {
      const userAgentData = "userAgentData" in navigator
        ? navigator.userAgentData as { platform?: string }
        : undefined;

      if (userAgentData) {
        switch (userAgentData.platform) {
          case "Windows":
            return "windows";
          case "Linux":
            return "linux";
          case "Android":
            return "android";
          case "iOS":
          case "macOS":
            return "darwin";
        }
      }

      const { userAgent } = navigator;
      if (userAgent.includes("Win")) {
        return "windows";
      } else if (userAgent.includes("Mac")) {
        return "darwin";
      } else if (userAgent.includes("Android")) {
        return "android";
      } else if (userAgent.includes("Linux")) {
        return "linux";
      }

      return "unknown";
    }
  }
}

/** Returns details about operating system on which the code is running */
export type OsDetails<T extends OS = OS> = T extends "windows" ? {
    os: "windows";
    version?: number;
    release?: number;
  }
  : T extends "linux" ? {
      os: "linux";
      kernel?: string;
    }
  : { os: T; details?: string };

/**
 * Returns details about operating system on which the code is running.
 * @returns
 * - On Windows, returns version and release number.
 * - On Linux, returns kernel version.
 * - On other operating systems, returns details string.
 *
 * @example
 * Windows
 * ```ts
 * console.log(osDetails()); // { os: "windows", version: 10, release: 14931 }
 * ```
 * @example
 * Linux
 * ```ts
 * console.log(osDetails()); // { os: "linux", kernel: "6.7.9-arch1-1" }
 * ```
 *
 * @example
 * Other OS's
 * ```ts
 * console.log(osDetails()); // { os: "darwin" | "linux" | "android" | "windows" | "openbsd" | "freebsd" | "netbsd" | "aix" | "solaris" | "illumos" | "unknown", version?: number, release?: number, kernel?: string, details?: string }
 * ```
 */
export async function osDetails(): Promise<OsDetails> {
  const currentOs = os();

  let details: string | undefined;
  switch (whichRuntime()) {
    case Runtime.Deno:
      details = Deno.osRelease();
      break;
    case Runtime.Node:
      details = (await nodeOs()).release();
      break;
  }

  if (!details) {
    return { os: currentOs };
  }

  switch (os()) {
    case "windows": {
      const [version, release] = details.split(".").map(Number);
      return { os: currentOs, version, release };
    }
    case "linux":
      return { os: "linux", kernel: details };
    default:
      return { os: "unknown", details };
  }
}

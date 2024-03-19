/**
 * Returns operating system on which the code is running.\
 * This module is compatible with Deno, Node and Web.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { process } from "./_node/mod.ts";

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

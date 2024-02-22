import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { process } from "./_node/mod.ts";

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
      // deno-lint-ignore no-explicit-any
      const userAgentData = (navigator as any)?.userAgentData as {
        platform?: string;
      };

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

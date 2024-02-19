import { Runtime, whichRuntime } from "./which.ts";

import { Deno } from "./_deno/mod.ts";
import { process } from "./_node/mod.ts";

export type OS =
  | "darwin"
  | "linux"
  | "android"
  | "windows"
  | "freebsd"
  | "netbsd"
  | "aix"
  | "solaris"
  | "illumos"
  | "unknown";

export function os(): OS {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.build.os as OS;
    case Runtime.Node:
      return process.platform as OS;
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

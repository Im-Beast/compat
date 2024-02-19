import { Runtime, whichRuntime } from "./which.ts";

import { process } from "./_node/mod.ts";
import { Deno } from "./_deno/mod.ts";

export function env(env: string): string | undefined {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.env.get(env);
    case Runtime.Node:
      return process.env[env];
    case Runtime.Browser:
      return undefined;
  }
}

/**
 * Get the value of environmental variable.
 * This module is compatible with Deno, Node and Web.
 * @module
 */

import { Runtime, whichRuntime } from "./which.ts";

import { process } from "./_node/mod.ts";
import { Deno } from "./_deno/mod.ts";

/**
 * Return the value of environmental variable.\
 * On browser this always returns `undefined`.
 */
export function env(env: string): string | undefined {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.env.get(env);
    case Runtime.Node:
      return process.env[env];
    case Runtime.Browser:
      // TODO: Should browser use `sessionStorage` as "environmental variables"?
      return undefined;
  }
}

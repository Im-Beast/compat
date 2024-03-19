/**
 * Reports the runtime in which code is running.\
 * This module is compatible with Deno, Node and Web.
 * @module
 */

/** Runtime, returned by {@linkcode whichRuntime} */
export enum Runtime {
  Deno = "Deno",
  Node = "Node",
  Browser = "Browser",
}

/**
 * Reports the runtime in which code is running
 *
 * @example
 * ```ts
 * console.log(whichRuntime()); // "Deno" | "Node" | "Browser"
 * ```
 */
export function whichRuntime(): Runtime {
  const { userAgent } = navigator;

  if (userAgent.includes("Deno")) {
    return Runtime.Deno;
  } else if (userAgent.includes("Node.js")) {
    return Runtime.Node;
  } else {
    return Runtime.Browser;
  }
}

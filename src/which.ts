export enum Runtime {
  Deno = "Deno",
  Node = "Node",
  Browser = "Browser",
}

/**
 * Reports the runtime in which code is running
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

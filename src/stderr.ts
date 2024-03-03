import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation } from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { nodeWritableStreamToWeb, process } from "./_node/mod.ts";

interface StderrOptions {
  byoWebImplementation?: () =>
    | WritableStream<Uint8Array>
    | Promise<WritableStream<Uint8Array>>;
}

export async function stderr(
  options?: StderrOptions,
): Promise<WritableStream<Uint8Array>> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      return Deno.stderr.writable;
    case Runtime.Node:
      return await nodeWritableStreamToWeb(process.stderr);
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return await options.byoWebImplementation();
      }
      throw new MissingByoWebImplementation("stderr");
  }
}

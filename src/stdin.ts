import { Runtime, whichRuntime } from "./which.ts";
import { MissingByoWebImplementation } from "./errors.ts";

import { Deno } from "./_deno/mod.ts";
import { nodeReadableStreamToWeb, process } from "./_node/mod.ts";

interface StdinOptions {
  raw?: boolean;
  signal?: AbortSignal;
  byoWebImplementation?: () =>
    | ReadableStream<Uint8Array>
    | Promise<ReadableStream<Uint8Array>>;
}

export async function stdin(
  options?: StdinOptions,
): Promise<ReadableStream<Uint8Array>> {
  switch (whichRuntime()) {
    case Runtime.Deno:
      if (typeof options?.raw === "boolean") {
        Deno.stdin.setRaw(options?.raw);
      }
      return Deno.stdin.readable;
    case Runtime.Node:
      if (typeof options?.raw === "boolean") {
        process.stdin.setRawMode(options.raw);
      }
      return nodeReadableStreamToWeb(process.stdin);
    case Runtime.Browser:
      if (options?.byoWebImplementation) {
        return await options.byoWebImplementation();
      }
      throw new MissingByoWebImplementation("stdin");
  }
}

import {
  NodeReadableStream,
  NodeWritableStream,
  StreamModule,
} from "./readable_stream.d.ts";

export async function stream(): Promise<StreamModule> {
  // deno-lint-ignore no-explicit-any
  return await import("node:stream") as any;
}

export async function nodeReadableStreamToWeb<T>(
  readable: NodeReadableStream,
): Promise<ReadableStream<T>> {
  const mod = await stream();
  return mod.Readable.toWeb(readable);
}

export async function nodeWritableStreamToWeb<T>(
  writable: NodeWritableStream,
): Promise<WritableStream<T>> {
  const mod = await stream();
  return mod.Writable.toWeb(writable);
}

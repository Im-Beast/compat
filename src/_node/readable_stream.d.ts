import type { NodeBuffer } from "./buffer.d.ts";

export interface StreamModule {
  Readable: NodeReadableStream;
  Writable: NodeWritableStream;
}

export declare interface NodeReadableStream {
  on(event: "data", listener: (chunk: NodeBuffer) => void): this;
  toWeb<T>(readable: NodeReadableStream): ReadableStream<T>;
}

export declare interface NodeWritableStream {
  toWeb<T>(writable: NodeWritableStream): WritableStream<T>;
}

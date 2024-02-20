import type { Buffer } from "./buffer.d.ts";

export interface StreamModule {
  Readable: NodeReadableStream;
  Writable: NodeWritableStream;
}

export declare interface NodeReadableStream {
  on(event: "data", listener: (chunk: Buffer) => void): this;
  toWeb<T>(readable: NodeReadableStream): ReadableStream<T>;
}

export declare interface NodeWritableStream {
  toWeb<T>(writable: NodeWritableStream): WritableStream<T>;
}

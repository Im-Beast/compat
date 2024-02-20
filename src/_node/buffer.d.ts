export interface Buffer {
  concat(chunks: Buffer[]): Buffer;
  buffer: ArrayBuffer;
}

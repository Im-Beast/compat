export interface NodeBuffer {
  concat(chunks: NodeBuffer[]): NodeBuffer;
  buffer: ArrayBuffer;
}

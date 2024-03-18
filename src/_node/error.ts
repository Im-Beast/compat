export declare class NodeError extends Error {
  code: string;
}

export function isNodeError(error: Error): error is NodeError {
  return "code" in error;
}

export function mergeUint8Arrays(ui8s: Uint8Array[]): Uint8Array {
  const length = ui8s.reduce((acc, ui8) => acc + ui8.length, 0);
  const result = new Uint8Array(length);

  ui8s.reduce((acc, ui8) => {
    result.set(ui8, acc);
    return acc + ui8.length;
  }, 0);

  return result;
}

export class MissingTargetImplementation extends Error {
  constructor(identifier: string, target: string, additional = "") {
    super(`${identifier} is not supported on ${target}.${additional}`);
  }
}

export class MissingByoWebImplementation extends MissingTargetImplementation {
  constructor(identifier: string) {
    super(
      identifier,
      "Web",
      `You can bring your own web implementation using 'byoWebImplementation' option`,
    );
  }
}

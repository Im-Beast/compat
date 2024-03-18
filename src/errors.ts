/**
 * Errors that can be thrown by compat modules.
 * @module
 */

import { Permission } from "./_shared/permissions.ts";

/** Thrown whenever a feature isn't supported on given target */
export class MissingTargetImplementation extends Error {
  identifier: string;
  target: string;

  constructor(identifier: string, target: string, additional = "") {
    super(`${identifier} is not supported on ${target}.${additional}`);

    this.identifier = identifier;
    this.target = target;
  }
}

/** Thrown whenever a feature isn't supported on Web and `options.byoWebImplementation` is not set */
export class MissingByoWebImplementation extends MissingTargetImplementation {
  constructor(identifier: string) {
    super(
      identifier,
      "Web",
      `You can bring your own web implementation using 'byoWebImplementation' option`,
    );
  }
}

/**
 * Thrown whenever Deno or Node process don't have appropriate permissions set
 * or user does not have access to a given resource.
 */
export class PermissionDenied extends Error {
  permission: Permission;
  specific?: string | URL;

  constructor(permission: Permission, specific?: string | URL) {
    let message = `Permission "${permission}" `;
    if (specific) {
      message += `for ${specific} `;
    }
    message += "has been denied";
    super(message);

    this.permission = permission;
    this.specific = specific;
  }
}

/** Thrown whenever tried to use path as a file, but it is a directory */
export class IsDirectory extends Error {
  path: string | URL;

  constructor(path: string | URL) {
    super(`${path} is a directory`);
    this.path = path;
  }
}

/** Thrown whenever given path does not exist */
export class NotFound extends Error {
  path: string | URL;

  constructor(path: string | URL) {
    super(`${path} could not be found`);
    this.path = path;
  }
}

/**
 * Errors that can be thrown by compat modules.
 * @module
 */

import { Permission } from "./_shared/permissions.ts";

export class MissingTargetImplementation extends Error {
  identifier: string;
  target: string;

  constructor(identifier: string, target: string, additional = "") {
    super(`${identifier} is not supported on ${target}.${additional}`);

    this.identifier = identifier;
    this.target = target;
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

export class IsDirectory extends Error {
  path: string | URL;

  constructor(path: string | URL) {
    super(`${path} is a directory`);
    this.path = path;
  }
}

export class NotFound extends Error {
  path: string | URL;

  constructor(path: string | URL) {
    super(`${path} could not be found`);
    this.path = path;
  }
}

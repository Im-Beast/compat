import { Runtime, whichRuntime } from "./which.ts";

import { urlToPath } from "./_shared/path.ts";
import { Permission } from "./_shared/permissions.ts";
import { nodePermissionsEquivalent, process } from "./_node/mod.ts";
import {
  Deno,
  denoPermissionsEquivalent,
  permissionSpecificKey,
} from "./_deno/mod.ts";

export { Permission };

export class PermissionError extends Error {
  constructor(permission: Permission) {
    super(`Permission denied: ${Permission[permission]}`);
  }
}

export async function hasPermission(
  permission: Permission,
  specific?: string | URL,
): Promise<boolean> {
  switch (whichRuntime()) {
    case Runtime.Deno: {
      const denoPermission = denoPermissionsEquivalent[permission];
      const specificKey = permissionSpecificKey[denoPermission];

      const status = await Deno.permissions.query({
        name: denoPermission,
        [specificKey]: specific,
      });

      return status.state === "granted";
    }
    case Runtime.Node: {
      const nodePermission = nodePermissionsEquivalent[permission];
      if ("permission" in process && nodePermission) {
        return process.permission.has(
          nodePermission,
          specific instanceof URL ? urlToPath(specific) : specific,
        );
      }
      return true;
    }
    case Runtime.Browser:
      return false;
  }
}

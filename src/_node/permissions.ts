import { Permission } from "../_shared/permissions.ts";

export enum NodePermission {
  Read = "fs.read",
  Write = "fs.write",
  Run = "child",
  Worker = "worker",
}

export const nodePermissionsEquivalent = {
  [Permission.Read]: NodePermission.Read,
  [Permission.Write]: NodePermission.Write,
  [Permission.Run]: NodePermission.Run,
  [Permission.Net]: undefined,
  [Permission.Env]: undefined,
};

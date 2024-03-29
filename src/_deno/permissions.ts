import { Permission } from "../_shared/permissions.ts";

export enum DenoPermission {
  Read = "read",
  Write = "write",
  Net = "net",
  Run = "run",
  Env = "env",
  Sys = "sys",
  Hrtime = "hrtime",
}

export interface PermissionDescriptor {
  name: string;
}

export interface PermissionStatus {
  state: "granted" | "denied" | "prompt";
}

export const permissionSpecificKey = {
  [DenoPermission.Read]: "path",
  [DenoPermission.Write]: "path",
  [DenoPermission.Net]: "host",
  [DenoPermission.Run]: "command",
  [DenoPermission.Env]: "variable",
  [DenoPermission.Sys]: "kind",
  [Permission.Hrtime]: "",
};

export const denoPermissionsEquivalent = {
  [Permission.Read]: DenoPermission.Read,
  [Permission.Write]: DenoPermission.Write,
  [Permission.Net]: DenoPermission.Net,
  [Permission.Run]: DenoPermission.Run,
  [Permission.Env]: DenoPermission.Env,
  [Permission.Sys]: DenoPermission.Sys,
  [Permission.Hrtime]: DenoPermission.Hrtime,
};

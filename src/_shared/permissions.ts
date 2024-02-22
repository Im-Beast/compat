// Permission needs to be imported from here
// To prevent circular imports and weird shenanigans
// like `Permission` becoming undefined from happening
export enum Permission {
  Read,
  Write,
  Net,
  Run,
  Env,
}

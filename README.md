# ⛰️ Compat

Package that tries to make writing cross-runtime code easier.\
Compat exposes a set of modules that wrap around respective runtimes to work on
Deno, Node and Browsers with the same API.

## Get started

```ts
import { command, PermissionDenied, ... } from "@beast/compat";

try {
  await command("echo", ["-e", "\\e[31mHello!\\e[0m"], {
    stdout: "inherit",
  });
} catch (error) {
  if (error instanceof PermissionDenied) {
    console.error("You do not have permission to run this command.");
  } else {
    console.error(error);
  }
}

...
```

## Targeted platforms:

- 🦕 Deno
- 🐢 Node
- 🌐 Browsers

## 📝 Licensing

This project is available under **MIT** License conditions.

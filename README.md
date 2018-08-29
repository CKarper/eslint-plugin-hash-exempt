# eslint-plugin-hash-exempt

This plugin supports exempting a file from linting based on a hash of its contents.  This is useful
for legacy code, or in cases where you may want to apply conflicting eslint standards to files from
a scaffold or generator.

> You break it, you buy it.

Once the content of the file changes, the exemption is invalidated.  The hash will have to be
updated, or the file corrected to current eslint standards.  This can allow organizations to
progressively update files without forcing a wholesale refactoring.

## Installation

```sh
npm install --save-dev eslint-plugin-hash-exempt
```

** Note:** If you want to install ESLint globally, then the plugin must also be installed globally.

## Usage

The rule to verify hashes is on by default. You may add further configuration in your 
.eslintrc.(yml|json|js):

```yaml
---
plugins:
  - hash-exempt

rules:
  hash-exempt/no-hash-mismatch: [error, { hashRequired: true }]
  # etc...
```

### Options
* **`hashRequired`**: If this is `false`, only files that have a directive with hash will be
verified. If it's `true`, any files with a directive at the top will require a hash.  This is
`false` by default.

## Hash Creation

In order to insert hashed eslint directives in your files, run the command `hash-exempt` in your
folder.

```sh
hash-exempt [--exempt-all] *.js
```

By default, `hash-exempt` will only insert directives into files that are currently failing lint.

### Flags
* **`--exempt-all`**: Insert a hashed eslint directive in all files matching the supplied glob,
regardless of whether or not they contain lint errors.

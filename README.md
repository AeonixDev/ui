# `@aeonixdev/ui`

Svelte components for _AeonixDev_ projects

## Development

Install dependencies:

```sh
bun install
```

Run Storybook:

```sh
bun run storybook
```

Build the package:

```sh
bun run package
```

## Usage

Import component styles once in your app (ideally in a root entrypoint or layout file so they are only included once):

```ts
import '@aeonixdev/ui/styles.css';
```

Import components through explicit entry points:

```svelte
<script lang="ts">
  import Badge from '@aeonixdev/ui/Badge.svelte';
  import Button from '@aeonixdev/ui/Button.svelte';
</script>

<Badge>Alpha</Badge>
<Button>Save</Button>
```

Import shared component types through the explicit type entry point:

```ts
import type { Size, Variant } from '@aeonixdev/ui/types';
```

Dark mode is class-based. Add `dark` to the document root to enable the dark theme:

```html
<html class="dark">
```

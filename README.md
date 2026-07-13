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

### Dashboard Example

The SvelteKit workspace app in [`examples/dashboard`](./examples/dashboard) exercises every component in a responsive operations dashboard. It consumes the library's raw source through its public exports, just like an installed package.

```sh
bun install
cd examples/dashboard
bun run dev
```

The dashboard is available at `http://localhost:21001`. Run `bun run check` or `bun run build` from the example directory to validate it independently.

## Usage

The package ships raw Svelte, TypeScript, and Tailwind CSS source. Configure your app's bundler for Svelte and Tailwind CSS, then import Tailwind and the component styles once in your global stylesheet:

```css
@import "tailwindcss";
@import "@aeonixdev/ui/styles.css";
```

Import components through explicit entry points:

```svelte
<script lang="ts">
	import Badge from "@aeonixdev/ui/Badge.svelte";
	import Button from "@aeonixdev/ui/Button.svelte";
</script>

<Badge>Alpha</Badge>
<Button>Save</Button>
```

If needed, shared component types (`Size`, `Variant`, etc) can be imported through the explicit type entry point:

```ts
import type { Size, Variant } from "@aeonixdev/ui/types";
```

Dark mode is class-based. Add `dark` to the document root to enable the dark theme:

```html
<html class="dark"></html>
```

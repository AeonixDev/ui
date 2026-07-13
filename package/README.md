# `@aeonixdev/ui`

Svelte components for _AeonixDev_ projects.

The package ships raw Svelte, TypeScript, and Tailwind CSS source. Configure your app's bundler for Svelte and Tailwind CSS, then import Tailwind and the component styles in your global stylesheet:

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

Dark mode is class-based. Add `dark` to the document root to enable the dark theme.

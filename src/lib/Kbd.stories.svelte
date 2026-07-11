<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Kbd from "./Kbd.svelte";
  import type { Size, Variant } from "./types.js";

  type KbdStoryArgs = {
    size: Size;
    variant: Variant;
  };

  const { Story } = defineMeta({
    args: {
      size: "md",
      variant: "default"
    },
    argTypes: {
      size: {
        control: "inline-radio",
        description: "Key height, minimum width, padding, and text size.",
        options: ["sm", "md", "lg"],
        table: {
          category: "Appearance",
          defaultValue: { summary: "'md'" },
          type: { summary: "'sm' | 'md' | 'lg'" }
        }
      },
      variant: {
        control: "inline-radio",
        description: "Visual emphasis for the key.",
        options: ["default", "primary", "secondary"],
        table: {
          category: "Appearance",
          defaultValue: { summary: "'default'" },
          type: { summary: "'default' | 'primary' | 'secondary'" }
        }
      }
    },
    parameters: {
      controls: { include: ["size", "variant"] },
      docs: {
        description: {
          component:
            "A semantic keyboard key wrapper for displaying individual keys and shortcuts. Native kbd attributes are forwarded to the element."
        }
      }
    },
    render: template,
    tags: ["autodocs"],
    title: "Components/Kbd"
  });
</script>

{#snippet template(args: KbdStoryArgs)}
  <Kbd size={args.size} variant={args.variant}>K</Kbd>
{/snippet}

<Story name="Default" />

<Story name="Shortcut">
  {#snippet template(args: KbdStoryArgs)}
    <span class="inline-flex items-center gap-1.5">
      <Kbd size={args.size} variant={args.variant}>Ctrl</Kbd>
      <span aria-hidden="true">+</span>
      <Kbd size={args.size} variant={args.variant}>Shift</Kbd>
      <span aria-hidden="true">+</span>
      <Kbd size={args.size} variant={args.variant}>P</Kbd>
    </span>
  {/snippet}
</Story>

<Story name="Primary" args={{ variant: "primary" }} />

<Story name="Secondary" args={{ variant: "secondary" }} />

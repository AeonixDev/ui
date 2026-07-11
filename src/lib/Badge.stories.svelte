<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Badge from './Badge.svelte';
  import type { Size, Variant } from './types.js';

  type BadgeStoryArgs = {
    variant: Variant;
    size: Size;
  };

  const { Story } = defineMeta({
    args: {
      size: 'md',
      variant: 'primary'
    },
    argTypes: {
      size: {
        control: 'inline-radio',
        description: 'Badge height, horizontal padding, and text size.',
        options: ['sm', 'md', 'lg'],
        table: {
          category: 'Appearance',
          defaultValue: { summary: "'md'" },
          type: { summary: "'sm' | 'md' | 'lg'" }
        }
      },
      variant: {
        control: 'inline-radio',
        description: 'Visual emphasis for the badge.',
        options: ['primary', 'secondary'],
        table: {
          category: 'Appearance',
          defaultValue: { summary: "'primary'" },
          type: { summary: "'primary' | 'secondary'" }
        }
      }
    },
    parameters: {
      controls: {
        include: ['variant', 'size']
      },
      docs: {
        description: {
          component:
            'A compact inline badge. Use child content for the label and shared Variant and Size values for visual treatment.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/Badge'
  });
</script>

{#snippet template(args: BadgeStoryArgs)}
  <Badge variant={args.variant} size={args.size}>Badge</Badge>
{/snippet}

<Story name="Primary">
  {#snippet template(args: BadgeStoryArgs)}
    <Badge variant={args.variant} size={args.size}>Primary badge</Badge>
  {/snippet}
</Story>

<Story name="Secondary" args={{ variant: 'secondary' }}>
  {#snippet template(args: BadgeStoryArgs)}
    <Badge variant={args.variant} size={args.size}>Secondary badge</Badge>
  {/snippet}
</Story>

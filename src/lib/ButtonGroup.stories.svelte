<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';
  import ButtonGroup from './ButtonGroup.svelte';
  import type { Variant } from './types.js';

  type ButtonGroupStoryArgs = {
    disabled: boolean;
    variant: Variant;
  };

  const { Story } = defineMeta({
    args: {
      disabled: false,
      variant: 'default'
    },
    argTypes: {
      disabled: {
        control: 'boolean',
        description: 'Disables every button that does not set its own disabled state.',
        table: {
          category: 'Behavior',
          defaultValue: { summary: 'false' },
          type: { summary: 'boolean' }
        }
      },
      variant: {
        control: 'inline-radio',
        description: 'Visual emphasis inherited by buttons that do not set their own variant.',
        options: ['default', 'primary', 'secondary', 'error', 'info', 'success', 'warning'],
        table: {
          category: 'Appearance',
          defaultValue: { summary: "'default'" },
          type: { summary: 'Variant' }
        }
      }
    },
    parameters: {
      controls: {
        include: ['variant', 'disabled']
      },
      docs: {
        description: {
          component:
            'Groups related buttons into one visual control while forwarding native div attributes. The group uses the semantic group role by default and can provide variant and disabled values to its buttons.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/ButtonGroup'
  });
</script>

{#snippet template(args: ButtonGroupStoryArgs)}
  <ButtonGroup aria-label="Text alignment" disabled={args.disabled} variant={args.variant}>
    <Button>Left</Button>
    <Button>Center</Button>
    <Button>Right</Button>
  </ButtonGroup>
{/snippet}

<Story name="Default" />

<Story name="Primary" args={{ variant: 'primary' }} />

<Story name="Secondary">
  {#snippet template(args: ButtonGroupStoryArgs)}
    <ButtonGroup aria-label="Document actions" variant="secondary">
      <Button>Save</Button>
      <Button disabled={true}>Preview</Button>
      <Button>Button</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<Story name="Mixed variants">
  {#snippet template(args: ButtonGroupStoryArgs)}
    <ButtonGroup aria-label="Document actions" disabled={args.disabled} variant={args.variant}>
      <Button>Save</Button>
      <Button variant="secondary">Preview</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<Story name="Disabled controls">
  {#snippet template(args: ButtonGroupStoryArgs)}
    <ButtonGroup aria-label="Disabled actions" disabled={true}>
      <Button>Button One</Button>
      <Button>Button Two</Button>
      <Button>Button Three</Button>
    </ButtonGroup>
  {/snippet}
</Story>

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Input from './Input.svelte';

  type InputStoryArgs = {
    disabled: boolean;
    placeholder: string;
    readonly: boolean;
    required: boolean;
  };

  const { Story } = defineMeta({
    args: {
      disabled: false,
      placeholder: 'name@example.com',
      readonly: false,
      required: false
    },
    argTypes: {
      disabled: {
        control: 'boolean',
        description: 'Prevents interaction with the input.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      placeholder: {
        control: 'text',
        description: 'Hint shown when the input has no value.',
        table: { category: 'Content' }
      },
      readonly: {
        control: 'boolean',
        description: 'Prevents editing without changing the input appearance.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      required: {
        control: 'boolean',
        description: 'Marks the input as required for native form validation.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      }
    },
    parameters: {
      controls: { include: ['placeholder', 'required', 'disabled', 'readonly'] },
      docs: {
        description: {
          component: 'A styled native input that forwards HTML attributes and supports bind:value.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/Form/Input'
  });
</script>

{#snippet template(args: InputStoryArgs)}
  <Input
    class="max-w-md"
    type="email"
    placeholder={args.placeholder}
    readonly={args.readonly}
    required={args.required}
    disabled={args.disabled}
  />
{/snippet}

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Readonly" args={{ readonly: true }} />

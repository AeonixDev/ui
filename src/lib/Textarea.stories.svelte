<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Textarea from './Textarea.svelte';

  type TextareaStoryArgs = {
    disabled: boolean;
    placeholder: string;
    readonly: boolean;
    required: boolean;
  };

  const { Story } = defineMeta({
    args: {
      disabled: false,
      placeholder: 'Add a description',
      readonly: false,
      required: false
    },
    argTypes: {
      disabled: {
        control: 'boolean',
        description: 'Prevents interaction with the textarea.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      placeholder: {
        control: 'text',
        description: 'Hint shown when the textarea has no value.',
        table: { category: 'Content' }
      },
      readonly: {
        control: 'boolean',
        description: 'Prevents editing without changing the textarea appearance.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      required: {
        control: 'boolean',
        description: 'Marks the textarea as required for native form validation.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      }
    },
    parameters: {
      controls: { include: ['placeholder', 'required', 'disabled', 'readonly'] },
      docs: {
        description: {
          component: 'A styled native textarea that forwards HTML attributes and supports bind:value.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/Form/Textarea'
  });
</script>

{#snippet template(args: TextareaStoryArgs)}
  <Textarea
    class="max-w-md"
    placeholder={args.placeholder}
    readonly={args.readonly}
    required={args.required}
    disabled={args.disabled}
  />
{/snippet}

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Readonly" args={{ readonly: true }} />

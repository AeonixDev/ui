<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Select from './Select.svelte';

  type SelectStoryArgs = {
    disabled: boolean;
    readonly: boolean;
    required: boolean;
  };

  const { Story } = defineMeta({
    args: {
      disabled: false,
      readonly: false,
      required: false
    },
    argTypes: {
      disabled: {
        control: 'boolean',
        description: 'Prevents interaction with the select.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      readonly: {
        control: 'boolean',
        description: 'Prevents selection changes without changing the select appearance.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      required: {
        control: 'boolean',
        description: 'Requires a non-empty option for native form validation.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      }
    },
    parameters: {
      controls: { include: ['required', 'disabled', 'readonly'] },
      docs: {
        description: {
          component:
            'A styled native select that forwards HTML attributes, renders option children, and supports bind:value.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/Form/Select'
  });
</script>

{#snippet template(args: SelectStoryArgs)}
  <Select
    class="max-w-md"
    disabled={args.disabled}
    name="role"
    readonly={args.readonly}
    required={args.required}
  >
    <option value="">Choose a role</option>
    <option value="developer">Developer</option>
    <option value="designer">Designer</option>
    <option value="manager">Manager</option>
  </Select>
{/snippet}

<Story name="Default" />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Readonly" args={{ readonly: true }} />

<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Checkbox from './Checkbox.svelte';

  type CheckboxStoryArgs = {
    checked: boolean;
    disabled: boolean;
    readonly: boolean;
    required: boolean;
  };

  const { Story } = defineMeta({
    args: {
      checked: false,
      disabled: false,
      readonly: false,
      required: false
    },
    argTypes: {
      checked: {
        control: 'boolean',
        description: 'Controls whether the checkbox is selected.',
        table: { category: 'State', defaultValue: { summary: 'false' } }
      },
      disabled: {
        control: 'boolean',
        description: 'Prevents interaction and applies the disabled appearance.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      readonly: {
        control: 'boolean',
        description: 'Prevents changes without altering the checkbox appearance.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      },
      required: {
        control: 'boolean',
        description: 'Requires the checkbox for native form validation.',
        table: { category: 'Behavior', defaultValue: { summary: 'false' } }
      }
    },
    parameters: {
      controls: { include: ['checked', 'required', 'disabled', 'readonly'] },
      docs: {
        description: {
          component:
            'A styled native checkbox that forwards HTML attributes, supports bind:checked, and inherits Form readonly behavior.'
        }
      }
    },
    render: template,
    tags: ['autodocs'],
    title: 'Components/Form/Checkbox'
  });
</script>

{#snippet template(args: CheckboxStoryArgs)}
  <label class="inline-flex items-center gap-2 text-sm" for="checkbox-updates">
    <Checkbox
      id="checkbox-updates"
      checked={args.checked}
      required={args.required}
      disabled={args.disabled}
      readonly={args.readonly}
    />
    Receive product updates
  </label>
{/snippet}

<Story name="Default" />

<Story name="Checked" args={{ checked: true }} />

<Story name="Disabled" args={{ disabled: true }} />

<Story name="Readonly" args={{ checked: true, readonly: true }} />

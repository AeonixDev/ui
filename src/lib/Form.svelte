<script lang="ts" module>
  import { cva } from 'class-variance-authority';
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';
  import type { HTMLFormAttributes } from 'svelte/elements';
  import { formContextKey, type FormContext } from './Form.js';

  const fieldsetVariants = cva('min-w-0 space-y-4 border-0 p-0', {
    defaultVariants: {
      fullWidth: true
    },
    variants: {
      fullWidth: {
        false: null,
        true: 'w-full [&>*]:w-full'
      }
    }
  });

  type NativeFormProps = Omit<HTMLFormAttributes, 'class' | 'onreset' | 'onsubmit'>;

  export type FormProps = NativeFormProps & {
    children?: Snippet;
    class?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    onreset?: HTMLFormAttributes['onreset'];
    onsubmit?: HTMLFormAttributes['onsubmit'];
    readonly?: boolean;
  };
</script>

<script lang="ts">
  let {
    children,
    class: className = '',
    disabled = false,
    fullWidth = true,
    onreset,
    onsubmit,
    readonly: isReadonly = false,
    ...restProps
  }: FormProps = $props();

  const context: FormContext = {
    get fullWidth() {
      return fullWidth;
    },
    get isReadonly() {
      return isReadonly;
    }
  };

  setContext(formContextKey, context);

  const fieldsetClasses = $derived(fieldsetVariants({ fullWidth }));
</script>

<form {...restProps} class={className} {onreset} {onsubmit}>
  <fieldset class={fieldsetClasses} {disabled}>
    {#if children}
      {@render children()}
    {/if}
  </fieldset>
</form>

<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { setContext } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { buttonGroupContextKey, type ButtonGroupContext } from './ButtonGroup.js';
  import type { Variant } from './types.js';

  type NativeButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'class'>;

  export type ButtonGroupProps = NativeButtonGroupProps & {
    children?: Snippet;
    class?: string;
    disabled?: boolean;
    variant?: Variant;
  };
</script>

<script lang="ts">
  let {
    children,
    class: className = '',
    disabled,
    role = 'group',
    variant,
    ...restProps
  }: ButtonGroupProps = $props();

  const context: ButtonGroupContext = {
    get disabled() {
      return disabled;
    },
    get variant() {
      return variant;
    }
  };

  setContext(buttonGroupContextKey, context);

  const classes = $derived(
    `inline-flex items-center [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none [&>button+button]:ml-px${className ? ` ${className}` : ''}`
  );
</script>

<div {...restProps} class={classes} {role}>
  {#if children}
    {@render children()}
  {/if}
</div>

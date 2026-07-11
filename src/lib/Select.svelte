<script lang="ts" module>
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { formContextKey, type FormContext } from './Form.js';
  import { formControlVariants } from './FormControl.js';

  type NativeSelectProps = Omit<HTMLSelectAttributes, 'class' | 'onkeydown' | 'onpointerdown' | 'value'>;

  export type SelectProps = NativeSelectProps & {
    children?: Snippet;
    class?: string;
    fullWidth?: boolean;
    onkeydown?: HTMLSelectAttributes['onkeydown'];
    onpointerdown?: HTMLSelectAttributes['onpointerdown'];
    readonly?: boolean;
    value?: HTMLSelectAttributes['value'];
  };
</script>

<script lang="ts">
  const form = getContext<FormContext | undefined>(formContextKey);

  let {
    children,
    class: className = '',
    fullWidth,
    onkeydown,
    onpointerdown,
    readonly: isReadonly = false,
    value = $bindable(),
    ...restProps
  }: SelectProps = $props();

  const effectiveReadonly = $derived(isReadonly || form?.isReadonly || false);
  const effectiveFullWidth = $derived(fullWidth ?? form?.fullWidth ?? true);
  const classes = $derived(
    formControlVariants({
      class: ['h-10 px-3', className],
      fullWidth: effectiveFullWidth,
      readonly: effectiveReadonly
    })
  );
</script>

<select
  {...restProps}
  aria-readonly={effectiveReadonly}
  bind:value
  class={classes}
  onkeydown={(event) => {
    if (effectiveReadonly && event.key !== 'Tab') {
      event.preventDefault();
      return;
    }

    onkeydown?.(event);
  }}
  onpointerdown={(event) => {
    if (effectiveReadonly) {
      event.preventDefault();
      return;
    }

    onpointerdown?.(event);
  }}
>
  {#if children}
    {@render children()}
  {/if}
</select>

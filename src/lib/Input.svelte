<script lang="ts" module>
  import { getContext } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import { formContextKey, type FormContext } from './Form.js';
  import { formControlVariants } from './FormControl.js';

  type NativeInputProps = Omit<HTMLInputAttributes, 'class' | 'value'>;

  export type InputProps = NativeInputProps & {
    class?: string;
    fullWidth?: boolean;
    value?: HTMLInputAttributes['value'];
  };
</script>

<script lang="ts">
  const form = getContext<FormContext | undefined>(formContextKey);

  let {
    class: className = '',
    fullWidth,
    readonly: isReadonly = false,
    type = 'text',
    value = $bindable(),
    ...restProps
  }: InputProps = $props();

  const effectiveReadonly = $derived(isReadonly || form?.isReadonly || false);
  const effectiveFullWidth = $derived(fullWidth ?? form?.fullWidth ?? true);
  const classes = $derived(
    formControlVariants({
      class: ['h-10 px-3 placeholder:text-foreground/50', className],
      fullWidth: effectiveFullWidth,
      readonly: effectiveReadonly
    })
  );
</script>

<input {...restProps} bind:value class={classes} readonly={effectiveReadonly} {type} />

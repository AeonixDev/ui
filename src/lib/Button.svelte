<script lang="ts" module>
  import { cva } from 'class-variance-authority';
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { buttonGroupContextKey, type ButtonGroupContext } from './ButtonGroup.js';
  import type { Size, Variant } from './types.js';

  const variantClasses = {
    default:
      'bg-foreground/10 text-foreground shadow-sm hover:bg-foreground/15 active:bg-foreground/20 focus-visible:ring-foreground/40',
    primary:
      'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80 focus-visible:ring-primary/40',
    secondary:
      'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 active:bg-secondary/80 focus-visible:ring-secondary/40'
  } satisfies Record<Variant, string>;

  const sizeClasses = {
    lg: 'h-12 px-5 text-base',
    md: 'h-10 px-4 text-sm',
    sm: 'h-8 px-3 text-sm'
  } satisfies Record<Size, string>;

  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg border-0 border-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    {
      defaultVariants: {
        size: 'md',
        variant: 'default'
      },
      variants: {
        size: sizeClasses,
        variant: variantClasses
      }
    }
  );

  type NativeButtonProps = Omit<HTMLButtonAttributes, 'class' | 'type'>;

  export type ButtonProps = NativeButtonProps & {
    children?: Snippet;
    class?: string;
    size?: Size;
    type?: 'button' | 'submit' | 'reset';
    variant?: Variant;
  };
</script>

<script lang="ts">
  const buttonGroup = getContext<ButtonGroupContext | undefined>(buttonGroupContextKey);

  let {
    children,
    class: className = '',
    disabled,
    size = 'md',
    type = 'button',
    variant,
    ...restProps
  }: ButtonProps = $props();

  const effectiveVariant = $derived(variant ?? buttonGroup?.variant ?? 'default');
  const effectiveDisabled = $derived(buttonGroup?.disabled ?? disabled ?? false);
  const classes = $derived(buttonVariants({ class: className, size, variant: effectiveVariant }));
</script>

<button {...restProps} class={classes} disabled={effectiveDisabled} {type}>
  {#if children}
    {@render children()}
  {/if}
</button>

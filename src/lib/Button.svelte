<script lang="ts" module>
  import { cva } from 'class-variance-authority';
  import type { Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Size, Variant } from './types.js';

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80',
    secondary:
      'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/90 active:bg-secondary/80'
  } satisfies Record<Variant, string>;

  const sizeClasses = {
    lg: 'h-12 px-5 text-base',
    md: 'h-10 px-4 text-sm',
    sm: 'h-8 px-3 text-sm'
  } satisfies Record<Size, string>;

  const buttonVariants = cva(
    'inline-flex items-center justify-center rounded-lg border-0 border-none font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
    {
      defaultVariants: {
        size: 'md',
        variant: 'primary'
      },
      variants: {
        size: sizeClasses,
        variant: variantClasses
      }
    }
  );

  type NativeButtonProps = Omit<HTMLButtonAttributes, 'class' | 'type'>;

  export type ButtonProps = NativeButtonProps & {
    class?: string;
    type?: 'button' | 'submit' | 'reset';
    variant?: Variant;
    size?: Size;
    children?: Snippet;
  };
</script>

<script lang="ts">
  let {
    class: className = '',
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    children,
    ...restProps
  }: ButtonProps = $props();

  const classes = $derived(buttonVariants({ class: className, size, variant }));
</script>

<button {...restProps} {type} {disabled} class={classes}>
  {#if children}
    {@render children()}
  {/if}
</button>

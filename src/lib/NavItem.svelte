<script lang="ts" module>
  import { cva } from 'class-variance-authority';
  import type { Snippet } from 'svelte';
  import { getContext } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { navContextKey, type NavContext } from './Nav.js';

  const navItemVariants = cva('box-border min-w-0 max-w-full', {
    compoundVariants: [
      {
        class:
          'text-primary-foreground hover:bg-primary-foreground/15 focus-visible:ring-primary-foreground/60 focus-visible:ring-offset-primary active:bg-primary-foreground/25 aria-[current=page]:bg-primary-foreground/20',
        type: ['link', 'button'],
        variant: 'primary'
      },
      {
        class:
          'text-secondary-foreground hover:bg-secondary-foreground/15 focus-visible:ring-secondary-foreground/60 focus-visible:ring-offset-secondary active:bg-secondary-foreground/25 aria-[current=page]:bg-secondary-foreground/20',
        type: ['link', 'button'],
        variant: 'secondary'
      },
      { class: 'bg-primary-foreground/30', type: 'divider', variant: 'primary' },
      { class: 'bg-secondary-foreground/30', type: 'divider', variant: 'secondary' },
      { class: 'h-6 w-px', mode: 'horizontal', type: 'divider' },
      { class: 'justify-start', mode: 'vertical', type: 'button' },
      { class: 'h-px', mode: 'vertical', type: 'divider' }
    ],
    defaultVariants: {
      mode: 'horizontal',
      type: 'link',
      variant: 'primary'
    },
    variants: {
      mode: {
        horizontal: null,
        vertical: 'w-full'
      },
      type: {
        button:
          'inline-flex h-auto cursor-pointer appearance-none items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md border-0 bg-transparent px-3 py-2 font-medium text-sm shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        divider: 'm-0 shrink-0 border-0',
        link:
          'inline-flex items-center overflow-hidden text-ellipsis whitespace-nowrap rounded-md px-3 py-2 font-medium text-sm no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1'
      },
      variant: {
        primary: null,
        secondary: null
      }
    }
  });

  export type NavLinkItemProps = Omit<HTMLAnchorAttributes, 'class' | 'href'> & {
    children?: Snippet;
    class?: string;
    href: NonNullable<HTMLAnchorAttributes['href']>;
    type: 'link';
  };

  export type NavButtonItemProps = Omit<HTMLButtonAttributes, 'class' | 'onclick' | 'type'> & {
    children?: Snippet;
    class?: string;
    onclick: NonNullable<HTMLButtonAttributes['onclick']>;
    type: 'button';
  };

  export type NavDividerItemProps = Omit<HTMLAttributes<HTMLHRElement>, 'class'> & {
    children?: never;
    class?: string;
    type: 'divider';
  };

  export type NavItemProps = NavLinkItemProps | NavButtonItemProps | NavDividerItemProps;

  type LinkElementProps = Omit<NavLinkItemProps, 'children' | 'class' | 'type'>;
  type ButtonElementProps = Omit<NavButtonItemProps, 'children' | 'class' | 'type'>;
  type DividerElementProps = Omit<NavDividerItemProps, 'children' | 'class' | 'type'>;
</script>

<script lang="ts">
  const nav = getContext<NavContext | undefined>(navContextKey);

  let { children, class: className = '', type, ...restProps }: NavItemProps = $props();

  const mode = $derived(nav?.mode ?? 'horizontal');
  const variant = $derived(nav?.variant ?? 'primary');
  const classes = $derived(navItemVariants({ class: className, mode, type, variant }));
  const dividerOrientation = $derived(mode === 'horizontal' ? 'vertical' : 'horizontal');
  const linkProps = $derived(restProps as LinkElementProps);
  const buttonProps = $derived(restProps as ButtonElementProps);
  const dividerProps = $derived(restProps as DividerElementProps);
</script>

{#if type === 'link'}
  <a {...linkProps} class={classes} href={linkProps.href}>
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else if type === 'button'}
  <button {...buttonProps} class={classes} type="button">
    {#if children}
      {@render children()}
    {/if}
  </button>
{:else}
  <hr
    {...dividerProps}
    aria-orientation={dividerProps['aria-orientation'] ?? dividerOrientation}
    class={classes}
  />
{/if}

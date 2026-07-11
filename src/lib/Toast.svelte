<script lang="ts" module>
  import { cva } from "class-variance-authority";
  import type { HTMLAttributes } from "svelte/elements";
  import type { ToastData } from "./Toast.js";

  const toastVariants = cva(
    "pointer-events-auto box-border w-full rounded-lg px-4 py-3 text-xs shadow-lg",
    {
      defaultVariants: {
        variant: "default"
      },
      variants: {
        variant: {
          default: "bg-foreground/10 text-foreground",
          error: "bg-error text-error-foreground",
          info: "bg-info text-info-foreground",
          primary: "bg-primary text-primary-foreground",
          secondary: "bg-secondary text-secondary-foreground",
          success: "bg-success text-success-foreground",
          warning: "bg-warning text-warning-foreground"
        }
      }
    }
  );

  type NativeToastProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-live" | "class" | "role">;

  export type ToastProps = NativeToastProps & Omit<ToastData, "duration" | "position"> & {
    class?: string;
  };
</script>

<script lang="ts">
  import { getContext } from "svelte";
  import { toastContextKey, type ToastContext } from "./Toast.js";

  let {
    class: className = "",
    dismissible,
    id,
    message,
    title,
    variant,
    ...restProps
  }: ToastProps = $props();

  const toastContext = getContext<ToastContext>(toastContextKey);
  const classes = $derived(toastVariants({ class: className, variant }));
</script>

<div {...restProps} class={classes} role="status">
  <div class="flex items-start gap-3">
    <div class="min-w-0 flex-1">
      {#if title}
        <strong class="block">{title}</strong>
      {/if}

      <p class={title && "mt-0.5"}>{message}</p>
    </div>

    {#if dismissible}
      <button
        aria-label="Dismiss notification"
        class="-m-1 shrink-0 cursor-pointer rounded p-1 text-current/70 hover:text-current focus:outline-none focus:ring-2 focus:ring-current/50"
        onclick={() => toastContext.removeToast(id)}
        type="button"
      >
        &times;
      </button>
    {/if}
  </div>
</div>

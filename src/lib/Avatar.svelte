<script lang="ts" module>
  import { cva } from "class-variance-authority";
  import type { Snippet } from "svelte";
  import type { HTMLAttributes, HTMLImgAttributes } from "svelte/elements";
  import type { Size, Variant } from "./types.js";

  export type AvatarStatus = "away" | "do not disturb" | "offline" | "online" | "unknown";

  const avatarVariants = cva(
    "relative inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium",
    {
      defaultVariants: {
        size: "md",
        variant: "default"
      },
      variants: {
        size: {
          lg: "size-12 text-base",
          md: "size-10 text-sm",
          sm: "size-8 text-xs"
        },
        variant: {
          default: "bg-foreground/10 text-foreground",
          primary: "bg-primary text-primary-foreground",
          secondary: "bg-secondary text-secondary-foreground"
        }
      }
    }
  );

  const statusClasses = {
    away: "bg-amber-400",
    "do not disturb": "bg-rose-500",
    offline: "bg-slate-500",
    online: "bg-emerald-500",
    unknown: "bg-sky-400"
  } satisfies Record<AvatarStatus, string>;

  const statusSizeClasses = {
    lg: "size-3",
    md: "size-2.5",
    sm: "size-2"
  } satisfies Record<Size, string>;

  type NativeAvatarProps = Omit<HTMLAttributes<HTMLSpanElement>, "class" | "children">;

  export type AvatarProps = NativeAvatarProps & {
    alt?: string;
    children?: Snippet;
    class?: string;
    decoding?: HTMLImgAttributes["decoding"];
    imageClass?: string;
    loading?: HTMLImgAttributes["loading"];
    size?: Size;
    src?: string;
    status?: AvatarStatus;
    variant?: Variant;
  };
</script>

<script lang="ts">
  let {
    alt = "",
    children,
    class: className = "",
    decoding,
    imageClass = "",
    loading,
    size = "md",
    src,
    status,
    variant = "default",
    ...restProps
  }: AvatarProps = $props();

  let failedSource = $state<string>();
  let loadedSource = $state<string>();
  const classes = $derived(avatarVariants({ class: className, size, variant }));
  const imageLoaded = $derived(Boolean(src) && loadedSource === src);
  const renderImage = $derived(Boolean(src) && failedSource !== src);
</script>

<span {...restProps} class={classes}>
  <span
    aria-hidden={imageLoaded || undefined}
    class="inline-flex size-full items-center justify-center overflow-hidden rounded-full"
  >
    {#if children}
      {@render children()}
    {:else if alt}
      <span class="sr-only">{alt}</span>
    {/if}
  </span>

  {#if renderImage && src}
    <img
      alt={imageLoaded ? alt : ""}
      class={[
        "absolute inset-0 size-full rounded-full object-cover transition-opacity duration-200",
        imageLoaded ? "opacity-100" : "opacity-0",
        imageClass
      ]}
      {decoding}
      {loading}
      onerror={() => (failedSource = src)}
      onload={() => (loadedSource = src)}
      {src}
    />
  {/if}

  {#if status}
    <span
      class={[
        "absolute right-0 bottom-0 rounded-full ring-2 ring-background transition-colors duration-200",
        statusClasses[status],
        statusSizeClasses[size]
      ]}
    >
      <span class="sr-only">Status: {status}</span>
    </span>
  {/if}
</span>

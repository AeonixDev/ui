<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";

  type ToastStoryArgs = {
    duration: number;
    maxToasts: number;
  };

  const { Story } = defineMeta({
    args: {
      duration: 5000,
      maxToasts: 2
    },
    argTypes: {
      duration: {
        control: { min: 0, step: 500, type: "number" },
        description: "Default auto-dismiss duration in milliseconds. Use 0 to disable auto-dismissal.",
        table: {
          category: "Behavior",
          defaultValue: { summary: "5000" },
          type: { summary: "number" }
        }
      },
      maxToasts: {
        control: { min: 0, step: 1, type: "number" },
        description: "Maximum visible notifications in each positioned region.",
        table: {
          category: "Behavior",
          defaultValue: { summary: "3" },
          type: { summary: "number" }
        }
      }
    },
    parameters: {
      docs: {
        description: {
          component:
            "ToastContainer stores notifications in context, groups them into six viewport regions, and limits each region independently. Its component instance exposes addToast and removeToast methods."
        }
      }
    },
    tags: ["autodocs"],
    title: "Components/Toast"
  });
</script>

<script lang="ts">
  import type { ToastId, ToastOptions, ToastPosition } from "./ToastContainer.svelte";
  import ToastContainer from "./ToastContainer.svelte";

  type ToastContainerHandle = {
    addToast: (toast: ToastOptions) => ToastId;
    removeToast: (id: ToastId) => void;
  };

  const positions: ToastPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right"
  ];

  let container = $state<ToastContainerHandle>();
  let initializedContainer: ToastContainerHandle | undefined;

  $effect(() => {
    if (!container || initializedContainer === container) {
      return;
    }

    initializedContainer = container;

    for (const position of positions) {
      for (let index = 1; index <= 3; index += 1) {
        container.addToast({
          duration: index === 3 ? 10000 : undefined,
          message: `Notification ${index} rendered in this region.`,
          position,
          title: position
            .split("-")
            .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
            .join(" "),
          variant: position.startsWith("top") ? "primary" : "secondary"
        });
      }
    }
  });
</script>

<Story name="All positions">
  {#snippet template(args: ToastStoryArgs)}
    <div style="min-height: 48rem">
      <p class="mx-auto max-w-md text-center text-sm text-foreground/70">
        One context-backed ToastContainer groups notifications without overlapping adjacent regions.
      </p>

      <ToastContainer bind:this={container} duration={args.duration} maxToasts={args.maxToasts} />
    </div>
  {/snippet}
</Story>

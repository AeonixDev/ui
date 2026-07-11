<script lang="ts" module>
  import { cva } from 'class-variance-authority';
  import type { Snippet } from 'svelte';
  import type { HTMLTableAttributes } from 'svelte/elements';
  import type { Variant } from './types.js';

  const tableVariants = cva('table', {
    defaultVariants: {
      hoverable: true,
      striped: false,
      variant: 'default'
    },
    variants: {
      hoverable: {
        false: null,
        true: 'hoverable'
      },
      striped: {
        false: null,
        true: 'striped'
      },
      variant: {
        default: 'variant-default',
        error: 'variant-error',
        info: 'variant-info',
        primary: 'variant-primary',
        secondary: 'variant-secondary',
        success: 'variant-success',
        warning: 'variant-warning'
      }
    }
  });

  const formatColumn = (column: string) => {
    const label = column.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const getCellValue = (row: TableRow, column: string) =>
    (row as Record<string, unknown>)[column];

  const getRowOption = <Row extends TableRow>(
    options: TableRowOptions<Row> | undefined,
    column: string
  ) => options?.[column as Extract<keyof Row, string>];

  const formatCellValue = (value: unknown, type?: TableCellType) => {
    if (value == null) {
      return '';
    }

    const resolvedType =
      type ??
      (value instanceof Date
        ? 'date'
        : typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string'
          ? typeof value
          : 'string');

    if (resolvedType === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    if (resolvedType === 'number') {
      const number = typeof value === 'number' ? value : Number(value);
      return Number.isNaN(number) ? String(value) : number.toLocaleString();
    }

    if (resolvedType === 'date') {
      const date = value instanceof Date ? value : new Date(value as string | number);
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString();
    }

    return String(value);
  };

  type NativeTableProps = Omit<HTMLTableAttributes, 'children' | 'class'>;

  export type TableRow = object;

  export type TableCellType = 'boolean' | 'date' | 'number' | 'string';

  export type TableRowOption = {
    label?: string;
    type?: TableCellType;
  };

  export type TableRowOptions<Row extends TableRow> = {
    [Key in Extract<keyof Row, string>]?: TableRowOption;
  };

  export type TableRowSnippet<Row extends TableRow> = Snippet<
    [row: Row, key: Extract<keyof Row, string>]
  >;

  type TableContentProps<Row extends TableRow> =
    | { children: Snippet; rowOptions?: never; rows?: never }
    | {
        children?: TableRowSnippet<Row>;
        rowOptions?: TableRowOptions<Row>;
        rows: readonly Row[];
      };

  export type TableProps<Row extends TableRow = TableRow> = NativeTableProps &
    TableContentProps<Row> & {
    class?: string;
    hoverable?: boolean;
    striped?: boolean;
    variant?: Variant;
  };
</script>

<script lang="ts" generics="Row extends TableRow">
  let {
    children,
    class: className = '',
    hoverable = true,
    rowOptions,
    rows,
    striped = false,
    variant = 'default',
    ...restProps
  }: TableProps<Row> = $props();

  const columns = $derived(rows?.[0] ? Object.keys(rows[0]) : []);
  const content = $derived(rows ? undefined : (children as Snippet | undefined));
  const rowSnippet = $derived(rows ? (children as TableRowSnippet<Row> | undefined) : undefined);
  const classes = $derived(tableVariants({ class: className, hoverable, striped, variant }));
</script>

<div class="table-shell">
  <table {...restProps} class={classes}>
    {#if rows}
      {#if columns.length > 0}
        <thead>
          <tr>
            {#each columns as column}
              <th scope="col">{getRowOption(rowOptions, column)?.label ?? formatColumn(column)}</th>
            {/each}
          </tr>
        </thead>
      {/if}
      <tbody>
        {#each rows as row}
          <tr>
            {#each columns as column}
              <td>
                {#if rowSnippet}
                  {@render rowSnippet(row, column as Extract<keyof Row, string>)}
                {:else}
                  {formatCellValue(
                    getCellValue(row, column),
                    getRowOption(rowOptions, column)?.type
                  )}
                {/if}
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    {:else if content}
      {@render content()}
    {/if}
  </table>
</div>

<style>
  .table-shell {
    box-sizing: border-box;
    isolation: isolate;
    max-width: 100%;
    overflow-x: auto;
    border-radius: 0.5rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  }

  .table {
    --table-border: color-mix(in srgb, var(--color-foreground) 15%, transparent);
    --table-base: transparent;
    --table-caption: color-mix(in srgb, var(--color-foreground) 10%, transparent);
    --table-header: color-mix(in srgb, var(--color-foreground) 15%, transparent);
    --table-hover: color-mix(in srgb, var(--color-foreground) 12%, var(--color-surface));
    --table-row: var(--color-surface);
    --table-stripe: color-mix(in srgb, var(--color-foreground) 8%, var(--color-surface));
    --table-text: var(--color-foreground);

    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    overflow: hidden;
    border-radius: 0.5rem;
    background: var(--table-base);
    color: var(--table-text);
    font-size: 0.875rem;
    line-height: 1.25rem;
    text-align: left;
  }

  .table.variant-primary {
    --table-accent: var(--color-primary);
    --table-accent-foreground: var(--color-primary-foreground);
  }

  .table.variant-secondary {
    --table-accent: var(--color-secondary);
    --table-accent-foreground: var(--color-secondary-foreground);
  }

  .table.variant-error {
    --table-accent: var(--color-error);
    --table-accent-foreground: var(--color-error-foreground);
  }

  .table.variant-info {
    --table-accent: var(--color-info);
    --table-accent-foreground: var(--color-info-foreground);
  }

  .table.variant-success {
    --table-accent: var(--color-success);
    --table-accent-foreground: var(--color-success-foreground);
  }

  .table.variant-warning {
    --table-accent: var(--color-warning);
    --table-accent-foreground: var(--color-warning-foreground);
  }

  .table:not(.variant-default) {
    --table-border: color-mix(in srgb, var(--table-accent-foreground) 20%, transparent);
    --table-base: var(--table-accent);
    --table-caption: color-mix(in srgb, var(--table-accent) 72%, var(--table-accent-foreground));
    --table-header: color-mix(in srgb, var(--table-accent) 82%, var(--table-accent-foreground));
    --table-hover: color-mix(in srgb, var(--table-accent) 75%, var(--table-accent-foreground));
    --table-row: var(--table-accent);
    --table-stripe: color-mix(in srgb, var(--table-accent) 85%, var(--table-accent-foreground));
    --table-text: var(--table-accent-foreground);
  }

  .table.variant-primary {
    --table-stripe: color-mix(in srgb, var(--table-accent) 75%, var(--table-accent-foreground));
  }

  .table :global(caption) {
    box-sizing: border-box;
    padding: 0.75rem 1rem;
    border: 1px solid var(--table-border);
    border-radius: 0.5rem 0.5rem 0 0;
    background: var(--table-caption);
    font-weight: 500;
    text-align: left;
  }

  .table :global(th),
  .table :global(td) {
    padding: 0.75rem 1rem;
    border-right: 1px solid var(--table-border);
    border-bottom: 1px solid var(--table-border);
  }

  .table :global(tr > :first-child) {
    border-left: 1px solid var(--table-border);
  }

  .table :global(thead:first-child tr:first-child th) {
    border-top: 1px solid var(--table-border);
  }

  .table :global(th) {
    background: var(--table-header);
    font-weight: 600;
  }

  .table :global(tbody td) {
    background: var(--table-row);
    transition: background-color 150ms ease;
  }

  .table.striped :global(tbody tr:nth-child(even) td) {
    background: var(--table-stripe);
  }

  .table.hoverable :global(tbody tr:hover td),
  .table.hoverable.striped :global(tbody tr:nth-child(even):hover td) {
    background: var(--table-hover);
  }

  .table:not(:has(> caption)) :global(thead:first-child tr:first-child th:first-child) {
    border-radius: 0.5rem 0 0 0;
  }

  .table:not(:has(> caption)) :global(thead:first-child tr:first-child th:last-child) {
    border-radius: 0 0.5rem 0 0;
  }

  .table :global(tbody:last-child tr:last-child td:first-child) {
    border-radius: 0 0 0 0.5rem;
  }

  .table :global(tbody:last-child tr:last-child td:last-child) {
    border-radius: 0 0 0.5rem 0;
  }
</style>

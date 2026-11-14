import type { ReactNode } from "react";
import type { Accessor } from "./model.js";
export interface Column<T> extends Accessor<T> {
  header: string;
  sortable?: boolean;
  hideable?: boolean;
  render?: (row: T) => ReactNode;
  align?: "left" | "right";
}
export interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly Column<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  caption: string;
  initialPageSize?: number;
  selection?: { ids: readonly string[]; onChange: (ids: string[]) => void };
  toolbar?: ReactNode;
  emptyMessage?: string;
}

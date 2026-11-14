import { expect, it } from "vitest";
import { deriveRows, pageRows, togglePageSelection } from "./model";
const rows = [
  { id: "a", name: "Item 10", price: 10 },
  { id: "b", name: "Item 2", price: 2 },
  { id: "c", name: "Empty", price: null },
];
const columns = [
  { id: "name", value: (row: (typeof rows)[number]) => row.name },
  { id: "price", value: (row: (typeof rows)[number]) => row.price },
];
it("sorts numbers numerically with missing values last in either direction", () => {
  expect(
    deriveRows(rows, columns, "", { id: "price", direction: "asc" }).map(
      (r) => r.id,
    ),
  ).toEqual(["b", "a", "c"]);
  expect(
    deriveRows(rows, columns, "", { id: "price", direction: "desc" }).map(
      (r) => r.id,
    ),
  ).toEqual(["a", "b", "c"]);
  expect(rows[0].id).toBe("a");
});
it("uses natural text sorting and case-insensitive search", () => {
  expect(
    deriveRows(rows, columns, "ITEM", { id: "name", direction: "asc" }).map(
      (r) => r.id,
    ),
  ).toEqual(["b", "a"]);
});
it("clamps pages when the dataset shrinks and handles empty data", () => {
  expect(pageRows(rows, 99, 2)).toMatchObject({
    page: 2,
    pages: 2,
    start: 3,
    end: 3,
  });
  expect(pageRows([], 3, 0)).toMatchObject({
    page: 1,
    pages: 1,
    start: 0,
    end: 0,
  });
});
it("changes only the current-page selection", () => {
  expect(togglePageSelection(["hidden", "a"], ["a", "b"], true)).toEqual([
    "hidden",
    "a",
    "b",
  ]);
  expect(togglePageSelection(["hidden", "a", "b"], ["a", "b"], false)).toEqual([
    "hidden",
  ]);
});
it("honors custom comparator and unsearchable columns", () => {
  expect(
    deriveRows(
      rows,
      [{ ...columns[0], compare: (a, b) => b.name.length - a.name.length }],
      "",
      { id: "name", direction: "asc" },
    )[0].id,
  ).toBe("a");
  expect(
    deriveRows(rows, [{ ...columns[0], searchable: false }], "Item", null),
  ).toEqual([]);
});

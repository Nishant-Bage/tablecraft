import { it, expect } from "vitest";
import { csvCell, exportCsv, initialProducts, stockStatus } from "./products";
it("escapes CSV quotes, newlines, and spreadsheet formulas", () => {
  expect(csvCell('a,"b"\nc')).toBe('"a,""b""\nc"');
  expect(csvCell(" =SUM(A1)")).toBe('"\' =SUM(A1)"');
  expect(exportCsv(initialProducts.slice(0, 1)).split("\r\n")).toHaveLength(2);
});
it("classifies zero, threshold, and healthy stock", () => {
  expect(stockStatus({ ...initialProducts[0], stock: 0 })).toBe("Out of stock");
  expect(stockStatus({ ...initialProducts[0], stock: 10, reorder: 10 })).toBe(
    "Low stock",
  );
  expect(stockStatus({ ...initialProducts[0], stock: 11, reorder: 10 })).toBe(
    "In stock",
  );
});

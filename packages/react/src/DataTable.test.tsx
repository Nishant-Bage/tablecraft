import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, it } from "vitest";
import { DataTable } from "./DataTable";
const data = [
  { id: "a", name: "Alpha", price: 10 },
  { id: "b", name: "Beta", price: 2 },
  { id: "c", name: "Gamma", price: 5 },
];
const columns = [
  {
    id: "name",
    header: "Name",
    value: (r: (typeof data)[number]) => r.name,
    hideable: false,
  },
  {
    id: "price",
    header: "Price",
    value: (r: (typeof data)[number]) => r.price,
  },
];
function Example() {
  const [ids, setIds] = useState<string[]>([]);
  return (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(r) => r.id}
      getRowLabel={(r) => r.name}
      caption="Products"
      initialPageSize={2}
      selection={{ ids, onChange: setIds }}
    />
  );
}
it("sorts by keyboard and exposes the active direction on one header", async () => {
  const user = userEvent.setup();
  render(<Example />);
  const sort = screen.getByRole("button", { name: "Price" });
  sort.focus();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("columnheader", { name: "Price" })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  expect(within(screen.getAllByRole("row")[1]).getByText("Beta")).toBeVisible();
  await user.keyboard(" ");
  expect(screen.getByRole("columnheader", { name: "Price" })).toHaveAttribute(
    "aria-sort",
    "descending",
  );
});
it("selects pages without clearing hidden selections and supports mixed state", async () => {
  const user = userEvent.setup();
  render(<Example />);
  await user.click(screen.getByLabelText("Select Alpha"));
  expect(screen.getByLabelText("Select current page")).toHaveProperty(
    "indeterminate",
    true,
  );
  await user.click(screen.getByLabelText("Select current page"));
  await user.click(screen.getByLabelText("Next page"));
  await user.click(screen.getByLabelText("Select Gamma"));
  expect(screen.getByText(/3 selected across/)).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Clear selection" }));
  expect(screen.getByLabelText("Select Gamma")).not.toBeChecked();
});
it("resets pagination when searching and reports a real empty state", async () => {
  const user = userEvent.setup();
  render(<Example />);
  await user.click(screen.getByLabelText("Next page"));
  await user.type(screen.getByRole("searchbox"), "Beta");
  expect(screen.getByText("Page 1 of 1")).toBeVisible();
  expect(screen.getByText("Beta")).toBeVisible();
  await user.type(screen.getByRole("searchbox"), "missing");
  expect(screen.getByText("No rows match your filters.")).toBeVisible();
  expect(screen.getByText("Showing 0–0 of 0 rows")).toBeVisible();
});
it("hides optional columns but retains the required column", async () => {
  const user = userEvent.setup();
  render(<Example />);
  await user.click(screen.getByText("Columns"));
  expect(screen.getByLabelText("Name", { selector: "input" })).toBeDisabled();
  await user.click(screen.getByLabelText("Price", { selector: "input" }));
  expect(
    screen.queryByRole("columnheader", { name: "Price" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("columnheader", { name: "Name" })).toBeVisible();
});

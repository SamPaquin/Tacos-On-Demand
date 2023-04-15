import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("subtotal starts at 0", async () => {
  const { unmount } = render(<Options optionType="meats" />);

  // make sure total starts out $0.00
  const meatsSubtotal = screen.getByText("Meats total: $", { exact: false });
  expect(meatsSubtotal).toHaveTextContent("0.00");

  // explicitly unmount component to trigger network call cancellation on cleanup
  // (necessary to avoid race condition if component unmounts when test function exits)
  unmount();
});

test("update meat subtotal when meats change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="meats" />);

  // make sure total starts out $0.00
  const meatsSubtotal = screen.getByText("Meats total: $", { exact: false });
  expect(meatsSubtotal).toHaveTextContent("0.00");

  // update beef meats to 1 and check the subtotal
  const beefInput = await screen.findByRole("spinbutton", {
    name: "Beef",
  });
  await user.clear(beefInput);
  await user.type(beefInput, "1");
  expect(meatsSubtotal).toHaveTextContent("2.00");

  // update chicken meats to 2 and check subtotal
  const chickenInput = await screen.findByRole("spinbutton", {
    name: "Chicken",
  });
  await user.clear(chickenInput);
  await user.type(chickenInput, "2");
  expect(meatsSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when toppings change", async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total starts out at $0.00
  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("0.00");

  // add cheese and check subtotal
  const cheeseCheckbox = await screen.findByRole("checkbox", {
    name: "Cheese",
  });
  await user.click(cheeseCheckbox);
  expect(toppingsTotal).toHaveTextContent(".25");

  // add sour cream and check subtotal
  const sourCreamCheckbox = screen.getByRole("checkbox", { name: "Sour Cream" });
  await user.click(sourCreamCheckbox);
  expect(toppingsTotal).toHaveTextContent(".50");

  // remove sour cream and check subtotal
  await user.click(sourCreamCheckbox);
  expect(toppingsTotal).toHaveTextContent(".25");
});

describe("grand total", () => {
  test("grand total updates properly if meat is added first", async () => {
    const user = userEvent.setup();

    // Test that the total starts out at $0.00
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("0.00");

    // update beef meats to 2 and check grand total
    const beefInput = await screen.findByRole("spinbutton", {
      name: "Beef",
    });
    await user.clear(beefInput);
    await user.type(beefInput, "2");
    expect(grandTotal).toHaveTextContent("4.00");

    // add cheese and check grand total
    const cheeseCheckbox = await screen.findByRole("checkbox", {
      name: "Cheese",
    });
    await user.click(cheeseCheckbox);
    expect(grandTotal).toHaveTextContent("4.25");
  });

  test("grand total updates properly if topping is added first", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });

    // add cheese and check grand total
    const cheeseCheckbox = await screen.findByRole("checkbox", {
      name: "Cheese",
    });
    await user.click(cheeseCheckbox);
    expect(grandTotal).toHaveTextContent(".25");

    // update beef meats to 2 and check grand total
    const beefInput = await screen.findByRole("spinbutton", {
      name: "Beef",
    });
    await user.clear(beefInput);
    await user.type(beefInput, "2");
    expect(grandTotal).toHaveTextContent("4.25");
  });

  test("grand total updates properly if item is removed", async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    // add cheese
    const cheeseCheckbox = await screen.findByRole("checkbox", {
      name: "Cheese",
    });
    await user.click(cheeseCheckbox);
    // grand total $.25

    // update beef tacos to 2; grand total should be $4.25
    const beefInput = await screen.findByRole("spinbutton", {
      name: "Beef",
    });
    await user.clear(beefInput);
    await user.type(beefInput, "2");

    // remove 1 beef taco and check grand total
    await user.clear(beefInput);
    await user.type(beefInput, "1");

    // check grand total
    const grandTotal = screen.getByRole("heading", { name: /Grand total: \$/ });
    expect(grandTotal).toHaveTextContent("2.25");

    // remove cheese and check grand total
    await user.click(cheeseCheckbox);
    expect(grandTotal).toHaveTextContent("1.00");
  });
});

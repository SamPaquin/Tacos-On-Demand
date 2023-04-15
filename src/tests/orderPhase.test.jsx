import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

test("Order phases for happy path", async () => {
  const user = userEvent.setup();
  // render app
  // Don't need to wrap in provider; already wrapped!
  const { unmount } = render(<App />);

  // add taco meats and toppings
  const beefInput = await screen.findByRole("spinbutton", {
    name: "Beef",
  });
  await user.clear(beefInput);
  await user.type(beefInput, "1");

  const chickenInput = screen.getByRole("spinbutton", { name: "Chicken" });
  await user.clear(chickenInput);
  await user.type(chickenInput, "2");

  const cheeseCheckbox = await screen.findByRole("checkbox", {
    name: "Cheese",
  });
  await user.click(cheeseCheckbox);

  // find and click order summary button
  const orderSummaryButton = screen.getByRole("button", {
    name: /submit order/i,
  });
  await user.click(orderSummaryButton);

  // check summary subtotals
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const meatsHeading = screen.getByRole("heading", { name: "Meats: $6.00" });
  expect(meatsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $0.25",
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items
  expect(screen.getByText("1 Beef")).toBeInTheDocument();
  expect(screen.getByText("2 Chicken")).toBeInTheDocument();
  expect(screen.getByText("Cheese")).toBeInTheDocument();

  // accept terms and click button
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // Expect "loading" to show
  const loading = screen.getByText(/loading/i);
  expect(loading).toBeInTheDocument();

  // check confirmation page text
  // this one is async because there is a POST request to server in between summary
  //    and confirmation pages
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // expect that loading has disappeared
  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // find and click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  await user.click(newOrderButton);

  // check that meats and toppings have been reset
  const meatsTotal = await screen.findByText("Meats total: $0.00");
  expect(meatsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  // explicitly unmount component to trigger network call cancellation on cleanup
  unmount();
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);

  // add taco meats but no toppings
  const beefInput = await screen.findByRole("spinbutton", {
    name: "Beef",
  });
  await user.clear(beefInput);
  await user.type(beefInput, "1");

  const chickenInput = screen.getByRole("spinbutton", { name: "Chicken" });
  await user.clear(chickenInput);
  await user.type(chickenInput, "2");

  // find and click order summary button
  const orderSummaryButton = screen.getByRole("button", {
    name: /submit order/i,
  });
  await user.click(orderSummaryButton);

  const meatsHeading = screen.getByRole("heading", { name: "Meats: $6.00" });
  expect(meatsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});

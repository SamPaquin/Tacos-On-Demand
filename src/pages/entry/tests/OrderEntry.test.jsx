import {
  render,
  screen,
  waitFor,
} from "../../../test-utils/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import userEvent from "@testing-library/user-event";

test("handles error for meats and toppings routes", async () => {
  server.resetHandlers(
    rest.get("http://localhost:3030/meats", (req, res, ctx) =>
      res(ctx.status(500))
    ),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderEntry setOrderPhase={jest.fn()} />);

  await waitFor(async () => {
    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("disable order button if there are no meats ordered", async () => {
  const user = userEvent.setup();
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  // order button should be disabled at first, even before options load
  const orderButton = screen.getByRole("button", { name: /submit order/i });
  expect(orderButton).toBeDisabled();

  // expect button to be enabled after adding meat
  const beefInput = await screen.findByRole("spinbutton", {
    name: "Beef",
  });
  await user.clear(beefInput);
  await user.type(beefInput, "1");
  expect(orderButton).toBeEnabled();

  // expect button to be disabled again after removing meat
  await user.clear(beefInput);
  await user.type(beefInput, "0");
  expect(orderButton).toBeDisabled();
});

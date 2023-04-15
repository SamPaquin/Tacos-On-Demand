import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

test("displays image for each meat option from server", async () => {
  render(<Options optionType="meats" />);

  // find images
  const meatImages = await screen.findAllByRole("img", { name: /meat$/i });
  expect(meatImages).toHaveLength(2);

  // confirm alt text of images
  // @ts-ignore
  const altText = meatImages.map((element) => element.alt);
  expect(altText).toEqual(["Chicken meat", "Beef meat"]);
});

test("Displays image for each toppings option from server", async () => {
  // Mock Service Worker will return three toppings from server
  render(<Options optionType="toppings" />);

  // find images, expect 3 based on what msw returns
  const images = await screen.findAllByRole("img", { name: /topping$/i });
  expect(images).toHaveLength(3);

  // check the actual alt text for the images
  // @ts-ignore
  const imageTitles = images.map((img) => img.alt);
  expect(imageTitles).toEqual([
    "Cheese topping",
    "Sour Cream topping",
    "Olives topping",
  ]);
});

test("don't update total if meats input is invalid", async () => {
  const user = userEvent.setup();
  render(<Options optionType="meats" />);

  // wait for the beefInput to appear after the server call
  const beefInput = await screen.findByRole("spinbutton", {
    name: "Beef",
  });

  // find the meats subtotal, which starts out at 0
  const meatsSubtotal = screen.getByText("Meats total: $0.00");

  // clear the input
  await user.clear(beefInput);

  // .type() will type one character at a time
  await user.type(beefInput, "2.5");

  // make sure meats subtotal hasn't updated
  expect(meatsSubtotal).toHaveTextContent("$0.00");

  // do the same test for "100"
  await user.clear(beefInput);
  await user.type(beefInput, "100");
  expect(meatsSubtotal).toHaveTextContent("$0.00");

  // do the same test for "-1"
  await user.clear(beefInput);
  await user.type(beefInput, "-1");
  expect(meatsSubtotal).toHaveTextContent("$0.00");
});

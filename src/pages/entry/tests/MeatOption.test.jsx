import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import MeatOption from "../MeatOption";

test("indicate if meat count is non-int or out of range", async () => {
  const user = userEvent.setup();
  render(<MeatOption />);

  // expect input to be invalid with negative number
  const beefInput = screen.getByRole("spinbutton");
  await user.clear(beefInput);
  await user.type(beefInput, "-1");
  expect(beefInput).toHaveClass("is-invalid");

  // replace with decimal input
  await user.clear(beefInput);
  await user.type(beefInput, "2.5");
  expect(beefInput).toHaveClass("is-invalid");

  // replace with input that's too high
  await user.clear(beefInput);
  await user.type(beefInput, "11");
  expect(beefInput).toHaveClass("is-invalid");

  // replace with valid input
  // note: here we're testing our validation rules (namely that the input can display as valid)
  // and not react-bootstrap's response
  await user.clear(beefInput);
  await user.type(beefInput, "3");
  expect(beefInput).not.toHaveClass("is-invalid");
});

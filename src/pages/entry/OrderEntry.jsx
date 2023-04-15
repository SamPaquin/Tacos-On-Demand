import Button from "react-bootstrap/Button";
import Options from "./Options";
import { useOrderDetails } from "../../contexts/OrderDetails";
import { formatCurrency } from "../../utilities";

export default function OrderEntry({ setOrderPhase }) {
  const { totals } = useOrderDetails();

  // disable order button if there aren't any meats in order
  const orderDisabled = totals.meats === 0;

  return (
    <div>
      <h1>Build Your Taco!</h1>
      <Options optionType="meats" />
      <Options optionType="toppings" />
      <h2>Grand total: {formatCurrency(totals.meats + totals.toppings)}</h2>
      <Button disabled={orderDisabled} onClick={() => setOrderPhase("review")}>
        Submit Order
      </Button>
    </div>
  );
}

import { rest } from "msw";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const handlers = [
  rest.get("http://localhost:3030/meats", async (req, res, ctx) => {
    await sleep(800);
    return res(
      ctx.json([
        { name: "Chicken", imagePath: "/images/chicken.png" },
        { name: "Beef", imagePath: "/images/beef.png" },
      ])
    );
  }),
  rest.get("http://localhost:3030/toppings", (req, res, ctx) => {
    return res(
      ctx.json([
        { name: "Cheese", imagePath: "/images/cheese.jpg" },
        { name: "Sour Cream", imagePath: "/images/sour-cream.jpg" },
        { name: "Olives", imagePath: "/images/olives.jpg" },
      ])
    );
  }),
  rest.post("http://localhost:3030/order", async (req, res, ctx) => {
    // add a 100ms pause here to give jest a chance to see the "loading" state.
    // See https://www.udemy.com/course/react-testing-library/learn/lecture/36703860
    //   for more details.
    await sleep(100);
    return res(ctx.json({ orderNumber: 123455676 }));
  }),
];

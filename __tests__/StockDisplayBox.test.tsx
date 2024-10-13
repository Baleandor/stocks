import { render, screen } from "@testing-library/react";
import StockDisplayBox from "~/components/StockDisplayBox";
import type { StockSliceType } from "~/utils/types";


// Mock data for a stock
const mockStock: StockSliceType = {
  name: "Apple Inc.",
  symbol: "AAPL",
  price: 145.09,
  changePercent: 1.25,
};

describe("StockDisplayBox component", () => {
  it("renders the stock name", () => {
    render(<StockDisplayBox stock={mockStock} />); // ARRANGE

    const nameElement = screen.getByText("Apple Inc."); // ACT

    expect(nameElement).toBeInTheDocument(); // ASSERT
  });

  it("renders the stock symbol", () => {
    render(<StockDisplayBox stock={mockStock} />); // ARRANGE

    const symbolElement = screen.getByText("AAPL"); // ACT

    expect(symbolElement).toBeInTheDocument(); // ASSERT
  });

  it("renders the stock price", () => {
    render(<StockDisplayBox stock={mockStock} />); // ARRANGE

    const priceElement = screen.getByText("145.09"); // ACT

    expect(priceElement).toBeInTheDocument(); // ASSERT
  });

  it("renders the daily percentage change", () => {
    render(<StockDisplayBox stock={mockStock} />); // ARRANGE

    const changePercentElement = screen.getByText("1.25%"); // ACT

    expect(changePercentElement).toBeInTheDocument(); // ASSERT
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<StockDisplayBox stock={mockStock} />); // ARRANGE

    expect(asFragment()).toMatchSnapshot(); // ACT
  });
});

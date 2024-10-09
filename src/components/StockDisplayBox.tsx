import { StockSliceType } from "~/utils/types";

export default function StockDisplayBox({ stock }: { stock: StockSliceType }) {
  return (
    <div className="border border-green-400 p-2 rounded-lg">
      <div>
        <span>Name:</span>
        <span>{stock.name}</span>
      </div>
      <div>
        <span>Symbol:</span>
        <span>{stock.symbol}</span>
      </div>
      <div>
        <span>Current Price:</span>
        <span>{stock.price}</span>
      </div>
      <div>
        <span>Daily Percentage Change:</span>
        <span>{stock.changePercent}</span>
      </div>
    </div>
  );
}

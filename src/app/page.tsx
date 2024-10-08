import StockDisplayBox from "~/components/StockDisplayBox";
import { CHOSEN_STOCKS } from "~/constants/chosenStocks";
import { getStock } from "~/utils/api";

export default function HomePage() {




  return (
    <main className="flex flex-col items-center justify-center p-3">
      <div className="grid grid-cols-4 gap-4">
        {CHOSEN_STOCKS.map((stock) => {
          const currentStock = getStock(stock);
          return (
            <StockDisplayBox
              key={currentStock.price}
              stock={currentStock}
            />
          );
        })}
      </div>
    </main>
  );
}

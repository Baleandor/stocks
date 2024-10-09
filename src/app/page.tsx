"use client";

import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import StockDisplayBox from "~/components/StockDisplayBox";
import { CHOSEN_STOCKS } from "~/constants/chosenStocks";
import { addStock } from "~/store/stock-slice";
import { AppDispatch } from "~/store/store";
import { getStock } from "~/utils/api";
import ErrorBox from "~/components/ErrorBox";
import LoadingSpinner from "~/components/LoadingSpinner";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);

    CHOSEN_STOCKS.map((stock: string[]) => {
      const currentStock = getStock(stock[0]);

      if (typeof currentStock === "string") {
        setError(currentStock);
      } else if (!Number(currentStock["05. price"])) {
        setError(
          "Data failed to load due to Alpha Vantage calls limit being reached!",
        );
      } else {
        const currentStockToAdd = {
          name: stock[1],
          symbol: currentStock["01. symbol"],
          price: Number(currentStock["05. price"]),
          changePercent: Number(currentStock["10. change percent"]),
        };

        dispatch(addStock(currentStockToAdd));
      }

      setIsLoading(false);
    });
  }, []);

  const stocksState = useSelector((state: RootState) => state.stocks.stocks);

  return (
    <main className="p-3">
      {error.length > 0 ? <ErrorBox errorMessage={error} /> : null}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {stocksState.map((stockInReduxState) => {
            return (
              <StockDisplayBox
                key={stockInReduxState.price}
                stock={stockInReduxState}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

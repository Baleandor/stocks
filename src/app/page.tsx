"use client";

import { useEffect, useState } from "react";
import type { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import StockDisplayBox from "~/components/StockDisplayBox";
import { CHOSEN_STOCKS } from "~/constants/chosenStocks";
import {
  getAllStocks,
  getStocksError,
  getStocksStatus,
  fetchAStockName,
  fetchDailyStockData,
} from "~/store/stock-slice";
import type { AppDispatch } from "~/store/store";

import ErrorBox from "~/components/ErrorBox";
import LoadingSpinner from "~/components/LoadingSpinner";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();

  const stocksState = useSelector(getAllStocks);
  const stockStatus = useSelector(getStocksStatus);
  const stockError = useSelector(getStocksError);

  useEffect(() => {
    CHOSEN_STOCKS.forEach((stock: string) => {
      dispatch(fetchDailyStockData(stock)).then(() =>
        dispatch(fetchAStockName(stock)),
      );
    });
  }, [dispatch]);

  return (
    <main className="p-3">
      {stockError && <ErrorBox errorMessage={stockError} />}

      {stockStatus === "loading" && <LoadingSpinner />}

      {stockStatus === "succeeded" && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {stocksState.map((stockInReduxState) => {
            return (
              <StockDisplayBox
                key={stockInReduxState.symbol}
                stock={stockInReduxState}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}

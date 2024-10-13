"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  StockNameType,
  StockDailyDataType,
  StockSliceType,
  AxiosStockNameReponse,
  AxiosStockDataResponse,
} from "~/utils/types";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type { RootState } from "./store";
import { BASE_URL } from "~/constants/baseUrl";
import { STOCKS_API_KEY } from "~/constants/stocksKey";

import bestMatches from "../mockJsons/namesJsons.json" assert { type: "json" };
import stockNumbers from "../mockJsons/numbersJsons.json" assert { type: "json" };

type StockStoreState = {
  stocks: StockSliceType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string[];
};

const initialState: StockStoreState = {
  stocks: [],
  status: "idle",
  error: [],
};

export const fetchDailyStockData = createAsyncThunk(
  "stocks/fetchAStockNumbers",
  async (symbol: string | undefined) => {
    try {
      await axios
        .get(`${BASE_URL}&symbol=${symbol}`)
        .then((response: AxiosResponse<AxiosStockDataResponse>) => {
          if (response.data["Global Quote"] === undefined) {
            return new Error("Exceeded daily calls limit for stock data!");
          } else {
            return response.data["Global Quote"];
          }
        });

      // fallback test code for when daily calls are exceeded
      // const response: StockDailyDataType[] = stockNumbers["Global Quote"];
      // const wantedStock = response.find(
      //   (stock) => stock["01. symbol"] === symbol,
      // );
      // return wantedStock;
    } catch (error: any) {
      return error.message;
    }
  },
);

export const fetchAStockName = createAsyncThunk(
  "stocks/fetchAStockName",
  async (symbol: string | undefined) => {
    try {
      await axios
        .get(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${STOCKS_API_KEY}`,
        )
        .then((response: AxiosResponse<AxiosStockNameReponse>) => {
          if (response.data.bestMatches === undefined) {
            return new Error("Exceeded daily calls limit!");
          } else {
            response.data.bestMatches.forEach((match: StockNameType) => {
              if (match["1. symbol"] === symbol) {
                return match;
              }
            });
          }
        });

      // fallback test code for when daily calls are exceeded
      // const response = bestMatches.bestMatches;
      // const wantedStock = response.find(
      //   (stock) => stock["1. symbol"] === symbol,
      // );
      // return wantedStock;
    } catch (err: any) {
      return err.message;
    }
  },
);

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    // REDUCER TO HANDLE MATCHING STOCK LOGIC AND UPDATING

    updateStock: (state, action: PayloadAction<StockNameType>) => {
      console.log("state:", state, "action:", action);
      state.stocks = state.stocks.map((stock) =>
        stock.symbol === action.payload["1. symbol"]
          ? { ...stock, name: action.payload["2. name"] }
          : stock,
      );
    },
  },
  extraReducers(builder) {
    //fetch stock numbers and symbol
    builder.addCase(fetchDailyStockData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      fetchDailyStockData.fulfilled,
      (state, action: PayloadAction<StockDailyDataType>) => {
        if (action.payload == undefined) {
          state.status = "failed";
          if (
            !state.error.includes("Exceeded daily calls limit for stock data!")
          ) {
            state.error = [
              ...state.error,
              "Exceeded daily calls limit for stock data!",
            ];
          }
          return;
        }
        state.status = "succeeded";

        const newStock = {
          name: "",
          symbol: action.payload["01. symbol"],
          price: Number(action.payload["05. price"]),
          changePercent: parseFloat(action.payload["10. change percent"]),
        };

        state.stocks = [...state.stocks, newStock];
      },
    );
    builder.addCase(fetchDailyStockData.rejected, (state, action) => {
      state.status = "failed";
      if (action.error.message)
        state.error = [...state.error, action.error.message];
    });
    //fetch stock name
    builder.addCase(fetchAStockName.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      fetchAStockName.fulfilled,
      (state, action: PayloadAction<StockNameType>) => {
        if (action.payload == undefined) {
          state.status = "failed";
          if (
            !state.error.includes("Exceeded daily calls limit for stock name!")
          ) {
            state.error = [
              ...state.error,
              "Exceeded daily calls limit for stock name!",
            ];
          }
          return;
        }
        state.status = "succeeded";

        stockSlice.caseReducers.updateStock(state, action);
      },
    );
    builder.addCase(fetchAStockName.rejected, (state, action) => {
      state.status = "failed";
      if (action.error.message)
        state.error = [...state.error, action.error.message];
    });
  },
});

export const getStockState = (state: RootState) => state.stocks;
export const getAllStocks = (state: RootState) => getStockState(state).stocks;
export const getStocksStatus = (state: RootState) =>
  getStockState(state).status;
export const getStocksError = (state: RootState) => getStockState(state).error;

export const { updateStock } = stockSlice.actions;
export default stockSlice.reducer;

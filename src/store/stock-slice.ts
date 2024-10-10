"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  StockNameType,
  StockNumberType,
  StockSliceType,
} from "~/utils/types";
import axios from "axios";

import bestMatches from "../mockJsons/namesJsons.json" assert { type: "json" };
import stockNumbers from "../mockJsons/numbersJsons.json" assert { type: "json" };
import type { RootState } from "./store";

type StockStoreState = {
  stocks: StockSliceType[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: StockStoreState = {
  stocks: [],
  status: "idle",
  error: null,
};

export const fetchDailyStockData = createAsyncThunk(
  "stocks/fetchAStockNumbers",
  async (symbol: string | undefined) => {
    try {
      const response: StockNumberType[] = stockNumbers["Global Quote"];

      const wantedStock = response.find(
        (stock) => stock["01. symbol"] === symbol,
      );

      return wantedStock;
    } catch (error) {
      return error.message;
    }
  },
);

export const fetchAStockName = createAsyncThunk(
  "stocks/fetchAStockName",
  async (symbol: string | undefined) => {
    try {
      //  const response = await axios.get(BASE_URL);

      const response = bestMatches.bestMatches;

      const wantedStock = response.find(
        (stock) => stock["1. symbol"] === symbol,
      );

      return wantedStock;
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
      const stocktoUpdate = state.stocks.find(
        (stock) => stock.symbol === action.payload["1. symbol"],
      );

      if (stocktoUpdate) {
        stocktoUpdate.name = action.payload["2. name"];
      }
    },
  },
  extraReducers(builder) {
    //fetch stock numbers and symbol
    builder.addCase(fetchDailyStockData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      fetchDailyStockData.fulfilled,
      (state, action: PayloadAction<StockNumberType>) => {
        state.status = "succeeded";

        //remember to add back in ["Global Quote"]
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
      state.error = action.error.message ?? null;
    });
    //fetch stock name
    builder.addCase(fetchAStockName.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchAStockName.fulfilled, (state, action) => {
      state.status = "succeeded";

      stockSlice.caseReducers.updateStock(state, action);
    });
    builder.addCase(fetchAStockName.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message ?? null;
    });
  },
});

export const getStockState = (state: RootState) => state.stocks;

export const getAllStocks = (state: RootState) => getStockState(state).stocks;
export const getStocksStatus = (state: RootState) =>
  getStockState(state).status;
export const getStocksError = (state: RootState) => getStockState(state).error;

export default stockSlice.reducer;

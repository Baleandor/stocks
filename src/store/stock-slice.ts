"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StockSliceType } from "~/utils/types";

interface StockState {
  stocks: StockSliceType[];
}

const initialState: StockState = { stocks: [] };

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock: (state, action: PayloadAction<StockSliceType>) => {
      const newStock = {
        name: action.payload.name,
        symbol: action.payload.symbol,
        price: action.payload.price,
        changePercent: action.payload.changePercent,
      };

      state.stocks.push(newStock);
    },
  },
});

export const { addStock } = stockSlice.actions;
export default stockSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { StockSliceType } from "~/utils/types";

interface StockState {
  stocks: StockSliceType[];
}

const initialState: StockState = { stocks: [] };

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    addStock: () => {},
  },
});

export const { addStock } = stockSlice.actions;
export default stockSlice.reducer;

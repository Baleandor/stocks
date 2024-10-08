"use client";
import { configureStore } from "@reduxjs/toolkit";
import stocksReducer from "./stock-slice";

export const makeStore = () =>
  configureStore({
    reducer: {
      stocks: stocksReducer,
    },
  });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

import axios, { AxiosError } from "axios";

import { STOCKS_API_KEY } from "~/constants/stocksKey";
import { StockSliceType } from "./types";

export const getStock = (symbol: string) =>
  axios
    .get<StockSliceType>(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCKS_API_KEY}`,
    )
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        console.log("Error message: ", error.message);
      } else {
        console.log("Unexepcted error!", error);
      }
    });

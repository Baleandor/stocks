import axios, { AxiosError } from "axios";

import { STOCKS_API_KEY } from "~/constants/stocksKey";

export const getStock = (symbol: string) =>
  axios
    .get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCKS_API_KEY}`,
    )
    .catch((error: Error | AxiosError) => console.log(error.message));

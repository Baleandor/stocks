import axios from "axios";

import { STOCKS_API_KEY } from "~/constants/stocksKey";

export const getStock = async (symbol: string | undefined) =>
  await axios
    .get(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCKS_API_KEY}`,
    )
    .catch((error) => {
      if (axios.isAxiosError(error)) {
        return error.message;
      } else {
        return error;
      }
    })
    .then((res) => res.data["Global Quote"]);

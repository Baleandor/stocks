import { configureStore } from "@reduxjs/toolkit";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { BASE_URL } from "~/constants/baseUrl";
import { STOCKS_API_KEY } from "~/constants/stocksKey";
import stockReducer, {
  fetchDailyStockData,
  fetchAStockName,
} from "~/store/stock-slice";
import { updateStock } from "~/store/stock-slice";
import type { AppStore } from "~/store/store";

describe("Stock Slice", () => {
  const mock = new MockAdapter(axios);
  let store: AppStore;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        stocks: stockReducer,
      },
    });
    mock.reset();
  });

  it("should return the initial state", () => {
    const initialState = {
      stocks: [],
      status: "idle",
      error: [],
    };
    expect(store.getState().stocks).toEqual(initialState);
  });

  it("should handle updateStock", async () => {
    const stockSymbolData = "AAPL";
    const mockResponseData = {
      "01. symbol": "AAPL",
      "02. open": "229.2000",
      "03. high": "234.9500",
      "04. low": "228.5000",
      "05. price": "234.3000",
      "06. volume": "5083566",
      "07. latest trading day": "2024-10-09",
      "08. previous close": "228.6200",
      "09. change": "5.6800",
      "10. change percent": "2.4845%",
    };

    mock
      .onGet(`${BASE_URL}&symbol=${stockSymbolData}`)
      .reply(200, { "Global Quote": mockResponseData });

    await store.dispatch(fetchDailyStockData(stockSymbolData));

    const stockSymbolName = "AAPL";
    const mockResponseName = {
      "1. symbol": "AAPL",
      "2. name": "Apple",
      "3. type": "Equity",
      "4. region": "United States",
      "5. marketOpen": "09:30",
      "6. marketClose": "16:00",
      "7. timezone": "UTC-04",
      "8. currency": "USD",
      "9. matchScore": "1.0000",
    };

    mock
      .onGet(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbolName}&apikey=${STOCKS_API_KEY}`,
      )
      .reply(200, mockResponseName);

    await store.dispatch(fetchAStockName(stockSymbolName));

    store.dispatch(updateStock(mockResponseName));

    const expectedState = {
      stocks: [
        {
          name: "Apple",
          symbol: "AAPL",
          price: 234.3,
          changePercent: 2.4845,
        },
      ],
      status: "succeeded",
      error: [],
    };

    expect(store.getState().stocks).toEqual(expectedState);
  });

  describe("async actions", () => {
    it("should handle fetchDailyStockData fulfilled", async () => {
      const stockSymbol = "AAPL";
      const mockResponse = {
        "01. symbol": "AAPL",
        "02. open": "229.2000",
        "03. high": "234.9500",
        "04. low": "228.5000",
        "05. price": "234.3000",
        "06. volume": "5083566",
        "07. latest trading day": "2024-10-09",
        "08. previous close": "228.6200",
        "09. change": "5.6800",
        "10. change percent": "2.4845%",
      };

      mock
        .onGet(`${BASE_URL}&symbol=${stockSymbol}`)
        .reply(200, { "Global Quote": mockResponse });

      await store.dispatch(fetchDailyStockData(stockSymbol));

      const expectedState = {
        stocks: [
          {
            name: "",
            symbol: "AAPL",
            price: 150,
            changePercent: 1.2,
          },
        ],
        status: "succeeded",
        error: [],
      };
      expect(store.getState().stocks).toEqual(expectedState);
    });

    it("should handle fetchDailyStockData rejected", async () => {
      const stockSymbol = "AAPL";
      mock.onGet(`${BASE_URL}&symbol=${stockSymbol}`).reply(500);

      await store.dispatch(fetchDailyStockData(stockSymbol));

      const expectedState = {
        stocks: [],
        status: "failed",
        error: ["Exceeded daily calls limit for stock data!"],
      };
      expect(store.getState().stocks).toEqual(expectedState);
    });

    it("should handle fetchAStockName fulfilled", async () => {
      const stockSymbol = "AAPL";
      const mockResponse = {
        "1. symbol": "AAPL",
        "2. name": "Apple",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      };

      mock
        .onGet(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${STOCKS_API_KEY}`,
        )
        .reply(200, mockResponse);

      await store.dispatch(fetchAStockName(stockSymbol));

      const expectedState = {
        stocks: [],
        status: "succeeded",
        error: [],
      };
      expect(store.getState().stocks).toEqual(expectedState);
    });

    it("should handle fetchAStockName rejected", async () => {
      const stockSymbol = "AAPL";
      mock
        .onGet(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockSymbol}&apikey=${STOCKS_API_KEY}`,
        )
        .reply(404);

      await store.dispatch(fetchAStockName(stockSymbol));

      const expectedState = {
        stocks: [],
        status: "failed",
        error: ["Exceeded daily calls limit!"],
      };
      expect(store.getState().stocks).toEqual(expectedState);
    });
  });
});

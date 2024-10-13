// HomePage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store'; // Mock Redux store
import thunk from 'redux-thunk';
import HomePage from '~/app/page'; // Adjust the path as necessary
import { CHOSEN_STOCKS } from '~/constants/chosenStocks';
import { fetchAStockName, fetchDailyStockData } from '~/store/stock-slice';
import StockDisplayBox from '~/components/StockDisplayBox';
import ErrorBox from '~/components/ErrorBox';
import LoadingSpinner from '~/components/LoadingSpinner';

// Mock modules
jest.mock('~/components/StockDisplayBox');
jest.mock('~/components/ErrorBox');
jest.mock('~/components/LoadingSpinner');
jest.mock('~/store/stock-slice', () => ({
  fetchAStockName: jest.fn(),
  fetchDailyStockData: jest.fn(),
  getAllStocks: jest.fn(),
  getStocksError: jest.fn(),
  getStocksStatus: jest.fn(),
}));

// Mock StockDisplayBox to return a simple JSX for testing
StockDisplayBox.mockImplementation(({ stock }) => (
  <div data-testid="mock-stock">{stock.name}</div>
));

// Mock ErrorBox and LoadingSpinner similarly
ErrorBox.mockImplementation(({ errorMessage }) => (
  <div data-testid="mock-error">{errorMessage}</div>
));

LoadingSpinner.mockImplementation(() => <div data-testid="mock-spinner">Loading...</div>);

const mockStore = configureStore([thunk]);

describe('HomePage component', () => {
  let store: any;

  beforeEach(() => {
    // Initial Redux state mock
    store = mockStore({
      stocks: {
        stocks: [], // Empty stocks initially
        status: 'idle',
        error: [],
      },
    });

    jest.clearAllMocks(); // Clear all mocks before each test
  });

  it('dispatches fetch actions on mount', async () => {
    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Ensure dispatching of fetch actions for each stock in CHOSEN_STOCKS
    await waitFor(() => {
      CHOSEN_STOCKS.forEach((stock) => {
        expect(fetchDailyStockData).toHaveBeenCalledWith(stock);
        expect(fetchAStockName).toHaveBeenCalledWith(stock);
      });
    });
  });

  it('shows loading spinner when loading', () => {
    // Mock Redux state with loading status
    store = mockStore({
      stocks: {
        stocks: [],
        status: 'loading',
        error: [],
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Assert that the loading spinner is displayed
    expect(screen.getByTestId('mock-spinner')).toBeInTheDocument();
  });

  it('displays stocks when data is successfully fetched', () => {
    // Mock Redux state with fetched stock data
    const mockStockData = [
      { name: 'Apple', symbol: 'AAPL', price: 145, changePercent: 1.5 },
      { name: 'Microsoft', symbol: 'MSFT', price: 250, changePercent: 0.8 },
    ];

    store = mockStore({
      stocks: {
        stocks: mockStockData,
        status: 'succeeded',
        error: [],
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Check if the stocks are displayed
    mockStockData.forEach((stock) => {
      expect(screen.getByTestId('mock-stock')).toHaveTextContent(stock.name);
    });
  });

  it('displays error messages when there are errors', () => {
    // Mock Redux state with errors
    const mockErrors = ['Error fetching Apple stock', 'Error fetching Microsoft stock'];

    store = mockStore({
      stocks: {
        stocks: [],
        status: 'failed',
        error: mockErrors,
      },
    });

    render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    // Check if error messages are displayed
    mockErrors.forEach((error) => {
      expect(screen.getByTestId('mock-error')).toHaveTextContent(error);
    });
  });

  it('matches snapshot', () => {
    store = mockStore({
      stocks: {
        stocks: [],
        status: 'loading',
        error: [],
      },
    });

    const { asFragment } = render(
      <Provider store={store}>
        <HomePage />
      </Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});

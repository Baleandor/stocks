import { render, screen } from "@testing-library/react";
import LoadingSpinner from "~/components/LoadingSpinner";


jest.mock("../LoadingSpinner.module.css", () => ({
  "animate-spin": "mocked-animate-spin", // Mock class for animation
}));

describe("LoadingSpinner component", () => {
  it("renders the loading spinner", () => {
   
    render(<LoadingSpinner />); // ARRANGE

  
    const spinnerElement = screen.getByTestId("spinner-svg"); // ACT

    expect(spinnerElement).toBeInTheDocument(); // ASSERT

   
    expect(spinnerElement).toHaveClass(
      "mr-3 h-5 w-5 animate-spin text-white",
    );
  });

  it('renders the "Processing..." text', () => {
   
    render(<LoadingSpinner />); // ARRANGE

   
    const textElement = screen.getByText("Processing..."); // ACT

  
    expect(textElement).toBeInTheDocument(); // ASSERT

   
    expect(textElement).toHaveClass("text-2xl");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<LoadingSpinner />); // ARRANGE

  
    expect(asFragment()).toMatchSnapshot(); // ASSERT
  });
});

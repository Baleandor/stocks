import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("Header component", () => {
  it("renders the header text", () => {
    render(<Header />); // ARRANGE

    const headerElement = screen.getByText("Stock Market Dashboard"); // ACT

    expect(headerElement).toBeInTheDocument(); // ASSERT

    expect(headerElement).toHaveClass("bg-none text-center text-4xl pt-3");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Header />); // ARRANGE

    expect(asFragment()).toMatchSnapshot(); // ASSERT
  });
});

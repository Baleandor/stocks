import { render, screen } from "@testing-library/react";
import ErrorBox from "~/components/ErrorBox";

describe("ErrorBox component", () => {
  it("renders the error message", () => {
    const testMessage = "This is an error!";

    render(<ErrorBox errorMessage={testMessage} />); // ARRANGE

    const errorElement = screen.getByText(testMessage); // ACT

    expect(errorElement).toBeInTheDocument(); // ASSERT

    expect(errorElement).toHaveClass("text-4xl text-red-700");
  });

  it("matches snapshot", () => {
    const { asFragment } = render(
      <ErrorBox errorMessage="Snapshot error message" />, // ARRANGE
    );

    expect(asFragment()).toMatchSnapshot(); // ASSERT
  });
});

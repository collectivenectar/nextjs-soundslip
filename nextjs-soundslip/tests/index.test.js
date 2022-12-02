import Home from '../pages/index';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from "@testing-library/react";

describe("Nextjs Template Page", () => {
    it("renders the stock home page", () => {
        render(<Home />);
        // Checks that all components are rendered
        expect(screen.getByTestId("create-next-app")).toBeInTheDocument();
    });
});
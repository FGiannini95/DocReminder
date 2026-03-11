import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

// Fake JWT with email payload for testing
const fakeToken = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ userId: 1, email: "fede@gmail.com" }))}.test`;
vi.mocked(axios.post).mockResolvedValue({ data: { newAccessToken: fakeToken } });

import { HomeHeader } from "./HomeHeader";

const renderHomeHeader = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <HomeHeader />
      </MemoryRouter>
    </AuthProvider>
  );

describe("HomeHeader", () => {
  it("renders without crashing", () => {
    renderHomeHeader();
  });

  it("displays email prefix", async () => {
    renderHomeHeader();
    expect(await screen.findByText("Hola fede")).toBeInTheDocument();
  });
});

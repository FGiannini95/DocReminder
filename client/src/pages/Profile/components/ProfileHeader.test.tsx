import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "@/context";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

// Fake JWT with email payload for testing
const fakeTokenWithName = `eyJhbGciOiJIUzI1NiJ9.${btoa(JSON.stringify({ userId: 1, email: "fede@gmail.com", displayName: "Federico" }))}.test`;
vi.mocked(axios.post).mockResolvedValue({ data: { newAccessToken: fakeTokenWithName } });

import { ProfileHeader } from "./ProfileHeader";

const renderProfileHeader = () =>
  render(
    <AuthProvider>
      <MemoryRouter>
        <ProfileHeader />
      </MemoryRouter>
    </AuthProvider>
  );

describe("ProfileHeader", () => {
  it("renders without crashing", () => {
    renderProfileHeader();
  });

  it("displays email prefix", async () => {
    renderProfileHeader();
    expect((await screen.findAllByText(/fede/i)).length).toBeGreaterThan(0);
  });

  it("displays displayName when available", async () => {
    vi.mocked(axios.post).mockResolvedValue({ data: { newAccessToken: fakeTokenWithName } });
    renderProfileHeader();
    expect(await screen.findByText("Federico")).toBeInTheDocument();
  });

  it("displays Avatar with initial", async () => {
    renderProfileHeader();
    expect(await screen.findByText("F")).toBeInTheDocument();
  });
});

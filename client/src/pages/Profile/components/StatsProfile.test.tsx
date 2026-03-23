import { render, screen } from "@testing-library/react";

import { StatsProfile } from "./StatsProfile";

const renderStatsProfile = () => render(<StatsProfile totalDocuments={5} totalGroups={2} />);

describe("StatsProfile", () => {
  it("renders without crashing", () => {
    renderStatsProfile();
  });

  it("displays correct count", async () => {
    renderStatsProfile();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders two labels", () => {
    renderStatsProfile();
    expect(screen.getByText("Documentos")).toBeInTheDocument();
    expect(screen.getByText("Grupos")).toBeInTheDocument();
  });
});

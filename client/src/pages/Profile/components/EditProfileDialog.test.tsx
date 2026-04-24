import { AuthProvider } from "@/context";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axiosInstance } from "@/api/axiosInstance";

import { EditProfileDialog } from "./EditProfileDialog";

const onClose = vi.fn();

const renderEditProfileDIalog = () =>
  render(
    <AuthProvider>
      <EditProfileDialog open={true} onClose={onClose} />
    </AuthProvider>
  );

describe("EditProfileDialog", () => {
  it("renders without crashing", () => {
    renderEditProfileDIalog();
  });

  it("renders back button", async () => {
    renderEditProfileDIalog();
    expect(await screen.findByRole("button", { name: /volver/i })).toBeInTheDocument();
  });

  it("calls onClose when Volver is clicked", async () => {
    const user = userEvent.setup();
    renderEditProfileDIalog();

    await user.click(await screen.findByRole("button", { name: /volver/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders edit button", async () => {
    renderEditProfileDIalog();
    expect(await screen.findByRole("button", { name: /modificar/i })).toBeInTheDocument();
  });

  it("calls api on successful submit", async () => {
    vi.mocked(axiosInstance.put).mockResolvedValue({});
    const user = userEvent.setup();
    renderEditProfileDIalog();

    await user.type(screen.getByLabelText(/Nombre/i), "ab");
    await user.click(screen.getByRole("button", { name: /modificar/i }));

    expect(axiosInstance.put).toHaveBeenCalled();
  });
});

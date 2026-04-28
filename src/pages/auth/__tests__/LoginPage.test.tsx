import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "../LoginPage";

type LoginMutationMock = {
  mutate: jest.Mock;
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

let wrapper: RenderResult | null = null;
let loginMutation: LoginMutationMock | null = null;
const mockNavigate = jest.fn();

function createDefaultLoginMutation(): LoginMutationMock {
  return {
    mutate: jest.fn(),
    isPending: false,
    isError: false,
    error: null,
  };
}

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom") as Record<string, unknown>;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("../../../hooks/useAuthMutations", () => ({
  useLoginMutation: () => loginMutation,
  getAuthErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : "Request failed",
}));

function renderComponent() {
  return render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    loginMutation = createDefaultLoginMutation();
    mockNavigate.mockReset();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = null;
    }
    cleanup();
  });

  it("Mounts", () => {
    wrapper = renderComponent();
    expect(wrapper.container).toBeTruthy();
    expect(screen.getByRole("heading", { name: /log in to kite wallet/i })).toBeInTheDocument();
  });

  it("Displays relevant fields", () => {
    wrapper = renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("Validation - shows required errors on empty submit", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    expect(loginMutation?.mutate).not.toHaveBeenCalled();
  });

  it("Calls mutate with trimmed email when valid", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.type(screen.getByLabelText(/email/i), "  user@example.com  ");
    await user.type(screen.getByLabelText(/^password$/i), "strongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(loginMutation?.mutate).toHaveBeenCalledTimes(1);
    expect(loginMutation?.mutate).toHaveBeenCalledWith(
      { email: "user@example.com", password: "strongpass" },
      { onSuccess: expect.any(Function) },
    );
  });

  it("Navigates to dashboard on success callback", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "strongpass");
    await user.click(screen.getByRole("button", { name: /login/i }));

    const [, options] = (loginMutation?.mutate as jest.Mock).mock.calls[0] as [
      unknown,
      { onSuccess: () => void },
    ];
    options.onSuccess();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("Shows API error message when mutation fails", () => {
    loginMutation = {
      ...createDefaultLoginMutation(),
      isError: true,
      error: new Error("Invalid credentials"),
    };

    wrapper = renderComponent();
    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("Disables button while pending", () => {
    loginMutation = {
      ...createDefaultLoginMutation(),
      isPending: true,
    };

    wrapper = renderComponent();
    expect(screen.getByRole("button", { name: /logging in/i })).toBeDisabled();
  });
});

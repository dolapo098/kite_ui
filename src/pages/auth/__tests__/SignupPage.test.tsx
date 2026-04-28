import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, render, screen, type RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SignupPage } from "../SignupPage";

type SignupMutationMock = {
  mutate: jest.Mock;
  isPending: boolean;
  isError: boolean;
  error: unknown;
};

let wrapper: RenderResult | null = null;
let signupMutation: SignupMutationMock | null = null;
const mockNavigate = jest.fn();

function createDefaultSignupMutation(): SignupMutationMock {
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
  useSignupMutation: () => signupMutation,
  getAuthErrorMessage: (error: unknown) =>
    error instanceof Error ? error.message : "Request failed",
}));

function renderComponent() {
  return render(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  );
}

describe("SignupPage", () => {
  beforeEach(() => {
    signupMutation = createDefaultSignupMutation();
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
    expect(screen.getByRole("heading", { name: /create your kite account/i })).toBeInTheDocument();
  });

  it("Displays relevant fields", () => {
    wrapper = renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("Validation - shows required errors on empty submit", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/^password is required$/i)).toBeInTheDocument();
    expect(screen.getByText(/confirm password is required/i)).toBeInTheDocument();
    expect(signupMutation?.mutate).not.toHaveBeenCalled();
  });

  it("Validation - shows mismatch error when passwords differ", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "strongpass");
    await user.type(screen.getByLabelText(/confirm password/i), "wrongpass");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    expect(signupMutation?.mutate).not.toHaveBeenCalled();
  });

  it("Calls mutate with trimmed email when valid", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.type(screen.getByLabelText(/email/i), "  user@example.com  ");
    await user.type(screen.getByLabelText(/^password$/i), "strongpass");
    await user.type(screen.getByLabelText(/confirm password/i), "strongpass");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(signupMutation?.mutate).toHaveBeenCalledTimes(1);
    expect(signupMutation?.mutate).toHaveBeenCalledWith(
      { email: "user@example.com", password: "strongpass" },
      { onSuccess: expect.any(Function) },
    );
  });

  it("Navigates to dashboard on success callback", async () => {
    const user = userEvent.setup();
    wrapper = renderComponent();

    await user.type(screen.getByLabelText(/email/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "strongpass");
    await user.type(screen.getByLabelText(/confirm password/i), "strongpass");
    await user.click(screen.getByRole("button", { name: /sign up/i }));

    const [, options] = (signupMutation?.mutate as jest.Mock).mock.calls[0] as [
      unknown,
      { onSuccess: () => void },
    ];
    options.onSuccess();

    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it("Shows API error message when mutation fails", () => {
    signupMutation = {
      ...createDefaultSignupMutation(),
      isError: true,
      error: new Error("Email already exists"),
    };

    wrapper = renderComponent();
    expect(screen.getByText("Email already exists")).toBeInTheDocument();
  });
});

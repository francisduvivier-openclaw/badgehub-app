import { render, screen } from "@__test__";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppEditActions from "./AppEditActions.tsx";

describe("AppEditActions", () => {
  it("renders action buttons and cancel link", () => {
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", { name: /^publish$/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancel/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("button", { name: /delete application/i })
    ).toBeInTheDocument();
  });

  it("invokes delete handler when clicked", async () => {
    const user = userEvent.setup();
    const onClickDeleteApplication = vi.fn();
    render(
      <AppEditActions
        onClickDeleteApplication={onClickDeleteApplication}
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /delete application/i })
    );

    expect(onClickDeleteApplication).toHaveBeenCalled();
  });

  it("invokes status change handler when toggled", async () => {
    const user = userEvent.setup();
    const onWorkInProgressChange = vi.fn();
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        workInProgress={false}
        onWorkInProgressChange={onWorkInProgressChange}
      />
    );

    await user.click(
      screen.getByRole("checkbox", { name: /work in progress/i })
    );

    expect(onWorkInProgressChange).toHaveBeenCalledWith(true);
  });

  it("shows a spinner and disables publish while publishing", () => {
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
        isPublishing
      />
    );

    const publishButton = screen.getByRole("button", { name: /^publish$/i });
    expect(publishButton).toBeDisabled();
    expect(publishButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("publish-spinner")).toBeInTheDocument();
  });

  it("shows the published version message below the button", () => {
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
        publishedMessage="Published version 1.2.3"
      />
    );

    expect(screen.getByTestId("publish-success-message")).toHaveTextContent(
      "Published version 1.2.3"
    );
  });
});

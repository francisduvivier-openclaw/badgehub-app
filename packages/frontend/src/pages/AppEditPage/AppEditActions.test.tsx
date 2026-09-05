import { render, screen, within } from "@__test__";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AppEditActions from "./AppEditActions.tsx";

describe("AppEditActions", () => {
  it("renders project actions and cancel link", () => {
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        onTransferOwner={vi.fn()}
        projectOwnerId="owner-id"
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
      />
    );

    expect(screen.getByRole("link", { name: /cancel/i })).toHaveAttribute(
      "href",
      "/"
    );
    expect(
      screen.getByRole("button", { name: /delete application/i })
    ).toBeInTheDocument();
  });

  it("only invokes the delete handler after confirmation", async () => {
    const user = userEvent.setup();
    const onClickDeleteApplication = vi.fn();
    render(
      <AppEditActions
        onClickDeleteApplication={onClickDeleteApplication}
        onTransferOwner={vi.fn()}
        projectOwnerId="owner-id"
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /delete application/i })
    );

    const dialog = screen.getByRole("dialog", {
      name: "Delete this application?",
    });
    expect(onClickDeleteApplication).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Keep application" })
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onClickDeleteApplication).not.toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: /delete application/i })
    );
    await user.click(
      within(screen.getByRole("dialog")).getByRole("button", {
        name: "Delete application",
      })
    );

    expect(onClickDeleteApplication).toHaveBeenCalledOnce();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("invokes status change handler when toggled", async () => {
    const user = userEvent.setup();
    const onWorkInProgressChange = vi.fn();
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        onTransferOwner={vi.fn()}
        projectOwnerId="owner-id"
        workInProgress={false}
        onWorkInProgressChange={onWorkInProgressChange}
      />
    );

    await user.click(
      screen.getByRole("checkbox", { name: /work in progress/i })
    );

    expect(onWorkInProgressChange).toHaveBeenCalledWith(true);
  });

  it("only invokes the ownership transfer handler after confirmation", async () => {
    const user = userEvent.setup();
    const onTransferOwner = vi.fn().mockResolvedValue(true);
    render(
      <AppEditActions
        onClickDeleteApplication={vi.fn()}
        onTransferOwner={onTransferOwner}
        projectOwnerId="owner-id"
        workInProgress={false}
        onWorkInProgressChange={vi.fn()}
      />
    );

    await user.type(
      screen.getByRole("textbox", { name: /new owner/i }),
      "new-owner-id"
    );
    await user.click(screen.getByRole("button", { name: /^transfer$/i }));

    const dialog = screen.getByRole("dialog", {
      name: "Transfer this project?",
    });
    expect(onTransferOwner).not.toHaveBeenCalled();

    await user.click(
      within(dialog).getByRole("button", { name: "Transfer project" })
    );

    expect(onTransferOwner).toHaveBeenCalledWith("new-owner-id");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /new owner/i })).toHaveValue("");
  });
});

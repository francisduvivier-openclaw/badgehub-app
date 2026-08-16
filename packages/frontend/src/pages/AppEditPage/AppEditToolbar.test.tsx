import { render, screen } from "@__test__";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
import AppEditToolbar from "./AppEditToolbar.tsx";

const renderToolbar = (
  overrides: Partial<ComponentProps<typeof AppEditToolbar>> = {}
) =>
  render(
    <AppEditToolbar
      slug="demo"
      revision={3}
      isSaving={false}
      hasUnsavedChanges={false}
      saveError={null}
      onSaveDraft={vi.fn()}
      onRetrySave={vi.fn()}
      isPublishing={false}
      publishedMessage={null}
      {...overrides}
    />
  );

describe("AppEditToolbar", () => {
  it("keeps the saved state visible", () => {
    renderToolbar();

    expect(screen.getByTestId("autosave-feedback")).toHaveAttribute(
      "data-save-state",
      "saved"
    );
    expect(screen.getByText("Draft saved")).toBeVisible();
    expect(screen.getByTestId("app-edit-toolbar")).toHaveClass(
      "sticky",
      "top-16"
    );
  });

  it("offers an immediate save while changes are waiting for autosave", async () => {
    const user = userEvent.setup();
    const onSaveDraft = vi.fn();
    const { rerender } = renderToolbar({
      hasUnsavedChanges: true,
      onSaveDraft,
    });
    expect(screen.getByText("Unsaved changes")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    expect(onSaveDraft).toHaveBeenCalledOnce();

    rerender(
      <AppEditToolbar
        slug="demo"
        revision={3}
        isSaving
        hasUnsavedChanges
        saveError={null}
        onSaveDraft={onSaveDraft}
        onRetrySave={vi.fn()}
        isPublishing={false}
        publishedMessage={null}
      />
    );
    expect(screen.getByText("Saving draft…")).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Save draft" })
    ).not.toBeInTheDocument();
  });

  it("shows a persistent error with retry", async () => {
    const user = userEvent.setup();
    const onRetrySave = vi.fn();
    renderToolbar({
      saveError: "Could not save draft.",
      onRetrySave,
    });

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not save draft."
    );
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetrySave).toHaveBeenCalledOnce();
  });

  it("shows publish progress and success feedback", () => {
    renderToolbar({
      isPublishing: true,
      publishedMessage: "Published revision 3 (Version 1.2.3)",
    });

    const publishButton = screen.getByRole("button", { name: /^publish$/i });
    expect(publishButton).toBeDisabled();
    expect(publishButton).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("publish-spinner")).toBeInTheDocument();
    expect(screen.getByTestId("publish-success-message")).toHaveTextContent(
      "Published revision 3 (Version 1.2.3)"
    );
  });
});

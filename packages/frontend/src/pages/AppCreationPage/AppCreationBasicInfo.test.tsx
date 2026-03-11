import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@__test__";
import AppCreationBasicInfo from "./AppCreationBasicInfo.tsx";

describe("AppCreationBasicInfo", () => {
  it("sanitizes slug input", async () => {
    const user = userEvent.setup();
    const Wrapper = () => {
      const [form, setForm] = useState<AppCreationFormData>({ slug: "" });
      return (
        <AppCreationBasicInfo
          form={form}
          onChange={(changes) =>
            setForm((prev) => ({ ...prev, ...changes }))
          }
        />
      );
    };

    render(<Wrapper />);
    const input = screen.getByTestId("app-creation-slug-input");

    await user.type(input, "1abc-DEF");
    expect(input).toHaveValue("abc");
  });
});

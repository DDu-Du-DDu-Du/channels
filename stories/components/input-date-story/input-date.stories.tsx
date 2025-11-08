import type { Meta, StoryObj } from "@storybook/react";

import { InputDateView } from "./components";

const meta = {
  title: "components/InputDate",
  component: InputDateView,
  parameters: {
    notes: `\n## InputDate\n\n- Single and Range date inputs using BottomSingleCalendar in a sheet.\n- Integrates with react-hook-form via Controller.\n    `,
  },
  argTypes: {
    type: { control: { type: "radio" }, options: ["single", "range"] },
    mode: { control: { type: "radio" }, options: ["create", "edit"] },
    onSubmit: { action: "onSubmit" },
  },
  args: {
    type: "single",
    mode: "create",
  },
} satisfies Meta<typeof InputDateView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

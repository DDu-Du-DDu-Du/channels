import type { Meta, StoryObj } from "@storybook/react";

import { PeriodGoalMemoView } from "./components";

const meta = {
  title: "components/PeriodGoalMemo",
  component: PeriodGoalMemoView,
  parameters: {
    notes: `\n## PeriodGoalMemo\n\n- Controlled multiline TextInput with outside press overlay.\n- Reusable for week or month.\n- Preserves web tokens (rem/px, z-index).\n    `,
  },
  argTypes: {
    type: { control: { type: "radio" }, options: ["week", "month"] },
    value: { control: "text" },
    onChange: { action: "onChange" },
    onBlur: { action: "onBlur" },
  },
  args: {
    type: "month",
    value: "",
  },
} satisfies Meta<typeof PeriodGoalMemoView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

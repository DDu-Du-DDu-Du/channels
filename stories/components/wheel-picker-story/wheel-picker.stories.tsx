import type { Meta, StoryObj } from "@storybook/react";

import WheelPickerView from "./components/wheel-picker-view/wheel-picker-view";

const meta = {
  title: "components/WheelPicker",
  component: WheelPickerView,
  parameters: {
    notes: `\n## WheelPicker\n\n- Reusable vertical snap picker used in sheets.\n- Props: data, value, onChange(index), itemHeight, visibleCount.\n    `,
  },
  argTypes: {
    onChange: { action: "onChange" },
    value: { control: { type: "number" } },
    itemHeight: { control: { type: "number" } },
    visibleCount: { control: { type: "number" } },
  },
} satisfies Meta<typeof WheelPickerView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 5,
    itemHeight: 40,
    visibleCount: 3,
  },
};

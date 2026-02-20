import type { Meta, StoryObj } from "@storybook/react";

import YearMonthPickerView from "./components/year-month-picker-view/year-month-picker-view";

const meta = {
  title: "components/YearMonthPicker",
  component: YearMonthPickerView,
  parameters: {
    notes: `\n## YearMonthPicker\n\n- Wheel picker based month selector for single/range mode.\n- Year range: 1980 ~ 2099\n- Month range: 1 ~ 12\n    `,
  },
  argTypes: {
    rangeEnabled: { control: "boolean" },
  },
} satisfies Meta<typeof YearMonthPickerView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rangeEnabled: false,
  },
};

export const Range: Story = {
  args: {
    rangeEnabled: true,
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import { InputDateSingleView } from "./components";

const meta = {
  title: "components/InputDateSingle (presentational)",
  component: InputDateSingleView,
  parameters: {
    notes: `\n## InputDateSingle (presentational)\n\n- Standalone input that opens a BottomSingleCalendar on press.\n- Controlled by value/onChange props (no react-hook-form inside).\n    `,
  },
  argTypes: {
    label: { control: "text" },
    todayDate: { control: "text" },
    minDate: { control: "text" },
    maxDate: { control: "text" },
    onChange: { action: "onChange" },
  },
  args: {
    label: "날짜 선택",
  },
} satisfies Meta<typeof InputDateSingleView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";

import { BottomMultipleCalendarView } from "./components";

const meta = {
  title: "components/BottomMultipleCalendar",
  component: BottomMultipleCalendarView,
  parameters: {
    notes: `\n## BottomMultipleCalendar (presentational)\n\n- Multiple date selection using react-native-calendars.\n- Taps toggle a date in the selection.\n    `,
  },
  argTypes: {
    onChangeSelected: { action: "onChangeSelected" },
    initialSelected: { control: "object" },
  },
} satisfies Meta<typeof BottomMultipleCalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialSelected: ["2024-01-03", "2024-01-07"],
  },
};

export const EmptyInitial: Story = {
  args: {
    initialSelected: [],
  },
};

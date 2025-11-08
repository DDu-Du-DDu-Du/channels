import type { Meta, StoryObj } from "@storybook/react";

import { BottomSingleCalendarView } from "./components";

const meta = {
  title: "components/BottomSingleCalendar",
  component: BottomSingleCalendarView,
  parameters: {
    notes: `\n## BottomSingleCalendar (opens on mount)\n\n- Uses react-native-calendars with Korean locale.\n- Confirm closes if the date is unchanged; otherwise calls onChangeDDuDuDate.\n    `,
  },
  argTypes: {
    handleCalendarSheetToggleOff: { action: "handleCalendarSheetToggleOff" },
    onChangeDDuDuDate: { action: "onChangeDDuDuDate" },
  },
} satisfies Meta<typeof BottomSingleCalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

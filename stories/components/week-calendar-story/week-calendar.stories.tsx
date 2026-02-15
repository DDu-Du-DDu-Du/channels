import type { Meta, StoryObj } from "@storybook/react";

import { WeekCalendarView } from "./components";

const meta = {
  title: "components/WeekCalendar",
  component: WeekCalendarView,
  parameters: {
    notes: `\n## WeekCalendar\n\n- Wrapped with CalendarProvider.\n- Uses the web-specific scroll handler to emit WEEK_SCROLL.\n    `,
  },
  argTypes: {
    handleDateChange: { action: "handleDateChange" },
  },
} satisfies Meta<typeof WeekCalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

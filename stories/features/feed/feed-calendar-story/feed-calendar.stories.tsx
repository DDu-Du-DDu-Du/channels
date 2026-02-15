import type { Meta, StoryObj } from "@storybook/react";

import FeedCalendarView from "./components/feed-calendar-view/feed-calendar-view";

const meta = {
  title: "components/FeedCalendar",
  component: FeedCalendarView,
  argTypes: {
    onSelectDate: { action: "onSelectDate" },
  },
} satisfies Meta<typeof FeedCalendarView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

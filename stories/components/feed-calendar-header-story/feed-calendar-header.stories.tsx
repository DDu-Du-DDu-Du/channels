import type { Meta, StoryObj } from "@storybook/react";

import FeedCalendarHeaderView from "./components/feed-calendar-header-view/feed-calendar-header-view";

const meta = {
  title: "components/FeedCalendarHeader",
  component: FeedCalendarHeaderView,
  argTypes: {
    currentYear: { control: { type: "number", min: 2000 } },
    currentMonth: { control: { type: "number", min: 1, max: 12 } },
    type: { control: { type: "radio" }, options: ["WEEK", "MONTH"] },
    onPrevMonth: { action: "onPrevMonth" },
    onNextMonth: { action: "onNextMonth" },
  },
  args: {
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
    type: "MONTH",
  },
} satisfies Meta<typeof FeedCalendarHeaderView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

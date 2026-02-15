import type { Meta, StoryObj } from "@storybook/react";

import FeedCalendarDayContentView from "./components/feed-calendar-day-content-view/feed-calendar-day-content-view";

const meta = {
  title: "components/FeedCalendarDayContent",
  component: FeedCalendarDayContentView,
  argTypes: {
    selectedDate: { control: "text" },
    date: { control: "text" },
    day: { control: { type: "number", min: 1, max: 31 } },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof FeedCalendarDayContentView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";

import FeedCalendarHeaderView from "./components/feed-calendar-header-view/feed-calendar-header-view";

const meta = {
  title: "components/FeedCalendarHeader",
  component: FeedCalendarHeaderView,
  argTypes: {
    displayMonth: { control: "text" },
    onPrev: { action: "onPrev" },
    onNext: { action: "onNext" },
  },
  args: {
    displayMonth: `${new Date().getFullYear()}년 ${String(new Date().getMonth() + 1).padStart(2, "0")}월`,
  },
} satisfies Meta<typeof FeedCalendarHeaderView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";

import ReminderNotificationView from "./components/reminder-notification-view/reminder-notification-view";

const meta = {
  title: "components/ReminderNotification",
  component: ReminderNotificationView,
  argTypes: {
    id: { control: "text" },
    title: { control: "text" },
    body: { control: "text" },
    context: { control: "text" },
    bgColor: { control: "color" },
  },
  args: {
    id: "1",
    title: "제목을 입력해주세요.",
    body: "10분 전에 알림이 도착했습니다.",
    context: "?=",
  },
} satisfies Meta<typeof ReminderNotificationView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

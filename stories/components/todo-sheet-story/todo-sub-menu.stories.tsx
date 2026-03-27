import { formatDateToYYYYMMDD } from "@/utils";
import type { Meta, StoryObj } from "@storybook/react";

import { TodosubMenuView } from "./components";

const meta = {
  title: "components/todoSubMenu",
  component: TodosubMenuView,
  argTypes: {
    handleSelectDifferentDate: { action: "handleSelectDifferentDate" },
    handleAlarmSetting: { action: "handleAlarmSetting" },
    onRepeatCurrentDate: { action: "onRepeatCurrentDate" },
  },
} satisfies Meta<typeof TodosubMenuView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TodayComplete: Story = {
  args: {
    TodoDetail: {
      id: 1,
      name: "Sample",
      status: "COMPLETE",
      goalId: 1,
      repeatTodoId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    },
  },
};

export const TodayUncompleted: Story = {
  args: {
    TodoDetail: {
      id: 1,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatTodoId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    },
  },
};

export const AnotherDayUncompleted: Story = {
  args: {
    TodoDetail: {
      id: 1,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatTodoId: 0,
      scheduledOn: "2000-01-01",
      beginAt: null,
      endAt: null,
    },
  },
};

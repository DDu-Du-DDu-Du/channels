import { formatDateToYYYYMMDD } from "@/utils";
import type { Meta, StoryObj } from "@storybook/react";

import { TodoMainMenuView } from "./components";

const meta = {
  title: "components/todoMainMenu",
  component: TodoMainMenuView,
  argTypes: {
    type: { control: "inline-radio", options: ["Todo", "schedule"] },
    TodoId: { control: "number" },
    handleEditTodo: { action: "handleEditTodo" },
    onDeleteTodo: { action: "onDeleteTodo" },
    handleTodoTimeSetting: { action: "handleTodoTimeSetting" },
    handleTodosheetToggleOff: { action: "handleTodosheetToggleOff" },
  },
} satisfies Meta<typeof TodoMainMenuView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TodayUncompleted: Story = {
  args: {
    type: "Todo",
    TodoId: 1,
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

export const TodayComplete: Story = {
  args: {
    type: "Todo",
    TodoId: 1,
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

export const ScheduleType: Story = {
  args: {
    type: "schedule",
    TodoId: 1,
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

import type { Meta, StoryObj } from "@storybook/react";

import GoalTodoListItemView from "./components/goal-todo-list-item-view/goal-todo-list-item-view";

const meta = {
  title: "components/GoalTodoListItem",
  component: GoalTodoListItemView,
  argTypes: {
    title: { control: "text" },
    repeatDays: { control: "text" },
    startDate: { control: "text" },
    endDate: { control: "text" },
    linkTo: { control: "text" },
    bgColor: { control: "color" },
  },
  args: {
    title: "목표 제목",
    repeatDays: "월 수 금",
    startDate: "2024-05-10",
    endDate: "2024-05-13",
    linkTo: "/feed?clicked=true",
  },
} satisfies Meta<typeof GoalTodoListItemView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

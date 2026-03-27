import type { Meta, StoryObj } from "@storybook/react";

import { TodosheetView } from "./components";

const meta = {
  title: "components/todoSheet",
  component: TodosheetView,
  parameters: {
    notes: `\n## Todosheet (opens on mount)\n\n- This sheet opens when mounted and closes via handleTodosheetToggleOff.\n- Query is scaffolded but disabled; menus render when detail exists (in app).\n    `,
  },
  argTypes: {
    type: { control: "inline-radio", options: ["Todo", "schedule"] },
    TodoId: { control: "number" },
    handleEditTodo: { action: "handleEditTodo" },
    onDeleteTodo: { action: "onDeleteTodo" },
    handleTodosheetToggleOff: { action: "handleTodosheetToggleOff" },
    handleSelectDifferentDate: { action: "handleSelectDifferentDate" },
    handleAlarmSetting: { action: "handleAlarmSetting" },
    handleTodoTimeSetting: { action: "handleTodoTimeSetting" },
    onRepeatCurrentDate: { action: "onRepeatCurrentDate" },
  },
} satisfies Meta<typeof TodosheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "Todo",
    TodoId: 1,
  },
};

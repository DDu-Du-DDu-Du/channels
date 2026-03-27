import type { Meta, StoryObj } from "@storybook/react";

import TodoTimeSheetView from "./components/todo-time-sheet-view/todo-time-sheet-view";

const meta = {
  title: "components/todoTimeSheet",
  component: TodoTimeSheetView,
  parameters: {
    notes: `\n## TodoTimeSheet (opens on demand)\n\n- Uses WheelPicker for hours (0-23) and minutes (0-59).\n- Confirm validates begin <= end then calls onChangeTodoTime and closes.\n    `,
  },
  argTypes: {
    onClose: { action: "onClose" },
    onChangeTodoTime: { action: "onChangeTodoTime" },
  },
} satisfies Meta<typeof TodoTimeSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

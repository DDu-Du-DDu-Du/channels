import type { Meta, StoryObj } from "@storybook/react";

import DDuDuTimeSheetView from "./components/ddudu-time-sheet-view/ddudu-time-sheet-view";

const meta = {
  title: "components/DDuDuTimeSheet",
  component: DDuDuTimeSheetView,
  parameters: {
    notes: `\n## DDuDuTimeSheet (opens on demand)\n\n- Uses WheelPicker for hours (0-23) and minutes (0-59).\n- Confirm validates begin <= end then calls onChangeDDuDuTime and closes.\n    `,
  },
  argTypes: {
    onClose: { action: "onClose" },
    onChangeDDuDuTime: { action: "onChangeDDuDuTime" },
  },
} satisfies Meta<typeof DDuDuTimeSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

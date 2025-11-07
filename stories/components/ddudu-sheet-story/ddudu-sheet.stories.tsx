import type { Meta, StoryObj } from "@storybook/react";

import { DDuDuSheetView } from "./components";

const meta = {
  title: "components/DDuDuSheet",
  component: DDuDuSheetView,
  parameters: {
    notes: `\n## DDuDuSheet (opens on mount)\n\n- This sheet opens when mounted and closes via handleDDuDuSheetToggleOff.\n- Query is scaffolded but disabled; menus render when detail exists (in app).\n    `,
  },
  argTypes: {
    type: { control: "inline-radio", options: ["ddudu", "schedule"] },
    dduduId: { control: "number" },
    handleEditDDuDu: { action: "handleEditDDuDu" },
    onDeleteDDuDu: { action: "onDeleteDDuDu" },
    handleDDuDuSheetToggleOff: { action: "handleDDuDuSheetToggleOff" },
    handleSelectDifferentDate: { action: "handleSelectDifferentDate" },
    handleAlarmSetting: { action: "handleAlarmSetting" },
    handleDDuDuTimeSetting: { action: "handleDDuDuTimeSetting" },
    onRepeatCurrentDate: { action: "onRepeatCurrentDate" },
  },
} satisfies Meta<typeof DDuDuSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "ddudu",
    dduduId: 1,
  },
};

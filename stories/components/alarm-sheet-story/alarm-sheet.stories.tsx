import type { Meta, StoryObj } from "@storybook/react";

import AlarmSheetView from "./components/alarm-sheet-view/alarm-sheet-view";

const meta = {
  title: "components/AlarmSheet",
  component: AlarmSheetView,
  parameters: {
    notes: `\n## AlarmSheet (opens on mount)\n\n- Reminder list and reminder time sheet based flow.\n    `,
  },
  argTypes: {
    onClose: { action: "onClose" },
  },
} satisfies Meta<typeof AlarmSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

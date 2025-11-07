import type { Meta, StoryObj } from "@storybook/react";

import AlarmSheetView from "./components/alarm-sheet-view/alarm-sheet-view";

const meta = {
  title: "components/AlarmSheet",
  component: AlarmSheetView,
  parameters: {
    notes: `\n## AlarmSheet (opens on mount)\n\n- Uses RN Switch and custom 3-column wheel pickers.\n- Confirm triggers onConfirm then closes the sheet.\n    `,
  },
  argTypes: {
    onClose: { action: "onClose" },
    onConfirm: { action: "onConfirm" },
  },
} satisfies Meta<typeof AlarmSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

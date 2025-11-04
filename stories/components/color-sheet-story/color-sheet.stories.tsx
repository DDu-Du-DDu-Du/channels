import type { Meta, StoryObj } from "@storybook/react";

import { ColorSheetView } from "./components";

const meta = {
  title: "components/ColorSheet",
  component: ColorSheetView,
  parameters: {
    notes: `
## ColorSheet

Props
- pickedColor: initial color hex
- disabled: disable color selection

Usage
- Tap the button to open. Tap a color to select; sheet closes immediately.
    `,
  },
  argTypes: {
    pickedColor: { control: "text" },
    disabled: { control: "boolean" },
    onClose: { action: "onClose" },
    onClick: { action: "onClick" },
  },
} satisfies Meta<typeof ColorSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    pickedColor: "#FF3B30",
    disabled: false,
  },
};

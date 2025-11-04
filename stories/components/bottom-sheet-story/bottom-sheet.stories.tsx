import type { Meta, StoryObj } from "@storybook/react";

import { BottomSheetView } from "./components";

const meta = {
  title: "components/BottomSheet",
  component: BottomSheetView,
  parameters: {
    notes: `
## BottomSheet Wrapper (gorhom)

Props
- defaultHeight: first snap point (e.g., '35%')
- maxHeight: second snap point (e.g., '80%')

Usage
Use useBottomSheetAction() to control open/close and snapping, and pass its ref to BottomSheet.
    `,
  },
  argTypes: {
    defaultHeight: { control: "text" },
    maxHeight: { control: "text" },
  },
} satisfies Meta<typeof BottomSheetView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultHeight: "35%",
    maxHeight: "80%",
  },
};

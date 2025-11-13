import type { Meta, StoryObj } from "@storybook/react";

import SelectOptionView from "./components/select-option-view/select-option-view";

const meta = {
  title: "components/SelectOption",
  component: SelectOptionView,
  argTypes: {
    backgroundColor: { control: "color" },
    width: { control: "text" },
  },
  args: {
    children: "옵션을 선택하세요",
    backgroundColor: "#F5F5F5",
  },
} satisfies Meta<typeof SelectOptionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

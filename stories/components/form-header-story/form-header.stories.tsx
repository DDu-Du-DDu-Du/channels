import type { Meta, StoryObj } from "@storybook/react";

import FormHeaderView from "./form-header-view";

const meta = {
  title: "components/FormHeader",
  component: FormHeaderView,
  argTypes: {
    title: { control: "text" },
    onPressBack: { action: "onPressBack" },
  },
  args: {
    title: "목표등록",
  },
} satisfies Meta<typeof FormHeaderView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

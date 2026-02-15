import type { Meta, StoryObj } from "@storybook/react";

import FormTitleInputView from "./form-title-input-view";

const meta = {
  title: "components/FormTitleInput",
  component: FormTitleInputView,
  argTypes: {
    placeholder: { control: "text" },
    required: { control: "boolean" },
  },
  args: {
    placeholder: "목표 제목을 입력하세요",
    required: false,
  },
} satisfies Meta<typeof FormTitleInputView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

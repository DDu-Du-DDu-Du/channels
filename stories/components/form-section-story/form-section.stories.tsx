import type { Meta, StoryObj } from "@storybook/react";

import FormSectionView from "./form-section-view";

const meta = {
  title: "components/FormSection",
  component: FormSectionView,
  argTypes: {
    label: { control: "text" },
    withPress: { control: "boolean" },
    onPress: { action: "onPress" },
  },
  args: {
    label: "반복 투두 만들기",
    withPress: true,
  },
} satisfies Meta<typeof FormSectionView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";

import FeedTypeSwitchView from "./components/feed-type-switch-view/feed-type-switch-view";

const meta = {
  title: "components/FeedTypeSwitch",
  component: FeedTypeSwitchView,
  argTypes: {
    firstLabel: { control: "text" },
    secondLabel: { control: "text" },
    selectedOption: { control: "text" },
    alternativeOption: { control: "text" },
  },
  args: {
    firstLabel: "뚜두",
    secondLabel: "스케줄",
    selectedOption: "ddudu",
    alternativeOption: "schedule",
  },
} satisfies Meta<typeof FeedTypeSwitchView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

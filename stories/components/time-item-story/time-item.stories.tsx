import type { Meta, StoryObj } from "@storybook/react";

import TimeItemView from "./components/time-item-view/time-item-view";

const meta = {
  title: "components/TimeItem",
  component: TimeItemView,
  argTypes: {
    dduduId: { control: "number" },
    name: { control: "text" },
    status: { control: { type: "radio" }, options: ["COMPLETE", "UNCOMPLETED"] },
    beginAt: { control: "text" },
    endAt: { control: "text" },
    color: { control: "text" },
    isLastItem: { control: "boolean" },
    onDDuDuCompleteToggle: { action: "onDDuDuCompleteToggle" },
    handleDDuDuSheetOpen: { action: "handleDDuDuSheetOpen" },
  },
  args: {
    dduduId: 1,
    name: "샘플 디두",
    status: "UNCOMPLETED",
    beginAt: "09:00",
    endAt: "10:00",
    color: "1363DE",
    isLastItem: false,
  },
} satisfies Meta<typeof TimeItemView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

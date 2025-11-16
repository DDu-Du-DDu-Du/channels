import type { Meta, StoryObj } from "@storybook/react";

import { GoalItemListView } from "./components";

const meta = {
  title: "components/GoalItem/List",
  component: GoalItemListView,
  argTypes: {
    type: {
      control: "select",
      options: ["create", "management"],
    },
  },
  args: {
    type: "management",
  },
} satisfies Meta<typeof GoalItemListView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Management: Story = {
  args: {
    type: "management",
  },
};

export const Create: Story = {
  args: {
    type: "create",
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import ExampleIconView from "./components/example-icon-view/example-icon-view";

const meta = {
  title: "components/ExampleIcon",
  component: ExampleIconView,
  argTypes: {
    size: { control: { type: "number", min: 8, max: 80 } },
  },
  args: {
    size: 32,
  },
} satisfies Meta<typeof ExampleIconView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";

import DailyDDuDuView from "./components/daily-ddudu-view/daily-ddudu-view";

const meta = {
  title: "components/DailyDDuDu",
  component: DailyDDuDuView,
  argTypes: {
    totalCount: { control: { type: "number", min: 0 } },
    doneCount: { control: { type: "number", min: 0 } },
    restCount: { control: { type: "number", min: 0 } },
  },
  args: { totalCount: 8, doneCount: 3, restCount: 5 },
} satisfies Meta<typeof DailyDDuDuView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

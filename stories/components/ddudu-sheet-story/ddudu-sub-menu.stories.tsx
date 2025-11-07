import { formatDateToYYYYMMDD } from "@/utils";
import type { Meta, StoryObj } from "@storybook/react";

import { DDuDuSubMenuView } from "./components";

const meta = {
  title: "components/DDuDuSubMenu",
  component: DDuDuSubMenuView,
  argTypes: {
    handleSelectDifferentDate: { action: "handleSelectDifferentDate" },
    handleAlarmSetting: { action: "handleAlarmSetting" },
    onRepeatCurrentDate: { action: "onRepeatCurrentDate" },
  },
} satisfies Meta<typeof DDuDuSubMenuView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TodayComplete: Story = {
  args: {
    dduduDetail: {
      id: 1,
      name: "Sample",
      status: "COMPLETE",
      goalId: 1,
      repeatDduduId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    },
  },
};

export const TodayUncompleted: Story = {
  args: {
    dduduDetail: {
      id: 1,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatDduduId: 0,
      scheduledOn: formatDateToYYYYMMDD(new Date()),
      beginAt: null,
      endAt: null,
    },
  },
};

export const AnotherDayUncompleted: Story = {
  args: {
    dduduDetail: {
      id: 1,
      name: "Sample",
      status: "UNCOMPLETED",
      goalId: 1,
      repeatDduduId: 0,
      scheduledOn: "2000-01-01",
      beginAt: null,
      endAt: null,
    },
  },
};

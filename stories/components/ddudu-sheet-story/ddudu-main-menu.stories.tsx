import { formatDateToYYYYMMDD } from "@/utils";
import type { Meta, StoryObj } from "@storybook/react";

import { DDuDuMainMenuView } from "./components";

const meta = {
  title: "components/DDuDuMainMenu",
  component: DDuDuMainMenuView,
  argTypes: {
    type: { control: "inline-radio", options: ["ddudu", "schedule"] },
    dduduId: { control: "number" },
    handleEditDDuDu: { action: "handleEditDDuDu" },
    onDeleteDDuDu: { action: "onDeleteDDuDu" },
    handleDDuDuTimeSetting: { action: "handleDDuDuTimeSetting" },
    handleDDuDuSheetToggleOff: { action: "handleDDuDuSheetToggleOff" },
  },
} satisfies Meta<typeof DDuDuMainMenuView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TodayUncompleted: Story = {
  args: {
    type: "ddudu",
    dduduId: 1,
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

export const TodayComplete: Story = {
  args: {
    type: "ddudu",
    dduduId: 1,
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

export const ScheduleType: Story = {
  args: {
    type: "schedule",
    dduduId: 1,
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

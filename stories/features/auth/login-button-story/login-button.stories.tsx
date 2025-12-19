import type { Meta, StoryObj } from "@storybook/react";

import LoginButtonView from "./components/login-button-view";

const meta = {
  title: "features/auth/LoginButton",
  component: LoginButtonView,
  argTypes: {
    provider: {
      control: "inline-radio",
      options: ["kakao", "naver", "google"],
    },
    size: {
      control: "inline-radio",
      options: ["medium", "large"],
    },
    label: { control: "text" },
    onPress: { action: "pressed" },
  },
} satisfies Meta<typeof LoginButtonView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Kakao: Story = {
  args: {
    provider: "kakao",
    size: "medium",
    label: undefined,
  },
};

import type { Meta, StoryObj } from "@storybook/react";

import { TextInputView } from "./components";

const meta = {
  title: "components/TextInput",
  component: TextInputView,
  parameters: {
    notes: `\n## TextInput (Controller)\n\n- RHF Controller-bound RN TextInput.\n- Shows error and disabled states via classes.\n    `,
  },
  argTypes: {
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    showError: { control: "boolean" },
    onSubmit: { action: "onSubmit" },
  },
  args: {
    placeholder: "내용을 입력하세요",
    disabled: false,
    showError: false,
  },
} satisfies Meta<typeof TextInputView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

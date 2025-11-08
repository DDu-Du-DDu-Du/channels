import type { Meta, StoryObj } from "@storybook/react";

import { InputRadioView } from "./components";

const meta = {
  title: "components/InputRadio",
  component: InputRadioView,
  parameters: {
    notes: `\n## InputRadio (Controller)\n\n- Uses react-hook-form Controller to bind a string value.\n- Renders presentational RadioItem pills.\n    `,
  },
  argTypes: {
    onSubmit: { action: "onSubmit" },
  },
} satisfies Meta<typeof InputRadioView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

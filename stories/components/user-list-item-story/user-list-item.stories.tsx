import type { Meta, StoryObj } from "@storybook/react";

import UserListItemView from "./user-list-item-view";

const meta = {
  title: "components/UserListItem",
  component: UserListItemView,
  argTypes: {
    isFollowing: { control: "boolean" },
    isPrivate: { control: "boolean" },
    isRequestFollow: { control: "boolean" },
  },
} satisfies Meta<typeof UserListItemView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isFollowing: false,
    isPrivate: false,
    isRequestFollow: false,
  },
};

export const FollowingPublic: Story = {
  args: {
    isFollowing: true,
    isPrivate: false,
    isRequestFollow: false,
  },
};

export const PrivateNotFollowing: Story = {
  args: {
    isFollowing: false,
    isPrivate: true,
    isRequestFollow: false,
  },
};

export const PrivateRequesting: Story = {
  args: {
    isFollowing: true,
    isPrivate: true,
    isRequestFollow: true,
  },
};

export const PrivateFollowingAccepted: Story = {
  args: {
    isFollowing: true,
    isPrivate: true,
    isRequestFollow: false,
  },
};

import {
  AlarmIcon,
  AnotherDayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  CreateIcon,
  DailyIcon,
  DeleteIcon,
  DragIcon,
  EditIcon,
  FollowerIcon,
  KakaoLoginIcon,
  ListIcon,
  MainFeedIcon,
  MessageIcon,
  OptionIcon,
  PlusIcon,
  PrivacyIcon,
  PublicIcon,
  QuestionIcon,
} from "@/icons";
import type { Meta, StoryObj } from "@storybook/react";

import { IconViewer } from "./components";

const meta = {
  title: "icons/Icons",
  component: IconViewer,
  parameters: {
    notes: `
## Icon List
 * 프로젝트 전반적으로 사용되는 Icon들을 한눈에 보기 쉽도록 볼 수 있는 페이지입니다.
 * Controls에서 원하는 Icon을 선택해 볼 수 있습니다.
### Props
- **size ? :** Icon의 사이즈를 전달받습니다. - **default : 32**
- **fill ?:** Icon의 색상을 전달받습니다 - **default : black**
- **className ? :** tailwind 구문을 통해 svg 태그의 스타일을 수정할 수 있습니다.
- **rest ? :** SVG 태그의 기본 속성을 상속받아 사용할 수 있습니다.
    `,
  },
  argTypes: {
    children: {
      options: [
        "AlarmIcon",
        "AnotherDayIcon",
        "ArrowLeftIcon",
        "ArrowRightIcon",
        "CheckIcon",
        "ChevronLeftIcon",
        "ChevronRightIcon",
        "ClockIcon",
        "CloseIcon",
        "CreateIcon",
        "DailyIcon",
        "DeleteIcon",
        "DragIcon",
        "EditIcon",
        "FollowerIcon",
        "KakaoLoginIcon",
        "ListIcon",
        "MainFeedIcon",
        "MessageIcon",
        "OptionIcon",
        "PlusIcon",
        "PrivacyIcon",
        "PublicIcon",
        "QuestionIcon",
      ],
      mapping: {
        AlarmIcon: <AlarmIcon />,
        AnotherDayIcon: <AnotherDayIcon />,
        ArrowLeftIcon: <ArrowLeftIcon />,
        ArrowRightIcon: <ArrowRightIcon />,
        CheckIcon: <CheckIcon />,
        ChevronLeftIcon: <ChevronLeftIcon />,
        ChevronRightIcon: <ChevronRightIcon />,
        ClockIcon: <ClockIcon />,
        CloseIcon: <CloseIcon />,
        CreateIcon: <CreateIcon />,
        DailyIcon: <DailyIcon />,
        DeleteIcon: <DeleteIcon />,
        DragIcon: <DragIcon />,
        EditIcon: <EditIcon />,
        FollowerIcon: <FollowerIcon />,
        KakaoLoginIcon: <KakaoLoginIcon />,
        ListIcon: <ListIcon />,
        MainFeedIcon: <MainFeedIcon />,
        MessageIcon: <MessageIcon />,
        OptionIcon: <OptionIcon />,
        PlusIcon: <PlusIcon />,
        PrivacyIcon: <PrivacyIcon />,
        PublicIcon: <PublicIcon />,
        QuestionIcon: <QuestionIcon />,
      },
      control: { type: "select" },
    },
  },
  args: { children: "AlarmIcon" },
} satisfies Meta<typeof IconViewer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

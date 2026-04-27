import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import {
  FeedTypeSwitch,
  GoalTodoListItem,
  ShakingCheckIcon,
  SpoqaText,
  TextInput,
} from "@/components";
import type { DesignSystemTokenKey } from "@/constants/theme";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import {
  ArrowLeftIcon,
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MenuIcon,
  NotificationIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from "@/icons";

export interface DesignTokenComponentPreviewItem {
  id: string;
  title: string;
  description: string;
  tokenKeys: DesignSystemTokenKey[];
  Preview: () => ReactNode;
}

function ButtonTokenPreview() {
  const primaryBackgroundColor = useThemeColorToken("ui.button.primary.bg");
  const primaryTextColor = useThemeColorToken("ui.button.primary.text");
  const primaryBorderColor = useThemeColorToken("ui.button.primary.border");
  const secondaryBackgroundColor = useThemeColorToken("ui.button.secondary.bg");
  const secondaryTextColor = useThemeColorToken("ui.button.secondary.text");
  const secondaryBorderColor = useThemeColorToken("ui.button.secondary.border");
  const handlePress = () => undefined;

  return (
    <View className="gap-[0.8rem]">
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="h-[4.6rem] items-center justify-center rounded-radius10 border px-[1.2rem]"
        style={{
          backgroundColor: primaryBackgroundColor,
          borderColor: primaryBorderColor,
        }}
      >
        <SpoqaText
          weight="semiBold"
          className="text-size13"
          style={{ color: primaryTextColor }}
        >
          기본 버튼
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="h-[4.6rem] items-center justify-center rounded-radius10 border px-[1.2rem]"
        style={{
          backgroundColor: secondaryBackgroundColor,
          borderColor: secondaryBorderColor,
        }}
      >
        <SpoqaText
          weight="semiBold"
          className="text-size13"
          style={{ color: secondaryTextColor }}
        >
          보조 버튼
        </SpoqaText>
      </Pressable>
    </View>
  );
}

function ChoiceChipTokenPreview() {
  const selectedBackgroundColor = useThemeColorToken("ui.button.choice.selected.bg");
  const selectedTextColor = useThemeColorToken("ui.button.choice.selected.text");
  const selectedBorderColor = useThemeColorToken("ui.button.choice.selected.border");
  const unselectedBackgroundColor = useThemeColorToken("ui.button.choice.unselected.bg");
  const unselectedTextColor = useThemeColorToken("ui.button.choice.unselected.text");
  const unselectedBorderColor = useThemeColorToken("ui.button.choice.unselected.border");
  const handlePress = () => undefined;

  return (
    <View className="flex-row flex-wrap gap-[0.8rem]">
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="h-[3.2rem] min-w-[3.2rem] items-center justify-center rounded-radius10 border px-[0.8rem]"
        style={{
          backgroundColor: selectedBackgroundColor,
          borderColor: selectedBorderColor,
        }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: selectedTextColor }}
        >
          선택
        </SpoqaText>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="h-[3.2rem] min-w-[3.2rem] items-center justify-center rounded-radius10 border px-[0.8rem]"
        style={{
          backgroundColor: unselectedBackgroundColor,
          borderColor: unselectedBorderColor,
        }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: unselectedTextColor }}
        >
          미선택
        </SpoqaText>
      </Pressable>
    </View>
  );
}

function InputTokenPreview() {
  const inputBackgroundColor = useThemeColorToken("ui.input.default.bg");
  const inputTextColor = useThemeColorToken("ui.input.default.text");
  const placeholderColor = useThemeColorToken("ui.input.default.placeholder");
  const inputBorderColor = useThemeColorToken("ui.input.default.border");
  const focusBorderColor = useThemeColorToken("ui.input.focus.border");
  const handleChangeText = () => undefined;

  return (
    <View className="gap-[0.8rem]">
      <TextInput
        value="입력 컴포넌트"
        placeholder="placeholder"
        onChangeText={handleChangeText}
        placeholderTextColor={placeholderColor}
        className="h-[4.6rem] rounded-radius10 text-size13"
        style={{
          backgroundColor: inputBackgroundColor,
          borderColor: inputBorderColor,
          color: inputTextColor,
        }}
      />
      <TextInput
        value="focus border"
        onChangeText={handleChangeText}
        className="h-[4.6rem] rounded-radius10 text-size13"
        style={{
          backgroundColor: inputBackgroundColor,
          borderColor: focusBorderColor,
          color: inputTextColor,
        }}
      />
    </View>
  );
}

function FeedSwitchTokenPreview() {
  return (
    <View className="items-start">
      <FeedTypeSwitch />
    </View>
  );
}

function GoalItemTokenPreview() {
  const cardBackgroundColor = useThemeColorToken("role.surface.card");

  return (
    <GoalTodoListItem
      title="반복 목표 샘플"
      repeatDays="월 수 금"
      startDate="2026-04-01"
      endDate="2026-04-30"
      linkTo="/"
      bgColor={cardBackgroundColor}
    />
  );
}

function ArrowTokenPreview() {
  const arrowBackgroundColor = useThemeColorToken("ui.arrow.bg");
  const arrowIconColor = useThemeColorToken("ui.arrow.icon");
  const arrowBorderColor = useThemeColorToken("ui.arrow.border");
  const handlePress = () => undefined;

  return (
    <View className="flex-row flex-wrap gap-[0.8rem]">
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="size-[3.2rem] items-center justify-center rounded-circle border"
        style={{
          backgroundColor: arrowBackgroundColor,
          borderColor: arrowBorderColor,
        }}
      >
        <ChevronLeftIcon
          size={16}
          fill={arrowIconColor}
        />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={handlePress}
        className="size-[3.2rem] items-center justify-center rounded-circle border"
        style={{
          backgroundColor: arrowBackgroundColor,
          borderColor: arrowBorderColor,
        }}
      >
        <ChevronRightIcon
          size={16}
          fill={arrowIconColor}
        />
      </Pressable>
    </View>
  );
}

function HeaderTokenPreview() {
  const headerBackgroundColor = useThemeColorToken("ui.header.bg");
  const headerTextColor = useThemeColorToken("ui.header.text");
  const iconColor = useThemeColorToken("ui.icon.default");
  const handlePress = () => undefined;

  return (
    <View
      className="rounded-radius10 px-[1.2rem] py-[1rem]"
      style={{ backgroundColor: headerBackgroundColor }}
    >
      <View className="relative h-[2.8rem] items-center justify-center">
        <Pressable
          accessibilityRole="button"
          onPress={handlePress}
          className="absolute left-0 size-[2.8rem] items-start justify-center"
        >
          <ArrowLeftIcon
            size={16}
            stroke={iconColor}
          />
        </Pressable>
        <SpoqaText
          weight="bold"
          className="text-size15"
          style={{ color: headerTextColor }}
        >
          페이지 헤더
        </SpoqaText>
        <View className="absolute right-0 flex-row gap-[0.8rem]">
          <SearchIcon
            size={18}
            stroke={iconColor}
          />
          <NotificationIcon
            size={18}
            stroke={iconColor}
          />
        </View>
      </View>
    </View>
  );
}

function CardTokenPreview() {
  const cardBackgroundColor = useThemeColorToken("ui.card.default.bg");
  const cardBorderColor = useThemeColorToken("ui.card.default.border");
  const titleColor = useThemeColorToken("role.text.primary");
  const descriptionColor = useThemeColorToken("role.text.secondary");

  return (
    <View
      className="rounded-radius10 border p-[1.2rem]"
      style={{
        backgroundColor: cardBackgroundColor,
        borderColor: cardBorderColor,
      }}
    >
      <SpoqaText
        weight="semiBold"
        className="text-size14"
        style={{ color: titleColor }}
      >
        카드 컨테이너
      </SpoqaText>
      <SpoqaText
        className="mt-[0.4rem] text-size12"
        style={{ color: descriptionColor }}
      >
        card alias 토큰을 직접 적용합니다.
      </SpoqaText>
    </View>
  );
}

function IconSetTokenPreview() {
  const defaultIconColor = useThemeColorToken("ui.icon.default");
  const mutedIconColor = useThemeColorToken("ui.icon.muted");
  const inverseIconColor = useThemeColorToken("ui.icon.inverse");
  const successColor = useThemeColorToken("role.status.success");
  const warningColor = useThemeColorToken("role.status.warning");
  const errorColor = useThemeColorToken("role.status.error");
  const inverseSurfaceColor = useThemeColorToken("role.surface.inverse");

  return (
    <View className="flex-row flex-wrap gap-[1rem]">
      <SearchIcon
        size={22}
        stroke={defaultIconColor}
      />
      <SettingsIcon
        size={22}
        stroke={defaultIconColor}
      />
      <MenuIcon
        size={22}
        stroke={mutedIconColor}
      />
      <CalendarIcon
        size={22}
        stroke={mutedIconColor}
      />
      <PlusIcon
        size={22}
        stroke={successColor}
      />
      <CheckIcon
        size={22}
        fill={warningColor}
      />
      <CloseIcon
        size={22}
        fill={errorColor}
      />
      <View
        className="size-[2.8rem] items-center justify-center rounded-circle"
        style={{ backgroundColor: inverseSurfaceColor }}
      >
        <NotificationIcon
          size={18}
          stroke={inverseIconColor}
        />
      </View>
    </View>
  );
}

function CheckboxTokenPreview() {
  const checkedColor = useThemeColorToken("ui.checkbox.check");
  const uncheckedColor = useThemeColorToken("ui.checkbox.uncheck");
  const textColor = useThemeColorToken("role.text.secondary");
  const handlePress = () => undefined;

  return (
    <View className="gap-[0.8rem]">
      <View className="flex-row items-center gap-[0.8rem]">
        <ShakingCheckIcon
          isChecked
          color={checkedColor}
          uncheckedColor={uncheckedColor}
          size={24}
          onPress={handlePress}
        />
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          checked
        </SpoqaText>
      </View>
      <View className="flex-row items-center gap-[0.8rem]">
        <ShakingCheckIcon
          isChecked={false}
          color={checkedColor}
          uncheckedColor={uncheckedColor}
          size={24}
          onPress={handlePress}
        />
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          unchecked
        </SpoqaText>
      </View>
    </View>
  );
}

function SurfaceTokenPreview() {
  const canvasColor = useThemeColorToken("role.surface.canvas");
  const cardColor = useThemeColorToken("role.surface.card");
  const panelColor = useThemeColorToken("role.surface.panel");
  const subtleColor = useThemeColorToken("role.surface.subtle");
  const mutedColor = useThemeColorToken("role.surface.muted");
  const textColor = useThemeColorToken("role.text.primary");

  return (
    <View className="gap-[0.8rem]">
      <View
        className="rounded-radius10 p-[1rem]"
        style={{ backgroundColor: canvasColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          canvas
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 p-[1rem]"
        style={{ backgroundColor: cardColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          card
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 p-[1rem]"
        style={{ backgroundColor: panelColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          panel
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 p-[1rem]"
        style={{ backgroundColor: subtleColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          subtle
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 p-[1rem]"
        style={{ backgroundColor: mutedColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          muted
        </SpoqaText>
      </View>
    </View>
  );
}

function TextHierarchyTokenPreview() {
  const primaryTextColor = useThemeColorToken("role.text.primary");
  const secondaryTextColor = useThemeColorToken("role.text.secondary");
  const tertiaryTextColor = useThemeColorToken("role.text.tertiary");
  const invalidTextColor = useThemeColorToken("role.text.invalid");

  return (
    <View className="gap-[0.4rem]">
      <SpoqaText
        className="text-size14"
        style={{ color: primaryTextColor }}
      >
        primary text
      </SpoqaText>
      <SpoqaText
        className="text-size13"
        style={{ color: secondaryTextColor }}
      >
        secondary text
      </SpoqaText>
      <SpoqaText
        className="text-size12"
        style={{ color: tertiaryTextColor }}
      >
        tertiary text
      </SpoqaText>
      <SpoqaText
        className="text-size12"
        style={{ color: invalidTextColor }}
      >
        invalid text
      </SpoqaText>
    </View>
  );
}

function BorderTokenPreview() {
  const defaultBorderColor = useThemeColorToken("role.border.default");
  const subtleBorderColor = useThemeColorToken("role.border.subtle");
  const strongBorderColor = useThemeColorToken("role.border.strong");
  const textColor = useThemeColorToken("role.text.primary");

  return (
    <View className="gap-[0.8rem]">
      <View
        className="rounded-radius10 border p-[1rem]"
        style={{ borderColor: defaultBorderColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          default border
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 border p-[1rem]"
        style={{ borderColor: subtleBorderColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          subtle border
        </SpoqaText>
      </View>
      <View
        className="rounded-radius10 border p-[1rem]"
        style={{ borderColor: strongBorderColor }}
      >
        <SpoqaText
          className="text-size12"
          style={{ color: textColor }}
        >
          strong border
        </SpoqaText>
      </View>
    </View>
  );
}

function StatusTokenPreview() {
  const successColor = useThemeColorToken("role.status.success");
  const warningColor = useThemeColorToken("role.status.warning");
  const errorColor = useThemeColorToken("role.status.error");
  const infoColor = useThemeColorToken("role.status.info");
  const inverseTextColor = useThemeColorToken("role.text.inverse");

  return (
    <View className="flex-row flex-wrap gap-[0.8rem]">
      <View
        className="rounded-circle px-[1rem] py-[0.5rem]"
        style={{ backgroundColor: successColor }}
      >
        <SpoqaText
          className="text-size11"
          style={{ color: inverseTextColor }}
        >
          success
        </SpoqaText>
      </View>
      <View
        className="rounded-circle px-[1rem] py-[0.5rem]"
        style={{ backgroundColor: warningColor }}
      >
        <SpoqaText
          className="text-size11"
          style={{ color: inverseTextColor }}
        >
          warning
        </SpoqaText>
      </View>
      <View
        className="rounded-circle px-[1rem] py-[0.5rem]"
        style={{ backgroundColor: errorColor }}
      >
        <SpoqaText
          className="text-size11"
          style={{ color: inverseTextColor }}
        >
          error
        </SpoqaText>
      </View>
      <View
        className="rounded-circle px-[1rem] py-[0.5rem]"
        style={{ backgroundColor: infoColor }}
      >
        <SpoqaText
          className="text-size11"
          style={{ color: inverseTextColor }}
        >
          info
        </SpoqaText>
      </View>
    </View>
  );
}

export const DESIGN_TOKEN_COMPONENT_PREVIEW_REGISTRY: DesignTokenComponentPreviewItem[] = [
  {
    id: "button",
    title: "Button",
    description: "Button primary/secondary 슬롯을 style 토큰으로 적용",
    tokenKeys: [
      "ui.button.primary.bg",
      "ui.button.primary.text",
      "ui.button.primary.border",
      "ui.button.secondary.bg",
      "ui.button.secondary.text",
      "ui.button.secondary.border",
    ],
    Preview: ButtonTokenPreview,
  },
  {
    id: "choice-chip",
    title: "Choice Chip",
    description: "선택/미선택 chip 슬롯을 style 토큰으로 적용",
    tokenKeys: [
      "ui.button.choice.selected.bg",
      "ui.button.choice.selected.text",
      "ui.button.choice.selected.border",
      "ui.button.choice.unselected.bg",
      "ui.button.choice.unselected.text",
      "ui.button.choice.unselected.border",
    ],
    Preview: ChoiceChipTokenPreview,
  },
  {
    id: "text-input",
    title: "TextInput",
    description: "공통 TextInput 배경, 텍스트, placeholder, focus 색상",
    tokenKeys: [
      "ui.input.default.bg",
      "ui.input.default.text",
      "ui.input.default.placeholder",
      "ui.input.default.border",
      "ui.input.focus.border",
    ],
    Preview: InputTokenPreview,
  },
  {
    id: "arrow-controls",
    title: "Arrow Controls",
    description: "calendar/month 이동 버튼의 bg, icon, border 슬롯",
    tokenKeys: ["ui.arrow.bg", "ui.arrow.icon", "ui.arrow.border"],
    Preview: ArrowTokenPreview,
  },
  {
    id: "header",
    title: "Header",
    description: "헤더 배경, 타이틀, 아이콘 슬롯",
    tokenKeys: ["ui.header.bg", "ui.header.text", "ui.icon.default"],
    Preview: HeaderTokenPreview,
  },
  {
    id: "card",
    title: "Card Surface",
    description: "카드 alias 배경과 보더 슬롯",
    tokenKeys: ["ui.card.default.bg", "ui.card.default.border"],
    Preview: CardTokenPreview,
  },
  {
    id: "icon-set",
    title: "Icon Set",
    description: "공통 icon token을 fill/stroke props로 적용",
    tokenKeys: [
      "ui.icon.default",
      "ui.icon.muted",
      "ui.icon.inverse",
      "role.icon.default",
      "role.icon.muted",
      "role.icon.inverse",
      "role.status.success",
      "role.status.warning",
      "role.status.error",
    ],
    Preview: IconSetTokenPreview,
  },
  {
    id: "shaking-check-icon",
    title: "ShakingCheckIcon",
    description: "체크박스 check/uncheck alias와 실제 check icon 컴포넌트",
    tokenKeys: [
      "ui.checkbox.check",
      "ui.checkbox.uncheck",
      "role.icon.checkboxCheck",
      "role.icon.checkboxUncheck",
    ],
    Preview: CheckboxTokenPreview,
  },
  {
    id: "feed-type-switch",
    title: "FeedTypeSwitch",
    description: "피드 타입 전환 pill 컴포넌트",
    tokenKeys: ["ui.button.primary.bg", "role.surface.canvas", "role.text.inverse"],
    Preview: FeedSwitchTokenPreview,
  },
  {
    id: "goal-todo-list-item",
    title: "GoalTodoListItem",
    description: "목표 투두 목록 아이템의 카드 배경과 보조 텍스트",
    tokenKeys: ["role.surface.card", "role.text.secondary"],
    Preview: GoalItemTokenPreview,
  },
  {
    id: "surface-stack",
    title: "Surface Stack",
    description: "role.surface 계층을 직접 적용한 표면 샘플",
    tokenKeys: [
      "role.surface.canvas",
      "role.surface.panel",
      "role.surface.card",
      "role.surface.subtle",
      "role.surface.muted",
    ],
    Preview: SurfaceTokenPreview,
  },
  {
    id: "text-hierarchy",
    title: "Text Hierarchy",
    description: "role.text 계층을 직접 적용한 텍스트 샘플",
    tokenKeys: [
      "role.text.primary",
      "role.text.secondary",
      "role.text.tertiary",
      "role.text.invalid",
      "role.text.inverse",
    ],
    Preview: TextHierarchyTokenPreview,
  },
  {
    id: "border-stack",
    title: "Border Stack",
    description: "role.border 슬롯을 직접 적용한 보더 샘플",
    tokenKeys: ["role.border.default", "role.border.subtle", "role.border.strong"],
    Preview: BorderTokenPreview,
  },
  {
    id: "status-badges",
    title: "Status Badges",
    description: "role.status 슬롯을 직접 적용한 상태 badge",
    tokenKeys: [
      "role.status.success",
      "role.status.warning",
      "role.status.error",
      "role.status.info",
    ],
    Preview: StatusTokenPreview,
  },
];

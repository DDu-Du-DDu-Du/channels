import { type ReactNode, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, ScrollView, View } from "react-native";

import {
  Button,
  ConfirmModal,
  EmptyList,
  HeaderRightActions,
  PageHeader,
  SpoqaText,
  WidePanelLayout,
} from "@/components";
import { useToast } from "@/components/toast/hooks";
import { AnnouncementListViewItem, useAnnouncementScreen } from "@/features/announcement";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { ChevronRightIcon } from "@/icons";

import AppConnectionSettingsScreen from "../app-connection-settings-screen/app-connection-settings-screen";
import { BugReportForm, BugReportFormHandle } from "../bug-report-sheet/components";
import DisplaySettingsScreen from "../display-settings-screen/display-settings-screen";
import MenuActivationSettingsScreen from "../menu-activation-settings-screen/menu-activation-settings-screen";
import { SettingsLoginContainer } from "../settings-login-container";
import useSettingsWideShellState, {
  SETTINGS_WIDE_DEFAULT_SECTION,
  SettingsWideSection,
} from "./hooks/use-settings-wide-shell-state";

interface SettingsWideShellProps {
  initialSection?: SettingsWideSection;
}

interface SettingsWideControlItem {
  section: SettingsWideSection;
  labelKey: string;
}

interface SettingsWideControlRowProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
  textColor?: string;
  value?: string;
}

const SETTINGS_WIDE_CONTROL_ITEMS: SettingsWideControlItem[] = [
  { section: "display", labelKey: "settings.display.title" },
  { section: "menu-activation", labelKey: "settings.menuActivation" },
  { section: "app-connection", labelKey: "settings.appConnection" },
  { section: "design-system", labelKey: "settings.designSystem" },
  { section: "bug-report", labelKey: "settings.bugReport" },
  { section: "announcement", labelKey: "settings.announcement" },
];

function SettingsWideControlRow({
  label,
  isSelected = false,
  onPress,
  textColor,
  value,
}: SettingsWideControlRowProps) {
  const defaultTextColor = useThemeColorToken("role.text.primary");
  const secondaryTextColor = useThemeColorToken("role.text.secondary");
  const chevronColor = useThemeColorToken("role.icon.muted");
  const resolvedTextColor = textColor ?? defaultTextColor;
  const rowClassName = `min-h-[5rem] flex-row items-center justify-between rounded-radius10 px-[1.2rem] py-[1rem] ${
    isSelected ? "bg-role-surface-subtle dark:bg-role-dark-surface-subtle" : ""
  }`;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      className={rowClassName}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-[0.8rem]">
        {isSelected ? (
          <View className="size-[0.6rem] rounded-circle bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg" />
        ) : null}
        <SpoqaText
          weight={isSelected ? "semiBold" : "medium"}
          className="text-size14"
          style={{ color: resolvedTextColor }}
        >
          {label}
        </SpoqaText>
      </View>

      <View className="ml-[1rem] flex-row items-center gap-[0.6rem]">
        {value ? (
          <SpoqaText
            className="text-size12"
            style={{ color: secondaryTextColor }}
          >
            {value}
          </SpoqaText>
        ) : null}
        {onPress ? (
          <ChevronRightIcon
            size={15}
            fill={chevronColor}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function SettingsWideDetailFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="min-h-0 flex-1 overflow-hidden bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
      <View className="border-b border-role-border-subtle px-[2rem] py-[1.5rem] dark:border-role-dark-border-subtle">
        <SpoqaText
          weight="bold"
          className="text-size16 text-role-text-primary dark:text-role-dark-text-primary"
        >
          {title}
        </SpoqaText>
      </View>
      <View className="min-h-0 flex-1">{children}</View>
    </View>
  );
}

function SettingsWideBugReportDetail() {
  const { t } = useTranslation();
  const { createToast } = useToast();
  const bugReportFormRef = useRef<BugReportFormHandle | null>(null);

  const handleSubmitReport = () => {
    bugReportFormRef.current?.handleSubmit();
  };

  const handleSubmitForm = () => {
    createToast(t("settings.bugReportSheet.success"), {
      type: "safe",
    });
    bugReportFormRef.current?.handleReset();
  };

  return (
    <View className="min-h-0 flex-1 px-[2.4rem] pb-[2.4rem] pt-[2rem]">
      <BugReportForm
        ref={bugReportFormRef}
        onSubmit={handleSubmitForm}
      />

      <Button
        label={t("settings.bugReportSheet.submit")}
        onPress={handleSubmitReport}
        className="mt-[1.2rem]"
        bodyClassName="bg-ui-button-primary-bg dark:bg-ui-dark-button-primary-bg"
        labelClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
      />
    </View>
  );
}

function SettingsWideAnnouncementDetail() {
  const { t } = useTranslation();
  const spinnerColor = useThemeColorToken("role.text.tertiary");
  const {
    announcementViewItems,
    isLoading,
    isError,
    isFetchingNextPage,
    handlePressAnnouncement,
    handleLoadMore,
  } = useAnnouncementScreen();

  const handleRenderEmpty = () => {
    if (isLoading) {
      return <EmptyList text={t("common.loading")} />;
    }

    if (isError) {
      return <EmptyList text={t("announcement.loadFailed")} />;
    }

    return <EmptyList text={t("announcement.empty")} />;
  };

  return (
    <FlatList<AnnouncementListViewItem>
      data={announcementViewItems}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 28,
      }}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => handlePressAnnouncement(item.id)}
          className="border-b border-role-border-subtle py-[1.4rem] dark:border-role-dark-border-subtle"
        >
          <SpoqaText
            weight="semiBold"
            className="text-size15 text-role-text-primary dark:text-role-dark-text-primary"
          >
            {item.title}
          </SpoqaText>
          <SpoqaText className="mt-[0.4rem] text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
            {item.dateText}
          </SpoqaText>
        </Pressable>
      )}
      ListEmptyComponent={handleRenderEmpty}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="py-[1.2rem]">
            <ActivityIndicator
              size="small"
              color={spinnerColor}
            />
          </View>
        ) : null
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.35}
      showsVerticalScrollIndicator={false}
    />
  );
}

function SettingsWideShell({
  initialSection = SETTINGS_WIDE_DEFAULT_SECTION,
}: SettingsWideShellProps) {
  const { t } = useTranslation();
  const dangerTextColor = useThemeColorToken("role.status.error");
  const {
    appVersion,
    isDesignTokenLabEnabled,
    isLogoutConfirmOpen,
    selectedSection,
    sessionType,
    handleCloseLogoutConfirm,
    handleLogoutConfirmResult,
    handlePressLogout,
    handleSelectSection,
    handleValidationError,
  } = useSettingsWideShellState({ initialSection });
  const controlItems = SETTINGS_WIDE_CONTROL_ITEMS.filter(
    (item) => item.section !== "design-system" || isDesignTokenLabEnabled,
  );
  const selectedControlItem = controlItems.find((item) => item.section === selectedSection);
  const detailTitle = t(
    selectedControlItem?.labelKey ?? controlItems[0]?.labelKey ?? "settings.title",
  );

  const handleRenderDetail = () => {
    switch (selectedSection) {
      case "display":
        return <DisplaySettingsScreen />;
      case "menu-activation":
        return (
          <MenuActivationSettingsScreen
            isValidationEnabled={true}
            onValidationError={handleValidationError}
          />
        );
      case "app-connection":
        return <AppConnectionSettingsScreen />;
      case "design-system":
        return <DisplaySettingsScreen />;
      case "bug-report":
        return <SettingsWideBugReportDetail />;
      case "announcement":
        return <SettingsWideAnnouncementDetail />;
      default:
        return <DisplaySettingsScreen />;
    }
  };
  const controlPanel = (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 12, paddingBottom: 16, rowGap: 4 }}
      showsVerticalScrollIndicator={false}
    >
      {controlItems.map((item) => (
        <SettingsWideControlRow
          key={item.section}
          label={t(item.labelKey)}
          isSelected={selectedSection === item.section}
          onPress={() => handleSelectSection(item.section)}
        />
      ))}

      <View className="my-[0.8rem] h-px bg-role-border-subtle dark:bg-role-dark-border-subtle" />

      <SettingsWideControlRow
        label={t("settings.appVersion")}
        value={`v${appVersion}`}
      />
      {sessionType === "member" ? (
        <SettingsWideControlRow
          label={t("settings.logout")}
          textColor={dangerTextColor}
          onPress={handlePressLogout}
        />
      ) : sessionType === "guest" ? (
        <View className="px-[1.2rem] pt-[0.8rem]">
          <SettingsLoginContainer />
        </View>
      ) : null}
    </ScrollView>
  );

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("settings.title")}
        showBackButton={false}
        rightContent={<HeaderRightActions />}
      />

      <WidePanelLayout
        control={controlPanel}
        detail={
          <SettingsWideDetailFrame title={detailTitle}>
            {handleRenderDetail()}
          </SettingsWideDetailFrame>
        }
        controlWidth="32%"
        className="pt-0"
      />

      <ConfirmModal
        isToggle={isLogoutConfirmOpen}
        title={t("settings.logoutConfirmTitle")}
        message={t("settings.logoutConfirmMessage")}
        completeText={t("settings.logout")}
        incompleteText={t("common.cancel")}
        handleToggleOff={handleCloseLogoutConfirm}
        onCompleteCheck={handleLogoutConfirmResult}
      />
    </View>
  );
}

export default SettingsWideShell;

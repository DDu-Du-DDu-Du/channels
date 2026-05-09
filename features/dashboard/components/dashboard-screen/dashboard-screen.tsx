import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Pressable, View, useWindowDimensions } from "react-native";

import {
  AlarmSheet,
  BottomSingleCalendar,
  EmptyList,
  TextInput,
  TodoSheet,
  TodoTimeSheet,
  WidePanelLayout,
} from "@/components";
import { TodoEditorSheet, useTodoEditorSheet } from "@/features/todo";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { PlusIcon, SearchIcon } from "@/icons";
import type { TodoDashboardContentType } from "@/types/response/todo/todo";

import { useDashboardState } from "../../hooks";
import DashboardFilterBar from "../dashboard-filter-bar/dashboard-filter-bar";
import DashboardTodoSection from "../dashboard-todo-section/dashboard-todo-section";
import DashboardWideControlPanel from "../dashboard-wide-control-panel/dashboard-wide-control-panel";

import { useRouter } from "expo-router";

function DashboardScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<TodoDashboardContentType>>(null);
  const hasScrolledToInitialRef = useRef(false);
  const isWideLayout = windowWidth > 768;
  const spinnerColor = useThemeColorToken("role.text.primary");
  const floatingButtonIconColor = useThemeColorToken("role.text.inverse");
  const detailHeaderIconColor = useThemeColorToken("ui.icon.default");
  const { editorSheetState, handleOpenCreateEditor, handleOpenEditEditor, handleCloseEditor } =
    useTodoEditorSheet();

  const {
    dashboardQuery,
    visibleSections,
    searchedVisibleSections,
    todayDate,
    selectedStatus,
    dashboardSearchText,
    currentTodoId,
    selectedDate,
    currentDate,
    initialScrollDate,
    moveToSelectedDate,
    selectedDashboardDate,
    pendingScrollDate,
    currentTodoTime,
    currentTodoSchedule,
    isTodoSheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isMoveToCalendarToggle,
    isTodoTimeSheetToggle,
    isDeletePending,
    isChangeDatePending,
    isRepeatDatePending,
    isChangeTimePending,
    isCompleteTogglePending,
    handleSelectStatus,
    handleChangeDashboardSearchText,
    handleSelectedDate,
    handleTodoSheetOpen,
    handleTodoCompleteToggle,
    handleDeleteTodo,
    handleSelectDifferentDate,
    handleChangeTodoDate,
    handleRepeatCurrentDate,
    handleChangeCurrentDate,
    handleAlarmSetting,
    handleTodoTimeSetting,
    handleChangeTodoTime,
    handleTodoSheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleTodoTimeSheetToggleOff,
    handleOpenMoveToCalendar,
    handleSelectMoveToDate,
    handleMoveToDate,
    handleMoveToCalendarToggleOff,
    handleClearPendingScrollDate,
    handleRefetchDashboard,
    resolveVisibleSectionIndex,
  } = useDashboardState();

  const handleScrollToDate = useCallback(
    (date: string, animated: boolean) => {
      const sections = isWideLayout ? searchedVisibleSections : visibleSections;
      const nextIndex = resolveVisibleSectionIndex(date, sections);

      if (nextIndex < 0) {
        return;
      }

      requestAnimationFrame(() => {
        listRef.current?.scrollToIndex({
          index: nextIndex,
          animated,
          viewPosition: 0,
        });
      });
    },
    [isWideLayout, resolveVisibleSectionIndex, searchedVisibleSections, visibleSections],
  );

  useEffect(() => {
    if (hasScrolledToInitialRef.current || !dashboardQuery.data || visibleSections.length === 0) {
      return;
    }

    hasScrolledToInitialRef.current = true;
    handleScrollToDate(initialScrollDate, false);
  }, [dashboardQuery.data, handleScrollToDate, initialScrollDate, visibleSections.length]);

  useEffect(() => {
    if (!pendingScrollDate || visibleSections.length === 0) {
      return;
    }

    handleScrollToDate(pendingScrollDate, true);
    handleClearPendingScrollDate();
  }, [handleClearPendingScrollDate, handleScrollToDate, pendingScrollDate, visibleSections.length]);

  const handlePressSearch = () => {
    router.push("/todo" as any);
  };

  const handlePressCreate = () => {
    handleOpenCreateEditor();
  };

  const handleSelectWideDate = useCallback(
    (date: string) => {
      handleMoveToDate(new Date(`${date}T00:00:00`));
    },
    [handleMoveToDate],
  );

  const handleEditTodo = (id: number) => {
    handleTodoSheetToggleOff();
    handleOpenEditEditor(id);
  };

  const handleEditorSuccess = async () => {
    await handleRefetchDashboard();
  };

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    listRef.current?.scrollToOffset({
      offset: info.averageItemLength * info.index,
      animated: true,
    });

    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0,
      });
    }, 120);
  };

  const renderEmptyState = () => {
    if (dashboardQuery.isLoading || dashboardQuery.isFetching) {
      return (
        <View className="items-center py-[4rem]">
          <ActivityIndicator
            size="small"
            color={spinnerColor}
          />
        </View>
      );
    }

    if (dashboardQuery.isError) {
      return <EmptyList text={t("dashboard.loadFailed")} />;
    }

    return <EmptyList text={t("dashboard.empty")} />;
  };

  const renderDashboardSection = ({ item }: { item: TodoDashboardContentType }) => {
    const section = (
      <DashboardTodoSection
        section={item}
        isToday={item.date === todayDate}
        onCompleteToggle={handleTodoCompleteToggle}
        onOpenMenu={handleTodoSheetOpen}
      />
    );

    if (!isWideLayout) {
      return section;
    }

    return <View className="w-full max-w-[76rem] self-center">{section}</View>;
  };

  const dashboardSections = isWideLayout ? searchedVisibleSections : visibleSections;

  const dashboardList = (
    <FlatList<TodoDashboardContentType>
      ref={listRef}
      data={dashboardSections}
      keyExtractor={(item) => item.date}
      renderItem={renderDashboardSection}
      ListEmptyComponent={renderEmptyState}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: isWideLayout ? 24 : 16,
        paddingTop: 28,
        paddingBottom: isWideLayout ? 144 : 112,
      }}
      style={isWideLayout ? { flex: 1 } : undefined}
      showsVerticalScrollIndicator={false}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      overScrollMode="always"
    />
  );

  const floatingCreateButton = (
    <Pressable
      accessibilityRole="button"
      onPress={handlePressCreate}
      className="absolute bottom-[2.2rem] right-[1.6rem] h-[4.8rem] w-[4.8rem] items-center justify-center rounded-[1.2rem] bg-[#5F6062] shadow-shadow_500"
    >
      <PlusIcon
        size={18}
        stroke={floatingButtonIconColor}
      />
    </Pressable>
  );

  const sheetStack = (
    <>
      {isTodoSheetToggle && (
        <TodoSheet
          TodoId={currentTodoId}
          handleEditTodo={handleEditTodo}
          onDeleteTodo={handleDeleteTodo}
          handleTodoSheetToggleOff={handleTodoSheetToggleOff}
          handleSelectDifferentDate={handleSelectDifferentDate}
          handleAlarmSetting={handleAlarmSetting}
          handleTodoTimeSetting={handleTodoTimeSetting}
          onRepeatCurrentDate={handleRepeatCurrentDate}
          onChangeCurrentDate={handleChangeCurrentDate}
          isDeletePending={isDeletePending}
          isChangeDatePending={isChangeDatePending}
          isRepeatDatePending={isRepeatDatePending}
          isChangeTimePending={isChangeTimePending}
          isCompleteTogglePending={isCompleteTogglePending}
        />
      )}

      {editorSheetState.isOpen && (
        <TodoEditorSheet
          mode={editorSheetState.mode}
          goalId={editorSheetState.goalId}
          TodoId={editorSheetState.TodoId}
          selectedDate={selectedDashboardDate}
          onClose={handleCloseEditor}
          onSuccess={handleEditorSuccess}
        />
      )}

      {isAlarmSheetToggle && (
        <AlarmSheet
          todoId={currentTodoId}
          onClose={handleAlarmSheetToggleOff}
        />
      )}

      {isCalendarSheetToggle && (
        <BottomSingleCalendar
          currentDate={currentDate}
          selectedDate={selectedDate}
          setSelected={handleSelectedDate}
          onChangeTodoDate={handleChangeTodoDate}
          handleCalendarSheetToggleOff={handleCalendarSheetToggleOff}
        />
      )}

      {!isWideLayout && isMoveToCalendarToggle && (
        <BottomSingleCalendar
          currentDate={selectedDashboardDate}
          selectedDate={moveToSelectedDate}
          setSelected={handleSelectMoveToDate}
          onChangeTodoDate={handleMoveToDate}
          handleCalendarSheetToggleOff={handleMoveToCalendarToggleOff}
          shouldConfirmSameDate
          confirmButtonLabel={t("common.move")}
        />
      )}

      {isTodoTimeSheetToggle && (
        <TodoTimeSheet
          currentTodoTime={currentTodoTime}
          onChangeTodoTime={handleChangeTodoTime}
          onClose={handleTodoTimeSheetToggleOff}
          scheduledOn={currentTodoSchedule.scheduledOn}
          reminders={currentTodoSchedule.reminders}
        />
      )}
    </>
  );

  if (isWideLayout) {
    const wideDashboardDetail = (
      <View className="relative min-w-0 flex-1 bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
        <View className="h-[5.6rem] flex-row items-center border-b border-role-border-subtle px-[2rem] dark:border-role-dark-border-subtle">
          <View className="h-[3.2rem] min-w-0 flex-1 flex-row items-center rounded-circle bg-role-surface-panel px-[1.2rem] dark:bg-role-dark-surface-panel">
            <SearchIcon
              size={18}
              stroke={detailHeaderIconColor}
            />
            <TextInput
              value={dashboardSearchText}
              onChangeText={handleChangeDashboardSearchText}
              placeholder={t("todo.searchPlaceholder")}
              returnKeyType="search"
              className="h-[3.2rem] flex-1 border-0 bg-transparent px-[0.8rem] text-size13"
              style={{
                backgroundColor: "transparent",
                borderWidth: 0,
              }}
            />
          </View>
        </View>

        {dashboardList}
        {floatingCreateButton}
      </View>
    );

    return (
      <View className="flex-1">
        <WidePanelLayout
          control={
            <DashboardWideControlPanel
              selectedStatus={selectedStatus}
              selectedDate={selectedDashboardDate}
              visibleSections={visibleSections}
              onSelectStatus={handleSelectStatus}
              onSelectDate={handleSelectWideDate}
            />
          }
          detail={wideDashboardDetail}
          controlWidth="34%"
        />
        {sheetStack}
      </View>
    );
  }

  return (
    <View className="flex-1">
      <DashboardFilterBar
        selectedStatus={selectedStatus}
        onSelectStatus={handleSelectStatus}
        onPressMoveTo={handleOpenMoveToCalendar}
        onPressSearch={handlePressSearch}
      />

      {dashboardList}
      {floatingCreateButton}
      {sheetStack}
    </View>
  );
}

export default DashboardScreen;

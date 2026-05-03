import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, View, useWindowDimensions } from "react-native";

import {
  AlarmSheet,
  BottomSingleCalendar,
  EmptyList,
  TodoSheet,
  TodoTimeSheet,
} from "@/components";
import { TodoEditorSheet, useTodoEditorSheet } from "@/features/todo";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { PlusIcon } from "@/icons";
import type { TodoDashboardContentType } from "@/types/response/todo/todo";

import { useDashboardState } from "../../hooks";
import DashboardFilterBar from "../dashboard-filter-bar/dashboard-filter-bar";
import DashboardTodoSection from "../dashboard-todo-section/dashboard-todo-section";
import DashboardWideControlPanel from "../dashboard-wide-control-panel/dashboard-wide-control-panel";

import { useRouter } from "expo-router";

function DashboardScreen() {
  const router = useRouter();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const listRef = useRef<FlatList<TodoDashboardContentType>>(null);
  const hasScrolledToInitialRef = useRef(false);
  const isWideLayout = windowWidth > 768;
  const spinnerColor = useThemeColorToken("role.text.primary");
  const floatingButtonIconColor = useThemeColorToken("role.text.inverse");
  const { editorSheetState, handleOpenCreateEditor, handleOpenEditEditor, handleCloseEditor } =
    useTodoEditorSheet();

  const {
    dashboardQuery,
    visibleSections,
    todayDate,
    selectedStatus,
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
      const nextIndex = resolveVisibleSectionIndex(date);

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
    [resolveVisibleSectionIndex],
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

  const renderListFooter = () => (
    <View
      pointerEvents="none"
      style={{ height: Math.max(windowHeight, 360) }}
    />
  );

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
      return <EmptyList text="대시보드를 불러오지 못했어요." />;
    }

    return <EmptyList text="표시할 투두가 없어요." />;
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

  const dashboardList = (
    <FlatList<TodoDashboardContentType>
      ref={listRef}
      data={visibleSections}
      keyExtractor={(item) => item.date}
      renderItem={renderDashboardSection}
      ListFooterComponent={visibleSections.length > 0 ? renderListFooter : null}
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
          confirmButtonLabel="이동"
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
    return (
      <View className="flex-1 bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
        <View className="flex-1 items-center px-[2.4rem] pb-[2.4rem] pt-[2rem]">
          <View className="min-h-0 w-full max-w-[144rem] flex-1 flex-row overflow-hidden rounded-[0.8rem] border border-role-border-subtle bg-role-surface-panel dark:border-role-dark-border-subtle dark:bg-role-dark-surface-panel">
            <View
              className="h-full border-r border-role-border-subtle dark:border-role-dark-border-subtle"
              style={{ width: "34%", minWidth: 300, maxWidth: 430 }}
            >
              <DashboardWideControlPanel
                selectedStatus={selectedStatus}
                selectedDate={selectedDashboardDate}
                visibleSections={visibleSections}
                onSelectStatus={handleSelectStatus}
                onSelectDate={handleSelectWideDate}
                onPressSearch={handlePressSearch}
              />
            </View>
            <View className="min-w-0 flex-1 bg-role-surface-canvas dark:bg-role-dark-surface-canvas">
              {dashboardList}
            </View>
          </View>
        </View>

        {floatingCreateButton}
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

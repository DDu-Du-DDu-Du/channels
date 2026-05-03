import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";

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

import { useRouter } from "expo-router";

function DashboardScreen() {
  const router = useRouter();
  const listRef = useRef<FlatList<TodoDashboardContentType>>(null);
  const hasScrolledToInitialRef = useRef(false);
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
      return <EmptyList text="대시보드를 불러오지 못했어요." />;
    }

    return <EmptyList text="표시할 투두가 없어요." />;
  };

  return (
    <View className="flex-1">
      <DashboardFilterBar
        selectedStatus={selectedStatus}
        onSelectStatus={handleSelectStatus}
        onPressMoveTo={handleOpenMoveToCalendar}
        onPressSearch={handlePressSearch}
      />

      <FlatList<TodoDashboardContentType>
        ref={listRef}
        data={visibleSections}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <DashboardTodoSection
            section={item}
            isToday={item.date === todayDate}
            onCompleteToggle={handleTodoCompleteToggle}
            onOpenMenu={handleTodoSheetOpen}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingTop: 28,
          paddingBottom: 112,
        }}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        overScrollMode="always"
      />

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

      {isMoveToCalendarToggle && (
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
    </View>
  );
}

export default DashboardScreen;

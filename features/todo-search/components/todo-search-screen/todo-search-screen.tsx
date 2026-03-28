import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { useSharedValue, withTiming } from "react-native-reanimated";

import {
  AlarmSheet,
  BottomSingleCalendar,
  EmptyList,
  TodoSheet,
  TodoTimeSheet,
} from "@/components";
import { TodoEditorSheet, useTodoEditorSheet } from "@/features/todo";
import { useTodoSearchActions, useTodoSearchQuery } from "@/features/todo-search/hooks";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import type { TodoSearchItemType } from "@/types/response/todo/todo";
import { formatDateToYYYYMMDD } from "@/utils";

import TodoSearchBar from "../todo-search-bar/todo-search-bar";
import TodoSearchItem from "../todo-search-item/todo-search-item";

function TodoSearchScreen() {
  const spinnerColor = useThemeColorToken("role.text.inverse");
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchBarProgress = useSharedValue(0);

  const { editorSheetState, handleOpenEditEditor, handleCloseEditor } = useTodoEditorSheet();
  const today = useMemo(() => formatDateToYYYYMMDD(new Date()), []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchText]);

  useEffect(() => {
    searchBarProgress.value = withTiming(1, {
      duration: 320,
    });
  }, [searchBarProgress]);

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useTodoSearchQuery({
      query: debouncedSearchText,
    });

  const handleRefetchSearch = useCallback(() => {
    void refetch();
  }, [refetch]);

  const {
    currentTodoId,
    currentTodoTime,
    hasAlarmBeginAt,
    selectedDate,
    currentDate,
    isTodoSheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isTodoTimeSheetToggle,
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
  } = useTodoSearchActions({
    onRefetchSearch: handleRefetchSearch,
  });

  const searchItems = useMemo(
    () => data?.pages.flatMap((page) => page.contents) ?? [],
    [data?.pages],
  );

  const handleEditTodo = (id: number) => {
    handleTodoSheetToggleOff();
    handleOpenEditEditor(id);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  };

  const renderSearchEmpty = () => {
    if (debouncedSearchText.length === 0) {
      return <EmptyList text="검색어를 입력하세요" />;
    }

    if (isLoading || isFetching) {
      return <EmptyList text="불러오는 중..." />;
    }

    return <EmptyList text="검색 결과가 없습니다" />;
  };

  return (
    <View className="flex-1">
      <View className="mt-[1.5rem]">
        <TodoSearchBar
          value={searchText}
          onChangeText={setSearchText}
          progress={searchBarProgress}
        />
      </View>

      <View className="mt-[0.8rem] flex-1 px-4">
        <FlatList<TodoSearchItemType>
          data={searchItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoSearchItem
              item={item}
              onCompleteToggle={handleTodoCompleteToggle}
              onOpenMenu={handleTodoSheetOpen}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.35}
          ListEmptyComponent={renderSearchEmpty}
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
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          windowSize={7}
          keyboardShouldPersistTaps="handled"
          overScrollMode="always"
        />
      </View>

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
        />
      )}

      {editorSheetState.isOpen && (
        <TodoEditorSheet
          mode={editorSheetState.mode}
          goalId={editorSheetState.goalId}
          TodoId={editorSheetState.TodoId}
          selectedDate={today}
          onClose={handleCloseEditor}
        />
      )}

      {isAlarmSheetToggle && (
        <AlarmSheet
          onClose={handleAlarmSheetToggleOff}
          hasBeginTime={hasAlarmBeginAt}
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

      {isTodoTimeSheetToggle && (
        <TodoTimeSheet
          currentTodoTime={currentTodoTime}
          onChangeTodoTime={handleChangeTodoTime}
          onClose={handleTodoTimeSheetToggleOff}
        />
      )}
    </View>
  );
}

export default TodoSearchScreen;

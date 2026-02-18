import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import {
  AlarmSheet,
  BottomSingleCalendar,
  DDuDuSheet,
  DDuDuTimeSheet,
  EmptyList,
} from "@/components";
import { DDuDuEditorSheet, useDDuDuEditorSheet } from "@/features/ddudu";
import { useDDuDuSearchActions, useDDuDuSearchQuery } from "@/features/ddudu-search/hooks";
import type { DDuDuSearchItemType } from "@/types/response/ddudu/ddudu";
import { formatDateToYYYYMMDD } from "@/utils";

import DDuDuSearchBar from "../ddudu-search-bar/ddudu-search-bar";
import DDuDuSearchHeader from "../ddudu-search-header/ddudu-search-header";
import DDuDuSearchItem from "../ddudu-search-item/ddudu-search-item";

import { useRouter } from "expo-router";

function DDuDuSearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const searchBarProgress = useSharedValue(0);
  const headerOpacity = useSharedValue(0);

  const { editorSheetState, handleOpenEditEditor, handleCloseEditor } = useDDuDuEditorSheet();
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
    headerOpacity.value = withDelay(
      260,
      withTiming(1, {
        duration: 220,
      }),
    );
  }, [headerOpacity, searchBarProgress]);

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useDDuDuSearchQuery({
      query: debouncedSearchText,
    });

  const handleRefetchSearch = useCallback(() => {
    void refetch();
  }, [refetch]);

  const {
    currentDDuDuId,
    currentDDuDuTime,
    hasAlarmBeginAt,
    selectedDate,
    currentDate,
    isDDuDuSheetToggle,
    isAlarmSheetToggle,
    isCalendarSheetToggle,
    isDDuDuTimeSheetToggle,
    handleSelectedDate,
    handleDDuDuSheetOpen,
    handleDDuDuCompleteToggle,
    handleDeleteDDuDu,
    handleSelectDifferentDate,
    handleChangeDDuDuDate,
    handleRepeatCurrentDate,
    handleChangeCurrentDate,
    handleAlarmSetting,
    handleDDuDuTimeSetting,
    handleChangeDDuDuTime,
    handleDDuDuSheetToggleOff,
    handleAlarmSheetToggleOff,
    handleCalendarSheetToggleOff,
    handleDDuDuTimeSheetToggleOff,
  } = useDDuDuSearchActions({
    onRefetchSearch: handleRefetchSearch,
  });

  const searchItems = useMemo(
    () => data?.pages.flatMap((page) => page.contents) ?? [],
    [data?.pages],
  );

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const handleBackPress = () => {
    router.back();
  };

  const handleEditDDuDu = (id: number) => {
    handleDDuDuSheetToggleOff();
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
    <View className="flex-1 bg-main pt-[1.2rem]">
      <Animated.View style={animatedHeaderStyle}>
        <DDuDuSearchHeader onBackPress={handleBackPress} />
      </Animated.View>

      <View className="mt-[1.5rem]">
        <DDuDuSearchBar
          value={searchText}
          onChangeText={setSearchText}
          progress={searchBarProgress}
        />
      </View>

      <View className="mt-[0.8rem] flex-1 px-4">
        <FlatList<DDuDuSearchItemType>
          data={searchItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <DDuDuSearchItem
              item={item}
              onCompleteToggle={handleDDuDuCompleteToggle}
              onOpenMenu={handleDDuDuSheetOpen}
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
                  color="#FFFFFF"
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

      {isDDuDuSheetToggle && (
        <DDuDuSheet
          dduduId={currentDDuDuId}
          handleEditDDuDu={handleEditDDuDu}
          onDeleteDDuDu={handleDeleteDDuDu}
          handleDDuDuSheetToggleOff={handleDDuDuSheetToggleOff}
          handleSelectDifferentDate={handleSelectDifferentDate}
          handleAlarmSetting={handleAlarmSetting}
          handleDDuDuTimeSetting={handleDDuDuTimeSetting}
          onRepeatCurrentDate={handleRepeatCurrentDate}
          onChangeCurrentDate={handleChangeCurrentDate}
        />
      )}

      {editorSheetState.isOpen && (
        <DDuDuEditorSheet
          mode={editorSheetState.mode}
          goalId={editorSheetState.goalId}
          dduduId={editorSheetState.dduduId}
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
          onChangeDDuDuDate={handleChangeDDuDuDate}
          handleCalendarSheetToggleOff={handleCalendarSheetToggleOff}
        />
      )}

      {isDDuDuTimeSheetToggle && (
        <DDuDuTimeSheet
          currentDDuDuTime={currentDDuDuTime}
          onChangeDDuDuTime={handleChangeDDuDuTime}
          onClose={handleDDuDuTimeSheetToggleOff}
        />
      )}
    </View>
  );
}

export default DDuDuSearchScreen;

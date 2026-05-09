/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import styleConstructor from "react-native-calendars/src/expandableCalendar/style";

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { FlatList, type ListRenderItemInfo, Text, View } from "react-native";
import constants from "react-native-calendars/src/commons/constants";
import { extractCalendarProps } from "react-native-calendars/src/componentUpdater";
import {
  getWeekDates,
  onSameDateRange,
  sameWeek,
  weekDayNames,
} from "react-native-calendars/src/dateutils";
import CalendarContext from "react-native-calendars/src/expandableCalendar/Context";
import type { WeekCalendarProps } from "react-native-calendars/src/expandableCalendar/WeekCalendar";
import { UpdateSources } from "react-native-calendars/src/expandableCalendar/commons";
import Week from "react-native-calendars/src/expandableCalendar/week";
import { useDidUpdate } from "react-native-calendars/src/hooks";
import { toMarkingFormat } from "react-native-calendars/src/interface";

import XDate from "xdate";

const NUMBER_OF_PAGES = 6;
const NUM_OF_ITEMS = NUMBER_OF_PAGES * 2 + 1;

function WeekCalendar(props: WeekCalendarProps) {
  const { calendarWidth, hideDayNames, current, theme, testID, markedDates } = props;
  const context = useContext(CalendarContext);
  const { allowShadow = true, ...calendarListProps } = props;
  const {
    style: propsStyle,
    onDayPress,
    firstDay = 0,
    ...others
  } = extractCalendarProps(calendarListProps);
  const { date, numberOfDays, updateSource, setDate, timelineLeftInset } = context;

  const visibleWeek = useRef(date);
  const styles = useMemo(() => styleConstructor(theme), [theme]);
  const items = useRef(getDatesArray(current ?? date, firstDay, numberOfDays));
  const [listData, setListData] = useState(items.current);
  const changedItems = useRef(constants.isRTL);
  const list = useRef<FlatList<string> | null>(null);
  const currentIndex = useRef(NUMBER_OF_PAGES);
  const isUserScroll = useRef(false);
  const shouldFixRTL = useMemo(() => !constants.isRN73() && constants.isAndroidRTL, []);
  const scrollEndTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollCorrectionTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useDidUpdate(() => {
    items.current = getDatesArray(date, firstDay, numberOfDays);
    setListData(items.current);
    visibleWeek.current = date;
    list?.current?.scrollToIndex({ index: NUMBER_OF_PAGES, animated: false });
  }, [numberOfDays]);

  useDidUpdate(() => {
    if (updateSource !== UpdateSources.WEEK_SCROLL) {
      const pageIndex = items.current.findIndex((item) =>
        isCustomNumberOfDays(numberOfDays)
          ? onSameDateRange({
              firstDay: item,
              secondDay: date,
              numberOfDays: numberOfDays!,
              firstDateInRange: item,
            })
          : sameWeek(item, date, firstDay),
      );
      if (pageIndex !== currentIndex.current) {
        const adjustedIndexForScroll = shouldFixRTL ? NUM_OF_ITEMS - 1 - pageIndex : pageIndex;
        if (pageIndex >= 0) {
          visibleWeek.current = items.current[adjustedIndexForScroll];
          currentIndex.current = adjustedIndexForScroll;
        } else {
          visibleWeek.current = date;
          currentIndex.current = NUMBER_OF_PAGES;
        }
        pageIndex <= 0
          ? onEndReached()
          : list?.current?.scrollToIndex({ index: adjustedIndexForScroll, animated: false });
      }
    }
  }, [date, updateSource, shouldFixRTL]);

  const containerWidth = useMemo(() => {
    return calendarWidth ?? constants.screenWidth;
  }, [calendarWidth]);

  const handleDayPress = useCallback(
    (value: { dateString: any; year: number; month: number; day: number; timestamp: number }) => {
      if (onDayPress) {
        onDayPress(value);
      } else {
        setDate?.(value.dateString, UpdateSources.DAY_PRESS);
      }
    },
    [onDayPress, setDate],
  );

  const getCurrentWeekMarkings = useCallback(
    (weekDate: string, markings: { [x: string]: any }) => {
      if (!markings) {
        return;
      }
      const dates = getWeekDates(weekDate, firstDay);
      return dates?.reduce((acc, date) => {
        const dateString = toMarkingFormat(date as XDate);
        return {
          ...acc,
          ...(markings[dateString] && { [dateString]: markings[dateString] }),
        };
      }, {});
    },
    [firstDay],
  );

  const weekStyle = useMemo(() => {
    return [{ width: containerWidth }, propsStyle];
  }, [containerWidth, propsStyle]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<string>) => {
      const currentContext = sameWeek(date, item, firstDay) ? context : undefined;
      const weekCurrent = currentContext ? date : item;
      const markings = getCurrentWeekMarkings(item, markedDates!);
      return (
        <Week
          {...others}
          markedDates={markings}
          current={weekCurrent}
          firstDay={firstDay}
          style={weekStyle}
          context={currentContext}
          onDayPress={handleDayPress}
          numberOfDays={numberOfDays}
          timelineLeftInset={timelineLeftInset}
        />
      );
    },
    [
      firstDay,
      handleDayPress,
      context,
      date,
      markedDates,
      numberOfDays,
      timelineLeftInset,
      getCurrentWeekMarkings,
    ],
  );

  const keyExtractor = useCallback((item: string, index: number) => `${item}-${index}`, []);

  const renderWeekDaysNames = useMemo(() => {
    const headerTheme = (theme as Record<string, Record<string, object>> | undefined)?.[
      "stylesheet.calendar.header"
    ];
    const dayNames = weekDayNames(firstDay);

    return (
      <>
        {dayNames.map((day: string, index: number) => {
          const dayTextAtIndexKey = `dayTextAtIndex${index}`;
          const dayTextStyle = headerTheme?.[dayTextAtIndexKey];

          return (
            <Text
              allowFontScaling={false}
              key={index}
              style={[styles.dayHeader, dayTextStyle]}
              numberOfLines={1}
              accessibilityLabel=""
            >
              {day}
            </Text>
          );
        })}
      </>
    );
  }, [firstDay, styles, theme]);

  const weekCalendarStyle = useMemo(() => {
    return [allowShadow && styles.containerShadow, !hideDayNames && styles.containerWrapper];
  }, [allowShadow, hideDayNames, styles]);

  const containerStyle = useMemo(() => {
    return [styles.week, styles.weekCalendar];
  }, [styles]);

  const getItemLayout = useCallback(
    (_: any, index: number) => {
      return {
        length: containerWidth,
        offset: containerWidth * index,
        index,
      };
    },
    [containerWidth],
  );

  const handleScrollToCurrentIndex = useCallback(() => {
    if (!containerWidth) {
      return;
    }

    const nextOffset = containerWidth * currentIndex.current;
    list.current?.scrollToIndex({
      index: currentIndex.current,
      animated: false,
    });
    list.current?.scrollToOffset({
      offset: nextOffset,
      animated: false,
    });
  }, [containerWidth]);

  const handleScheduleScrollToCurrentIndex = useCallback(() => {
    requestAnimationFrame(handleScrollToCurrentIndex);

    scrollCorrectionTimeouts.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    scrollCorrectionTimeouts.current = [0, 80, 180].map((delay) =>
      setTimeout(handleScrollToCurrentIndex, delay),
    );
  }, [handleScrollToCurrentIndex]);

  const onEndReached = useCallback(() => {
    changedItems.current = true;
    items.current = getDatesArray(visibleWeek.current, firstDay, numberOfDays);
    setListData(items.current);
    currentIndex.current = NUMBER_OF_PAGES;
    handleScheduleScrollToCurrentIndex();
  }, [firstDay, handleScheduleScrollToCurrentIndex, numberOfDays]);

  useEffect(() => {
    if (!containerWidth || listData.length === 0) {
      return;
    }

    handleScheduleScrollToCurrentIndex();
  }, [containerWidth, handleScheduleScrollToCurrentIndex, listData.length]);

  const applyScrollUpdate = useCallback(
    (offsetX: number) => {
      if (changedItems.current) {
        changedItems.current = false;
        return;
      }

      if (!isUserScroll.current) {
        return;
      }

      const rawIndex = Math.round(offsetX / containerWidth);
      const pageIndex = shouldFixRTL ? NUM_OF_ITEMS - 1 - rawIndex : rawIndex;
      const newDate = items.current[pageIndex];

      if (newDate && newDate !== visibleWeek.current) {
        currentIndex.current = pageIndex;
        visibleWeek.current = newDate;
        setDate?.(newDate, UpdateSources.WEEK_SCROLL);
        if (pageIndex === 0 || pageIndex === items.current.length - 1) {
          onEndReached();
        }
      }
    },
    [containerWidth, onEndReached, setDate, shouldFixRTL],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserScroll.current = true;
  }, []);

  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }
      scrollEndTimeout.current = setTimeout(() => {
        applyScrollUpdate(offsetX);
      }, 80);
    },
    [applyScrollUpdate],
  );

  const handleScrollEnd = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number } } }) => {
      const offsetX = event?.nativeEvent?.contentOffset?.x ?? 0;
      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }
      applyScrollUpdate(offsetX);
      isUserScroll.current = false;
    },
    [applyScrollUpdate],
  );

  useEffect(() => {
    return () => {
      if (scrollEndTimeout.current) {
        clearTimeout(scrollEndTimeout.current);
      }
      scrollCorrectionTimeouts.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return (
    <View
      testID={testID}
      style={weekCalendarStyle}
    >
      {!hideDayNames && <View style={containerStyle}>{renderWeekDaysNames}</View>}
      <View style={styles.container}>
        <FlatList
          testID={`${testID}.list`}
          ref={list}
          style={styles.container}
          data={listData}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEnabled
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          initialScrollIndex={NUMBER_OF_PAGES}
          initialNumToRender={NUM_OF_ITEMS}
          maxToRenderPerBatch={NUM_OF_ITEMS}
          windowSize={NUM_OF_ITEMS}
          contentOffset={{ x: containerWidth * NUMBER_OF_PAGES, y: 0 }}
          getItemLayout={getItemLayout}
          onLayout={handleScheduleScrollToCurrentIndex}
          onContentSizeChange={handleScheduleScrollToCurrentIndex}
          onScrollToIndexFailed={handleScheduleScrollToCurrentIndex}
          onEndReached={onEndReached}
          onEndReachedThreshold={1 / NUM_OF_ITEMS}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollEndDrag={handleScrollEnd}
        />
      </View>
    </View>
  );
}

function getDateForDayRange(date: string, weekIndex: number, numberOfDays?: number) {
  const d = new XDate(date);
  if (weekIndex !== 0) {
    d.addDays((numberOfDays ?? 0) * weekIndex);
  }
  return toMarkingFormat(d);
}

function getDate(date: string, firstDay: number, weekIndex: number, numberOfDays?: number) {
  const d = new XDate(date);
  let dayOfTheWeek = d.getDay();
  if (dayOfTheWeek < firstDay && firstDay > 0) {
    dayOfTheWeek = 7 + dayOfTheWeek;
  }
  if (weekIndex !== 0) {
    d.addDays(firstDay - dayOfTheWeek);
  }
  const newDate =
    numberOfDays && numberOfDays > 1 ? d.addDays(weekIndex * numberOfDays) : d.addWeeks(weekIndex);
  const today = new XDate();
  const offsetFromNow = newDate.diffDays(today);
  const isSameWeek = offsetFromNow > 0 && offsetFromNow < (numberOfDays ?? 7);
  return toMarkingFormat(isSameWeek ? today : newDate);
}

function getDatesArray(date: string, firstDay: number, numberOfDays?: number) {
  return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
    if (isCustomNumberOfDays(numberOfDays)) {
      return getDateForDayRange(date, index - NUMBER_OF_PAGES, numberOfDays);
    }
    return getDate(date, firstDay, index - NUMBER_OF_PAGES);
  });
}

function isCustomNumberOfDays(numberOfDays?: number) {
  return numberOfDays && numberOfDays > 1;
}

WeekCalendar.displayName = "WeekCalendar";

export default WeekCalendar;

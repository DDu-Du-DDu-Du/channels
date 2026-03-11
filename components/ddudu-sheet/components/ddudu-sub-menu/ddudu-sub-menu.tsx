import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import SpoqaText from "@/components/spoqa-text/spoqa-text";
import { AlarmIcon, AnotherDayIcon, DailyIcon } from "@/icons";
import { formatDateToYYYYMMDD } from "@/utils";

import type { DDuDuDetailType } from "../../ddudu-sheet.types";

export interface DDuDuSubMenuProps {
  dduduDetail: DDuDuDetailType;
  handleSelectDifferentDate: (type: "change" | "repeat", currentDate: string) => void;
  handleAlarmSetting: () => void;
  onRepeatCurrentDate: () => void;
}

function DDuDuSubMenu({
  dduduDetail,
  handleSelectDifferentDate,
  handleAlarmSetting,
  onRepeatCurrentDate,
}: DDuDuSubMenuProps) {
  const { scheduledOn, status } = dduduDetail;
  const isDDuDuDateNow = formatDateToYYYYMMDD(new Date()) === scheduledOn;

  const handleRepeatDDuDuCurrentDate = () => {
    onRepeatCurrentDate();
  };

  const handleChangeDDuDuDate = () => {
    handleSelectDifferentDate("change", scheduledOn);
  };

  const handleRepeatDDuDuDate = () => {
    handleSelectDifferentDate("repeat", scheduledOn);
  };

  return (
    <View className="flex flex-col w-full max-w-[50rem] gap-[1rem]">
      {status === "COMPLETE" && (
        <>
          <SheetButton
            Icon={<DailyIcon />}
            title="오늘 다시 하기"
            buttonType="sub"
            onPress={handleRepeatDDuDuCurrentDate}
          />
          <SheetButton
            Icon={<AnotherDayIcon fill="#FDB541" />}
            title="다른 날 반복하기"
            buttonType="sub"
            onPress={handleRepeatDDuDuDate}
          />
          <SheetButton
            Icon={<AnotherDayIcon />}
            title="날짜 바꾸기"
            buttonType="sub"
            onPress={handleChangeDDuDuDate}
          />
        </>
      )}
      {status === "UNCOMPLETED" && isDDuDuDateNow && (
        <>
          <SheetButton
            Icon={<AlarmIcon />}
            title="알림 설정하기"
            buttonType="sub"
            rightPlace={
              <SpoqaText className="text-size13 text-role-text-tertiary dark:text-role-dark-text-tertiary">
                없음
              </SpoqaText>
            }
            onPress={handleAlarmSetting}
          />
          <SheetButton
            Icon={<AnotherDayIcon fill="#FDB541" />}
            title="미루기"
            buttonType="sub"
            onPress={handleChangeDDuDuDate}
          />
        </>
      )}
      {status === "UNCOMPLETED" && !isDDuDuDateNow && (
        <SheetButton
          Icon={<DailyIcon />}
          title="오늘 다시 하기"
          buttonType="sub"
          onPress={handleRepeatDDuDuCurrentDate}
        />
      )}
      {status === "UNCOMPLETED" && (
        <SheetButton
          Icon={<AnotherDayIcon />}
          title="다른 날 반복하기"
          buttonType="sub"
          onPress={handleRepeatDDuDuDate}
        />
      )}
    </View>
  );
}

export default DDuDuSubMenu;

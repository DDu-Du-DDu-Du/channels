import { View } from "react-native";

import SheetButton from "@/components/sheet-button/sheet-button";
import { AlarmIcon, AnotherDayIcon, ClockIcon, DailyIcon } from "@/icons";

interface DDuDuActionItemType {
  key: string;
  title: string;
  onPress: () => void;
}

export interface DDuDuActionGridProps {
  actions: DDuDuActionItemType[];
}

const buildRows = (actions: DDuDuActionItemType[]) => {
  if (actions.length === 4) {
    return [actions.slice(0, 2), actions.slice(2, 4)];
  }

  if (actions.length === 5) {
    return [actions.slice(0, 3), actions.slice(3, 5)];
  }

  return [actions];
};

const getActionIcon = (key: string) => {
  if (key === "alarm-setting") {
    return <AlarmIcon />;
  }

  if (key === "time-setting") {
    return <ClockIcon />;
  }

  if (key === "repeat-today") {
    return <DailyIcon />;
  }

  if (key === "repeat-another-day" || key === "copy-date") {
    return <AnotherDayIcon fill="#FDB541" />;
  }

  return <AnotherDayIcon />;
};

function DDuDuActionGrid({ actions }: DDuDuActionGridProps) {
  const rows = buildRows(actions);

  return (
    <View className="w-full max-w-[50rem] gap-[0.8rem]">
      {rows.map((row, rowIndex) => (
        <View
          key={`${rowIndex}-${row.length}`}
          className="flex-row w-full gap-[1rem]"
        >
          {row.map((action) => (
            <SheetButton
              key={action.key}
              Icon={getActionIcon(action.key)}
              title={action.title}
              onPress={action.onPress}
              style={{ flex: 1, flexGrow: 1 }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

export default DDuDuActionGrid;

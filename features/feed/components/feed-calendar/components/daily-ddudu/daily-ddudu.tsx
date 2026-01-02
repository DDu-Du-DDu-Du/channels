import { View } from "react-native";

import { SpoqaText } from "@/components";
import { CheckIcon } from "@/icons";

export interface DailyDDuDuProps {
  totalCount: number;
  doneCount: number;
  restCount: number;
}

function DailyDDuDu({ totalCount, doneCount, restCount }: DailyDDuDuProps) {
  const isAllDone = totalCount > 0 && totalCount === doneCount;
  const percent = totalCount > 0 ? Math.max(0, Math.min(1, restCount / totalCount)) : 0;

  return (
    <View
      className={`relative rounded-full shrink-0 w-[2rem] h-[2rem] items-center justify-center overflow-hidden ${
        isAllDone ? "bg-sub_3" : "bg-sub_1 border border-sub_3"
      }`}
    >
      {!isAllDone && (
        <View
          className="absolute left-0 right-0 bottom-0 bg-sub_4"
          style={{ height: `${percent * 100}%` }}
        />
      )}

      {isAllDone ? (
        <CheckIcon
          size={14}
          fill="#fff"
        />
      ) : (
        <SpoqaText
          className="text-sub_3 text-size10"
          style={{
            textShadowColor: "rgba(0,0,0,0.2)",
            textShadowOffset: { width: 0, height: 0.5 },
            textShadowRadius: 1,
          }}
        >
          {restCount > 99 ? "+99" : restCount}
        </SpoqaText>
      )}
    </View>
  );
}

export default DailyDDuDu;

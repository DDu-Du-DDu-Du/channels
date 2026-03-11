import { View } from "react-native";

import SpoqaText from "../spoqa-text/spoqa-text";

export interface TimeSetProps {
  beginAt?: string;
  endAt?: string;
  beginLabel?: string;
  endLabel?: string;
}

function TimeSet({ beginAt, endAt, beginLabel = "시작", endLabel = "종료" }: TimeSetProps) {
  return (
    <View className="rounded-radius15 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem]">
      <View className="flex-row items-center justify-between py-[0.6rem]">
        <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
          {beginLabel}
        </SpoqaText>
        <View className="min-h-[4rem] min-w-[8rem] items-center justify-center rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[0.8rem]">
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {beginAt ?? "미설정"}
          </SpoqaText>
        </View>
      </View>
      <View className="flex-row items-center justify-between py-[0.6rem]">
        <SpoqaText className="text-size14 text-role-text-secondary dark:text-role-dark-text-secondary">
          {endLabel}
        </SpoqaText>
        <View className="min-h-[4rem] min-w-[8rem] items-center justify-center rounded-radius10 bg-role-surface-canvas dark:bg-role-dark-surface-canvas px-[1.2rem] py-[0.8rem]">
          <SpoqaText className="text-size14 text-role-text-primary dark:text-role-dark-text-primary">
            {endAt ?? "미설정"}
          </SpoqaText>
        </View>
      </View>
    </View>
  );
}

export default TimeSet;

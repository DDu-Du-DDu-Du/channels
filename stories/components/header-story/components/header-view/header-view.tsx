import { View } from "react-native";

import { Header, SpoqaText } from "@/components";
import { ChevronRightIcon } from "@/icons";

export interface HeaderViewProps {
  headerLabel?: string;
  onPressLeft?: () => void;
  rightButtonFn?: () => void;
  onPressLabel?: () => void;
  showRight?: boolean;
}

function HeaderView({
  headerLabel = "제목",
  onPressLeft,
  rightButtonFn,
  onPressLabel,
  showRight = false,
}: HeaderViewProps) {
  return (
    <View className="flex-1 items-center justify-start">
      <Header
        headerLabel={headerLabel}
        onPressLeft={onPressLeft}
        rightButtonIcon={showRight ? <ChevronRightIcon size={16} /> : undefined}
        onPressRight={showRight ? rightButtonFn : undefined}
        onPressLabel={onPressLabel}
      />
      <View className="w-full max-w-[60rem] mt-[6.4rem] p-[2rem]">
        <SpoqaText className="text-size15">
          헤더 상단 고정. 좌측 버튼, 중앙 라벨, 우측 버튼(옵션) 구성을 확인하세요.
        </SpoqaText>
      </View>
    </View>
  );
}

export default HeaderView;

import type { ReactNode } from "react";
import { View } from "react-native";

import HeaderRightActions from "@/components/header-right-actions/header-right-actions";
import PageHeader from "@/components/page-header/page-header";

interface RootTabHeaderProps {
  title?: string;
  rightExtraContent?: ReactNode;
}

function RootTabHeader({ title = " ", rightExtraContent }: RootTabHeaderProps) {
  return (
    <PageHeader
      title={title}
      showBackButton={false}
      rightContent={
        <View className="flex-row items-center gap-[1.2rem]">
          {rightExtraContent}
          <HeaderRightActions />
        </View>
      }
    />
  );
}

export default RootTabHeader;

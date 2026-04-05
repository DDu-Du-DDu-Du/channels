import { View } from "react-native";

import HeaderRightActions from "@/components/header-right-actions/header-right-actions";
import PageHeader from "@/components/page-header/page-header";

// Legacy component kept for compatibility with old imports.

function MainHeader() {
  return (
    <View>
      <PageHeader
        title=""
        showBackButton={false}
        className="px-[2.4rem] pb-[1.5rem] pt-[2rem]"
        rightContent={<HeaderRightActions />}
      />
    </View>
  );
}

export default MainHeader;

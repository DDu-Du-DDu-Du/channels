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
        rightContent={<HeaderRightActions />}
      />
    </View>
  );
}

export default MainHeader;

import { Pressable, View } from "react-native";

import PageHeader from "@/components/page-header/page-header";
import { useThemeColorToken } from "@/hooks/use-theme-color";
import { EditIcon } from "@/icons";

interface GoalDetailHeaderProps {
  goalName: string;
  handlePressBack: () => void;
  onPressEdit?: () => void;
}

function GoalDetailHeader({ goalName, handlePressBack, onPressEdit }: GoalDetailHeaderProps) {
  const iconFill = useThemeColorToken("ui.icon.default");

  return (
    <View>
      <PageHeader
        title={goalName}
        onPressBack={handlePressBack}
        rightContent={
          onPressEdit ? (
            <Pressable
              onPress={onPressEdit}
              className="size-[2.4rem] items-end justify-center"
              hitSlop={8}
            >
              <EditIcon
                size={16}
                fill={iconFill}
              />
            </Pressable>
          ) : undefined
        }
      />
    </View>
  );
}

export default GoalDetailHeader;

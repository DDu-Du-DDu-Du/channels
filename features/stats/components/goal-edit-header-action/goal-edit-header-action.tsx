import { Pressable } from "react-native";

import { useThemeColorToken } from "@/hooks/use-theme-color";
import { EditIcon } from "@/icons";

import { useRouter } from "expo-router";

interface GoalEditHeaderActionProps {
  goalId: number;
  yearMonth?: string;
  backPathname: string;
}

function GoalEditHeaderAction({ goalId, yearMonth, backPathname }: GoalEditHeaderActionProps) {
  const router = useRouter();
  const iconFill = useThemeColorToken("ui.icon.default");

  const handlePressEdit = () => {
    if (!goalId) {
      return;
    }

    router.push({
      pathname: "/goal/editor",
      params: {
        goalId,
        backHref: yearMonth
          ? `${backPathname}?yearMonth=${encodeURIComponent(yearMonth)}`
          : backPathname,
      },
    });
  };

  return (
    <Pressable
      onPress={handlePressEdit}
      className="size-[2.4rem] items-center justify-center"
      hitSlop={8}
    >
      <EditIcon
        size={16}
        fill={iconFill}
      />
    </Pressable>
  );
}

export default GoalEditHeaderAction;

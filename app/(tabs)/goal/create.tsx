import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { HeaderRightActions, PageHeader } from "@/components";
import { GoalEditorForm } from "@/features/goal";

import { useLocalSearchParams, useRouter } from "expo-router";

const toSingleParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
};

type GoalCreateSuccessRedirect = {
  pathname: "/feed" | "/stats";
  params?: {
    openGoalSheet?: string;
    yearMonth?: string;
  };
};

function Create() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{
    returnTo?: string | string[];
    openGoalSheet?: string | string[];
    yearMonth?: string | string[];
  }>();
  const returnTo = toSingleParam(params.returnTo);
  const openGoalSheet = toSingleParam(params.openGoalSheet);
  const yearMonth = toSingleParam(params.yearMonth);
  const successRedirect: GoalCreateSuccessRedirect | undefined =
    returnTo === "/feed" || returnTo === "/stats"
      ? {
          pathname: returnTo,
          params: {
            ...(openGoalSheet ? { openGoalSheet } : {}),
            ...(yearMonth ? { yearMonth } : {}),
          },
        }
      : undefined;

  const handlePressBack = () => {
    if (!successRedirect) {
      return;
    }

    router.replace(successRedirect);
  };

  return (
    <View className="flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel">
      <PageHeader
        title={t("navigation.goalCreate")}
        onPressBack={successRedirect ? handlePressBack : undefined}
        titleClassName="text-role-text-inverse dark:text-role-dark-text-inverse"
        rightContent={<HeaderRightActions />}
      />
      <GoalEditorForm
        submitLabel={t("goal.create")}
        successRedirect={successRedirect}
      />
    </View>
  );
}

export default Create;

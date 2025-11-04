import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";

import { GoalPrivacyType } from "@/types/response/goal/goal";

interface PrivacyFormType {
  privacyType: GoalPrivacyType;
}

export interface UsePrivacySheetParams {
  goalPrivacy: GoalPrivacyType;
  onSubmit: (privacyType: GoalPrivacyType) => void;
}

function usePrivacySheet({ goalPrivacy, onSubmit }: UsePrivacySheetParams) {
  const methods = useForm<PrivacyFormType>({
    defaultValues: { privacyType: goalPrivacy },
  });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    methods.reset({ privacyType: goalPrivacy });
  }, [goalPrivacy]);

  const handlePrivacySubmit = methods.handleSubmit(
    useCallback(
      ({ privacyType }) => {
        onSubmit(privacyType);
      },
      [onSubmit],
    ),
  );

  return { methods, handlePrivacySubmit };
}

export default usePrivacySheet;

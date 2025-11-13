import { useCallback, useState } from "react";

import { useLocalSearchParams, useRouter } from "expo-router";

type UseFeedTypeSwitchState = {
  selectedOption: string;
  alternativeOption: string;
};

function useFeedTypeSwitchToggle({ selectedOption, alternativeOption }: UseFeedTypeSwitchState) {
  const { view } = useLocalSearchParams<{ view?: string }>();
  const router = useRouter();

  const [toggle, setToggle] = useState(
    view === alternativeOption ? alternativeOption : selectedOption,
  );

  const handleToggleToFirst = useCallback(() => {
    if (toggle === selectedOption) {
      return;
    }

    setToggle(selectedOption);
    router.setParams({ view: selectedOption });
  }, [router, selectedOption, toggle]);

  const handleToggleToSecond = useCallback(() => {
    if (toggle === alternativeOption) {
      return;
    }

    setToggle(alternativeOption);
    router.setParams({ view: alternativeOption });
  }, [router, alternativeOption, toggle]);

  return { toggle, handleToggleToFirst, handleToggleToSecond };
}

export default useFeedTypeSwitchToggle;

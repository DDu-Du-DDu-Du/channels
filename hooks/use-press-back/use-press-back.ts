import { useRouter } from "expo-router";

function usePressBack() {
  const router = useRouter();

  const handlePressBack = () => {
    router.back();
  };

  return { handlePressBack };
}

export default usePressBack;

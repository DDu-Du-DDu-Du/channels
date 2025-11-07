import type { TextStyle, ViewStyle } from "react-native";

interface UseSheetButtonStyleParams {
  buttonType?: "main" | "sub";
}

function useSheetButtonStyle({ buttonType = "main" }: UseSheetButtonStyleParams) {
  const rem = (v: number) => v * 10; // project uses 1rem = 10px

  const containerStyle: ViewStyle = { flexGrow: 2 };

  const innerStyle: ViewStyle =
    buttonType === "main"
      ? {
          height: rem(8),
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
        }
      : {
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          height: rem(3.6),
        };

  const contentStyle: ViewStyle =
    buttonType === "main"
      ? { alignItems: "center", justifyContent: "center" }
      : { flexDirection: "row", alignItems: "center" };

  const titleStyle: TextStyle =
    buttonType === "sub"
      ? { fontSize: 13, textAlign: "left", marginLeft: rem(1.6) }
      : { fontSize: 13, marginTop: rem(0.6) };

  return { containerStyle, innerStyle, contentStyle, titleStyle };
}

export default useSheetButtonStyle;

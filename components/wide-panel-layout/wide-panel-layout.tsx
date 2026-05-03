import type { ReactNode } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";

export interface WidePanelLayoutProps {
  control: ReactNode;
  detail: ReactNode;
  controlWidth?: ViewStyle["flexBasis"];
  maxWidth?: number;
  className?: string;
  controlClassName?: string;
  detailClassName?: string;
  style?: StyleProp<ViewStyle>;
}

function WidePanelLayout({
  control,
  detail,
  controlWidth = "34%",
  maxWidth = 1440,
  className,
  controlClassName,
  detailClassName,
  style,
}: WidePanelLayoutProps) {
  const resolvedClassName = `flex-1 bg-role-surface-panel dark:bg-role-dark-surface-panel px-[2.4rem] pb-[1.6rem] pt-[1.6rem] ${
    className ?? ""
  }`;
  const panelClassName = `w-full flex-1 self-center overflow-hidden rounded-radius15 border border-role-border-subtle bg-role-surface-canvas dark:border-role-dark-border-subtle dark:bg-role-dark-surface-canvas`;
  const controlPanelClassName = `overflow-hidden ${controlClassName ?? ""}`;
  const detailPanelClassName = `min-w-0 flex-1 overflow-hidden ${detailClassName ?? ""}`;

  return (
    <View className={resolvedClassName}>
      <View
        className={panelClassName}
        style={[{ maxWidth }, style]}
      >
        <View className="flex-1 flex-row">
          <View
            className={controlPanelClassName}
            style={{
              flexBasis: controlWidth,
              maxWidth: 480,
              minWidth: 280,
            }}
          >
            {control}
          </View>
          <View className="w-px self-stretch bg-role-border-subtle dark:bg-role-dark-border-subtle" />
          <View className={detailPanelClassName}>{detail}</View>
        </View>
      </View>
    </View>
  );
}

export default WidePanelLayout;

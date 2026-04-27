import { View } from "react-native";

import { SpoqaText } from "@/components";
import type { DesignSystemTokenKey } from "@/constants/theme";

import {
  DESIGN_TOKEN_COMPONENT_PREVIEW_REGISTRY,
  type DesignTokenComponentPreviewItem,
} from "./design-token-preview-registry";

interface DesignTokenComponentPreviewListProps {
  tokenKey?: DesignSystemTokenKey | null;
  items?: DesignTokenComponentPreviewItem[];
  emptyLabel?: string;
}

function DesignTokenComponentPreviewList({
  tokenKey,
  items = DESIGN_TOKEN_COMPONENT_PREVIEW_REGISTRY,
  emptyLabel = "연결된 컴포넌트 미리보기가 없습니다.",
}: DesignTokenComponentPreviewListProps) {
  const previewItems = tokenKey ? items.filter((item) => item.tokenKeys.includes(tokenKey)) : items;

  if (previewItems.length === 0) {
    return (
      <View className="rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[1.2rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card">
        <SpoqaText className="text-size12 text-role-text-secondary dark:text-role-dark-text-secondary">
          {emptyLabel}
        </SpoqaText>
      </View>
    );
  }

  return (
    <View className="gap-[1rem]">
      {previewItems.map((item) => {
        const Preview = item.Preview;

        return (
          <View
            key={item.id}
            className="rounded-radius10 border border-role-border-subtle bg-role-surface-card p-[1.2rem] dark:border-role-dark-border-subtle dark:bg-role-dark-surface-card"
          >
            <SpoqaText className="text-size13 text-role-text-primary dark:text-role-dark-text-primary">
              {item.title}
            </SpoqaText>
            <SpoqaText className="mt-[0.4rem] text-size11 text-role-text-secondary dark:text-role-dark-text-secondary">
              {item.description}
            </SpoqaText>

            <View className="mt-[1rem]">
              <Preview />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default DesignTokenComponentPreviewList;

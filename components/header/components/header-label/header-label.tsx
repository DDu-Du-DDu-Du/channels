import SpoqaText from "@/components/spoqa-text/spoqa-text";

export interface HeaderLabelProps {
  label: string;
  onPressLabel?: () => void;
}

function HeaderLabel({ label, onPressLabel }: HeaderLabelProps) {
  return (
    <SpoqaText
      className="text-size15 select-none"
      onPress={onPressLabel}
    >
      {label}
    </SpoqaText>
  );
}

export default HeaderLabel;

import HeaderRightActions from "@/components/header-right-actions/header-right-actions";
import PageHeader from "@/components/page-header/page-header";

interface RootTabHeaderProps {
  title?: string;
}

function RootTabHeader({ title = " " }: RootTabHeaderProps) {
  return (
    <PageHeader
      title={title}
      showBackButton={false}
      rightContent={<HeaderRightActions />}
    />
  );
}

export default RootTabHeader;

import HeaderRightActions from "@/components/header-right-actions/header-right-actions";
import PageHeader from "@/components/page-header/page-header";

interface RootTabHeaderProps {
  title?: string;
}

function RootTabHeader({ title = "" }: RootTabHeaderProps) {
  return (
    <PageHeader
      title={title}
      showBackButton={false}
      rightContent={<HeaderRightActions />}
      className="px-[2.4rem] pb-[1.5rem] pt-[2rem]"
      titleClassName="text-size18 text-role-text-primary dark:text-role-dark-text-primary"
    />
  );
}

export default RootTabHeader;

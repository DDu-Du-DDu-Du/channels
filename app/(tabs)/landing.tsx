import { useMenuActivationTabRouting } from "@/hooks";

import { Redirect } from "expo-router";

function Landing() {
  const { firstActiveHref } = useMenuActivationTabRouting();

  return <Redirect href={firstActiveHref} />;
}

export default Landing;

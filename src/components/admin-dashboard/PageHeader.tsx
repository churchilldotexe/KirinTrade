import type { PropsWithChildren } from "react";

function PageHeader({ children }: PropsWithChildren) {
  return <h1 className="mb-4 text-4xl">{children}</h1>;
}

export default PageHeader;

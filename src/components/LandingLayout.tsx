import { AppShell, BackgroundImage, createStyles } from "@mantine/core";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const useStyle = createStyles((theme) => ({
  appShell: {
    background: theme.colors.primary?.[0],
  },
}));

function LandingLayout({ children }: Props) {
  const { classes } = useStyle();
  return (
    <BackgroundImage src={"background.svg"}>
      <AppShell className={classes.appShell} header={<Header />}>
        {children}
      </AppShell>
    </BackgroundImage>
  );
}

export default LandingLayout;

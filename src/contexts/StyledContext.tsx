"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "styled-components";
import "bootstrap/dist/css/bootstrap.min.css";
// CUSTOM THEME
import theme from "theme";
import GlobalStyles from "theme/global-styles/globalStyles";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)


export default function StyledContext({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme()}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}

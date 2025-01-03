import React, { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider, Attribute } from "next-themes";

export function ThemeProvider({ children, ...props }) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
export default ThemeProvider;
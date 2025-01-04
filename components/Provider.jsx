import { ThemeProvider } from "@/components/theme-provider";
import {  Toaster } from "react-hot-toast";

const Providers = ({ children }) => {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </>
  );
};
export default Providers;

import { Toaster } from "react-hot-toast";

const Providers = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-center" />
    </>
  );
};
export default Providers;

import Navbar from "./Navbar";
import { auth } from "@clerk/nextjs/server";
const NavMain = async () => {
  const { userId } = await auth();
  return <Navbar userId={userId} />;
};

export default NavMain;

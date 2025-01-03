import loader from "@/public/loader.svg"; // นำเข้ารูปภาพ loader.gif
import Image from "next/image";

const Loading = () => {
  return (
    <>
     <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
     <Image
       src={loader}
       alt="loader"
       width={100}
       height={100}
       className=" object-contain"
     />
     <p className="mt-[20px] font-epilogue font-bold text-[20px] text-white text-center">
       {/* แปลเป็นภาษาไทย */}
       กำลังโหลดข้อมูล<br /> กรุณารอสักครู่...
 
     </p>
      </div>
    </>
  );
};

export default Loading
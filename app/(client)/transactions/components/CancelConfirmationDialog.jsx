import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle,
   } from "@/components/ui/alert-dialog";
   
   export default function CancelConfirmationDialog({ isOpen, onClose, onConfirm }) {
     return (
       <AlertDialog open={isOpen} onOpenChange={onClose}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>ยืนยันการยกเลิก</AlertDialogTitle>
             <AlertDialogDescription>
               คุณต้องการยกเลิกรายการนี้หรือไม่?
               การดำเนินการนี้ไม่สามารถย้อนกลับได้
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel>ปิด</AlertDialogCancel>
             <AlertDialogAction
               className="bg-red-500 text-white hover:bg-red-600"
               onClick={onConfirm}
             >
               ยืนยัน
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     );
   }
   

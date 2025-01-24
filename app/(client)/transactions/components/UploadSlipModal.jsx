import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UploadSlipModal({ isOpen, onClose, onUpload, selectedTransaction }) {
  const [slipFile, setSlipFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSlipFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (slipFile) {
      onUpload(slipFile);
    }
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(amount);
    return type === "DEPOSIT" ? `+${formattedAmount}` : `-${formattedAmount}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl">อัพโหลดสลิป</DialogTitle>
          <DialogDescription className="text-sm">
            กรุณาอัพโหลดภาพสลิปเพื่อยืนยันการทำรายการ
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">จำนวนเงิน</Label>
            <p className="text-lg font-semibold">
              {selectedTransaction &&
                formatAmount(selectedTransaction.amount, selectedTransaction.transactionType)}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">อัพโหลดสลิป</Label>
            <Input
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              className="text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!slipFile}
            className="w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" />
            อัพโหลด
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


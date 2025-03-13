
import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui-custom/Button";
import { QrCode, Copy, Download, X } from "lucide-react";
import { toast } from "sonner";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
}

const QRCodeModal = ({ isOpen, onClose, restaurantId, restaurantName }: QRCodeModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const shareUrl = `${window.location.origin}/restaurants/${restaurantId}`;
  
  useEffect(() => {
    if (isOpen) {
      // Generate QR code using Google Charts API
      const encodedUrl = encodeURIComponent(shareUrl);
      const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodedUrl}&choe=UTF-8`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, shareUrl]);
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };
  
  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `${restaurantName.replace(/\s+/g, "-")}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded");
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-foodz-500" />
              Share Your Restaurant
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6 flex flex-col items-center">
            <p className="text-muted-foreground text-sm mb-4 text-center">
              Share this QR code with your customers so they can easily access your restaurant page
            </p>
            
            <div className="border p-3 rounded-lg bg-gray-50 mb-4">
              {qrCodeUrl && (
                <img 
                  src={qrCodeUrl} 
                  alt={`QR code for ${restaurantName}`} 
                  className="w-64 h-64"
                />
              )}
            </div>
            
            <div className="w-full mb-4">
              <div className="flex items-center mb-2">
                <div className="flex-grow font-medium text-sm">Restaurant Link:</div>
                <button 
                  onClick={copyLinkToClipboard}
                  className="text-foodz-600 hover:text-foodz-700 text-sm flex items-center"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </button>
              </div>
              <div className="p-2 bg-gray-100 rounded text-sm break-all">
                {shareUrl}
              </div>
            </div>
            
            <div className="flex space-x-3 w-full">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button 
                className="flex-1"
                onClick={downloadQRCode}
                icon={<Download className="h-4 w-4 mr-2" />}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default QRCodeModal;

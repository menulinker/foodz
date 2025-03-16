
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui-custom/Button";
import { QrCode, Copy, Download, X, Share2 } from "lucide-react";
import { toast } from "sonner";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantId: string;
  restaurantName: string;
}

const QRCodeModal = ({ isOpen, onClose, restaurantId, restaurantName }: QRCodeModalProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const shareUrl = `${window.location.origin}/restaurant/${restaurantId}`;
  
  useEffect(() => {
    if (isOpen && restaurantId) {
      // Generate QR code using Google Charts API
      const encodedUrl = encodeURIComponent(shareUrl);
      const qrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodedUrl}&choe=UTF-8`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, shareUrl, restaurantId]);
  
  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };
  
  const downloadQRCode = () => {
    // Create a temporary link and download the image
    fetch(qrCodeUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${restaurantName.replace(/\s+/g, "-")}-qrcode.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("QR code downloaded");
      })
      .catch(() => {
        toast.error("Failed to download QR code");
      });
  };

  // Function to share QR code
  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} Menu`,
          text: `Check out the menu for ${restaurantName}`,
          url: shareUrl,
        });
        toast.success("Link shared successfully");
      } catch (error) {
        console.error("Error sharing:", error);
        copyLinkToClipboard();
      }
    } else {
      copyLinkToClipboard();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <QrCode className="h-5 w-5 mr-2 text-foodz-500" />
            Share Your Restaurant
          </DialogTitle>
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </DialogHeader>
        
        <div className="p-6 flex flex-col items-center">
          <p className="text-muted-foreground text-sm mb-4 text-center">
            Share this QR code with your customers so they can easily access your restaurant page
          </p>
          
          <div className="border border-foodz-200 p-6 rounded-lg bg-foodz-50 mb-6 flex flex-col items-center">
            {qrCodeUrl && (
              <>
                <div className="bg-white p-3 rounded-lg shadow-sm mb-3">
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR code for ${restaurantName}`} 
                    className="w-56 h-56"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null;
                      (e.target as HTMLImageElement).src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzg4OCIqPlFSIENvZGUgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-foodz-800">Scan to view menu</h3>
                  <p className="text-xs text-foodz-600 mt-1">powered by foodz</p>
                </div>
              </>
            )}
          </div>
          
          <div className="w-full mb-6">
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
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={downloadQRCode}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={shareQRCode}
              className="w-full"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;

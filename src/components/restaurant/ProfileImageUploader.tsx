
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui-custom/Button";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

interface ProfileImageUploaderProps {
  userId: string;
  imageUrl: string;
  onImageUpdate: (url: string) => void;
}

const ProfileImageUploader = ({ userId, imageUrl, onImageUpdate }: ProfileImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !userId) return;
    
    setIsUploading(true);
    
    try {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `restaurants/${userId}/profile`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update parent component with the new image URL
      onImageUpdate(downloadURL);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };
  
  // Handle image removal
  const handleRemoveImage = async () => {
    if (!userId || !imageUrl) return;
    
    setIsUploading(true);
    
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `restaurants/${userId}/profile`);
      
      // Delete the file from storage
      await deleteObject(storageRef);
      
      // Update parent component
      onImageUpdate("");
      
      toast.success("Image removed successfully");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-start space-x-6">
      <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Restaurant profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Upload a clear image of your restaurant or logo. <br />
          Recommended size: 500x500 pixels.
        </p>
        
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-foodz-500 mr-2"></div>
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Upload Image
          </Button>
          
          {imageUrl && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </Button>
          )}
          
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/png, image/jpeg, image/jpg"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileImageUploader;

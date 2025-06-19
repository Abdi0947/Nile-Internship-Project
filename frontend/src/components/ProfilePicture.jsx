import React, { useState, useRef, useEffect } from 'react';
import { FiEdit, FiUpload, FiCamera, FiUser } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../features/Authentication';
import toast from 'react-hot-toast';
import { getProfileImage, saveProfileImage, addCacheBusting } from '../lib/profileImageUtils';

const ProfilePicture = ({ 
  profilePic, 
  firstName = "", 
  size = "medium", 
  editable = true,
  onImageUpdate = null,
  fullWidth = false
}) => {
  const dispatch = useDispatch();
  const { Authuser } = useSelector((state) => state.auth);
  const [localImage, setLocalImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now());
  const [showFallbackImage, setShowFallbackImage] = useState(true);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const fallbackRef = useRef(null);
  
  // Initialize and update local image from props or Redux
  useEffect(() => {
    // Use our utility function to get the image from various sources
    const imageUrl = getProfileImage(profilePic, Authuser);
    
    if (imageUrl) {
      setLocalImage(imageUrl);
      setShowFallbackImage(false);
    } else {
      setShowFallbackImage(true);
      console.log('Using fallback image');
    }
  }, [profilePic, Authuser]);

  // Size classes mapping
  const sizes = {
    small: {
      container: "w-7 h-7 sm:w-8 sm:h-8", // Adjusted for TopNavbar
      text: "text-sm",
      editIcon: "text-xs"
    },
    medium: {
      container: "w-24 h-24",
      text: "text-2xl",
      editIcon: "text-lg"
    },
    large: {
      container: "w-32 h-32", 
      text: "text-4xl",
      editIcon: "text-xl"
    },
    xl: {
      container: "w-40 h-40",
      text: "text-5xl",
      editIcon: "text-2xl"
    }
  };

  const sizeClass = sizes[size]?.container || sizes.medium.container;
  const textSizeClass = sizes[size]?.text || sizes.medium.text;
  const editIconClass = sizes[size]?.editIcon || sizes.medium.editIcon;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Read the file and create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      
      // Set local image immediately for UI feedback
      setLocalImage(imageData);
      setImageKey(Date.now()); // Update key to force re-render
      setShowFallbackImage(false);
      
      // Save the image to localStorage for persistence
      saveProfileImage(imageData);
      
      // Notify parent component if callback provided
      if (onImageUpdate) {
        onImageUpdate(imageData);
      } else {
        // Otherwise update directly ourselves
        updateProfileImage(imageData);
      }
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast.error('Failed to read image file');
    };
    
    reader.readAsDataURL(file);
  };

  const updateProfileImage = async (imageData) => {
    try {
      setIsUploading(true);
      
      // Update the user's profile with the new image data
      const result = await dispatch(updateUserInfo({ 
        ProfilePic: imageData 
      })).unwrap();
      
      // Update the image key to force refresh
      setImageKey(Date.now());
      
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Error updating profile picture:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (editable && !isUploading) {
      fileInputRef.current.click();
    }
  };

  const containerStyles = fullWidth ? "w-full flex justify-center" : "";
  
  // Force image reload on error
  const handleImageError = () => {
    console.error('Image failed to load:', localImage);
    setShowFallbackImage(true);
  };

  return (
    <div className={containerStyles}>
      <div className="flex flex-col items-center">
        <div 
          className={`${sizeClass} relative rounded-full overflow-hidden ${editable ? 'cursor-pointer' : ''} group`}
          onClick={editable ? triggerFileInput : undefined}
        >
          {/* Actual image */}
          {!showFallbackImage && (
            <img 
              ref={imageRef}
              src={localImage || ''}
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={handleImageError}
              key={imageKey} // Force re-render on key change
            />
          )}
          
          {/* Fallback */}
          {showFallbackImage && (
            <div 
              ref={fallbackRef}
              className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold"
            >
              {firstName ? firstName.charAt(0).toUpperCase() : <FiUser className={textSizeClass} />}
            </div>
          )}
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
          
          {/* Edit overlay */}
          {editable && !isUploading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <FiCamera className={`text-white ${editIconClass}`} />
            </div>
          )}
        </div>
        
        {editable && (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="text-blue-600 text-sm hover:underline mt-2 flex items-center gap-1"
            >
              {isUploading ? 'Uploading...' : 'Change Photo'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePicture; 
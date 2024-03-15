import React, { useState, useRef, useEffect } from 'react'
import {CiCircleRemove} from 'react-icons/ci'

const UploadImage = ({setFormData}) => {

  const [imageFile, setImageFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);

  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = async(e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const resizedFile = await resizeImage(file);
        setImageFile(resizedFile);
        previewFile(resizedFile);
      } catch (error) {
        console.error('Error resizing image:', error);
      }
    }
  }

  //reduce image size before uploading to cloudinary
  const resizeImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;
  
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(resizedFile);
          }, 'image/jpeg', 0.7); // Adjust quality here if needed
        }
        img.onerror = (error) => {
          reject(error);
        }
      }
      reader.onerror = (error) => {
        reject(error);
      }
    });
  }

  const handleFileRemove = () => {
    setImageFile(null);
    setPreviewSource(null);
    setFormData((prev) => ({...prev, imageFile: null}));
  }

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    }
  }

  useEffect(()=>{
    if(imageFile){
      previewFile(imageFile);
      setFormData((prev) => ({...prev, imageFile: imageFile}));
    }
  }, [imageFile, setFormData])

  return (
    <div className='flex items-center justify-center gap-5 p-2 rounded-lg border border-dashed -mb-3'>
      
      <div className='flex flex-col items-center'>
        <p className='text-[1.1rem]'>Add Picture</p>
        <div className='flex gap-3'>

          <input
            type='file'
            ref={fileInputRef}
            className='hidden'
            accept="image/png, image/gif, image/jpeg"
            onChange={handleFileChange}
          />

          <button
            onClick={handleClick}
            className="bg-blue-500 rounded-[8px] font-medium text-white px-[12px] py-[8px] mt-2 hover:scale-[0.98] transition-all duration-150"
          >
            Select
          </button>
        </div>
      </div>

      {previewSource && 
        <div className='flex items-start'>
            <img
            src={previewSource}
            alt='selectedImage'
            className="aspect-square w-[100px] rounded-full object-cover"
          />
          <button className='text-2xl' onClick={handleFileRemove}><CiCircleRemove/></button>
        </div>
      }

    </div>
  )
}

export default UploadImage
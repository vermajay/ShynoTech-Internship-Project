import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useSelector } from "react-redux"
import { ACCOUNT_TYPE } from "../utils/constants"
import { getImagePosts, uploadImagePost } from "../services/operations/imagePostApi"
import UploadImage from "../components/UploadImage"
import toast from "react-hot-toast"
import uploadToCloudinary from "../services/operations/uploadToCloudinary"

const ImagePosts = () => {

  const [fetchLoading, setFetchLoading] = useState(false)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [imagePosts, setImagePosts] = useState(null)
  const {token} = useSelector((state) => state.auth)
  const {user} = useSelector((state) => state.profile)

  const [formData, setFormData] = useState({
    imageFile: null
  });

  //upload image post to database
  const uploadHandler = async() => {
    if(formData.imageFile === null){
      toast.error("Select an image to upload");
      return;
    }
    setUploadLoading(true);
    const imgData = new FormData();
    imgData.append("imageFile", formData?.imageFile)
    const img = await uploadToCloudinary(imgData);
    console.log("Inside image posts, printing url-> ", img?.secure_url);

    if(img?.secure_url){
      const result = uploadImagePost(token, img?.secure_url);
      console.log("upload image api response: ", result);
    }
    setUploadLoading(false);
  }

  //fetch image posts upon component mounting
  useEffect(()=>{   
    setFetchLoading(true)
    ;(async()=>{            
      const results = await getImagePosts(token);
      setImagePosts(results);
    })()
    setFetchLoading(false)
  },[token])

  if(fetchLoading) return <div className="flex justify-center items-center w-full h-screen"><div className="spinner"></div></div>

  return (
    <div>
      <Navbar/>
      <div className="overflow-auto w-full h-[calc(100vh-9rem)] relative pb-20 sm:pb-0">

        {/* if admin, then show upload image component */}
        {
          user.accountType === ACCOUNT_TYPE.ADMIN && 

          <div className="max-w-md mx-auto py-5 m-4 flex flex-col gap-5">

            <UploadImage setFormData={setFormData}/>

            <button className="bg-blue-500 rounded-[8px] font-medium text-white px-[12px] py-[8px] hover:scale-[0.98] transition-all duration-150" disabled={uploadLoading}
            onClick={uploadHandler}
            >
              {uploadLoading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        }

        {imagePosts?.length === 0 ? <div className="grid place-items-center mt-40 font-semibold text-3xl">No images☹️</div>
        :
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 m-10 gap-5">
          {
            imagePosts?.map((image, index)=>(
              <div key={index} className="relative group rounded-xl overflow-hidden">
                <div className="absolute inset-0 group-hover:flex hidden flex-col items-center justify-center text-white text-lg font-semibold bg-black bg-opacity-50">
                  <div>{image.adminDetails.name}</div>
                  <div>{image.adminDetails.email}</div>
                </div>
                <img src={image.image} alt="post"/>
              </div>
            ))
          }
        </div>
        }

      </div>
    </div>
  )
}

export default ImagePosts
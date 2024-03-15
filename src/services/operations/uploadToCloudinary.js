import { apiConnector } from "../apiConnector";
import { UPLOAD_PROFILE_PIC_API } from "../apis";

const uploadToCloudinary = async(data) => {   //this uploads picture to cloudinary and returns the image url
    let result = null;
    try{
      const response = await apiConnector("PUT", UPLOAD_PROFILE_PIC_API, data)
      console.log("UPLOAD_PROFILE_PIC_API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error(response.data.message)
      }
      result = response?.data?.data
    }
    catch(error){
      console.log("UPLOAD_PROFILE_PIC_API ERROR............", error)
    }
    return result
}

export default uploadToCloudinary;
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiConnector"
import { GET_IMAGE_POSTS, UPLOAD_IMAGE_POST } from "../apis"

export async function getImagePosts(token){
    let result = []
    const toastId = toast.loading("Fetching image posts...")

    try {
        const response = await apiConnector("GET", GET_IMAGE_POSTS, null, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("GET_IMAGE_POSTS API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could not fetch image posts")
        }
        result = response?.data?.allImagePosts

    } catch (error) {
        console.log("GET_IMAGE_POSTS API ERROR............", error)
        toast.error(error?.response?.data?.message)
    }
    toast.dismiss(toastId)
    toast.success("Image posts fetched successfully")
    return result
}

export async function uploadImagePost(token, image){
    let result = null
    const toastId = toast.loading("Uploading image post...")

    try {
        const response = await apiConnector("POST", UPLOAD_IMAGE_POST, {image}, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })
        console.log("UPLOAD_IMAGE_POST API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could not upload image post")
        }
        result = response?.data?.newImagePost

    } catch (error) {
        console.log("UPLOAD_IMAGE_POST API ERROR............", error)
        toast.error(error?.response?.data?.message)
    }
    toast.dismiss(toastId)
    toast.success("Image post uploaded successfully")
    return result
}
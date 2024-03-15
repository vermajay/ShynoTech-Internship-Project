const BASE_URL = process.env.REACT_APP_BASE_URL

//these are the list of all the backend apis

export const UPLOAD_PROFILE_PIC_API = BASE_URL + "/upload";
export const SIGNUP_API = BASE_URL + "/signup"
export const LOGIN_API = BASE_URL + "/login"
export const GET_IMAGE_POSTS = BASE_URL + "/getimageposts"
export const UPLOAD_IMAGE_POST = BASE_URL + "/uploadimagepost"
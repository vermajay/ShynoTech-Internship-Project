import { toast } from "react-hot-toast"
import { setLoading, setToken } from "../../redux/slices/authSlice"
import { setUser } from "../../redux/slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { LOGIN_API, SIGNUP_API } from "../apis"

export function signUp(
    name,
    email,
    password,
    confirmPassword,
    image,
    accountType,
    navigate
){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST", SIGNUP_API, {
                name,
                email,
                password,
                confirmPassword,
                image,
                accountType
            })

            console.log("SIGNUP API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Signup Successful")

            navigate("/login")
        }
        catch(error){
            console.log("SIGNUP API ERROR............", error)
            toast.error(error?.response?.data?.message)
            navigate("/signup")
        }

        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function login(email, password, navigate){

    return async(dispatch) => {
        const toastId = toast.loading("Loading...")
        dispatch(setLoading(true))

        try{
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password
            })

            console.log("LOGIN API RESPONSE............", response)

            if(!response.data.success) {
                throw new Error(response.data.message)
            }
            toast.success("Login Successful")
            console.log("JWT Token -> ", response?.data?.token)

            //set the token after login
            dispatch(setToken(response.data.token))

            //set the user after login
            dispatch(setUser(response.data.user))
            
            //set token and user in local storage
            localStorage.setItem("token", JSON.stringify(response.data.token))
            localStorage.setItem("user", JSON.stringify(response.data.user))

        }
        catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error(error?.response?.data?.message)
            navigate("/")
        }

        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}

export function logout(navigate){
    return (dispatch) => {
        dispatch(setToken(null));
        dispatch(setUser(null));
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        toast.success("Logged Out")
        navigate("/")
    }
}
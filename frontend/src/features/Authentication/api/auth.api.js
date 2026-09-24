import axiosClient from "../../../axiosClient"

export const registerUser = async (payload) => {

    try {
        const response = await axiosClient.post("/auth/register", {
            firstName: payload.firstName,
            lastName: payload.lastName,
            userName: payload.username,
            password: payload.password,
        })
        return response.data
    } catch (error) {
        console.error(error.response.data);
        throw error.response.data
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await axiosClient.post("/auth/login", {
            userName: payload.username,
            password: payload.password
        })
        return response.data
    } catch (error) {
        console.error(error.response.data);
        throw error?.response?.data || "Can not catch error"
    }
}

export const uploadFile = async (file) => {
    console.log("df", file);
    const formData = new FormData()
    formData.append("file", file)

    try {
        const response = await axiosClient.post("/auth/file", formData)
        return response.data
    } catch (error) {
        console.error(error.response.data);
        throw error?.response?.data || error || "Can not catch error"
    }

}

export const getUser = async (token) => {
    try {
        const response = await axiosClient("/auth/get-user", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error(error);
        throw error?.response?.data || error || "Can not catch error"
    }
}

export const logoutUser = async (token) => {
    try {
        const response = await axiosClient.get("/auth/logout", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.error(error);
        throw error?.response?.data || error || "Can not catch error"
    }
}

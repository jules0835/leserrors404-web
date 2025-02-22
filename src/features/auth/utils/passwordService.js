import axios from "axios"

export const sendResetEmail = async (email) => {
  try {
    const response = await axios.post("/api/authentification/password", {
      email,
    })

    return response.data
  } catch (error) {
    return { error: error.response.data.message }
  }
}

export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post("/api/authentification/password/reset", {
      token,
      password,
    })

    return response.data
  } catch (error) {
    return { error: error.response.data.message }
  }
}

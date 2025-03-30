/* eslint-disable max-params */
import axios from "axios"

export const completeAction = async (
  chatId,
  messageId,
  selectedItem,
  action
) => {
  const response = await axios.post("/api/contact/chat/action", {
    chatId,
    messageId,
    selectedItem,
    action,
  })

  return response.data
}

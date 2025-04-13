/* eslint-disable max-params */
import { findAdminChatsForTickets } from "@/db/crud/chatCrud"

export const getTicketsList = async (
  limit,
  page,
  query,
  sortField,
  sortOrder
) => {
  try {
    const tickets = await findAdminChatsForTickets()
    const filteredTickets = tickets.filter((ticket) => {
      const searchString = query.toLowerCase()

      return (
        ticket.user?.firstName?.toLowerCase().includes(searchString) ||
        ticket.user?.lastName?.toLowerCase().includes(searchString) ||
        ticket.user?.email?.toLowerCase().includes(searchString) ||
        ticket.userName?.toLowerCase().includes(searchString) ||
        ticket.email?.toLowerCase().includes(searchString)
      )
    })
    const sortedTickets = filteredTickets.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      }

      return aValue < bValue ? 1 : -1
    })
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTickets = sortedTickets.slice(startIndex, endIndex)

    return {
      tickets: paginatedTickets,
      total: filteredTickets.length,
    }
  } catch (error) {
    throw new Error("Failed to fetch tickets")
  }
}

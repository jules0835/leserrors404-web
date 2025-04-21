/* eslint-disable max-params */
import { findAdminChatsForTicketsWithSearch } from "@/db/crud/chatCrud"

export const getTicketsList = async (
  limit,
  page,
  query,
  sortField,
  sortOrder,
  isActive
) => {
  const tickets = await findAdminChatsForTicketsWithSearch(query, isActive)
  const sortedTickets = tickets.sort((a, b) => {
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
    total: tickets.length,
  }
}

import { NextResponse } from "next/server"
import { getActiveCategories } from "@/db/crud/categorieCrud"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const size = parseInt(searchParams.get("size"), 10) || 10
    const page = parseInt(searchParams.get("page"), 10) || 1
    const query = searchParams.get("query") || ""
    const { Categories, total } = await getActiveCategories(size, page, query)

    return NextResponse.json({
      categories: Categories,
      total,
      page,
      size,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

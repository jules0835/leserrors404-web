import { NextResponse } from "next/server"

export async function GET() {
  const countries = await import(
    "../../../../assets/countries/countries_list.json"
  )

  return NextResponse.json(countries.default)
}

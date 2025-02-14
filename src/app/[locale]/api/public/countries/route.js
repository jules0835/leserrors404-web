import { logKeys } from "@/assets/options/config"
import log from "@/lib/log"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const countries = await import(
      "../../../../../assets/countries/countries_list.json"
    )

    return NextResponse.json(countries.default)
  } catch (error) {
    log.systemError({
      logKey: logKeys.systemError.key,
      message: "Failed to fetch countries",
      isError: true,
      technicalMessage: error.message,
    })

    return NextResponse.json(
      { error: "Failed to fetch countries" },
      { status: 500 }
    )
  }
}

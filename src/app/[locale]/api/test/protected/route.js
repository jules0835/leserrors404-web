import { NextResponse } from "next/server"

//TEST
export function GET() {
  return NextResponse.json({
    message: "Hello from the protected route",
  })
}

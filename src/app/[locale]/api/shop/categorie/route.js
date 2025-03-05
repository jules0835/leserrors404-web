export function GET() {
  return new Response(JSON.stringify({ error: "Failed to fetch categories" }), {
    status: 500,
  })
}

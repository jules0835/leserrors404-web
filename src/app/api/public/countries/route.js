export async function GET() {
  const countries = await import(
    "../../../../assets/countries/countries_list.json"
  )

  return Response.json(countries.default)
}

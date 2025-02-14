export const getAllCountries = async () => {
  const countries = await import(
    "../../../assets/countries/countries_list.json"
  )

  return countries
}

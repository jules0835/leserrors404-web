export default async function Await({ promise, children }) {
  const data = await promise
  console.log(data)
  return children(data)
}

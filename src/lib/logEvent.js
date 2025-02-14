export const logEvent = async ({ level, ...logData }) => {
  try {
    await fetch(`${process.env.SERVER_URL}/en/api/services/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        logLevel: level,
        ...logData,
      }),
    })
  } catch (error) {
    throw new Error(`Failed to log event: ${error.message}`)
  }
}

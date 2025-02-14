import log from "@/lib/log"
import { connectToDatabase } from "@/db/utils/dbUtils"
import { logKeys } from "@/assets/options/config"

export const mwdb = async () => {
  try {
    await connectToDatabase()
    // eslint-disable-next-line no-console
    console.log("Successfully connected to the database")
  } catch (error) {
    log.systemError({
      logKey: logKeys.databaseError.key,
      message: "Error connecting to the database",
      ErrorMessage: error.message,
      data: { error },
    })
  }
}

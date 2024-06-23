import { initiateDeveloperControlledWalletsClient } from '@circle-fin/developer-controlled-wallets'

export const circle = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY as string,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET as string,
})

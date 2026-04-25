import { defineNitroConfig } from 'nitro/config'

// Must be `vercel` for Vercel routing; `node-server` will produce NOT_FOUND on Vercel.
export default defineNitroConfig({
  preset: 'vercel',
})

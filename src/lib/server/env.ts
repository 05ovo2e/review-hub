import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NOTION_API_KEY: z
    .string()
    .min(1, 'NOTION_API_KEY is required')
    .refine(
      val => !val.includes('http') && !val.includes('://'),
      'NOTION_API_KEY should not contain URL'
    ),
  NOTION_DATABASE_ID: z
    .string()
    .min(1, 'NOTION_DATABASE_ID is required')
    .refine(
      val => !val.includes('http') && !val.includes('://'),
      'NOTION_DATABASE_ID should not contain URL'
    )
    .refine(
      val => !val.includes(' '),
      'NOTION_DATABASE_ID should not contain spaces'
    )
    .refine(
      val => /^[a-f0-9-]{32,36}$/.test(val) || /^[a-f0-9]{32,32}$/.test(val),
      'NOTION_DATABASE_ID format should be UUID (32 or 36 characters)'
    ),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_API_KEY: process.env.NOTION_API_KEY,
  NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID,
})

export type Env = z.infer<typeof envSchema>

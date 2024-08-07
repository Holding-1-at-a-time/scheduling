// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Bricolage_Grotesque, Space_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'
import ConvexClerkProvider from '../Providers/ConvexClerkProviders'

const fontHeading = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Space_Mono({
  subsets: ['latin'],
  display: 'swap',
  weights: [ `400`, `700` ],
  variable: '--font-body',
})

export default function Layout({ children }) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <body
          className={cn(
            'antialiased',
            fontHeading.variable,
            fontBody.variable
          )}
        >
          {children}
        </body>
      </html>
    </ConvexClerkProvider>
  )
}
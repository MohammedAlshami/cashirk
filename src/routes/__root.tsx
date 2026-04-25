/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import Navbar from '~/components/Navbar'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Imper',
        description: 'Imper workshop management system.',
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#0e100f' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = router.state.location.pathname
  const isLanding = pathname === '/'
  const showDefaultNavbar = !isLanding
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <>
          {showDefaultNavbar && <Navbar />}
          <div className={`min-h-screen bg-[#0E100F] ${showDefaultNavbar ? 'pt-16' : ''}`}>
            {children}
          </div>
          <TanStackRouterDevtools position="bottom-right" />
          <Scripts />
        </>
      </body>
    </html>
  )
}

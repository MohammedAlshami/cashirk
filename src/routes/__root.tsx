/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouter,
} from '@tanstack/react-router'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { RedirectToHome } from '~/components/RedirectToHome'
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
        title: 'Cashirk — Drive-thru voice AI',
        description:
          'Cashirk is an AI voice agent for drive-thru lanes: natural ordering, menu-aware conversations, and POS-ready handoff.',
        keywords:
          'drive-thru AI, voice agent, restaurant AI, QSR automation, order taking, speaker post, Cashirk',
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
  notFoundComponent: RedirectToHome,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = router.state.location.pathname
  const isLandingLocale =
    pathname === '/' || pathname === '/en' || pathname === '/en/'
  const isFullBleed =
    isLandingLocale || pathname === '/demo' || pathname === '/demo-v2' || pathname === '/map'
  const showDefaultNavbar = !isFullBleed
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
          <Scripts />
        </>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import UIOverlays from '@/components/UIOverlays'
import SmoothScroll from '@/components/SmoothScroll'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

const SITE_URL = 'https://abhay-portfolio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Abhay Chaurasiya | Full-Stack & DevOps Engineer',
  description:
    'Full-Stack & DevOps Engineer specializing in React.js, Next.js, Node.js, Python, Golang, AWS, Kubernetes, Docker, and CI/CD pipelines. CNCF open-source contributor. Available for new opportunities.',
  keywords: [
    'Full-Stack Developer',
    'DevOps Engineer',
    'Cloud Native',
    'React.js',
    'Next.js',
    'Node.js',
    'Python',
    'Golang',
    'AWS',
    'Kubernetes',
    'Docker',
    'Terraform',
    'CI/CD',
    'Helm',
    'CNCF',
    'Open Source',
    'Abhay Chaurasiya',
  ],
  authors: [{ name: 'Abhay Chaurasiya', url: SITE_URL }],
  creator: 'Abhay Chaurasiya',
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Abhay Chaurasiya Portfolio',
    title: 'Abhay Chaurasiya | Full-Stack & DevOps Engineer',
    description:
      'Full-Stack & DevOps Engineer — React, Next.js, Node.js, Python, AWS, Kubernetes, Helm. CNCF open-source contributor.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Abhay Chaurasiya — Full-Stack & DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhay Chaurasiya | Full-Stack & DevOps Engineer',
    description:
      'Full-Stack & DevOps Engineer — React, Next.js, Node.js, Python, AWS, Kubernetes, Helm. CNCF open-source contributor.',
    images: ['/og-image.png'],
  },
}

// JSON-LD structured data — helps Google show rich results for your name
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Abhay Chaurasiya',
  url: SITE_URL,
  jobTitle: 'Full-Stack & DevOps Engineer',
  description:
    'Full-Stack & DevOps Engineer specializing in React.js, Next.js, Node.js, Python, AWS, Kubernetes, Docker, Terraform, and CI/CD pipelines.',
  email: 'abhaychaurasiya19@gmail.com',
  telephone: '+918299211830',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/abhay1999',
    'https://linkedin.com/in/abhay-chaurasiya',
    'https://leetcode.com/u/imt_2018005/',
    'https://www.hackerrank.com/profile/abhaychaurasiya1',
  ],
  knowsAbout: [
    'React.js',
    'Next.js',
    'Node.js',
    'Python',
    'Golang',
    'AWS',
    'Kubernetes',
    'Docker',
    'Terraform',
    'CI/CD',
    'Helm',
    'DevOps',
    'Cloud Native',
    'Full-Stack Development',
    'Open Source',
  ],
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${outfit.variable} font-sans antialiased bg-black text-white min-h-screen selection:bg-white/10`}
        suppressHydrationWarning
      >
        {/* Google Analytics 4 — set NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        <SmoothScroll>
          <UIOverlays />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}

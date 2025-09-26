import ThemeNavigation from "@/components/theme-navigation"

export const metadata = {
  title: 'Team Purple Dad Jokes',
  keywords: ['Dad Jokes', 'Purple Theme', 'Humor'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <>
        <ThemeNavigation />
        {children}
      </>
  )
}

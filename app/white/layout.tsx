import ThemeNavigation from "@/components/theme-navigation"

export const metadata = {
  title: 'Team White Dad Jokes',
  keywords: ['Dad Jokes', 'White Theme', 'Humor'],
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

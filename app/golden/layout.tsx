import ThemeNavigation from "@/components/theme-navigation"

export const metadata = {
  title: 'Team Golden Dad Jokes',
  keywords: ['Dad Jokes', 'Golden Theme', 'Humor'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <ThemeNavigation />
      {children}</body>
    </html>
  )
}

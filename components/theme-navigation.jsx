"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HomeIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function ThemeNavigation() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // List of all theme pages
  const themes = [
    { name: "Purple Finch", path: "/purple", color: "bg-purple-700" },
    { name: "Snowy White Owl", path: "/white", color: "bg-gray-300" },
    { name: "Golden Pheasant", path: "/golden", color: "bg-amber-700" },
  ]

  // Navigate to selected theme page
  const navigateToTheme = (path) => {
    router.push(path)
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation Menu */}
      <div className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <NavigationMenu>
          <NavigationMenuList>

          <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="flex items-center gap-2">
                        <HomeIcon className="w-4 h-4" />
                        Home
                    </div>
                    </NavigationMenuLink>
                </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
    
              <NavigationMenuContent>
             
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {themes.map((theme) => (
                    <ListItem
                      key={theme.path}
                      title={theme.name}
                      onClick={() => router.push(theme.path)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                        <span>Click to view the {theme.name} theme</span>
                      </div>
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {themes.map((theme) => (
              <NavigationMenuItem key={theme.path}>
                <Link href={theme.path} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${theme.color}`}></div>
                      {theme.name}
                    </div>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Menu (Sheet) */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/80 backdrop-blur-sm">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <h2 className="text-xl font-semibold">Team Themes</h2>
              {themes.map((theme) => (
                <Button
                  key={theme.path}
                  variant="ghost"
                  className="justify-start"
                  onClick={() => navigateToTheme(theme.path)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${theme.color}`}></div>
                    {theme.name}
                  </div>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

const ListItem = ({ className, title, children, ...props }) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-50 dark:focus:bg-slate-700 dark:focus:text-slate-50",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-500 dark:text-slate-400">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
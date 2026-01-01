import { Link, Outlet } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { MainNav } from "./main-nav"
import { SiteFooter } from "./site-footer"

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-primary">GustoPlan</h1>
              <span className="text-xs font-mono bg-blue-100 text-blue-800 px-1 rounded border border-blue-200">React</span>
            </Link>
            <MainNav />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <ModeToggle />
              <UserNav />
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}

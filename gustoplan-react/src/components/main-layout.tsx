import { Outlet } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"
import { UserNav } from "./user-nav"
import { MainNav } from "./main-nav"

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <h1 className="text-xl font-bold hidden md:inline-block">GustoPlan</h1>
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
    </div>
  )
}
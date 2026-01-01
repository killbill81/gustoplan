import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const location = useLocation()

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        to="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Tableau de bord
      </Link>
      <Link
        to="/menu"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/menu" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Mon Menu
      </Link>
      <Link
        to="/recipes"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/recipes" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Mes Recettes
      </Link>
      <Link
        to="/ingredients"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/ingredients" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Ingrédients
      </Link>
      <Link
        to="/shopping-list"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          location.pathname === "/shopping-list" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Courses
      </Link>
    </nav>
  )
}

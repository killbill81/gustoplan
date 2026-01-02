import { useEffect, useState } from "react"
import { useNavigate, Outlet } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Loader2 } from "lucide-react"

export default function AuthWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("AuthWrapper: useEffect mounted")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("AuthWrapper: Auth state changed", user ? "User logged in" : "No user")
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        console.log("AuthWrapper: No user, redirecting to /login")
        navigate("/login")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  return <Outlet />
}

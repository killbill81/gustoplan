import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Login.tsx: useEffect mounted")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Login.tsx: Auth state changed", user ? "User logged in" : "No user")
      if (user) {
        console.log("Login.tsx: User found, redirecting to /")
        navigate("/")
      }
    })
    return () => unsubscribe()
  }, [navigate])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redirect handled by App router/auth listener
    } catch (err: any) {
      setError("Email ou mot de passe incorrect.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const provider = new GoogleAuthProvider()
    try {
      const result = await signInWithPopup(auth, provider)
      console.log("Login.tsx: Popup success", result.user)
      // Navigation is handled by onAuthStateChanged
    } catch (err: any) {
      console.error("Login.tsx: Popup error", err)
      setError("Erreur lors de la connexion Google: " + err.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">GustoPlan</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder à vos plans de repas
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 gap-6">
            <Button variant="outline" onClick={handleGoogleLogin} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                  <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                </svg>
              )}
              Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continuer avec
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            <div className="grid gap-2">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="nom@exemple.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  placeholder="******"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button disabled={isLoading} className="mt-2">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter avec Email
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Pas encore de compte ?{" "}
            <a href="#" className="underline text-primary hover:text-primary/80">
              S&apos;inscrire
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

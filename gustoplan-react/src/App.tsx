import { Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import MenuPage from "@/pages/MenuPage"
import RecipesPage from "@/pages/RecipesPage"
import MainLayout from "@/components/main-layout"
import AuthWrapper from "@/components/auth-wrapper"

// Temporary Dashboard / Home page
function Dashboard() {
  return (
    <div className="container py-8">
      <h2 className="text-3xl font-bold">Bienvenue sur GustoPlan !</h2>
      <p className="text-muted-foreground">Votre tableau de bord sera ici.</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthWrapper />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

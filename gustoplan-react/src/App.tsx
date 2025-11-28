import { Routes, Route } from "react-router-dom"
import Login from "@/pages/Login"
import MenuPage from "@/pages/MenuPage"
import RecipesPage from "@/pages/RecipesPage"
import ShoppingListPage from "@/pages/ShoppingListPage"
import DashboardPage from "@/pages/DashboardPage"
import MainLayout from "@/components/main-layout"
import AuthWrapper from "@/components/auth-wrapper"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AuthWrapper />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} /> {/* Use DashboardPage here */}
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
          {/* More protected routes will go here */}
        </Route>
      </Route>
    </Routes>
  )
}

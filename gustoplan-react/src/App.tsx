import { Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
import { Loader2 } from "lucide-react"
import MainLayout from "@/components/main-layout"
import AuthWrapper from "@/components/auth-wrapper"
import { ErrorBoundary } from "@/components/error-boundary"

// Lazy loaded components
const Login = lazy(() => import("@/pages/Login"))
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const MenuPage = lazy(() => import("@/pages/MenuPage"))
const RecipesPage = lazy(() => import("@/pages/RecipesPage"))
const IngredientsPage = lazy(() => import("@/pages/IngredientsPage"))
const ShoppingListPage = lazy(() => import("@/pages/ShoppingListPage"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))

const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-muted/20">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
)

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<AuthWrapper />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/ingredients" element={<IngredientsPage />} />
              <Route path="/shopping-list" element={<ShoppingListPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { PlanningView } from "./components/PlanningView";
import { ListeView } from "./components/ListeView";
import { RecettesView } from "./components/RecettesView";
import { IngredientsView } from "./components/IngredientsView";
import { 
  Calendar, ShoppingCart, BookOpen, LogOut, User, ChefHat, Info, Tag,
  Cloud, CloudOff, Loader2
} from "lucide-react";
import { subscribeDbState } from "./services/db";
import "./App.css";

const AppContent: React.FC = () => {
  const { user, foyer, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"planning" | "liste" | "recettes" | "ingredients">("planning");
  const [dbState, setDbState] = useState<"idle" | "saving">("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const unsubscribe = subscribeDbState((state) => {
      setDbState(state);
    });

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-500 text-sm font-medium">Chargement de GustoPlan...</p>
      </div>
    );
  }

  // Si pas authentifié ou pas encore de Foyer configuré
  if (!user || !foyer) {
    return <AuthScreen />;
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col text-slate-800 font-sans overflow-hidden">
      
      {/* ================= HEADER COMMUN (PC & TABLETTE) ================= */}
      <header 
        className="h-[88px] shrink-0 border-b border-slate-200 px-6 flex items-center justify-between z-10 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/header_banner.png')" }}
      >
        {/* Voile blanc de gradation pour la lisibilité en thème clair */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/95 backdrop-blur-[1px]" />

        <div className="flex items-center gap-3.5 relative z-10">
          <img 
            src="/logo.png" 
            alt="GustoPlan Logo" 
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm" 
          />
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-slate-800 drop-shadow-sm">GustoPlan</h1>
            <span className="text-3xs text-slate-500 font-extrabold uppercase tracking-widest mt-1 block">
              V2 Efficace
            </span>
          </div>
        </div>

        {/* Navigation Onglets (Thème Clair / Boutons Abricot pastels) */}
        <nav className="hidden md:flex bg-slate-100/90 border border-slate-200 p-1 rounded-xl relative z-10">
          <button
            onClick={() => setActiveTab("planning")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "planning"
                ? "bg-orange-100 text-orange-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Planning
          </button>
          
          <button
            onClick={() => setActiveTab("recettes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "recettes"
                ? "bg-orange-100 text-orange-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Mes Recettes
          </button>

          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "ingredients"
                ? "bg-orange-100 text-orange-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <Tag className="w-4 h-4" />
            Ingrédients
          </button>

          <button
            onClick={() => setActiveTab("liste")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "liste"
                ? "bg-orange-100 text-orange-800 shadow-sm"
                : "text-slate-600 hover:text-slate-800 hover:bg-slate-200/50"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Liste de Courses
          </button>
        </nav>

        {/* Profil & Logout */}
        <div className="flex items-center gap-3 md:gap-4 relative z-10">
          <div className="hidden sm:flex items-center gap-2 bg-white/80 border border-slate-200 px-3 py-1.5 rounded-xl">
            <User className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-semibold text-slate-700 max-w-[120px] truncate">
              {user.email}
            </span>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="p-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200/40 rounded-xl text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* ================= CONTENU PRINCIPAL ================= */}
      <main className="flex-grow overflow-hidden relative">
        {activeTab === "planning" && <PlanningView />}
        {activeTab === "recettes" && <RecettesView />}
        {activeTab === "ingredients" && <IngredientsView />}
        {activeTab === "liste" && (
          <div className="h-full max-w-4xl mx-auto">
            <ListeView context="liste" />
          </div>
        )}
      </main>

      {/* ================= NAVIGATION BASSE (MOBILE UNIQUEMENT) ================= */}
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 py-2.5 px-6 flex items-center justify-around z-20 shadow-lg">
        <button
          onClick={() => setActiveTab("planning")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "planning" ? "text-orange-600" : "text-slate-400 hover:text-slate-655"
          }`}
        >
          <Calendar className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Planning</span>
        </button>

        <button
          onClick={() => setActiveTab("recettes")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "recettes" ? "text-orange-600" : "text-slate-400 hover:text-slate-655"
          }`}
        >
          <BookOpen className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Recettes</span>
        </button>

        <button
          onClick={() => setActiveTab("ingredients")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "ingredients" ? "text-orange-600" : "text-slate-400 hover:text-slate-655"
          }`}
        >
          <Tag className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Ingrédients</span>
        </button>

        <button
          onClick={() => setActiveTab("liste")}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === "liste" ? "text-orange-600" : "text-slate-400 hover:text-slate-655"
          }`}
        >
          <ShoppingCart className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Courses</span>
        </button>
      </footer>

    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

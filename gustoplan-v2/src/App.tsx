import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { PlanningView } from "./components/PlanningView";
import { ListeView } from "./components/ListeView";
import { RecettesView } from "./components/RecettesView";
import { IngredientsView } from "./components/IngredientsView";
import { 
  Calendar, ShoppingCart, BookOpen, LogOut, User, ChefHat, Info, Tag
} from "lucide-react";
import "./App.css";

const AppContent: React.FC = () => {
  const { user, foyer, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"planning" | "liste" | "recettes" | "ingredients">("planning");

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium">Chargement de GustoPlan...</p>
      </div>
    );
  }

  // Si pas authentifié ou pas encore de Foyer configuré
  if (!user || !foyer) {
    return <AuthScreen />;
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col text-white font-sans overflow-hidden">
      
      {/* ================= HEADER COMMUN (PC & TABLETTE) ================= */}
      <header 
        className="border-b border-slate-900/85 px-6 py-4 flex items-center justify-between z-10 relative overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/header_banner.png')" }}
      >
        {/* Voile sombre de gradation pour l'effet de profondeur et lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/90 backdrop-blur-[1px]" />

        <div className="flex items-center gap-3.5 relative z-10">
          <img 
            src="/logo.png" 
            alt="GustoPlan Logo" 
            className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shadow-md shadow-violet-500/10" 
          />
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none text-white drop-shadow-md">GustoPlan</h1>
            <span className="text-3xs text-slate-300 font-extrabold uppercase tracking-widest mt-1 block drop-shadow">
              V2 Efficace
            </span>
          </div>
        </div>

        {/* Navigation Onglets (Visible uniquement sur PC/Tablette dans le header) */}
        <nav className="hidden md:flex bg-slate-900/80 backdrop-blur-md border border-slate-800 p-1 rounded-xl relative z-10">
          <button
            onClick={() => setActiveTab("planning")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "planning"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Planning
          </button>
          
          <button
            onClick={() => setActiveTab("recettes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "recettes"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Mes Recettes
          </button>

          <button
            onClick={() => setActiveTab("ingredients")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "ingredients"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <Tag className="w-4 h-4" />
            Ingrédients
          </button>

          <button
            onClick={() => setActiveTab("liste")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "liste"
                ? "bg-violet-600 text-white shadow-md shadow-violet-600/10"
                : "text-slate-300 hover:text-slate-100"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Liste de Courses
          </button>
        </nav>

        {/* Profil & Logout */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden sm:flex items-center gap-2 bg-slate-900/85 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl">
            <User className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-semibold text-slate-200 max-w-[120px] truncate">
              {user.email}
            </span>
          </div>
          <button
            onClick={logout}
            title="Se déconnecter"
            className="p-2.5 bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors"
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
      <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-900/60 py-2.5 px-6 flex items-center justify-around z-20 shadow-2xl">
        <button
          onClick={() => setActiveTab("planning")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "planning" ? "text-violet-500" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Calendar className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Planning</span>
        </button>

        <button
          onClick={() => setActiveTab("recettes")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "recettes" ? "text-violet-500" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <BookOpen className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Recettes</span>
        </button>

        <button
          onClick={() => setActiveTab("ingredients")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "ingredients" ? "text-violet-500" : "text-slate-500 hover:text-slate-400"
          }`}
        >
          <Tag className="w-5.5 h-5.5" />
          <span className="text-4xs font-bold uppercase tracking-wider">Ingrédients</span>
        </button>

        <button
          onClick={() => setActiveTab("liste")}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === "liste" ? "text-violet-500" : "text-slate-500 hover:text-slate-400"
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

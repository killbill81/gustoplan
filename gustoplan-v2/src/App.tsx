import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthScreen } from "./components/AuthScreen";
import { PlanningView } from "./components/PlanningView";
import { ListeView } from "./components/ListeView";
import { RecettesView } from "./components/RecettesView";
import { IngredientsView } from "./components/IngredientsView";
import { 
  Calendar, ShoppingCart, BookOpen, LogOut, User, ChefHat, Info, Tag,
  Cloud, CloudOff, Loader2, Copy, Check, X
} from "lucide-react";
import { subscribeDbState, quitFoyer } from "./services/db";
import "./App.css";

const AppContent: React.FC = () => {
  const { user, foyer, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"planning" | "liste" | "recettes" | "ingredients">("planning");
  const [dbState, setDbState] = useState<"idle" | "saving">("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showFoyerModal, setShowFoyerModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);
  const [foyerConfirmed, setFoyerConfirmed] = useState(false);

  const handleCopyCode = () => {
    if (foyer?.codeFoyer) {
      navigator.clipboard.writeText(foyer.codeFoyer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveFoyer = async () => {
    if (!user) return;
    try {
      await quitFoyer(user.uid);
      setShowFoyerModal(false);
      setShowConfirmLeave(false);
    } catch (error) {
      console.error("Erreur lors de la sortie du foyer:", error);
    }
  };

  useEffect(() => {
    if (!user || !foyer) {
      setFoyerConfirmed(false);
    }
  }, [user, foyer]);

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

  // Si pas authentifié ou pas encore de Foyer configuré ou non confirmé
  if (!user || !foyer || !foyerConfirmed) {
    return <AuthScreen onConfirmFoyer={() => setFoyerConfirmed(true)} />;
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
          <button
            onClick={() => setShowFoyerModal(true)}
            title="Gérer mon foyer"
            className="flex items-center gap-2 bg-white/80 border border-slate-200 p-2 sm:px-3 sm:py-1.5 rounded-xl hover:bg-orange-50/50 hover:border-orange-200 transition-colors cursor-pointer group"
          >
            <User className="w-4.5 h-4.5 sm:w-4 sm:h-4 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline text-xs font-semibold text-slate-700 max-w-[120px] truncate">
              {user.email}
            </span>
          </button>
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

      {/* Modal de gestion du Foyer */}
      {showFoyerModal && foyer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Mon Foyer</h3>
                  <p className="text-3xs text-slate-500 font-semibold uppercase tracking-wider">Gestion de la maisonnée</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowFoyerModal(false);
                  setShowConfirmLeave(false);
                }}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Foyer Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Nom du foyer</label>
                  <div className="text-lg font-extrabold text-slate-800 bg-slate-50 border border-slate-200/60 px-3.5 py-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-xl">🏠</span>
                    <span>{foyer.nom}</span>
                  </div>
                </div>

                <div>
                  <label className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">Code d'invitation</label>
                  <div className="relative flex items-center">
                    <input 
                      type="text" 
                      readOnly 
                      value={foyer.codeFoyer || ""} 
                      className="w-full font-mono text-center tracking-widest text-lg font-black bg-orange-50/30 text-orange-800 border border-orange-200/50 rounded-xl py-3 pl-4 pr-12 select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyCode}
                      title="Copier le code"
                      className="absolute right-2 p-2 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg text-slate-500 hover:text-orange-600 transition-colors shadow-sm cursor-pointer"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="mt-1.5 flex justify-between items-center px-1">
                    <span className="text-3xs text-slate-400 font-medium">Partagez ce code pour inviter des membres</span>
                    {copied && (
                      <span className="text-3xs text-emerald-600 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                        Copié !
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirm / Leave Section */}
              <div className="border-t border-slate-100 pt-5">
                {!showConfirmLeave ? (
                  <button
                    onClick={() => setShowConfirmLeave(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-slate-600 hover:text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Quitter le Foyer
                  </button>
                ) : (
                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex gap-2">
                      <span className="text-lg">⚠️</span>
                      <div>
                        <h4 className="text-xs font-bold text-rose-900">Êtes-vous sûr de vouloir quitter ?</h4>
                        <p className="text-3xs text-rose-700/80 mt-0.5 leading-relaxed">
                          Vous n'aurez plus accès aux recettes, planning et liste de courses partagés de ce foyer.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirmLeave(false)}
                        className="flex-1 py-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 text-3xs font-bold transition-colors cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleLeaveFoyer}
                        className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white text-3xs font-bold transition-colors shadow-sm cursor-pointer"
                      >
                        Oui, quitter le foyer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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

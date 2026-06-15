import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { createFoyer, joinFoyerByCode } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ChefHat, LogIn, UserPlus, Home, Users, ArrowRight, LogOut, Copy, Check } from "lucide-react";

interface AuthScreenProps {
  onConfirmFoyer?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onConfirmFoyer }) => {
  const { user, userProfile, foyer, refreshFoyer, logout } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Foyer State
  const [foyerName, setFoyerName] = useState("");
  const [foyerCode, setFoyerCode] = useState("");
  const [foyerAction, setFoyerAction] = useState<"choose" | "create" | "join">("choose");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        setError("Cet email est déjà utilisé.");
      } else if (err.code === "auth/invalid-credential") {
        setError("Identifiants incorrects.");
      } else if (err.code === "auth/weak-password") {
        setError("Le mot de passe doit faire au moins 6 caractères.");
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email pour réinitialiser le mot de passe.");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Un email de réinitialisation a été envoyé ! Vérifiez votre boîte de réception.");
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        setError("Aucun utilisateur trouvé avec cette adresse email.");
      } else {
        setError("Impossible d'envoyer l'email de réinitialisation.");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleCreateFoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !foyerName.trim()) return;
    setError("");
    setLoading(true);
    try {
      await createFoyer(user.uid, foyerName.trim());
      await refreshFoyer();
      setFoyerAction("choose");
    } catch (err: any) {
      console.error(err);
      setError("Impossible de créer le foyer.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinFoyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !foyerCode.trim()) return;
    setError("");
    setLoading(true);
    try {
      await joinFoyerByCode(user.uid, foyerCode.trim());
      await refreshFoyer();
      setFoyerAction("choose");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible de rejoindre ce foyer. Vérifiez le code.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-55 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <ChefHat className="w-9 h-9 text-orange-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">GustoPlan</h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              Planifiez vos menus et générez vos courses en un clin d'œil.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-4 rounded-xl mb-6 text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-2xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-100 text-orange-850 hover:bg-orange-200 font-bold py-3 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
            >

              {loading ? (
                <div className="w-5 h-5 border-2 border-orange-800/30 border-t-orange-800 rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-5 h-5" /> S'inscrire
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Se connecter
                </>
              )}
            </button>
          </form>

          {/* Toggle Sign Up / Sign In */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors cursor-pointer"
            >
              {isSignUp
                ? "Déjà inscrit ? Connectez-vous"
                : "Nouveau ? Créez un compte gratuitement"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 1.5. Écran de confirmation du Foyer
  if (user && userProfile?.foyerId && foyerAction === "choose") {
    if (!foyer) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800">
          <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-500 text-sm font-medium">Chargement des informations du foyer...</p>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <ChefHat className="w-9 h-9 text-orange-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">GustoPlan</h1>
            <p className="text-slate-500 text-sm mt-2 text-center">
              Ravi de vous revoir ! Confirmez votre foyer pour continuer.
            </p>
          </div>

          {/* User Email Info */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 mb-6 space-y-3">
            <div className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">
              Session active
            </div>
            <div className="text-xs font-semibold text-slate-700 truncate">
              👤 {user.email}
            </div>
          </div>

          {/* Foyer Card */}
          <div className="border border-orange-200/50 bg-orange-50/10 rounded-2xl p-6 mb-6 space-y-4">
            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                Foyer assigné
              </span>
              <div className="text-lg font-black text-slate-800 flex items-center gap-2">
                🏠 {foyer.nom}
              </div>
            </div>

            <div>
              <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                Code d'invitation
              </span>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  readOnly 
                  value={foyer.codeFoyer || ""} 
                  className="w-full font-mono text-center tracking-widest text-sm font-black bg-orange-50/30 text-orange-800 border border-orange-200/30 rounded-xl py-2 pl-3 pr-10 select-all focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (foyer.codeFoyer) {
                      navigator.clipboard.writeText(foyer.codeFoyer);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  title="Copier le code"
                  className="absolute right-1.5 p-1.5 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-lg text-slate-500 hover:text-orange-600 transition-colors shadow-sm cursor-pointer"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
              {copied && (
                <div className="text-right mt-1">
                  <span className="text-4xs text-emerald-600 font-bold uppercase tracking-wider">
                    Copié !
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirmFoyer}
              className="w-full bg-orange-100 text-orange-850 hover:bg-orange-200 font-bold py-3.5 px-4 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer text-sm animate-pulse"
            >
              Accéder à l'application <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setFoyerAction("join")}
                className="py-2.5 px-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl text-slate-700 hover:text-indigo-800 text-2xs font-bold transition-colors cursor-pointer text-center"
              >
                Rejoindre un autre foyer
              </button>
              <button
                onClick={() => setFoyerAction("create")}
                className="py-2.5 px-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-xl text-slate-700 hover:text-orange-600 text-2xs font-bold transition-colors cursor-pointer text-center"
              >
                Créer un autre foyer
              </button>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200/40 rounded-xl text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Écran d'attribution du Foyer
  if (user && (!userProfile?.foyerId)) {
    return (
      <div className="min-h-screen bg-slate-55 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 text-center">Rejoindre un Foyer</h2>
            <p className="text-slate-500 text-xs mt-2 text-center">
              Pour commencer à planifier, vous devez appartenir à un foyer partagé.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {foyerAction === "choose" && (
            <div className="space-y-4">
              <button
                onClick={() => setFoyerAction("create")}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-98 cursor-pointer"
              >
                <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-slate-850 font-bold text-base">Créer un nouveau Foyer</h3>
                  <p className="text-slate-500 text-xs mt-1">Idéal pour démarrer votre propre planning.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 ml-auto shrink-0" />
              </button>

              <button
                onClick={() => setFoyerAction("join")}
                className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-98 cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-indigo-650" />
                </div>
                <div>
                  <h3 className="text-slate-850 font-bold text-base">Rejoindre un Foyer existant</h3>
                  <p className="text-slate-500 text-xs mt-1">Saisissez le code fourni par votre partenaire ou colocataire.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 ml-auto shrink-0" />
              </button>
            </div>
          )}

          {foyerAction === "create" && (
            <form onSubmit={handleCreateFoyer} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                  Nom du Foyer
                </label>
                <input
                  type="text"
                  required
                  value={foyerName}
                  onChange={(e) => setFoyerName(e.target.value)}
                  placeholder="Ex: Famille Martin, Coloc Aventure..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-100 text-orange-850 hover:bg-orange-200 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Création..." : "Confirmer la création"}
              </button>

              <button
                type="button"
                onClick={() => setFoyerAction("choose")}
                className="w-full text-slate-500 hover:text-slate-800 text-sm font-semibold py-2 transition-colors cursor-pointer"
              >
                Retour
              </button>
            </form>
          )}

          {foyerAction === "join" && (
            <form onSubmit={handleJoinFoyer} className="space-y-4">
              <div>
                <label className="block text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                  Code d'invitation Foyer
                </label>
                <input
                  type="text"
                  required
                  value={foyerCode}
                  onChange={(e) => setFoyerCode(e.target.value)}
                  placeholder="Ex: GUSTO-9821"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-850 placeholder-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-100 text-orange-850 hover:bg-orange-200 font-bold py-3 px-4 rounded-xl shadow-sm transition-colors active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Connexion..." : "Rejoindre le Foyer"}
              </button>

              <button
                type="button"
                onClick={() => setFoyerAction("choose")}
                className="w-full text-slate-500 hover:text-slate-800 text-sm font-semibold py-2 transition-colors cursor-pointer"
              >
                Retour
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return null;
};

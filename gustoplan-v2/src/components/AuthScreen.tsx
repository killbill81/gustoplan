import React, { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import { createFoyer, joinFoyerByCode } from "../services/db";
import { useAuth } from "../contexts/AuthContext";
import { ChefHat, LogIn, UserPlus, Home, Users, ArrowRight } from "lucide-react";

export const AuthScreen: React.FC = () => {
  const { user, userProfile, refreshFoyer } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Impossible de rejoindre ce foyer. Vérifiez le code.");
    } finally {
      setLoading(false);
    }
  };

  // 1. Écran de Connexion / Inscription
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-violet-600 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 mb-4">
              <ChefHat className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">GustoPlan</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
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
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                Adresse Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom@exemple.com"
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider">
                  Mot de passe
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-2xs text-violet-400 hover:text-violet-300 transition-colors"
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
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-violet-600/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >

              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
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

  // 2. Écran d'attribution du Foyer
  if (user && (!userProfile?.foyerId)) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-violet-500" />
            </div>
            <h2 className="text-2xl font-bold text-white text-center">Rejoindre un Foyer</h2>
            <p className="text-slate-400 text-xs mt-2 text-center">
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
                className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-98"
              >
                <div className="w-12 h-12 bg-violet-600/10 border border-violet-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Créer un nouveau Foyer</h3>
                  <p className="text-slate-400 text-xs mt-1">Idéal pour démarrer votre propre planning.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 ml-auto shrink-0" />
              </button>

              <button
                onClick={() => setFoyerAction("join")}
                className="w-full bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex items-center gap-4 text-left transition-all active:scale-98"
              >
                <div className="w-12 h-12 bg-fuchsia-600/10 border border-fuchsia-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Rejoindre un Foyer existant</h3>
                  <p className="text-slate-400 text-xs mt-1">Saisissez le code fourni par votre partenaire ou colocataire.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 ml-auto shrink-0" />
              </button>
            </div>
          )}

          {foyerAction === "create" && (
            <form onSubmit={handleCreateFoyer} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Nom du Foyer
                </label>
                <input
                  type="text"
                  required
                  value={foyerName}
                  onChange={(e) => setFoyerName(e.target.value)}
                  placeholder="Ex: Famille Martin, Coloc Aventure..."
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? "Création..." : "Confirmer la création"}
              </button>

              <button
                type="button"
                onClick={() => setFoyerAction("choose")}
                className="w-full text-slate-400 hover:text-white text-sm font-medium py-2 transition-colors"
              >
                Retour
              </button>
            </form>
          )}

          {foyerAction === "join" && (
            <form onSubmit={handleJoinFoyer} className="space-y-4">
              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Code d'invitation Foyer
                </label>
                <input
                  type="text"
                  required
                  value={foyerCode}
                  onChange={(e) => setFoyerCode(e.target.value)}
                  placeholder="Ex: GUSTO-9821"
                  className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50"
              >
                {loading ? "Connexion..." : "Rejoindre le Foyer"}
              </button>

              <button
                type="button"
                onClick={() => setFoyerAction("choose")}
                className="w-full text-slate-400 hover:text-white text-sm font-medium py-2 transition-colors"
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

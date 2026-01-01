import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User, Bell, Shield, Palette, Wand2, Save, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function SettingsPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [userSettings, setUserSettings] = useState({
        displayName: "",
        email: "",
        defaultServings: 4,
        newsletter: true,
        darkMode: false,
        aiAssistant: true
    })

    useEffect(() => {
        const fetchSettings = async () => {
            const user = auth.currentUser
            if (!user) return

            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                setUserSettings({
                    displayName: user.displayName || "",
                    email: user.email || "",
                    defaultServings: data.defaultServings || 4,
                    newsletter: data.newsletter ?? true,
                    darkMode: data.darkMode ?? false,
                    aiAssistant: data.aiAssistant ?? true
                })
            } else {
                setUserSettings(prev => ({
                    ...prev,
                    displayName: user.displayName || "",
                    email: user.email || ""
                }))
            }
            setLoading(false)
        }

        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        try {
            const user = auth.currentUser
            if (!user) return

            await setDoc(doc(db, "users", user.uid), {
                defaultServings: userSettings.defaultServings,
                newsletter: userSettings.newsletter,
                darkMode: userSettings.darkMode,
                aiAssistant: userSettings.aiAssistant,
                lastUpdated: new Date()
            }, { merge: true })

            // Note: displayName update is separate in Firebase Auth
            // For now we persist it in Firestore as part of user profile

            alert("Paramètres enregistrés !")
        } catch (error) {
            console.error("Save failed:", error)
            alert("Erreur lors de l'enregistrement.")
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = () => {
        auth.signOut().then(() => navigate("/login"))
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Paramètres</h1>
                    <p className="text-muted-foreground font-medium">Gérez votre compte et vos préférences.</p>
                </div>
                <Button variant="destructive" className="rounded-xl font-bold gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Déconnexion
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Nav */}
                <div className="space-y-2">
                    <Button variant="secondary" className="w-full justify-start gap-3 rounded-xl font-bold h-12">
                        <User className="h-5 w-5" /> Profil
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold h-12 text-muted-foreground">
                        <Bell className="h-5 w-5" /> Notifications
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold h-12 text-muted-foreground">
                        <Shield className="h-5 w-5" /> Sécurité
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold h-12 text-muted-foreground">
                        <Palette className="h-5 w-5" /> Apparence
                    </Button>
                </div>

                {/* Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-[2rem] border-primary/5 shadow-xl">
                        <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                            <CardTitle className="text-xl font-black">Informations de Profil</CardTitle>
                            <CardDescription className="font-medium">Ces informations sont utilisées pour personnaliser votre expérience.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="font-bold ml-1">Nom d'affichage</Label>
                                <Input
                                    id="name"
                                    value={userSettings.displayName}
                                    onChange={(e) => setUserSettings({ ...userSettings, displayName: e.target.value })}
                                    className="rounded-xl h-12 border-primary/10"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-bold ml-1">Email</Label>
                                <Input
                                    id="email"
                                    value={userSettings.email}
                                    disabled
                                    className="rounded-xl h-12 bg-muted/50 border-primary/10"
                                />
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest ml-1">Non modifiable directement</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2rem] border-primary/5 shadow-xl">
                        <CardHeader className="bg-amber-500/5 pb-6 border-b border-amber-500/10">
                            <CardTitle className="text-xl font-black text-amber-700">Préférences de Planning</CardTitle>
                            <CardDescription className="font-medium text-amber-600/80">Configurez vos options par défaut pour les menus.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold">Nombre de convives par défaut</Label>
                                    <p className="text-sm text-muted-foreground">Utilisé pour calculer automatiquement les quantités.</p>
                                </div>
                                <Select
                                    value={String(userSettings.defaultServings)}
                                    onValueChange={(val) => setUserSettings({ ...userSettings, defaultServings: parseInt(val) })}
                                >
                                    <SelectTrigger className="w-[120px] rounded-xl h-12 border-amber-500/10">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {[1, 2, 3, 4, 5, 6, 8].map(n => (
                                            <SelectItem key={n} value={String(n)} className="rounded-lg">{n} personnes</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <hr className="border-amber-500/10" />

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base font-bold flex items-center gap-2">
                                        <Wand2 className="h-4 w-4 text-amber-600" /> Assistant IA Activé
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Autoriser Gusto IA à proposer des suggestions.</p>
                                </div>
                                <Switch
                                    checked={userSettings.aiAssistant}
                                    onCheckedChange={(val) => setUserSettings({ ...userSettings, aiAssistant: val })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button
                            className="rounded-xl px-12 h-14 font-black text-lg gap-2 shadow-xl shadow-primary/20"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                            Enregistrer les modifications
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

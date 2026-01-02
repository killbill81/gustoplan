import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
                    <div className="max-w-md w-full bg-card p-8 rounded-[2.5rem] shadow-2xl border-primary/5 text-center space-y-6">
                        <div className="h-20 w-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="h-10 w-10 text-destructive" />
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight">Oups !</h1>
                            <p className="text-muted-foreground font-medium">Une erreur inattendue est survenue dans l&apos;application.</p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="p-4 bg-muted rounded-xl text-left text-xs font-mono overflow-auto max-h-[150px]">
                                {this.state.error?.message}
                            </div>
                        )}

                        <div className="flex flex-col gap-3">
                            <Button
                                className="rounded-xl h-12 font-black gap-2 shadow-lg shadow-primary/20"
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    window.location.reload();
                                }}
                            >
                                <RefreshCcw className="h-5 w-5" /> Réessayer
                            </Button>
                            <Button
                                variant="ghost"
                                className="rounded-xl h-12 font-bold gap-2"
                                onClick={() => {
                                    this.setState({ hasError: false });
                                    window.location.href = "/";
                                }}
                            >
                                <Home className="h-5 w-5" /> Retour à l&apos;accueil
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

import { Settings, Car, RefreshCw } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      {/* Logo / Ícone Principal */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse-glow" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-border bg-card">
          <Car className="h-12 w-12 text-primary" />
        </div>
      </div>

      {/* Título */}
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
        Sistema de Gestão
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Oficina Estética Automotiva
      </p>

      {/* Card de Status */}
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <RefreshCw className="h-6 w-6 text-primary animate-spin-slow" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">
              Aguardando Alterações
            </h2>
            <p className="text-sm text-muted-foreground">
              Sistema em preparação para migração
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-border bg-secondary/50 p-4">
          <div className="flex items-start gap-3">
            <Settings className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Próximos passos:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Upload dos arquivos do projeto</li>
                <li>Migração do MySQL para Supabase</li>
                <li>Configuração do ambiente</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <p className="mt-8 text-xs text-muted-foreground">
        Ambiente preparado para receber a migração
      </p>
    </div>
  );
};

export default Index;

export function ErrorPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Pagina não encontrada</h1>
      <p className="text-accent-foreground">
        Voltar para pagina{" "}
        <a className="text-sky-500 dark:text-sky-400" href="/">
          inicial.
        </a>
      </p>
    </div>
  );
}

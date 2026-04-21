import type { ReactNode } from "react";

type AuthPageShellProps = {
  heroTitle: string;
  heroDescription: string;
  children: ReactNode;
};

export function AuthPageShell({ heroTitle, heroDescription, children }: AuthPageShellProps) {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="flex flex-col justify-center border-b bg-muted/40 px-6 py-10 lg:border-b-0 lg:border-r lg:px-8 lg:py-14 xl:px-14">
        <div className="mx-auto w-full max-w-md space-y-3 lg:mx-0">
          <p className="text-sm font-medium text-muted-foreground">CampusBook</p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight lg:text-3xl">{heroTitle}</h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground lg:text-base">
            {heroDescription}
          </p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col justify-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14 xl:px-14">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

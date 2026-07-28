import { WeaverAuthGate } from "@/components/auth/WeaverAuthGate";
import { LanguageProvider } from "@/lib/i18n/context";

export default function WeaverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-loom-bg">
        <WeaverAuthGate>{children}</WeaverAuthGate>
      </div>
    </LanguageProvider>
  );
}

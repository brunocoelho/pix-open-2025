"use client";

import { useSearchParams } from "next/navigation";
import * as Tabs from "@radix-ui/react-tabs";
import DoublesTab from "./doubles";
import PlayersTab from "./players";
import TournamentBracket from "./tournamentBracket";

export default function Main() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          Pix Open 2025 🎾
        </h1>

        <Tabs.Root defaultValue="jogadores" className="w-full">
          <Tabs.List className="flex border-b border-border mb-6">
            <Tabs.Trigger
              value="jogadores"
              className="flex-1 py-3 px-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
            >
              Jogadores
            </Tabs.Trigger>
            <Tabs.Trigger
              value="duplas"
              className="flex-1 py-3 px-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
            >
              Duplas
            </Tabs.Trigger>
            <Tabs.Trigger
              value="partidas"
              className="flex-1 py-3 px-4 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary transition-colors"
            >
              Partidas
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content
            value="jogadores"
            className="space-y-6 data-[state=inactive]:hidden"
            forceMount
          >
            <PlayersTab isAdmin={isAdmin} />
          </Tabs.Content>

          <Tabs.Content
            value="duplas"
            className="space-y-6 data-[state=inactive]:hidden"
            forceMount
          >
            <DoublesTab isAdmin={isAdmin} />
          </Tabs.Content>

          <Tabs.Content
            value="partidas"
            className="data-[state=inactive]:hidden"
            forceMount
          >
            <TournamentBracket isAdmin={isAdmin} />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

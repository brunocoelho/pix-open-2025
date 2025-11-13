"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Callout } from "@radix-ui/themes";
import { createPlayers, type Player, getPlayers } from "@/lib/api";

export default function PlayersTab({ isAdmin }: { isAdmin: boolean }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [players, setPlayers] = useState<Array<Player | null>>(
    Array(32).fill(null)
  );

  useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { group1, group2 } = await getPlayers();
      // Combine all groups into one list
      const allPlayers = [...group1, ...group2];
      setPlayers(allPlayers);
      return { group1, group2 };
    },
  });

  const createPlayersMutation = useMutation({
    mutationFn: createPlayers,
    onSuccess: ({ group1, group2 }) => {
      const allPlayers = [...group1, ...group2];
      setPlayers(allPlayers);
      setShowSuccessMessage("Jogadores salvos.");
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    },
    onError: (error) => {
      alert(`Erro ao criar jogadores: ${error.message}`);
    },
  });

  const handleCreatePlayers = () => {
    const playersList: Player[] = [];

    players.forEach((player) => {
      if (player && player.name) playersList.push(player);
    });

    createPlayersMutation.mutate(playersList);
  };

  return (
    <>
      <div className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold mb-1">Jogadores</h2>
          <p className="text-xs text-muted-foreground">
            Lista de todos os jogadores
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            {players.slice(0, 14).map((player, index) => (
              <input
                disabled={!isAdmin}
                key={`player-${index}`}
                type="text"
                value={player?.name || ""}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[index] =
                    newPlayers[index] ||
                    ({
                      name: "",
                      group: 1,
                    } as Player);
                  newPlayers[index]!.name = (e.target.value ?? "").trim();
                  setPlayers(newPlayers);
                }}
                placeholder={`${index + 1}.`}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>
          <div className="space-y-2">
            {players.slice(14, 28).map((player, index) => (
              <input
                disabled={!isAdmin}
                key={`player-${index + 14}`}
                type="text"
                value={player?.name || ""}
                onChange={(e) => {
                  const newPlayers = [...players];
                  const actualIndex = index + 14;
                  newPlayers[actualIndex] =
                    newPlayers[actualIndex] ||
                    ({
                      name: "",
                      group: 1,
                    } as Player);
                  newPlayers[actualIndex]!.name = e.target.value ?? "";
                  setPlayers(newPlayers);
                }}
                placeholder={`${index + 17}.`}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className="grid grid-cols-2 gap-3">
          <button
            className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createPlayersMutation.isPending}
            onClick={handleCreatePlayers}
          >
            Salvar jogadores
          </button>
          {showSuccessMessage && (
            <Callout.Root>
              <Callout.Text>{showSuccessMessage}</Callout.Text>
            </Callout.Root>
          )}
        </div>
      )}
    </>
  );
}

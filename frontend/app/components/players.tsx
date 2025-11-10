"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Callout } from "@radix-ui/themes";
import { createPlayers, type Player, getPlayers } from "@/lib/api";

export default function PlayersTab() {
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [group1Players, setGroup1Players] = useState<Array<Player | null>>(
    Array(16).fill(null)
  );

  const [group2Players, setGroup2Players] = useState<Array<Player | null>>(
    Array(16).fill(null)
  );

  useQuery({
    queryKey: ["players"],
    queryFn: async () => {
      const { group1, group2 } = await getPlayers();
      setGroup1Players(group1);
      setGroup2Players(group2);
      return { group1, group2 };
    },
  });

  const createPlayersMutation = useMutation({
    mutationFn: createPlayers,
    onSuccess: ({ group1, group2 }) => {
      setGroup1Players(group1);
      setGroup2Players(group2);
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
    const players: Player[] = [];

    group1Players.forEach((player) => {
      if (player) players.push(player);
    });

    group2Players.forEach((player) => {
      if (player) players.push(player);
    });

    createPlayersMutation.mutate(players);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {/* Group 1 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold mb-1">Grupo 1</h2>
            <p className="text-xs text-muted-foreground">Profissionais</p>
          </div>
          <div className="space-y-2">
            {group1Players.map((player, index) => (
              <input
                key={`group1-${index}`}
                type="text"
                value={player?.name || ""}
                onChange={(e) => {
                  const newPlayers = [...group1Players];
                  newPlayers[index] =
                    newPlayers[index] ||
                    ({
                      name: "",
                      group: 1,
                    } as Player);
                  newPlayers[index].name = (e.target.value ?? "").trim();
                  setGroup1Players(newPlayers);
                }}
                placeholder={`${index + 1}.`}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>
        </div>

        {/* Group 2 */}
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold mb-1">Grupo 2</h2>
            <p className="text-xs text-muted-foreground">Pangarés</p>
          </div>
          <div className="space-y-2">
            {group2Players.map((player, index) => (
              <input
                key={`group2-${index}`}
                type="text"
                value={player?.name || ""}
                onChange={(e) => {
                  const newPlayers = [...group2Players];
                  newPlayers[index] =
                    newPlayers[index] ||
                    ({
                      name: "",
                      group: 2,
                    } as Player);
                  newPlayers[index].name = e.target.value;
                  setGroup2Players(newPlayers);
                }}
                placeholder={`${index + 1}.`}
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            ))}
          </div>
        </div>
      </div>
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
    </>
  );
}

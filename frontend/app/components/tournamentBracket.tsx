"use client";

import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { getDoubles, type Double } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface Match {
  id: string;
  round: "R16" | "R8" | "SEMI" | "FINAL";
  position: number;
  double1?: string;
  double2?: string;
  score1?: string;
  score2?: string;
  winner?: string;
}

export default function TournamentBracket({ isAdmin }: { isAdmin: boolean }) {
  const [matches, setMatches] = useState<Match[]>(initializeMatches());
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [doubles, setDoubles] = useState<Double[]>([]);

  useQuery({
    queryKey: ["doubles"],
    queryFn: async () => {
      const doubles = await getDoubles();
      setDoubles(doubles);
      return doubles;
    },
  });

  function initializeMatches(): Match[] {
    const matches: Match[] = [];

    // R16 - 8 matches
    for (let i = 0; i < 8; i++) {
      matches.push({
        id: `R16-${i}`,
        round: "R16",
        position: i,
      });
    }

    // R8 - 4 matches
    for (let i = 0; i < 4; i++) {
      matches.push({
        id: `R8-${i}`,
        round: "R8",
        position: i,
      });
    }

    // Semifinals - 2 matches
    for (let i = 0; i < 2; i++) {
      matches.push({
        id: `SEMI-${i}`,
        round: "SEMI",
        position: i,
      });
    }

    // Final - 1 match
    matches.push({
      id: "FINAL-0",
      round: "FINAL",
      position: 0,
    });

    return matches;
  }

  const getMatchesByRound = (round: string) => {
    return matches.filter((m) => m.round === round);
  };

  const handleMatchClick = (match: Match) => {
    if (!isAdmin) return;
    setSelectedMatch(match);
    setDialogOpen(true);
  };

  const handleUpdateMatch = (updates: Partial<Match>) => {
    if (!selectedMatch) return;

    setMatches((prev) =>
      prev.map((m) => (m.id === selectedMatch.id ? { ...m, ...updates } : m))
    );
    setSelectedMatch({ ...selectedMatch, ...updates });
  };

  const handleSaveMatch = () => {
    setDialogOpen(false);
    setSelectedMatch(null);
  };

  const doublesOptions = doubles.map((d) => ({
    value: `${d.player1} / ${d.player2}`,
    label: `${d.player1} / ${d.player2}`,
  }));

  return (
    <>
      <div className="overflow-x-auto pb-4">
        <div className="inline-flex gap-8 min-w-max p-4">
          <div className="flex flex-col justify-around gap-6 min-w-[220px]">
            <div className="text-xs font-semibold text-center mb-2 text-muted-foreground">
              Oitavas (R16)
            </div>
          </div>
          <div className="flex flex-col justify-around gap-6 min-w-[220px]">
            <div className="text-xs font-semibold text-center mb-2 text-muted-foreground">
              Quartas (R8)
            </div>
          </div>
          <div className="flex flex-col justify-around gap-6 min-w-[220px]">
            <div className="text-xs font-semibold text-center mb-2 text-muted-foreground">
              Semifinais
            </div>
          </div>

          <div className="flex flex-col justify-around gap-6 min-w-[220px]">
            <div className="text-xs font-semibold text-center mb-2 text-muted-foreground">
              Final
            </div>
          </div>
        </div>
        <div className="inline-flex gap-8 min-w-max p-4">
          {/* R16 Column */}
          <div className="flex flex-col justify-around gap-6 min-w-[220px]">
            {getMatchesByRound("R16").map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchClick(match)}
              />
            ))}
          </div>

          {/* R8 Column */}
          <div className="flex flex-col justify-around gap-12 min-w-[220px]">
            {getMatchesByRound("R8").map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchClick(match)}
              />
            ))}
          </div>

          {/* Semifinals Column */}
          <div className="flex flex-col justify-around gap-24 min-w-[220px]">
            {getMatchesByRound("SEMI").map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchClick(match)}
              />
            ))}
          </div>

          {/* Final Column */}
          <div className="flex flex-col justify-center min-w-[220px]">
            {getMatchesByRound("FINAL").map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => handleMatchClick(match)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Match Edit Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 animate-fadeIn" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg shadow-lg p-6 w-[90vw] max-w-md animate-slideUpAndFade">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Configurar Partida
            </Dialog.Title>

            {selectedMatch && (
              <div className="space-y-4">
                {/* Double 1 Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dupla 1
                  </label>
                  <Select.Root
                    value={selectedMatch.double1 || ""}
                    onValueChange={(value) =>
                      handleUpdateMatch({ double1: value })
                    }
                  >
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 text-sm border border-input rounded-md bg-background">
                      <Select.Value placeholder="Selecionar dupla" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                        <Select.Viewport className="p-1">
                          {doublesOptions.map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-accent outline-none"
                            >
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Score 1 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Placar Dupla 1
                  </label>
                  <input
                    type="text"
                    value={selectedMatch.score1 || ""}
                    onChange={(e) =>
                      handleUpdateMatch({ score1: e.target.value })
                    }
                    placeholder="ex: 6-3, 6-4"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Double 2 Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Dupla 2
                  </label>
                  <Select.Root
                    value={selectedMatch.double2 || ""}
                    onValueChange={(value) =>
                      handleUpdateMatch({ double2: value })
                    }
                  >
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 text-sm border border-input rounded-md bg-background">
                      <Select.Value placeholder="Selecionar dupla" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                        <Select.Viewport className="p-1">
                          {doublesOptions.map((option) => (
                            <Select.Item
                              key={option.value}
                              value={option.value}
                              className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-accent outline-none"
                            >
                              <Select.ItemText>{option.label}</Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                {/* Score 2 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Placar Dupla 2
                  </label>
                  <input
                    type="text"
                    value={selectedMatch.score2 || ""}
                    onChange={(e) =>
                      handleUpdateMatch({ score2: e.target.value })
                    }
                    placeholder="ex: 3-6, 4-6"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Winner Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vencedor
                  </label>
                  <Select.Root
                    value={selectedMatch.winner || ""}
                    onValueChange={(value) =>
                      handleUpdateMatch({ winner: value })
                    }
                  >
                    <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 text-sm border border-input rounded-md bg-background">
                      <Select.Value placeholder="Selecionar vencedor" />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-popover border border-border rounded-md shadow-lg overflow-hidden">
                        <Select.Viewport className="p-1">
                          {selectedMatch.double1 && (
                            <Select.Item
                              value={selectedMatch.double1}
                              className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-accent outline-none"
                            >
                              <Select.ItemText>
                                {selectedMatch.double1}
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          )}
                          {selectedMatch.double2 && (
                            <Select.Item
                              value={selectedMatch.double2}
                              className="relative flex items-center px-8 py-2 text-sm rounded cursor-pointer hover:bg-accent outline-none"
                            >
                              <Select.ItemText>
                                {selectedMatch.double2}
                              </Select.ItemText>
                              <Select.ItemIndicator className="absolute left-2">
                                <CheckIcon />
                              </Select.ItemIndicator>
                            </Select.Item>
                          )}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div className="flex gap-3 mt-6">
                  <Dialog.Close asChild>
                    <button className="flex-1 py-2 px-4 border border-border rounded-md text-sm font-medium hover:bg-accent transition-colors">
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <button
                    onClick={handleSaveMatch}
                    className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function MatchCard({ match, onClick }: { match: Match; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="border border-border rounded-lg bg-card hover:bg-accent transition-colors text-left"
    >
      <div className="border-b border-border px-3 py-2">
        <div className="text-xs font-medium truncate">
          {match.double1 || "Dupla 1"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {match.score1 || "-"}
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-xs font-medium truncate">
          {match.double2 || "Dupla 2"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {match.score2 || "-"}
        </div>
      </div>
      {match.winner && (
        <div className="border-t border-border px-3 py-1.5 bg-primary/10">
          <div className="text-xs font-semibold text-primary truncate">
            Vencedor: {match.winner.split(" / ")[0]}
          </div>
        </div>
      )}
    </button>
  );
}

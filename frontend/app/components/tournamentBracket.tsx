"use client";

import { useMemo, useState, useEffect } from "react";
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  getMatches,
  createMatch,
  updateMatch,
  type Match as APIMatch,
  getDoubles,
} from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Match {
  _id?: string;
  id: string;
  round: "R16" | "R8" | "SEMI" | "FINAL";
  position: number;
  double1?: string;
  double2?: string;
  double1Id?: string;
  double2Id?: string;
  score1?: string;
  score2?: string;
  winner?: string;
}

export default function TournamentBracket({ isAdmin }: { isAdmin: boolean }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [doubles, setDoubles] = useState<Double[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const queryClient = useQueryClient();

  const { data: doubles = [] } = useQuery({
    queryKey: ["doubles"],
    queryFn: getDoubles,
  });

  const { data: apiMatches } = useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });

  // Transform API matches to UI format
  useEffect(() => {
    if (!apiMatches || !doubles.length) {
      setMatches(initializeMatches());
      return;
    }

    const transformedMatches: Match[] = [];

    // Create all possible matches
    const allMatches = initializeMatches();

    // Map API matches to UI format
    allMatches.forEach((uiMatch) => {
      const apiMatch = apiMatches.find(
        (m) => m.round === uiMatch.round && m.position === uiMatch.position
      );

      if (apiMatch) {
        const double1Data =
          typeof apiMatch.double1 === "object" ? apiMatch.double1 : null;
        const double2Data =
          typeof apiMatch.double2 === "object" ? apiMatch.double2 : null;

        transformedMatches.push({
          ...uiMatch,
          _id: apiMatch._id,
          double1: double1Data
            ? `${double1Data.player1?.name} / ${double1Data.player2?.name}`
            : undefined,
          double2: double2Data
            ? `${double2Data.player1?.name} / ${double2Data.player2?.name}`
            : undefined,
          double1Id:
            typeof apiMatch.double1 === "string"
              ? apiMatch.double1
              : double1Data?._id,
          double2Id:
            typeof apiMatch.double2 === "string"
              ? apiMatch.double2
              : double2Data?._id,
          score1: apiMatch.scoreDouble1,
          score2: apiMatch.scoreDouble2,
        });
      } else {
        transformedMatches.push(uiMatch);
      }
    });

    setMatches(transformedMatches);
  }, [apiMatches, doubles]);

  const updateMatchMutation = useMutation({
    mutationFn: async ({
      matchId,
      data,
    }: {
      matchId: string;
      data: Partial<APIMatch>;
    }) => {
      return updateMatch(matchId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
  });

  const createMatchMutation = useMutation({
    mutationFn: async (data: APIMatch) => {
      return createMatch(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
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

  const handleSaveMatch = async () => {
    if (!selectedMatch) return;
    debugger;

    // Find the double IDs based on selected names
    const double1Id = selectedMatch.double1
      ? doubles.find(
          (d) =>
            `${d.player1?.name} / ${d.player2?.name}` === selectedMatch.double1
        )?._id ||
        doubles.find(
          (d) =>
            `${d.player1?.name} / ${d.player2?.name}` === selectedMatch.double1
        )?.id
      : undefined;

    const double2Id = selectedMatch.double2
      ? doubles.find(
          (d) =>
            `${d.player1?.name} / ${d.player2?.name}` === selectedMatch.double2
        )?._id ||
        doubles.find(
          (d) =>
            `${d.player1?.name} / ${d.player2?.name}` === selectedMatch.double2
        )?.id
      : undefined;

    const matchData: Partial<APIMatch> = {
      round: selectedMatch.round,
      position: selectedMatch.position,
      double1: double1Id,
      double2: double2Id,
      scoreDouble1: selectedMatch.score1,
      scoreDouble2: selectedMatch.score2,
    };

    try {
      if (selectedMatch._id) {
        // Update existing match
        await updateMatchMutation.mutateAsync({
          matchId: selectedMatch._id,
          data: matchData,
        });
      } else {
        // Create new match
        await createMatchMutation.mutateAsync(matchData as APIMatch);
      }
      setDialogOpen(false);
      setSelectedMatch(null);
    } catch (error) {
      console.error("Failed to save match:", error);
    }
  };

  const doublesOptions = useMemo(
    () =>
      [
        {
          value: "bye",
          label: "Limpar Campo",
        },
      ].concat(
        doubles
          .map((d) => ({
            value: `${d.player1?.name} / ${d.player2?.name}`,
            label: `${d.player1?.name} / ${d.player2?.name}`,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      ),
    [doubles]
  );

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
                {/* <div>
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
                </div> */}

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
  const double2 =
    match.round === "R16" && !!match.double1 && !match.double2
      ? "Bye"
      : match.double2;
  return (
    <button
      onClick={onClick}
      className="border border-border rounded-lg bg-card hover:bg-accent transition-colors text-left"
    >
      <div className="border-b border-border px-3 py-2">
        <div className="text-xs font-medium truncate flex justify-between">
          <span>{match.double1 || "--"}</span>
          <span>
            <b>{match.score1 || "-"}</b>
          </span>
        </div>
      </div>
      <div className="px-3 py-2">
        <div className="text-xs font-medium truncate flex justify-between">
          <span>{double2 || "--"}</span>
          <span>
            <b>{match.score2 || "-"}</b>
          </span>
        </div>
      </div>
    </button>
  );
}

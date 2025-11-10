"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Tabs from "@radix-ui/react-tabs";
import {
  createPlayers,
  createDoubles,
  type Player,
  type Double,
  getPlayers,
  getDoubles,
} from "@/lib/api";
import PlayersTab from "./components/players";

export default function BTChampionship() {
  const [doubles, setDoubles] = useState<Double[]>([]);
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

  useQuery({
    queryKey: ["doubles"],
    queryFn: async () => {
      const doubles = await getDoubles();
      setDoubles(doubles);
      return doubles;
    },
  });

  const createPlayersMutation = useMutation({
    mutationFn: createPlayers,
    onSuccess: ({ group1, group2 }) => {
      setGroup1Players(group1);
      setGroup2Players(group2);
      setShowSuccessMessage("Jogadores salvos com sucesso.");
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    },
    onError: (error) => {
      alert(`Erro ao criar jogadores: ${error.message}`);
    },
  });

  const createDoublesMutation = useMutation({
    mutationFn: createDoubles,
    onSuccess: (data) => {
      // alert("Duplas criadas com sucesso!");
      setDoubles(data);
      setShowSuccessMessage("Duplas criadas com sucesso.");
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    },
    onError: (error) => {
      alert(`Erro ao criar duplas: ${error.message}`);
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

  const handleCreateDoubles = () => {
    createDoublesMutation.mutate();
  };

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

          <Tabs.Content value="jogadores" className="space-y-6">
            <PlayersTab />

            {/* Doubles Table */}
            {doubles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Duplas</h2>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          #
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Pro
                        </th>
                        <th className="py-3 px-4 text-left text-sm font-medium">
                          Pangaré
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {doubles.map((double, index) => (
                        <tr key={index} className="border-t border-border">
                          <td className="py-3 px-4 text-sm">{index + 1}</td>
                          <td className="py-3 px-4 text-sm">
                            {double.player1.name}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {double.player2.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="partidas">
            <div className="text-center py-12 text-muted-foreground">
              <p>Em breve: visualização das partidas</p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}

// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDoubles, getDoubles } from "@/lib/api";
import { Callout } from "@radix-ui/themes";

export default function DoublesTab({ isAdmin }: { isAdmin: boolean }) {
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: doubles = [] } = useQuery({
    queryKey: ["doubles"],
    queryFn: getDoubles,
  });

  const createDoublesMutation = useMutation({
    mutationFn: createDoubles,
    onSuccess: () => {
      setShowSuccessMessage("Duplas criadas!");
      queryClient.invalidateQueries({ queryKey: ["doubles"] });
      setTimeout(() => {
        setShowSuccessMessage("");
      }, 3000);
    },
    onError: (error) => {
      alert(`Erro ao criar duplas: ${error.message}`);
    },
  });

  const handleCreateDoubles = () => {
    createDoublesMutation.mutate();
  };

  return (
    <div>
      {doubles.length > 0 && (
        <div className="mt-8">
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="py-3 px-4 text-left text-sm font-medium">#</th>
                  <th className="py-3 px-4 text-left text-sm font-medium">
                    Profissional
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
                      {double.player1?.name}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {double.player2?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="grid grid-cols-2 gap-3 pt-6">
          <button
            className="py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createDoublesMutation.isPending}
            onClick={handleCreateDoubles}
          >
            Gerar duplas
          </button>

          {showSuccessMessage && (
            <Callout.Root>
              <Callout.Text>{showSuccessMessage}</Callout.Text>
            </Callout.Root>
          )}
        </div>
      )}
    </div>
  );
}

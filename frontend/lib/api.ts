const API_BASE_URL = "http://localhost:3001";

export interface Player {
  name: string;
  group: number;
}

export interface Double {
  id?: string;
  player1: Player;
  player2: Player;
}

export async function createPlayers(players: Player[]) {
  const response = await fetch(`${API_BASE_URL}/players/multiple`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(players),
  });

  if (!response.ok) {
    throw new Error("Failed to create players");
  }

  return response.json();
}

export async function createDoubles(): Promise<Double[]> {
  const response = await fetch(`${API_BASE_URL}/doubles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create doubles");
  }

  return response.json();
}

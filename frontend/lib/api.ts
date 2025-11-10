const API_BASE_URL = "http://localhost:3001";

export interface Player {
  __v: number;
  _id: string;
  createdAt: string;
  group: number;
  name: string;
  updatedAt: string;
}

export interface Double {
  id?: string;
  player1: Player;
  player2: Player;
}

export async function createPlayers(players: Player[]): Promise<{
  group1: (Player | null)[];
  group2: (Player | null)[];
}> {
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

export async function getPlayers(): Promise<{
  group1: (Player | null)[];
  group2: (Player | null)[];
}> {
  const response = await fetch(`${API_BASE_URL}/players`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch players");
  }

  return response.json();
}

export async function getDoubles(): Promise<Double[]> {
  const response = await fetch(`${API_BASE_URL}/doubles`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch doubles");
  }

  return response.json();
}

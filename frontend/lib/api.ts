const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Player {
  __v: number;
  _id: string;
  createdAt: string;
  group: number;
  name: string;
  updatedAt: string;
}

export interface Double {
  _id?: string;
  id?: string;
  player1: Player;
  player2: Player;
}

export interface Match {
  _id?: string;
  double1?: Double | string;
  double2?: Double | string;
  scoreDouble1?: string;
  scoreDouble2?: string;
  round?: "R16" | "R8" | "SEMI" | "FINAL";
  position?: number;
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

export async function getMatches(): Promise<Match[]> {
  const response = await fetch(`${API_BASE_URL}/matches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch matches");
  }

  return response.json();
}

export async function createMatch(match: Match): Promise<Match> {
  const response = await fetch(`${API_BASE_URL}/matches`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(match),
  });

  if (!response.ok) {
    throw new Error("Failed to create match");
  }

  return response.json();
}

export async function updateMatch(
  id: string,
  match: Partial<Match>
): Promise<Match> {
  const response = await fetch(`${API_BASE_URL}/matches/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(match),
  });

  if (!response.ok) {
    throw new Error("Failed to update match");
  }

  return response.json();
}

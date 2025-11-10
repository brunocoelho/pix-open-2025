import { Player } from 'src/players/players.schema';

export const getGroupPlayers = (players: Player[]) => {
  const group1: Array<Player | null> = players.filter(
    (player) => player.group === 1,
  );
  const group2: Array<Player | null> = players.filter(
    (player) => player.group === 2,
  );
  // I want to return each array with 16 elements, filling with null if necessary
  while (group1.length < 16) {
    group1.push(null);
  }
  while (group2.length < 16) {
    group2.push(null);
  }
  return { group1, group2 };
};

import { pipe } from 'fp-ts/lib/function';
import { isSamePlayer, Player } from './types/player';
import { advantage, Point, PointsData, Score, game , deuce, FortyData, fifteen, thirty, forty, love, points } from './types/score';
import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
// import { pipe } from 'fp-ts/lib/function';

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'PLAYER_TWO';
    case 'PLAYER_TWO':
      return 'PLAYER_ONE';
  }
};

export const incrementPoint = (point: Point): Option<Point> => {
  switch (point.kind) {
    case 'LOVE':
      return some(fifteen());
    case 'FIFTEEN':
      return some(thirty());
    case 'THIRTY':
      return none;
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string => {
  switch (point.kind) {
    case 'LOVE':
      return "LOVE";
    case 'FIFTEEN':
      return "FIFTEEN";
    case 'THIRTY':
      return "THIRTY";
  }
}
export const scoreToString = (score: Score): string => {
  switch (score.kind) {
    case "GAME":
      return 'Game';
    case "ADVANTAGE":
      return 'Advantage';
    case "DEUCE":
      return 'Duce';
    case "FORTY":
      return 'Forty';
    case "POINTS":
      return 'Points';
  }

}

export const scoreWhenDeuce = (winner: Player): Score => {
  return advantage(winner);
};

export const scoreWhenAdvantage = (
  advantagedPlayed: Player,
  winner: Player
): Score => {
  if(!isSamePlayer(advantagedPlayed, winner)) return deuce(); 
  return game(winner);
};

export const scoreWhenForty = (
  currentForty: FortyData,
  winner: Player
): Score => {
  if (isSamePlayer(currentForty.player, winner)) return game(winner);
  return pipe(
    incrementPoint(currentForty.otherPoint),
    matchOpt(
      () => deuce(),
      p => forty({player:winner, otherPoint:p}) as Score
    )
  );
};

export const scoreWhenGame = (winner: Player): Score =>  game(winner);



// Exercice 2
// Tip: You can use pipe function from fp-ts to improve readability.
// See scoreWhenForty function above.
export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  return pipe(
    incrementPoint(current[winner]),
    matchOpt(
      () => forty({ player: winner, otherPoint: current[otherPlayer(winner)] }),
      (newPoint) => points(
        {
          ...current,
          [winner]: newPoint
        }
    ) as Score
    )
  );
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      return scoreWhenPoint(currentScore.pointsData, winner);
    case 'ADVANTAGE':
      return scoreWhenAdvantage(currentScore.player,winner);
    case 'DEUCE':
      return scoreWhenDeuce(winner);
    case 'FORTY':
      return scoreWhenForty(currentScore.fortyData, winner);
    case 'GAME':
      return scoreWhenGame(winner);
  }
};





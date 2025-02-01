import { Player } from './player';


export type Love = {
  kind: 'LOVE';
};

export type Fifteen = {
  kind: 'FIFTEEN';
}

export type Thirty = {
  kind: 'THIRTY';
}

export type Point =
  | Love
  | Fifteen
  | Thirty

export type FortyData = {
  player: Player; // The player who have forty points
  otherPoint: Point; // Points of the other player
};

export const love = (): Love => ({
  kind: 'LOVE',
});

export const fifteen = (): Fifteen => ({
  kind: 'FIFTEEN',
});

export const thirty = (): Thirty => ({
  kind: 'THIRTY',
});



export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};

export type Points = {
  kind: 'POINTS';
  pointsData: PointsData;
};

export type Forty = {
  kind: 'FORTY';
  fortyData: FortyData;
}

export type Deuce = {
  kind: 'DEUCE';
};

export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player;
};

export type Game = {
  kind: 'GAME';
  winner: Player;
};

// Exerice 0: Write all type constructors of Points, Deuce, Forty and Advantage types.
export type Score = Points | Forty | Deuce | Advantage | Game;

export const deuce = (): Deuce => ({  
  kind: 'DEUCE',
});

export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  fortyData: {
    player,
    otherPoint,
  },
});

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  winner,
});

export const points = (playerTwoPoint:Point, winnerPoint: Point): Points => ({
  kind: 'POINTS',
  pointsData:{
    PLAYER_ONE: winnerPoint,
    PLAYER_TWO: playerTwoPoint,
  }
});

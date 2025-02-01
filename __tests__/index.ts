import { describe, expect, test } from '@jest/globals';
import { otherPlayer, playerToString, scoreWhenAdvantage,
   scoreWhenDeuce, scoreWhenForty, 
   scoreWhenPoint} from '..';
import { advantage, game, forty, deuce, thirty, points, fifteen } from '../types/score';
import * as fc from 'fast-check';
import * as G from './generators';
import { isSamePlayer } from '../types/player';

describe('Tests for tooling functions', () => {
  test('Given playerOne when playerToString', () => {
    expect(playerToString('PLAYER_ONE')).toStrictEqual('Player 1');
  });

  test('Given playerOne when otherPlayer', () => {
    expect(otherPlayer('PLAYER_ONE')).toStrictEqual('PLAYER_TWO');
  });
});

describe('Tests for transition functions', () => {
  test('Given deuce, score is advantage to winner', () => {
    fc.assert(
      fc.property(G.getPlayer(), (winner) => {
        const score = scoreWhenDeuce(winner);
        const scoreExpected = advantage(winner);
        expect(score).toStrictEqual(scoreExpected);
      })
    );
    console.log('To fill when we will know how represent Deuce');
  });

  test('Given advantage when advantagedPlayer wins, score is Game avantagedPlayer', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const scoreExpected = game(winner);
        fc.pre(isSamePlayer(winner, advantagedPlayer));
        expect(score).toStrictEqual(scoreExpected);
      })
    ); 
    console.log('To fill when we will know how represent Advantage');
  });

  test('Given advantage when otherPlayer wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getPlayer(), G.getPlayer(), (advantagedPlayer, winner) => {
        fc.pre(!isSamePlayer(winner, advantagedPlayer));
        const score = scoreWhenAdvantage(advantagedPlayer, winner);
        const scoreExpected = deuce();
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });
  console.log('To fill when we will know how represent Advantage');
});

  test('Given a player at 40 when the same player wins, score is Game for this player', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        //player who has 40 points wins
        fc.pre(isSamePlayer(fortyData.player, winner));
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = game(winner);
        expect(score).toStrictEqual(scoreExpected);
        })
      );
  });
  console.log('To fill when we will know how represent Forty');
  test('Given player at 40 and other at 30 when other wins, score is Deuce', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        // Other point must be 30
        fc.pre(fortyData.otherPoint.kind === 'THIRTY');
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = deuce();
        expect(score).toStrictEqual(scoreExpected);
      })
    );
    console.log('To fill when we will know how represent Forty');
  });
  test('Given player at 40 and other at 15 when other wins, score is 40 - 15', () => {
    fc.assert(
      fc.property(G.getForty(), G.getPlayer(), ({ fortyData }, winner) => {
        fc.pre(!isSamePlayer(fortyData.player, winner));
        //Other point must be 15
        fc.pre(fortyData.otherPoint.kind === 'FIFTEEN')
        const score = scoreWhenForty(fortyData, winner);
        const scoreExpected = forty(fortyData.player, thirty());
        expect(score).toStrictEqual(scoreExpected);
      })
    );
    console.log('To fill when we will know how represent Forty');
  });
  // -------------------------TESTS POINTS-------------------------- //
  test('Given players at 0 or 15 points score kind is still POINTS', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        if (pointsData.PLAYER_ONE.kind === 'LOVE') {
          const score = scoreWhenPoint(pointsData, winner);
          const scoreExpected = points(pointsData.PLAYER_TWO,fifteen());
          expect(score).toStrictEqual(scoreExpected);
        } 
        if (pointsData.PLAYER_ONE.kind === 'FIFTEEN') {
          const score = scoreWhenPoint(pointsData, winner);
          const scoreExpected = points(pointsData.PLAYER_TWO,thirty());
          expect(score).toStrictEqual(scoreExpected);
        } 
      })
    );
  });

  test('Given one player at 30 and win, score kind is forty', () => {
    fc.assert(
      fc.property(G.getPoints(), G.getPlayer(), ({ pointsData }, winner) => {
        fc.pre(pointsData.PLAYER_ONE.kind === 'THIRTY' )
        const score = scoreWhenPoint(pointsData,winner)
        const scoreExpected = forty(winner,pointsData.PLAYER_TWO)
        expect(score).toStrictEqual(scoreExpected);
      })
    );
  });



const GamePhase = require('../../../../../utils/GamePhase.json');

module.exports = {
  friendlyName: 'Validate request to play face card',

  description: 'Verifies whether a request to play face card is legal, throwing explanatory error if not.',

  inputs: {
    currentState: {
      type: 'ref',
      descriptions: 'Object containing the current game state',
      required: true,
    },
    /**
     * @param { Object } requestedMove - Object describing the request to play points
     * @param { String } requestedMove.cardId - Card Played for points
     * @param { MoveType.FACECARD } requestedMove.moveType - Specifies that this a face card move
     */
    requestedMove: {
      type: 'ref',
      description: 'Object containing data needed for current move',
      required: true,
    },
    playedBy: {
      type: 'number',
      description: 'Player number of player requesting move',
      required: true,
    },
  },
  sync: true,
  fn: ({ requestedMove, currentState, playedBy }, exits) => {
    try {
      const playerKey = playedBy ? 'p1' : 'p0';

      const cardPlayed = currentState[playerKey].hand.find(({ id }) => id === requestedMove.cardId);

      if (currentState.phase !== GamePhase.MAIN) {
        throw new Error(`Can only play face card  in main phase, not ${currentState.phase}`);
      }

      if (!cardPlayed) {
        throw new Error('game.snackbar.global.playFromHand');
      }

      if (cardPlayed.isFrozen) {
        throw new Error('game.snackbar.global.cardFrozen');
      }

      if (currentState.turn % 2 !== playedBy) {
        throw new Error('game.snackbar.global.notYourTurn');
      }

      if ((cardPlayed.rank >= 12 && cardPlayed.rank <= 13) || cardPlayed.rank === 8) {
        throw new Error('game.snackbar.faceCard.withoutTarget');
      }

      return exits.success();
    } catch (err) {
      return exits.error(err);
    }
  },
};

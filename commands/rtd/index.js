var redisUtil = requireRoot('utils/redis')

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a pong for your ping.
 * @return {String}
 */
function* roll_the_dice(events, restargs) {
  let roll = getRandomInt(0,101)

  // yield redisUtil.addToSortedSet({
  //  key    : 'rtd',
  //  member : events.message.author.username,
  //  score  : roll
  // })

  // var saved_rolls = yield redisUtil.getBatchFromSortedSet({ key: 'rtd' })

  yield redisUtil.setHashForKey('asd');

  var saved_rolls = yield redisUtil.getHashForKey('asd');

  // let result = yield saved_rolls.next().value;
  return saved_rolls;
}

module.exports = roll_the_dice

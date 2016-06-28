let Redis        = require('ioredis')

let validateUtil = requireRoot('utils/validate')

let redis        = new Redis()



/**
 * Adds a member with a specified score to the sorted set.
 *
 * @param {Object} options
 * @param {String} options.key Redis key for sorted set.
 * @param {Number} options.score Score for the added member.
 * @param {String} options.member Member to be added to the sorted set.
 */
function* addToSortedSet(options) {

  validateUtil(options).has({
    key    : {
      type : 'string'
    },
    score  : {
      type: 'number'
    },
    member : {
      type: 'string'
    }
  })

  yield redis.zadd(options.key, options.score, options.member)

}



/**
 * Checks the existence of a redis key.
 * @param {String} key Redis key.
 * @return {Number}
 */
function* exists(key) {
  validateUtil(key).isA('string')
  return yield redis.exists(key)
}



/**
 * Gets a batch of members from the sorted set.
 *
 * @param {Object} options
 * @param {String} options.key Redis key.
 * @param {Number} [options.lastScore='+inf'] Upper bound on score.
 * @param {Number} [options.limit] Batch size.
 *
 * @return {Array}
 */
function* getBatchFromSortedSet(options) {

  validateUtil(options).has({
    key : {
      required : true,
      type     : 'string'
    },
    lastScore : {
      type : 'number'
    },
    limit : {
      default : 10,
      type    : 'number'
    }
  })

  let args = [options.key]

  if (options.lastScore) {
    args.push('(' + options.lastScore)
  }
  else {
    args.push('+inf')
  }

  // Set the lower bound on score
  args.push('-inf')

  // Set the batch size
  args.push('limit', 0, options.limit)

  return yield redis.zrevrangebyscore(args)

}



/**
 * Resets the redis cache.
 */
function* reset() {
  yield redis.flushall()
}




module.exports = {
  addToSortedSet,
  exists,
  getBatchFromSortedSet,
  reset
}

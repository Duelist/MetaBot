let sinon         = require('sinon')

let METACOINS     = requireRoot('bot/commands/metacoins/constants')
let testUtil      = requireRoot('utils/test')

let metacoins     = testUtil.rewireRoot('bot/commands/metacoins')



describe('@default', () => {

  it('responds with a user’s metacoin count', function* () {

    // Rewire the metacoins service with a stub for the get metacoins function
    let metacoinsService = metacoins.__get__('metacoins')
    let metacoinsServiceStub = {
      getMetacoinsForUser : function* () { return 3 }
    }
    metacoins.__set__('metacoins', metacoinsServiceStub)

    // Create test message options
    let options = {
      message : {
        author  : {
          id      : 1,
          mention : '@User'
        },
        channel : {
          createMessage : function* (message) {
            return message
          }
        }
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    yield metacoins.message(options)

    createMessageSpy.callCount.should.eql(1)
    createMessageSpy.lastCall.args[0].should.eql(
      METACOINS.MESSAGE.METACOIN_COUNT('@User', '3')
    )

    // Restore stub
    metacoins.__set__('metacoins', metacoinsService)

  })


  it('responds with a leaderboard for an admin user', function* () {

    // Rewire the metacoins service with a stub for the leaderboard function
    let metacoinsService = metacoins.__get__('metacoins')
    let metacoinsServiceStub = {
      getLeaderboard: function* () { return 'leaderboard' }
    }
    metacoins.__set__('metacoins', metacoinsServiceStub)

    // Change the config admin ids to include a new admin user id
    let config = metacoins.__get__('metabotConfig')
    metacoins.__set__('metabotConfig', { adminIds: [1] })

    // Create test message options
    let options = {
      args    : [METACOINS.COMMAND.LEADERBOARD],
      message : {
        author  : { id: 1 },
        channel : {
          createMessage : function* (message) {
            return message
          }
        }
      }
    }

    // Create a spy on the create message function
    let createMessageSpy = sinon.spy(options.message.channel, 'createMessage')

    yield metacoins.message(options)

    createMessageSpy.callCount.should.eql(1)
    createMessageSpy.lastCall.args[0].should.eql('leaderboard')

    // Restore stub and config
    metacoins.__set__('metacoins', metacoinsService)
    metacoins.__set__('metabotConfig', config)

  })

})

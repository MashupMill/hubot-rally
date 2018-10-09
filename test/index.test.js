import Helper from 'hubot-test-helper';
import { expect } from 'chai';
const helper = new Helper('../src/index.js');

describe('hubot-rally', () => {
    let room;

    beforeEach(() => {
        room = helper.createRoom();
    });

    afterEach(() => {
        room.destroy();
    });

    it('should not response when a ticket is not given', () => {
        return room.user.say('jsmith', 'show me gus12345').then(() => {
            expect(room.messages[room.messages.length - 1]).to.eql(['jsmith', `show me gus12345`])
        })
    });
    // TODO: need to mock the rally api
    // it('should give link to ticket', () => {
    //     return room.user.say('jsmith', 'US12345 is ready').then(() => {
    //         expect(room.messages[room.messages.length - 1]).to.eql(['hubot', `https://rally1.rallydev.com/#/search?keywords=US12345`])
    //     })
    // });
    //
    // it('should give link to multiple tickets', () => {
    //     return room.user.say('jsmith', 'are US12345 and DE12345 ready?').then(() => {
    //         expect(room.messages[room.messages.length - 1]).to.eql(['hubot', `https://rally1.rallydev.com/#/search?keywords=US12345\nhttps://rally1.rallydev.com/#/search?keywords=DE12345`])
    //     })
    // });
});

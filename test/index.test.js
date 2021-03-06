import Helper from 'hubot-test-helper';
import { expect } from 'chai';
import { stub } from 'sinon';
import * as rallyClient from '../src/rally-client';
const helper = new Helper('../src/index.js');

const US12345 = require('./resources/US12345.json');
const DE12345 = require('./resources/DE12345.json');

const delay = ms => new Promise((resolve) => setTimeout(resolve, ms));

describe('hubot-rally', () => {
    let room, client, query;

    beforeEach(() => {
        room = helper.createRoom({ httpd: false });
        query = stub();
        client = stub(rallyClient, 'default').returns({
            query
        });
    });

    afterEach(() => {
        room.destroy();
        client.restore();
    });

    it('should allow blacklisting words', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', 'lets update the f5');

        await delay(10);
        expect(room.messages.length).to.equal(3);
    });

    it('should still return results for non-blacklisted tickets', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', 'lets update the f5 for us12345');

        await delay(10);
        expect(room.messages.length).to.equal(4);
    });

    it('should allow removing blacklisted words', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', '@hubot rally-blacklist remove f5');
        await room.user.say('jsmith', 'lets update the f5');

        await delay(10);
        expect(room.messages.length).to.equal(7);
    });

    it('should allow showing blacklisted words with command `show`', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', '@hubot rally-blacklist show');

        await delay(10);
        expect(room.messages[room.messages.length - 1][1]).to.equal("Here's the blacklist for room1: \"f5\"");
    });

    it('should allow showing blacklisted words when no command is given', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', '@hubot rally-blacklist');

        await delay(10);
        expect(room.messages[room.messages.length - 1][1]).to.equal("Here's the blacklist for room1: \"f5\"");
    });

    it('should allow concatenate words with a comma', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-blacklist add f5');
        await room.user.say('jsmith', '@hubot rally-blacklist add f6');
        await room.user.say('jsmith', '@hubot rally-blacklist show');

        await delay(10);
        expect(room.messages[room.messages.length - 1][1]).to.equal("Here's the blacklist for room1: \"f5\", \"f6\"");
    });

    it('should allow disabling rally', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-disable');
        await room.user.say('jsmith', 'look at us12345');

        await delay(10);
        expect(room.messages.length).to.equal(3);
    });

    it('should allow re-enabling rally', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', '@hubot rally-disable');
        await room.user.say('jsmith', '@hubot rally-enable');
        await room.user.say('jsmith', 'look at us12345');

        await delay(10);
        expect(room.messages.length).to.equal(6);
    });

    it('should not respond when a ticket is not given', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', 'show me gus12345');
        await delay(10);
        expect(room.messages[room.messages.length - 1]).to.eql(['jsmith', `show me gus12345`])
    });

    it('not send any message when no results are found', async () => {
        query.returns({Results: []});
        await room.user.say('jsmith', 'US12345 is ready');
        await delay(10);
        expect(room.messages[room.messages.length - 1]).to.eql(['jsmith', 'US12345 is ready'])
    });

    // TODO: may be more useful to have separate tests that just simply test the transform of a rally result to an 'attachment' and these tests can be slimmed down to not check the messages so deeply
    it('should give link to ticket', async () => {
        query.returns({ Results: [US12345] });
        await room.user.say('jsmith', 'US12345 is ready');
        await delay(10);
        expect(room.messages[room.messages.length - 1]).to.eql([
            "hubot",
            {
                "as_user": false,
                "attachments": [
                    {
                        "color": "#107c1e",
                        "fields": [
                            {
                                "short": true,
                                "title": "Schedule State",
                                "value": "`Released`",
                            },
                            {
                                "short": true,
                                "title": "State",
                                "value": "_Undefined_",
                            },
                            {
                                "short": true,
                                "title": "Owner",
                                "value": "John",
                            },
                            {
                                "short": true,
                                "title": "Project",
                                "value": "Wild Boars",
                            },
                            {
                                "short": true,
                                "title": "Release",
                                "value": "1.0.0",
                            }
                        ],
                        "title": "US12345: Create Something Cool",
                        "title_link": "https://rally1.rallydev.com/#/search?keywords=US12345"
                    }
                ],
                "icon_url": "https://avatars0.githubusercontent.com/u/1316658",
                "text": "Results from Rally",
                "username": "Rally"
            }
        ]);

    });

    it('should give link to multiple tickets', async () => {
        query.onFirstCall().returns({ Results: [US12345] });
        query.onSecondCall().returns({ Results: [DE12345] });

        await room.user.say('jsmith', 'are US12345 and DE12345 ready?');
        await delay(10);

        expect(room.messages[room.messages.length - 1]).to.eql([
            "hubot",
            {
                "as_user": false,
                "attachments": [
                    {
                        "color": "#107c1e",
                        "fields": [
                            {
                                "short": true,
                                "title": "Schedule State",
                                "value": "`Released`",
                            },
                            {
                                "short": true,
                                "title": "State",
                                "value": "_Undefined_",
                            },
                            {
                                "short": true,
                                "title": "Owner",
                                "value": "John",
                            },
                            {
                                "short": true,
                                "title": "Project",
                                "value": "Wild Boars",
                            },
                            {
                                "short": true,
                                "title": "Release",
                                "value": "1.0.0",
                            },
                        ],
                        "title": "US12345: Create Something Cool",
                        "title_link": "https://rally1.rallydev.com/#/search?keywords=US12345",
                    },
                    {
                        "color": "#f9a814",
                        "fields": [
                            {
                                "short": true,
                                "title": "Schedule State",
                                "value": "`In-Progress`",
                            },
                            {
                                "short": true,
                                "title": "State",
                                "value": "`Open`",
                            },
                            {
                                "short": true,
                                "title": "Owner",
                                "value": "John",
                            },
                            {
                                "short": true,
                                "title": "Project",
                                "value": "Wild Boars",
                            },
                            {
                                "short": true,
                                "title": "Release",
                                "value": "_Unscheduled_",
                            },
                        ],
                        "title": "DE12345: Fix something cool",
                        "title_link": "https://rally1.rallydev.com/#/search?keywords=DE12345",
                    },
                ],
                "icon_url": "https://avatars0.githubusercontent.com/u/1316658",
                "text": "Results from Rally",
                "username": "Rally"
            }
        ]);
    });
});

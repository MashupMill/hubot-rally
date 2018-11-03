# hubot-rally

[![npm](https://img.shields.io/npm/v/@mashupmill/hubot-rally.svg?style=for-the-badge)](https://www.npmjs.com/package/@mashupmill/hubot-rally)
[![npm](https://img.shields.io/npm/dm/@mashupmill/hubot-rally.svg?style=for-the-badge)](https://npmjs.org/package/@mashupmill/hubot-rally)
[![GitHub issues](https://img.shields.io/github/issues-raw/MashupMill/hubot-rally.svg?style=for-the-badge)](https://github.com/MashupMill/hubot-rally/issues)

[![Travis](https://img.shields.io/travis/MashupMill/hubot-rally.svg?style=for-the-badge)](https://travis-ci.org/MashupMill/hubot-rally)
[![Coveralls github](https://img.shields.io/coveralls/github/MashupMill/hubot-rally.svg?style=for-the-badge)](https://coveralls.io/github/MashupMill/hubot-rally)
[![David](https://img.shields.io/david/MashupMill/hubot-rally.svg?style=for-the-badge)](https://david-dm.org/MashupMill/hubot-rally)

A hubot script to do rally stuff

## Installation

Just add `@mashupmill/hubot-rally` to your external scripts in hubot and set the `RALLY_API_KEY` environment variable.

> Note: This may only work with `hubot-slack`

## Persistent storage

The data to disable and blacklist tickets is stored in the hubot brain, which by default is stored in memory.
If you wish to have this persist across restarts, you will need to setup a persistent robot brain in hubot.
For example, the redis hubot brain.  

## Usage

Make sure you invite your hubot to whatever channels you want it to listen in. Once he's in a channel, he will listen
for text matching rally ticket numbers (i.e. `US12345`, `DE12345`, etc) and it will output the ticket information.

### Enable/Disable per room
You can disable ticket matching in a room by saying `@hubot rally-disable`. And to re-enable type `@hubot rally-enable`

### Blacklisting tickets per room
You can add tickets to a blacklist per room by saying `@hubot rally-blacklist add f5`. And to remove it from the blacklist, say `@hubot rally-blacklist remove f5`


## Changelog

### `0.2.0`

* Added `@hubot rally-disable` and `@hubot rally-enable`
* Added `@hubot rally-blacklist add ...` and `@hubot rally-blacklist remove ...`

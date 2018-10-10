# hubot-rally

[![npm](https://img.shields.io/npm/v/@mashupmill/hubot-rally.svg?style=for-the-badge)](https://www.npmjs.com/package/@mashupmill/hubot-rally)
[![npm](https://img.shields.io/npm/dm/@mashupmill/hubot-rally.svg?style=for-the-badge)](https://npmjs.org/package/@mashupmill/hubot-rally)
[![GitHub issues](https://img.shields.io/github/issues-raw/MashupMill/hubot-rally.svg?style=for-the-badge)](https://github.com/MashupMill/hubot-rally/issues)

[![Travis](https://img.shields.io/travis/MashupMill/hubot-rally.svg?style=for-the-badge)](https://travis-ci.org/MashupMill/hubot-rally)
[![David](https://img.shields.io/david/MashupMill/hubot-rally.svg?style=for-the-badge)](https://david-dm.org/MashupMill/hubot-rally)

A hubot script to do rally stuff

## Installation

Just add `@mashupmill/hubot-rally` to your external scripts in hubot and set the `RALLY_API_KEY` environment variable.

> Note: This may only work with `hubot-slack`

## Usage

Make sure you invite your hubot to whatever channels you want it to listen in. Once he's in a channel, he will listen
for text matching rally ticket numbers (i.e. `US12345`, `DE12345`, etc) and it will output the ticket information.

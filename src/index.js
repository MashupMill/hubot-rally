// Description:
//   Integration with rally
//
// Dependencies:
//   "rally": "^2.1.2"
//
// Configuration:
//   RALLY_API_KEY
//
// Commands:
//   <FormattedID> - <Some rally ticket FormattedID>
//
// Author:
//   Branden Cash

import { util as rallyUtils }  from "rally";
import rallyClient from './rally-client';
import parseTickets, { RALLY_TICKET_REGEX } from './parse-tickets';

const typeMap = {
    'de': 'defect',
    'ta': 'tasks',
    'tc': 'testcases',
    'f': 'portfolioitem/feature',
    'i': 'portfolioitem/initiative',
    'us': 'hierarchicalrequirement'
};

const getType = ticket => typeMap[ticket.toLowerCase().replace(/[^a-z]*/g, '')];

export default
module.exports = (robot) => {
    robot.hear(RALLY_TICKET_REGEX, async res => {
        const tickets = parseTickets(res.message.text);

        /* istanbul ignore next */
        if (!tickets.length) return;

        const responses = await Promise.all(tickets.map(ticket => (rallyClient().query({
            type: getType(ticket),
            start: 1,
            pageSize: 10,
            order: 'Rank',
            fetch: ['FormattedID', 'Name', 'ScheduleState', 'State', 'DisplayColor', 'Owner', 'Project', 'Release'],
            query: rallyUtils.query.where('FormattedID', '=', ticket)
        }))));

        const results = responses.reduce(((previousValue, currentValue) => (
            previousValue.concat(currentValue.Results)
        )), []);

        if (results.length === 0) return;

        //console.debug(JSON.stringify(results));

        return res.send({
            username: 'Rally',
            icon_url: 'https://avatars0.githubusercontent.com/u/1316658',
            as_user: false,
            text: `Results from Rally`,
            attachments: results.map(({
                FormattedID,
                Name,
                ScheduleState,
                State,
                DisplayColor,
                Release,
                Owner,
                Project,
            }) => ({
                title: `${FormattedID}: ${Name}`,
                title_link: `https://rally1.rallydev.com/#/search?keywords=${FormattedID}`,
                color: DisplayColor,
                fields: [
                    { title: 'Schedule State', value: ScheduleState && `\`${ScheduleState}\`` || '_Undefined_', short: true },
                    { title: 'State', value: State && `\`${typeof State === 'string' ? State : State._refObjectName}\`` || '_Undefined_', short: true },
                    { title: 'Owner', value: (Owner && Owner._refObjectName || '_Unassigned_'), short: true },
                    { title: 'Project', value: (Project && Project._refObjectName || '_Unassigned_'), short: true },
                    { title: 'Release', value: (Release && Release.Name || null) || '_Unscheduled_', short: true }
                ]
            }))
        })
    })
};

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
//   hubot <trigger> - <what the respond trigger does>
//   <trigger> - <what the hear trigger does>
//
// Author:
//   Branden Cash
import rally from "rally";
import parseTickets, { RALLY_TICKET_REGEX } from './parse-tickets';
const queryUtils = rally.util.query;

const restApi = rally({
    apiKey: process.env.RALLY_API_KEY,
    requestOptions: {
        headers: {
            'X-RallyIntegrationName': require('../package.json').name,
            'X-RallyIntegrationVendor': require('../package.json').author,
            'X-RallyIntegrationVersion': require('../package.json').version
        }
    }
});

export default
module.exports = (robot) => {
    robot.hear(RALLY_TICKET_REGEX, res => {
        const tickets = parseTickets(res.message.text);

        if (!tickets.length) return;

        restApi.query({
            type: 'artifact',
            qs: {
                types: 'defect,hierarchicalrequirement,testcases,tasks,portfolioitem/feature'
            },
            //type: type, //text.toLowerCase().startsWith('de') ? 'defect' : 'hierarchicalrequirement',
            start: 1,
            pageSize: 10,
            order: 'Rank',
            fetch: ['FormattedID', 'Name', 'ScheduleState', 'State', 'DisplayColor', 'Owner', 'Project', 'Release'],
            query: queryUtils.where('FormattedID', '=', tickets[0])//.or('Name', 'contains', text)
        }).then(response => {
            const results = response.Results;

            if (results.length === 0) return;

            console.debug(JSON.stringify(results));

            res.send({
                username: 'Rally',
                icon_url: 'https://avatars0.githubusercontent.com/u/1316658',
                as_user: false,
                text: `Results for "${text}"`,
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
        }).catch(err => {
            console.error('Failed to search for rally tickets', err);
        });

        //res.send(tickets.map(FormattedID => `https://rally1.rallydev.com/#/search?keywords=${FormattedID}`).join("\n"));
    })
};

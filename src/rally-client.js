import rally from "rally";

export default () => {
    return rally({
        apiKey: process.env.RALLY_API_KEY,
        requestOptions: {
            headers: {
                'X-RallyIntegrationName': require('../package.json').name,
                'X-RallyIntegrationVendor': require('../package.json').author,
                'X-RallyIntegrationVersion': require('../package.json').version
            }
        }
    });
}

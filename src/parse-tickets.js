export const RALLY_TICKET_REGEX = /^(\s*|.+\s)((US|DE|TA|F|TC|I)[\d]+)(\W.*|\s.*|)$/i

const parse = message => {
    const matches = RALLY_TICKET_REGEX.exec(message);
    if (!matches) return [];

    const lh = parse(matches[1]);
    const rh = parse(matches[4]);

    return lh.concat([matches[2]], rh);
};

export default parse;

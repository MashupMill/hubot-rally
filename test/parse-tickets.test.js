import { expect } from 'chai';
import parseTickets from '../src/parse-tickets';

describe('parse-tickets', () => {
    it('should match ticket when at the beginning of the message', () => {
        expect(parseTickets('US12345 is ready')).to.eql(['US12345']);
    });

    it('should match ticket when in the middle of the message', () => {
        expect(parseTickets('is US12345 ready?')).to.eql(['US12345']);
    });

    it('should match ticket when at the end of the message', () => {
        expect(parseTickets('show me US12345')).to.eql(['US12345']);
    });

    it('should match ticket when there is a suffix non-word character', () => {
        expect(parseTickets('show me US12345?')).to.eql(['US12345']);
    });

    it('should not match ticket when there is a suffix word character', () => {
        expect(parseTickets('show me US12345a')).to.eql([]);
    });

    it('should not match ticket when there is not whitespace before', () => {
        expect(parseTickets('show me gUS12345')).to.eql([]);
    });

    it('should match ticket when multiple tickets are present', () => {
        expect(parseTickets('are US12345 and DE12345 ready?')).to.eql(['US12345', 'DE12345']);
    });
});

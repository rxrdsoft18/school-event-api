import { Event } from './event.entity';

describe('EventEntity', () => {
  test('Event should be initialized through constructor', () => {
    const event = new Event({
      name: 'Interesting event',
      description: 'That is fun',
    });

    expect(event).toEqual({
      name: 'Interesting event',
      description: 'That is fun',
    });
  });
});

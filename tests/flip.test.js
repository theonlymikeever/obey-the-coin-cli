const { randomOneZero, createTimeStamp } = require('../lib/utils');
const { calculateFlips } = require('../lib/flip');

describe('Flipping functions', () => {
  it('randomOneTwo generates either 0 or 1', () => {
    const randomNums = Array.from(new Array(50), randomOneZero);
    const expected = [0, 1];
    expect(randomNums).toEqual(expect.arrayContaining(expected));
  })

  it('calculateFlips returns an obj w/ proper results', () => {
    const flipCount = 9;
    const result = calculateFlips(flipCount);
    const timeStamp = createTimeStamp();

    expect(result.flipCount).toEqual(flipCount);
    expect(result.tie).toBeFalsy();
    expect(result.timeStamp).toEqual(timeStamp);
    expect(result.headsCount).toBeLessThanOrEqual(flipCount)
    expect(result.tailsCount).toBeLessThanOrEqual(flipCount)
  })
});


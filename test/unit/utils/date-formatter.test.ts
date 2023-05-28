import {convertSecondsToDuration} from "../../../src/utils/date-formatter";

describe('Utils Test', () => {
    test('Convert Second To Duration', () => {
        const {
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
        } = convertSecondsToDuration(60 * 60 * 24 * 395 + (5) + (60 * 2) + (60 * 60 * 3) + (60 * 60 * 24 * 20))

        expect(years).toBe(1)
        expect(months).toBe(1)
        expect(days).toBe(20)
        expect(hours).toBe(3)
        expect(minutes).toBe(2)
        expect(seconds).toBe(5)
    })
})
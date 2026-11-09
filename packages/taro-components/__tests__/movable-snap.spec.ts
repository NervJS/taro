import { snapTarget } from '../src/components/movable-area/snap-target'

describe('movable snap target', () => {
  it.each([
    ['max: equal threshold returns to max', 0, -40, -80, 0, 40, 0],
    ['max: over threshold moves to min', 0, -40.1, -80, 0, 40, -80],
    ['min: equal threshold moves to max', -80, -40, -80, 0, 40, 0],
    ['min: under threshold returns to min', -80, -40.1, -80, 0, 40, -80],
    ['interior: nearest endpoint is max on a tie', -40, -60, -80, 0, 15, -80],
    ['zero threshold still requires a real move', -80, -80, -80, 0, 0, null],
    ['zero threshold and movement from max', 0, -0.1, -80, 0, 0, -80],
    ['zero threshold and movement from min', -80, -79.9, -80, 0, 0, 0],
    ['outward movement clamped to min is not effective', -80, -100, -80, 0, 0, null],
    ['threshold larger than range returns to start side', 0, -80, -80, 0, 90, 0],
    ['no travel has no target', 0, 0, 0, 0, 0, null],
  ] as const)('%s', (_name, start, end, min, max, threshold, expected) => {
    expect(snapTarget(start, end, min, max, threshold)).toBe(expected)
  })

  it.each([undefined, null, -1, NaN, Infinity])('disables invalid threshold %s', threshold => {
    expect(snapTarget(0, -50, -80, 0, threshold)).toBeNull()
  })
})

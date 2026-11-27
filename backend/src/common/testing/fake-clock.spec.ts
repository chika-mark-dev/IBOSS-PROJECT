import { describe, expect, it } from '@jest/globals';
import { FakeClock } from './fake-clock';

describe('FakeClock', () => {
  const start = new Date('2026-11-27T10:00:00.000Z');

  it('returns the time it was given', () => {
    const clock = new FakeClock(start);
    expect(clock.now().toISOString()).toBe('2026-11-27T10:00:00.000Z');
  });

  it('does not move on its own', () => {
    const clock = new FakeClock(start);
    const first = clock.now().getTime();
    const second = clock.now().getTime();
    expect(second).toBe(first);
  });

  it('advanceSeconds moves the time forward', () => {
    const clock = new FakeClock(start);
    clock.advanceSeconds(90);
    expect(clock.now().toISOString()).toBe('2026-11-27T10:01:30.000Z');
  });

  it('set replaces the time', () => {
    const clock = new FakeClock(start);
    clock.set(new Date('2026-12-01T00:00:00.000Z'));
    expect(clock.now().toISOString()).toBe('2026-12-01T00:00:00.000Z');
  });

  it('returns a copy, so callers cannot change the clock', () => {
    const clock = new FakeClock(start);
    const leaked = clock.now();
    leaked.setFullYear(1999);
    expect(clock.now().toISOString()).toBe('2026-11-27T10:00:00.000Z');
  });
});

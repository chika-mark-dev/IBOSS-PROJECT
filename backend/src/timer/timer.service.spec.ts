import { beforeEach, describe, expect, it } from '@jest/globals';
import { FakeClock } from '../common/testing/fake-clock';
import { GRACE_SECONDS, TimerService } from './timer.service';

describe('TimerService', () => {
  const start = new Date('2026-11-27T10:00:00.000Z');
  let clock: FakeClock;
  let timer: TimerService;

  beforeEach(() => {
    clock = new FakeClock(start);
    timer = new TimerService(clock);
  });

  describe('computeExpiry', () => {
    it('adds the duration to the current time', () => {
      expect(timer.computeExpiry(30).toISOString()).toBe(
        '2026-11-27T10:30:00.000Z',
      );
    });
  });

  describe('isExpired', () => {
    const expiresAt = new Date('2026-11-27T10:30:00.000Z');

    it('is false one second before expiry', () => {
      clock.set(new Date('2026-11-27T10:29:59.000Z'));
      expect(timer.isExpired(expiresAt)).toBe(false);
    });

    it('is true exactly at expiry', () => {
      clock.set(expiresAt);
      expect(timer.isExpired(expiresAt)).toBe(true);
    });

    it('is true after expiry', () => {
      clock.set(new Date('2026-11-27T10:30:01.000Z'));
      expect(timer.isExpired(expiresAt)).toBe(true);
    });
  });

  describe('classifySubmit', () => {
    const expiresAt = new Date('2026-11-27T10:30:00.000Z');

    it('is submitted before expiry', () => {
      clock.set(new Date('2026-11-27T10:20:00.000Z'));
      expect(timer.classifySubmit(expiresAt)).toBe('submitted');
    });

    it('is submitted exactly at the end of the grace window', () => {
      clock.set(expiresAt);
      clock.advanceSeconds(GRACE_SECONDS);
      expect(timer.classifySubmit(expiresAt)).toBe('submitted');
    });

    it('is submitted_late one second past the grace window', () => {
      clock.set(expiresAt);
      clock.advanceSeconds(GRACE_SECONDS + 1);
      expect(timer.classifySubmit(expiresAt)).toBe('submitted_late');
    });
  });

  describe('remainingSeconds', () => {
    const expiresAt = new Date('2026-11-27T10:30:00.000Z');

    it('returns the seconds left', () => {
      clock.set(new Date('2026-11-27T10:28:30.000Z'));
      expect(timer.remainingSeconds(expiresAt)).toBe(90);
    });

    it('rounds a partial second up', () => {
      clock.set(new Date('2026-11-27T10:29:59.500Z'));
      expect(timer.remainingSeconds(expiresAt)).toBe(1);
    });

    it('never goes below zero', () => {
      clock.set(new Date('2026-11-27T10:45:00.000Z'));
      expect(timer.remainingSeconds(expiresAt)).toBe(0);
    });
  });
});

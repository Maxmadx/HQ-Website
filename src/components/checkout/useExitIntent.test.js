// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useExitIntent from './useExitIntent';
import useTabReturn from './useTabReturn';

describe('useExitIntent', () => {
  it('returns false initially', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    expect(result.current).toBe(false);
  });

  it('returns true after mouseleave near the top edge', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 5 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(true);
  });

  it('does NOT trigger when disabled', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: false }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 5 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(false);
  });

  it('does NOT trigger if mouse leaves the side, not the top', () => {
    const { result } = renderHook(() => useExitIntent({ enabled: true }));
    act(() => {
      const evt = new MouseEvent('mouseleave', { bubbles: true, clientY: 500 });
      document.dispatchEvent(evt);
    });
    expect(result.current).toBe(false);
  });
});

describe('useTabReturn', () => {
  let originalVisibility;
  beforeEach(() => {
    originalVisibility = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
  });
  afterEach(() => {
    if (originalVisibility) {
      Object.defineProperty(Document.prototype, 'visibilityState', originalVisibility);
    }
  });

  it('returns false initially', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: true }));
    expect(result.current).toBe(false);
  });

  it('returns true after hidden → visible', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: true }));
    act(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(true);
  });

  it('does NOT trigger if disabled', () => {
    const { result } = renderHook(() => useTabReturn({ enabled: false }));
    act(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
      document.dispatchEvent(new Event('visibilitychange'));
      Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(result.current).toBe(false);
  });
});

import '@testing-library/jest-dom/vitest';

// jsdom ships neither of these; components rely on them (matchMedia for the
// reduced-motion effect, rAF for Svelte's Spring scheduler).
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false
		}) as unknown as MediaQueryList;
}

if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = (cb: FrameRequestCallback) =>
		setTimeout(() => cb(performance.now()), 0) as unknown as number;
	window.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// jsdom lacks the Pointer Capture API; model it as a per-element pointer set so
// the deck's drag handlers (set/has/release) are exercisable in tests.
if (!Element.prototype.setPointerCapture) {
	const captured = new WeakMap<Element, Set<number>>();
	Element.prototype.setPointerCapture = function (pointerId: number) {
		(captured.get(this) ?? captured.set(this, new Set()).get(this)!).add(pointerId);
	};
	Element.prototype.hasPointerCapture = function (pointerId: number) {
		return captured.get(this)?.has(pointerId) ?? false;
	};
	Element.prototype.releasePointerCapture = function (pointerId: number) {
		captured.get(this)?.delete(pointerId);
	};
}

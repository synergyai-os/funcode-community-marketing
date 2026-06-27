/** True when Web Animations API is available (false in SSR / jsdom — INS-28). */
export function canUseWebAnimations(): boolean {
	return typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
}

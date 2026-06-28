import type { Guide } from './types';

export type { Guide, GuideStatus, GuideStep } from './types';

export const guides: Guide[] = [
	{
		slug: 'ship-with-ai-15',
		title: 'Ship with AI in 15 minutes',
		tagline: 'Interactive workshop — from zero to something deployed.',
		description:
			'The core FunCode meetup workshop. We demo setup in ~15 minutes, then you ship hands-on. Works during the meetup and on your own at /guides/ship-with-ai-15 afterward.',
		duration: '~15 min setup demo + 45 min build',
		status: 'interactive',
		steps: [
			{
				order: 1,
				title: 'Fork & orient',
				body: 'Clone a Play Room starter, run pb orient, and tell your agent what you are building — intent before prompts.'
			},
			{
				order: 2,
				title: 'Pick your stack',
				body: 'Choose a sensible default (SvelteKit + Tailwind here) or swap — see the pick-tech-stack guide for tradeoffs.'
			},
			{
				order: 3,
				title: 'Ship one screen',
				body: 'Build a single UI that proves your idea — design tokens, one component, one happy path.'
			},
			{
				order: 4,
				title: 'Deploy or share',
				body: 'Get a URL you can show someone — deploy preview or local demo; done beats perfect.'
			}
		],
		chainRefs: ['WP-1', 'FLO-1', 'GLO-2']
	},
	{
		slug: 'connect-email',
		title: 'Connect email',
		tagline: 'Capture signups and send mail — without overbuilding.',
		description:
			'Wire a simple email capture flow: form, validation, and a provider stub. Placeholder guide — full interactive steps shipping next.',
		duration: '20 min',
		status: 'placeholder',
		steps: [
			{
				order: 1,
				title: 'Choose a provider',
				body: 'Resend, Postmark, or your existing stack — start with one transactional path.'
			},
			{
				order: 2,
				title: 'Add a capture form',
				body: 'Reuse FunCode patterns: modal or inline, validate email, store safely.'
			},
			{
				order: 3,
				title: 'Send a welcome',
				body: 'One template, one trigger — prove the loop before automating everything.'
			}
		],
		chainRefs: ['WP-1']
	},
	{
		slug: 'add-authentication',
		title: 'Add authentication',
		tagline: 'Sign-in that protects member actions — start simple.',
		description:
			'Magic link or OAuth — pick the smallest auth that fits. Placeholder guide covering session, protected routes, and member-only CTAs.',
		duration: '30 min',
		status: 'placeholder',
		steps: [
			{
				order: 1,
				title: 'Pick an auth model',
				body: 'Email magic link vs OAuth — optimize for your audience, not Twitter debates.'
			},
			{
				order: 2,
				title: 'Protect member actions',
				body: 'RSVP, host a meetup, save progress — gate these, keep marketing pages public.'
			},
			{
				order: 3,
				title: 'Test the unhappy paths',
				body: 'Expired link, wrong account, sign-out — the boring stuff that saves you later.'
			}
		],
		chainRefs: ['WP-1']
	},
	{
		slug: 'design-system-components',
		title: 'Build design components',
		tagline: 'Tokens and atoms — consistent UI without one-offs.',
		description:
			'Extend the FunCode design system: Button, Badge, Card, tokens in layout.css. Never bespoke — derive or update (BR-2).',
		duration: '25 min',
		status: 'placeholder',
		steps: [
			{
				order: 1,
				title: 'Read the tokens',
				body: 'layout.css @theme — semantic colors, radius, shadow. No arbitrary hex.'
			},
			{
				order: 2,
				title: 'Compose atoms',
				body: 'Import from ui/ — Icon via ~icons/lucide, extend the system do not reinvent.'
			},
			{
				order: 3,
				title: 'Run lint:ds',
				body: 'Design-system guard catches bespoke UI before it ships.'
			}
		],
		chainRefs: ['STD-1', 'STD-3', 'BR-2']
	},
	{
		slug: 'pick-tech-stack',
		title: 'Pick the right tech stack',
		tagline: 'Defaults that ship — swap when you have a reason.',
		description:
			'SvelteKit, Convex, Railway, Product Brain — why FunCode picks what it picks, and when to diverge.',
		duration: '15 min read',
		status: 'placeholder',
		steps: [
			{
				order: 1,
				title: 'Start from the bet',
				body: 'What are you proving? Pick the stack that gets you there fastest.'
			},
			{
				order: 2,
				title: 'Harness + Chain + code',
				body: 'Agent surface, governance, implementation — all three, not code alone.'
			},
			{
				order: 3,
				title: 'Document the fork',
				body: 'If you diverge, capture why on the Chain — future you will thank you.'
			}
		],
		chainRefs: ['WP-1', 'INS-1']
	},
	{
		slug: 'whats-possible-overview',
		title: "What's possible with AI",
		tagline: 'Email, auth, UI, deploy — a map before you dive in.',
		description:
			'Orientation guide linking the workshop path: what you can realistically ship in an afternoon with agents and a Play Room.',
		duration: '10 min read',
		status: 'placeholder',
		steps: [
			{
				order: 1,
				title: 'Prototype, not production',
				body: 'Play Room first — prove the idea, then harden.'
			},
			{
				order: 2,
				title: 'Follow the guides',
				body: 'Each capability (email, auth, design, stack) has its own guide — bite-sized.'
			},
			{
				order: 3,
				title: 'Bring questions to the meetup',
				body: "The “What's next?” block exists for exactly that."
			}
		],
		chainRefs: ['GLO-2', 'INS-18']
	}
];

export function guideBySlug(slug: string): Guide | undefined {
	return guides.find((g) => g.slug === slug);
}

export function interactiveGuides(): Guide[] {
	return guides.filter((g) => g.status === 'interactive');
}

<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui';
	import { isFeatureEnabled } from '$lib/analytics/feature-flags';
	import { captureEvent } from '$lib/analytics/posthog';
	import { mockAgentReply, type ChatContext, type ChatMessage } from '$lib/agent/mock-agent';
	import IconMessageCircle from '~icons/lucide/message-circle';
	import IconMic from '~icons/lucide/mic';
	import IconSend from '~icons/lucide/send';
	import IconX from '~icons/lucide/x';

	type Props = {
		context: ChatContext;
	};

	let { context }: Props = $props();

	let open = $state(false);
	let input = $state('');
	let messages = $state<ChatMessage[]>([]);
	let voiceEnabled = $state(false);

	onMount(() => {
		voiceEnabled = isFeatureEnabled('premium-ai-voice');
	});

	function toggle() {
		open = !open;
		if (open) captureEvent('ai_chat_opened', { page: context.pageKind });
	}

	function send() {
		const text = input.trim();
		if (!text) return;
		messages = [...messages, { id: crypto.randomUUID(), role: 'user', text }];
		input = '';
		const reply = mockAgentReply(text, context);
		messages = [...messages, reply];
		captureEvent('ai_chat_message', { page: context.pageKind, queryLength: text.length });
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
	{#if open}
		<section
			class="flex w-[min(100vw-3rem,24rem)] flex-col overflow-hidden rounded-card border border-border bg-surface shadow-card"
			aria-label="AI chat"
		>
			<header
				class="flex items-center justify-between border-b border-border bg-surface-muted px-4 py-3"
			>
				<div>
					<p class="text-sm font-bold">Ask this page</p>
					<p class="text-xs text-ink-soft">Prototype · Chain-backed snippets</p>
				</div>
				<button
					type="button"
					class="grid size-8 place-items-center rounded-full text-ink-soft transition hover:bg-surface hover:text-ink"
					aria-label="Close chat"
					onclick={toggle}
				>
					<IconX class="size-4" />
				</button>
			</header>

			<div class="flex max-h-72 flex-col gap-3 overflow-y-auto px-4 py-3">
				{#if messages.length === 0}
					<p class="text-sm text-pretty text-ink-soft">
						Ask about the mental model, guests, Play Rooms, or what leaders say about building with
						AI.
					</p>
				{/if}
				{#each messages as msg (msg.id)}
					<div class={msg.role === 'user' ? 'ml-8 text-right' : 'mr-4'}>
						<p
							class="inline-block rounded-card px-3 py-2 text-sm text-pretty {msg.role === 'user'
								? 'bg-accent text-white'
								: 'bg-surface-muted text-ink'}"
						>
							{msg.text}
						</p>
						{#if msg.sources && msg.sources.length > 0}
							<ul class="mt-1 space-y-0.5 text-left text-xs text-ink-soft">
								{#each msg.sources as src (src.title)}
									<li>{src.guest} — {src.title}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>

			<footer class="border-t border-border px-3 py-3">
				<div class="flex items-end gap-2">
					<textarea
						class="min-h-10 flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
						rows="2"
						placeholder="Ask anything…"
						bind:value={input}
						onkeydown={onKeydown}></textarea>
					<div class="flex flex-col gap-1">
						<Button type="button" variant="primary" size="icon" aria-label="Send" onclick={send}>
							<IconSend class="size-4" />
						</Button>
						{#if voiceEnabled}
							<Button type="button" variant="soft" size="icon" aria-label="Voice input">
								<IconMic class="size-4" />
							</Button>
						{:else}
							<span class="text-center text-xs text-muted">Voice soon</span>
						{/if}
					</div>
				</div>
			</footer>
		</section>
	{/if}

	<Button type="button" variant="primary" size="lg" aria-expanded={open} onclick={toggle}>
		<IconMessageCircle class="size-5" />
		Ask AI
	</Button>
</div>

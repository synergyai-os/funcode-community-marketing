#!/usr/bin/env node
/**
 * Point git at repo-root .husky hooks (STD-10). Runs on npm install in web/.
 */
import { chmodSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = fileURLToPath(new URL('../..', import.meta.url));
const hook = join(REPO, '.husky/pre-commit');

if (!existsSync(hook)) {
	console.warn('setup-git-hooks: .husky/pre-commit missing — skip');
	process.exit(0);
}

try {
	chmodSync(hook, 0o755);
	execSync('git config core.hooksPath .husky', { cwd: REPO, stdio: 'ignore' });
} catch {
	// Not a git checkout or git unavailable — non-fatal
}

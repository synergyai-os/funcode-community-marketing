import type { ChainCaptureManifest } from './chain-capture.types.js';
import { execPb } from './pb-exec.js';

function pbRelate(fromId: string, toId: string, type = 'related_to'): void {
	execPb(['relate', '--if-missing', fromId, type, toId]);
}

/** Wire the PAT-7 relation graph — shared by commit and reconcile --wire. */
export function wireManifestRelations(manifest: ChainCaptureManifest): void {
	console.log('Linking relations…');
	if (manifest.guestLand) {
		pbRelate(manifest.guestLand, manifest.showLand ?? 'LAND-1');
		pbRelate(manifest.guestLand, 'WP-1');
	}

	pbRelate(manifest.episodeIns, manifest.showLand ?? 'LAND-1');
	if (manifest.guestLand) {
		pbRelate(manifest.episodeIns, manifest.guestLand);
	}
	pbRelate(manifest.episodeIns, 'WP-1');

	for (const ins of manifest.insights) {
		pbRelate(ins.id, manifest.episodeIns);
		if (manifest.guestLand) pbRelate(ins.id, manifest.guestLand);
		pbRelate(ins.id, 'WP-1');
	}

	for (const word of manifest.words) {
		pbRelate(word.id, 'GLO-11');
		pbRelate(word.id, manifest.episodeIns);
		if (manifest.guestLand) pbRelate(word.id, manifest.guestLand);
	}

	if (manifest.glossaryIns) {
		pbRelate(manifest.glossaryIns, manifest.episodeIns);
		if (manifest.guestLand) pbRelate(manifest.glossaryIns, manifest.guestLand);
		pbRelate(manifest.glossaryIns, 'INS-48');
	}
}

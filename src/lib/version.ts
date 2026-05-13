/**
 * Single source of truth for the app version.
 * Reads from package.json so it never drifts from the published package version.
 */
import pkg from '../../package.json';

export const APP_VERSION: string = `v${pkg.version}`;

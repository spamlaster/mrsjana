// Preview mode lets pairs that are accepted for development, but not yet clinically approved, be used
// to build and try the activities. It is on in `npm run dev`, and in a build only when
// VITE_MINIMAL_PAIRS_PREVIEW=true is set for it (for example a private review copy for Jana).
// A normal production build never enables it, so families only ever see pairs Jana has approved.
// Outside Vite (Node tests) import.meta.env is undefined and preview is off.
const env = import.meta.env as ImportMetaEnv | undefined

export const previewMode: boolean = env?.DEV === true || env?.VITE_MINIMAL_PAIRS_PREVIEW === 'true'

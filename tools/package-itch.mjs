// tools/package-itch.mjs — local itch.io ZIP packager (plan §10, M7-01).
//
// NOT IMPLEMENTED yet. This is an explicit stub for the M0 scaffold: it must
// fail loudly instead of producing a fake release artifact. Real
// implementation lands in M7-01 (REL-01..08): build a ZIP from dist/ with
// index.html at the ZIP root, no source maps, no private/debug files, and
// report the file listing + total size against ZIP <= 25 MB / initial
// payload <= 10 MB. No upload, no login (M7-02/M7-03 are owner actions).
console.error(
  "package:itch is NOT IMPLEMENTED yet (M7-01). " +
    "No ZIP was created. Run `npm run build` for a local dist/ build instead.",
);
process.exit(1);

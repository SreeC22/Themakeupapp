# Neu Replit workspace snapshot

This review branch preserves the existing GitHub repository at its root and adds
the complete tracked Replit workspace snapshot under `replit-workspace/`.

- Snapshot source: local Replit `main` at `581e5a6`.
- GitHub base: `main` at `6e0acc4`, plus the earlier additive website organization
  commit already present on this branch.
- Snapshot contents: all 482 tracked workspace files. Untracked uploads and
  generated output are not included.
- The older standalone website port remains under `website/`; the new snapshot
  is separate on purpose. The owner can later choose what to keep, merge, or
  delete.
- Existing native-app source files at the GitHub repository root remain intact.
  The earlier website-port commit adds or updates only the root README and
  handoff documents, plus its separate `website/` tree. This branch does not
  update GitHub `main`, deploy the website, or apply database changes.

The snapshot is an archive of the Replit project, not yet a migration of every
Replit service to GitHub hosting. The website's API and development database
requirements remain documented in `replit-workspace/docs/neu-handoff.md` and
`replit-workspace/docs/STAGE_3_WARDROBE.md`. Do not add credentials to this
repository.

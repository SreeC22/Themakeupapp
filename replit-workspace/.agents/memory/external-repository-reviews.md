---
name: External repository reviews
description: Preserving review work when the website repository is separate from the Replit workspace.
---

Do not rely on a nested, ignored checkout as the only copy of website review work. Keep the website files in this workspace's tracked preview folder as well.

**Why:** An ignored checkout's files survived a task-session transition, but its nested `.git` directory did not. Git commands inside it then silently targeted the parent workspace repository instead of the website repository.

**How to apply:** Before committing or pushing from a nested checkout, verify `git rev-parse --show-toplevel` matches the intended checkout. Recreate the checkout if needed and copy the tracked website sources into it. Never infer that a named local branch or commit from a previous session still exists.

A managed GitHub connection reporting active is not proof that Git writes are authenticated. If repeated reconnection does not resolve rejected writes, use GitHub CLI's browser authorization with the owner's approval rather than repeatedly asking them to reconnect the same integration.

**Why:** The integration reported healthy while pushes consistently rejected its credentials. Owner-approved browser authorization for GitHub CLI restored write access without sharing credentials in chat.

**How to apply:** Verify an actual Git operation before claiming access works. Let the official client manage credentials, never inspect them, and exclude its credential directory from Git and deployment.

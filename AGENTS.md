# SimplyVibe agent workspace

The controller owns this protocol. Read `.agents/shared/plan.md` and `.agents/shared/tasks.json` before role work. Shared tasks describe application structure and flows, not role ownership. Only the planner changes shared plan files; every other role writes only its own home and allowed output paths. Never put credentials, tokens, raw event payloads, or signed URLs in this repository. Runtime files belong under `site/`; Cloudflare publishes only that folder.

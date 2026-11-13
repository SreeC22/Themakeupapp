# Preview gate and future release checklist

## Current gate

Stage 1 was accepted by the owner. Stage 2 now includes two-path onboarding, a representative normalized catalog and initial explainable recommendations. Its scope is `STAGE_2_REQUIREMENTS.md`; observed implementation/coverage is `STAGE_2_IMPLEMENTATION.md` and actual verification is `STAGE_2_QA.md`. Stop for review at this gate. Full catalog targets are progressive. Public community remains outside MVP until 500+ registered users and phase approval. Do not push or deploy.

### Historical Stage 0/1 checklist

- Stage 0 baseline audit and reuse plan are recorded.
- Stage 1 must be demonstrated through the existing website preview.
- Record actual unit/type/build/browser outcomes in `QA_TEST_PLAN.md`.
- Preserve native/static parity, waitlist wiring and SQL.
- Explain unknown evidence, local-only storage and unsupported account/publication actions.
- Stop for owner review. Do not automatically proceed to Stage 2.

Current result: 56 preview unit tests, website typecheck/build, 3 existing catalog tests and 2,180 legacy parity checks passed. The browser pass found a draft reload defect; the focused continuation verified its fix and remaining journeys. See `QA_TEST_PLAN.md` for exact coverage and exclusions. Stage 1 is a preview review gate, not release approval.

## Not approved or complete

- A current, licensed, verified product/shade catalog and full editorial coverage.
- Category-specific recommendation engine and calibrated evidence confidence.
- Real authentication, private saves, shared reviews, reporting/moderation and two-account RLS tests.
- Security/accessibility certification, real-device matrix and slow-network measurement.
- Legal review, photo rights, production privacy/retention/account deletion and operational ownership.
- Public hosting migration, production database migrations, paid services, tracker enablement or launch.

## Rollback and compatibility

Changes live on a feature branch, not production. The native app, legacy root site and FormSubmit destination remain unchanged. Reverting frontend changes must not reset the owner's existing backend or erase local browser data silently. Any future profile-schema migration needs an explicit version and a non-destructive compatibility path.

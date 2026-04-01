# Claude Code Instructions

## Before Starting Any Work

**Always read these three files at the start of every session before writing any code or making any suggestions:**

1. `docs/PRD.md` — product requirements, user flows, feature definitions, and what is explicitly out of scope
2. `docs/DESIGN_BRIEF.md` — the full visual design system: colors, typography, spacing, component specs
3. `docs/TECHNICAL_DESIGN.md` — data models, screen architecture, navigation structure, tech stack (create this once written)

If a request conflicts with the PRD or Design Brief, flag the conflict to the user before proceeding.

---

## Development Methodology

### Phase gates — do not skip phases
1. **PRD** → approved before any technical design
2. **Technical Design** → approved before any code
3. **Design Brief** → approved before any UI code
4. **Features** → built one at a time using the Feature Spec Template below

### Feature Spec Template
Every feature request must include this before implementation begins. Do not write code for a feature that hasn't been specced:

```
Feature: [Name]

User story: As a [user type], I want to [action] so that [benefit].

This feature is done when:
- [Specific observable outcome 1]
- [Specific observable outcome 2]

Edge cases to handle:
- [What happens if data is empty?]
- [What happens if the user does X wrong?]

Not in scope:
- [Thing you are explicitly not building]
```

### Definition of Done (per feature)
A feature is not done until:
- [ ] Works on device without crashing
- [ ] Edge cases specified in the spec are handled
- [ ] Unit tests written and passing for core business logic
- [ ] Matches acceptance criteria in the spec
- [ ] Follows the Design Brief (colors, typography, spacing, components)

---

## Design Rules

- **Always use the Design Brief color tokens** — never hardcode hex values in component files
- **Font:** DM Sans via `expo-google-fonts`
- **Styling:** NativeWind v4 (Tailwind CSS for React Native)
- Every new screen must use the color tokens, type scale, spacing system, and component specs defined in `docs/DESIGN_BRIEF.md`
- Light mode only (MVP)

---

## Git & GitHub

After every change or set of changes, automatically commit and push to GitHub:

```bash
git add <changed files>
git commit -m "<descriptive message>"
git push origin main
```

- Always push to `origin main` after committing
- Use descriptive commit messages so individual changes are easy to identify and revert if needed
- This enables version recovery via GitHub if a mistake is made

---

## Project Context

- **App:** iOS workout tracker (Expo / React Native)
- **Platform:** iOS 16+ only, light mode only
- **Storage:** On-device only — no backend, no accounts, no cloud sync (MVP)
- **Users:** Regular gym-goers who do weight training. Not beginners needing coaching.
- **North star:** Simplicity. If a feature adds complexity without directly serving the core workout tracking loop, it does not belong in MVP.

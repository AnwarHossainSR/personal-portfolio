# Writing a note

Create `src/content/notes/<slug>.tsx`:

```tsx
import { defineNote } from "@/content/notes";

export const meta = {
	slug: "why-we-moved-uploads-off-the-api",
	title: "Why we moved uploads off the API",
	summary: "Proxying large uploads through application servers ties transfer lifetime to deploy lifetime. Here is what that costs and what we did instead.",
	published: "2026-03-14",
	readingMinutes: 7,
	tags: ["AWS", "Architecture"],
};

export function Body() {
	return (
		<>
			<p>...</p>
		</>
	);
}
```

Then register it in `src/content/notes/index.ts`:

```tsx
import { Body as UploadsBody, meta as uploadsMeta } from "./why-we-moved-uploads-off-the-api";

export const notes: NoteEntry[] = [defineNote(uploadsMeta, UploadsBody)];
```

**What to write about.** The best note is the decision you almost got wrong.
Second best is a thing that surprised you in production. Avoid tutorials —
"How to set up X" is the genre this site was rebuilt to get away from.

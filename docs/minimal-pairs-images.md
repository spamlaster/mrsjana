# Minimal pairs illustrations

How to add a custom PNG illustration to a word in the Minimal Pairs Therapy Center. Architecture and clinical rules are in `docs/minimal-pairs-spec.md`; recordings are in `docs/minimal-pairs-audio.md`.

## Rules

- One illustration per lexicon word, at `public/images/minimal-pairs/<word id>.png`.
- The file is named by the word's stable `id` in `src/minimal-pairs/content/lexicon.ts`, never by its spelling. Today every id is the same as the word (`fat` → `fat.png`), but if a homograph is ever added with an id like `tear-eye`, its file is `tear-eye.png`.
- A file is shown only after `npm run images:minimal-pairs` has checked it and recorded it in `src/minimal-pairs/content/illustration-records.ts`. The app never assumes a file exists because it has the expected name, and never fetches to find out.
- A recorded illustration takes priority over everything else. Without one, a word shows what it showed before: a linked `WordPicture`, else its `emoji`, else the "Picture coming soon" placeholder. If a recorded file fails to load in the browser, the word falls back the same way.
- The lexicon needs no change to link an illustration. Leave `picture` and `emoji` in place: they are the fallback, and the picture audit (`picture-audit.ts`) still applies to them.
- An illustration is not clinical approval. Jana still reviews every picture.
- This project does not generate images. Illustrations are made outside it and added by hand.

## File requirements

The command refuses any file that breaks the first four rules.

| Requirement | Value |
|---|---|
| Format | PNG (a renamed JPEG or WebP is refused) |
| Name | `<word id>.png`, all lowercase, matching a lexicon id |
| Shape | square |
| Size | 512 × 512 px recommended; anything from 512 to 1024 px square is accepted |
| File size | at most 500 KB; compress larger files (e.g. with TinyPNG or `pngquant`) |
| Background | transparent, or a plain light color |
| Framing | the subject centered, filling about 70% of the canvas, inside the middle circle: Bubble Pop and Feed the Monster crop pictures to a circle |
| Content | one clear subject a young child would name with the target word, no printed text |

The largest picture slot is 160 CSS px, so 512 px stays sharp on 3× phone screens. The smallest is a 32 px Sound Train car, so the subject must still read at thumbnail size: bold shapes, few details.

### Words with special requirements

Words with a `pictureRequirement` in the lexicon must follow it. These are shown in the command's report, on the grown-ups review page (`#/phonological/review` in preview mode), and in the placeholder's description. Current ones:

| Word | Requirement |
|---|---|
| fat | a chubby cat or another nonhuman subject, never a person |
| thin | a thin object or animal, never a person |
| deer | the animal (not *dear*) |
| buck | a male deer with antlers; must look different from deer |
| slug | must look different from snail |
| smile | must look different from face in face / fate |
| tack | must look different from pin in thin / pin and fin / pin |
| tin | must look different from can in scan / can |
| tub | must look different from bath in bath / bat |

Also check the second-look notes in `pictureCautions` in `picture-audit.ts` (for example, tea should not read as coffee, rat not as mouse), and the `imageAlt` of each word, which describes the intended picture.

## Adding an illustration

1. Find the word's id in `src/minimal-pairs/content/lexicon.ts` and read its `imageAlt` and any `pictureRequirement`.
2. Save the PNG as `public/images/minimal-pairs/<word id>.png`, meeting the requirements above.
3. Run `npm run images:minimal-pairs`. It checks every file in the folder and updates `illustration-records.ts`. A refused file is listed with the reason, and the command exits with an error.
4. Check the word shows as `illustrated` in the report.
5. Run `npm run test:minimal-pairs`. It fails if a PNG in the folder has no record, or a record no longer matches its file.
6. Look at it in context: `npm run dev`, open `#/phonological/review`, and use **Try it** on a pair with the word.
7. Commit the PNG and `illustration-records.ts` together.

To replace an illustration, overwrite the file and run step 3 again. The record's hash changes, and the image URL changes with it, so browsers do not show the old cached copy. To remove one, delete the file and run step 3 again: the word goes back to its fallback.

## Commands

```sh
npm run images:minimal-pairs                 # check the files, update the records, print the report
npm run images:minimal-pairs -- --check      # check and report only; fails if the records are out of date
```

The report prints one line per word, with what it shows today and what file it needs:

```
182 words: 1 illustrated, 181 without an illustration.
  illustrated                   bag
  missing (shows emoji)         deer
                                          needs images/minimal-pairs/deer.png: a deer
                                          must be: the animal
  missing (shows placeholder)   fat
                                          needs images/minimal-pairs/fat.png: a chubby cat
                                          must be: a chubby cat or another nonhuman subject, never a person
```

## Where it lives

| File | Role |
|---|---|
| `public/images/minimal-pairs/` | the PNGs |
| `src/minimal-pairs/content/illustration-records.ts` | written by the command: each linked word's hash and size. Do not edit by hand |
| `src/minimal-pairs/content/illustrations.ts` | folder, size rules, `illustrationFile()`, `hasIllustration()`, and `pictureSource()`, which decides what a word shows |
| `src/minimal-pairs/components/PairPicture.tsx` | draws the illustration, or the fallback |
| `src/minimal-pairs/content/readiness.ts` | a word with an illustration has no `no-picture` item |
| `scripts/minimal-pairs-images.mjs` | the command |
| `scripts/minimal-pairs-images.test.mjs` | tests for it |

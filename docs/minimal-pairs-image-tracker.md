# Minimal pairs image tracker

Custom illustrations for every word in the Minimal Pairs Therapy Center, one row per unique word in `src/minimal-pairs/content/lexicon.ts` (182 words). How to add an illustration is in `docs/minimal-pairs-images.md`.

Every image here, custom or existing, is a development asset. None has been reviewed by Jana, and no word pair is clinically approved.

## Progress

| Custom illustrations | Words |
|---|---|
| Reviewed by Jana | 0 |
| Integrated, awaiting Jana's review | 147 |
| Created, not yet integrated | 0 |
| Needs changes | 0 |
| Missing | 35 |
| **Total** | **182** |

**147 of 182** custom illustrations done (80.8%), **35** still missing.

| What the games show today | Words |
|---|---|
| Custom illustration | 147 |
| Existing site picture | 21 |
| Existing emoji | 14 |
| "Picture coming soon" placeholder | 0 |
| **Words with a usable picture** | **182 of 182** |

### Existing usable pictures

Before custom illustrations, 43 words had a usable existing picture: 27 linked site pictures (`WordPicture`) and 16 standard emoji. These are listed in the **Existing asset** column. They stay in the lexicon as the fallback when no custom illustration exists, or when one fails to load. 8 are now replaced on screen by custom illustrations (bat, bike, cap, car, coat, down, key, tea), so 35 existing pictures are still shown. A word with an existing picture still counts as **Missing** until it has its own custom illustration.

## Statuses

| Status | Meaning |
|---|---|
| Missing | No custom illustration yet. The word shows its existing picture, if it has one, or the placeholder |
| Created | A PNG exists but is not yet in `public/images/minimal-pairs/` or not yet recorded by `npm run images:minimal-pairs` |
| Integrated | The PNG is in `public/images/minimal-pairs/<word id>.png`, recorded in `illustration-records.ts`, and checked in the games. Awaiting Jana's review |
| Reviewed by Jana | Jana has looked at the picture and accepted it. Only Jana's review moves a word here; tick its box |
| Needs changes | Jana or the team flagged a problem; note it in the log below |

The **Shows today** column reflects `illustration-records.ts` on the day this file was updated. `npm run images:minimal-pairs` prints the live list.

## Flags for Jana's review

Integrated pictures with a known question. They stay **Integrated** and are used in the games until Jana decides; ⚑ marks them in the word list.

| Word | Question |
|---|---|
| came | Abstract word: a past-tense verb is hard to identify from any picture. Replaced in Batch 4: the new picture shows a boy with a backpack arriving at a friend's front door as she waves hello, which reads as arriving rather than leaving. A child may still name it "door", "friend" or "hello"; Jana should decide whether "came" can be elicited from it |
| tame | Abstract word: an adjective is hard to identify from a picture. Replaced in Batch 4: the new picture shows a child gently petting a pony, which now matches the lexicon's intended picture. A child is likely to say "pony" or "horse"; Jana should decide whether "tame" can be elicited from it |
| tub | Conflicts with the lexicon's picture requirement for tub: "must look different from bath in bath / bat". The picture is a bubble-filled bathtub, the same subject as bath ("a bathtub full of bubbles"), and `pictureCautions` already warns that bath may be named "tub". A child who learns this picture as "tub" may later say "tub" for bath, or the reverse |
| cool | Ice cubes with a ❄️ snowflake beside them. A child may say "ice" or "cold". The snowflake is the same picture snow uses in snow / no, so "snow" is also possible. |
| back | A child seen from behind; a child may say "boy" rather than "back". |
| bat | Now a baseball bat with a ball. The site picture it replaces was 🦇, the animal, so bat changes meaning in back / bat and in bath / bat. A child may say "baseball" or "ball" |
| tool | A red toolbox full of tools; a child may say "toolbox" or name one tool ("hammer") |
| pick | A girl crouching to pick a daisy from a patch of flowers; a child may say "flower" or "daisy" |
| smash | The ball knocking down blocks may elicit “break,” “crash” or “blocks.” Jana should check that the action reads as smash and stays distinct from mash |
| small | A small elephant beside a large elephant clearly shows size, though a child may say “baby elephant.” Review beside big; “small” may also be confused with thin or slim |
| mall | Several storefronts suggest a mall, but a child may say “shops” or “building.” Review against mart and the existing shop picture |
| smart | A girl completing a shape puzzle may elicit “think,” “puzzle” or “idea”; think is another target. Abstract concept; Jana should review prominently |
| mart | One produce market storefront may elicit “store,” “market” or “shop.” The image has no identifying text, so Jana should review prominently whether it can elicit mart |
| swing | A child on a swing may be named “playground” or “seat”; the swinging action is visible |
| wing | A spread wing on a bird may elicit “bird” or “feather.” Jana should check whether the wing remains the clear target |
| sweet | A child enjoying a lollipop may elicit “candy” or “lollipop”; the adjective “sweet” is abstract and not printed. Jana should review |
| wheat | A tied sheaf of golden grain may elicit “grain,” “plant” or “grass.” Jana should check the wheat heads are recognizable |
| sweep | A child sweeping may elicit “broom” or “clean.” Review against wipe; the broom action is distinct from wiping a table |
| weep | A child with visible tears may elicit “cry,” “sad” or “tears.” Jana should check the mild expression reads as weeping |
| sweat | Visible perspiration after exercise may elicit “tired,” “hot” or “exercise.” Review against wet; no external water is shown |
| wet | A soaked dog with dripping fur may elicit “dog” or “water.” Review as the external-wet contrast to sweat |
| kate | The badge reads “Kate,” making this proper name dependent on printed text and adult teaching. Jana should review prominently |
| skin | A child points to a healthy arm with a magnifier; likely responses include “arm” or “hand.” Jana should review the abstract surface concept |
| kin | A multigenerational family may elicit “family” or “people.” “Kin” is less familiar; Jana should review prominently |
| scoop | The lifted ice cream scoop shows the action; a child may say “ice cream” or “spoon.” Jana should review whether scoop is elicited |
| coop | The coop structure is prominent, with chickens for context; a child may say “chicken,” “house” or “barn.” Pair note retained: coop is also said k uh p in some regions |
| scan | A hand-held scanner beams onto a box barcode; a child may say “scanner” or “barcode.” The scanned object is not a can. Pair note retained: can is drafted as the noun, not its weak form |
| scar | The child points to a small healed forearm scar under a magnifier. A child may say “arm” or “cut”; Jana should check the healed mark reads clearly and remains non-graphic |
| bite | A boy biting a red apple; a child may say "apple" or "eat" |
| pit | A halved peach showing its pit, next to a whole peach with a leaf. A child may say "peach", which is also a lexicon word (peach / peat); Jana should check the pit reads as the focus |
| date | A desk calendar with 15 circled in red. The calendar intentionally shows printed numbers, which goes against the "no printed text" rule in docs/minimal-pairs-images.md (math was rejected for printed numbers). Jana should decide whether this is acceptable for date, and whether a child names it "calendar" rather than "date" |
| go | A green traffic light. Symbolic: a child may say "light", "traffic light" or "green" rather than "go" |
| guy | A bearded adult man waving. A child may call him "man" or describe the action ("waving", "hi") rather than say "guy" |
| dye | White fabric being dipped into a bowl of bright blue dye. A child may say "shirt", "water", "blue" or "paint". The picture intentionally shows the dyeing action rather than just a cup of colored liquid. The pair note still applies: dye sounds the same as die; nothing in the picture suggests die or dice |
| gown | A long purple formal gown on a dress form. A child may say "dress" |
| down | A child sliding down a playground slide. A child may say "slide". This picture intentionally replaces the symbolic ⬇️ arrow (the site picture, which \`pictureCautions\` called "symbolic, not a picture of an object") with an action showing downward movement |
| got | A boy opening a present. Abstract past-tense verb: a child may name the action ("opening", "present", "gift") rather than say "got" |
| dot | A single red dot. Its shading makes it look round, so a child may call it a "circle" or "ball" (the old ⚪ site picture was rejected because a child would say "circle") |
| gum | A pink stick of chewing gum in a foil wrapper. A child may call it "candy" |
| dumb | A confused boy scratching his head under three question marks. The word may be inappropriate for children: the pair note warns that "dumb can be heard as an insult", and the picture pairs the word with a child. A child may say "confused", "thinking" or "question". The question marks are symbols, close to the "no printed text" rule. Jana should decide whether to keep this pair |
| dole | A woman in an apron handing a bowl of soup to a boy, for "dole out". Abstract verb, temporary visual: a child may describe the person ("lady", "mom"), the food ("soup") or the action ("giving", "serving"). The pair note says "dole may be unfamiliar to children" |
| buck | A male deer with large antlers. A child may simply say "deer". It must stay visually distinct from deer, but deer currently shows the 🦌 emoji, which on most devices also has antlers, so the two may look alike until deer has a custom antlerless picture |
| but | A girl shrugging with her palms up. Abstract conjunction, temporary visual: a child may say "girl", "shrug", "confused" or "I don't know". Jana should review both the word and the picture choice. The pair note says "but is usually unstressed (b ah t / b ax t); drafted stressed" |
| late | A red wall clock showing about 11:45, for "late". A child may say "clock" or read the time. The clock face has printed numbers, accepted for now as with date. The clock sits right of center with its rim about 1 px from the right edge, so the circular frames in Bubble Pop and Feed the Monster clip part of the rim |
| lot | A pile of many balls, for "a lot". A child may simply say "balls" |
| rack | A wooden coat rack with a blue coat and a hat. A child may say "coat rack", "coat", "hat" or "hanger". The rack sits left of center |
| sit | A boy sitting on the floor. A child may describe the boy ("boy") rather than the action. The same brown-haired boy appears in several other pictures |
| bad | A frowning boy giving a thumbs-down. Abstract adjective: a child may describe the expression or action ("angry", "mad", "thumbs down"). The picture still includes a thumbs-down, the reason the old 👎 site picture was rejected, though the frown now carries the meaning too |
| bud | A closed red rose bud on its stem. A child may say "flower" or "rose" |
| beg | A puppy sitting up with its paws raised to beg. A child may say "dog" or "puppy" |
| big | A big elephant next to a small mouse. A child may say "elephant", "mouse" or "small"; small is itself a target word (small / mall) |
| bid | An auctioneer at a podium raising a gavel. Bidding is an unfamiliar concept for children. The picture shows the auctioneer, the person who takes bids, rather than someone making a bid; a child may say "judge", "hammer" or "man" |
| mug | An empty blue mug, so it does not suggest coffee or tea. A child may say "cup" |
| mud | A puddle of muddy water ringed with dirt clods and grass tufts. A child may say "dirt" or "puddle". The scattered dirt reaches both side edges, so the circular frames trim it slightly |
| fan | A blue desk fan with visible blades and three airflow swooshes. A child may say "wind" or "air". The old 🌀 site picture was rejected as a cyclone |
| pan | An empty black frying pan, with no egg or food (the old 🍳 was rejected because a child would say "egg"). A child may say "pot" |
| fin | A shark fin sticking out of the sea. A child may say "shark" or "fish"; fish is also a lexicon word. Partner pin still uses 📌, which the audit warns is close to "tack" |
| fat | A very round, chubby ginger cat. Lexicon rule kept exactly: *a chubby cat or another nonhuman subject, never a person*. A child may say "cat"; cat is also a lexicon word |
| pat | A hand patting a happy puppy's head. A child may say "dog", "pet" or "hand". The puppy looks like the one in beg, which may blur pat and beg |
| pour | A glass pitcher pouring water into a glass, with a visible stream. A child may say "water", "pitcher" or "glass". Pair note kept: "For some speakers pour sounds like poor." |
| sea | Open blue sea to the horizon, with no beach. A child may say "ocean" or "water". It looks similar to the sea behind fin, which may blur sea and fin |
| sip | A boy sipping water from a glass. A child may say "drink", "water" or "cup". The drink is clear water, not tea-like |
| tip | A close-up of a sharpened pencil point. A child may say "pencil". High value: tip is in sip / tip, ship / tip and chip / tip |
| tick | A green check mark in a box. Symbolic: a child may say "check" or "check mark"; the old ✅ for got was rejected for exactly that, but it is accepted here as tick's intended meaning. High value: tick is in sick / tick, thick / tick and stick / tick. In American English the mark is usually called a "check", so Jana should confirm "tick" will be elicited |
| shop | A small storefront with a striped awning and fruit and bread in the windows, no printed name. A child may say "store". The old 🛒 site picture was rejected for "cart" |
| top | A striped spinning top with motion lines. A child may say "toy" or "spinning". High value: top is in shop / top, stop / top and chop / top |
| thin | A thin blue hardcover book. Rule kept: *a thin object or animal, never a person*. A child may say "book". Meant as a matched contrast with thick's thick red book, which is still held |
| tank | A glass aquarium with plants, a rock and one goldfish. A child may say "fish" (also a lexicon word) or "aquarium" |
| sell | A boy at a lemonade stand handing a cup to a girl. A child may say "lemonade", "drink" or "stand". The stand legs and the girl's jeans end on one bottom line, a scene crop |
| tell | A girl whispering into a boy's ear. A child may say "whisper", "secret" or "kids" |
| shy | A girl peeking from behind an adult's leg. A child may say "hiding", "girl" or "child". Framing: the adult's jeans begin about 50 px below the top of the picture with white above, so the leg can look like it hangs in mid-air in the square games. This is the framing that held shy in Batch 10; accepted now as an adult partly out of frame, but worth a look |
| tin | A rectangular silver tin with a lid. A child may say "box". Rule kept: must look different from can in scan / can |
| thick | A very thick red hardcover book, the matched contrast to thin. A child may say "book" |
| thank | A smiling boy, hand on his chest, receiving a gift. Abstract: a child may say "gift", "present" or "happy". The old 🙏 site picture was rejected as praying |
| leap | A frog in mid-leap over grass, with motion lines. A child may say "frog" or "jump" |
| race | Three children running through a red finish ribbon. A child may say "run", "running" or "finish" |
| thought | A boy imagining a slice of cake in a thought bubble. A child may say "think" (also a lexicon word, with its own picture), "cake" or "idea". Pair note kept: "Drafted with /ao/; speakers with the cot-caught merger use /aa/ in both." |
| taught | A teacher pointing at a sun drawn on a chalkboard while children watch. A child may say "teacher" or "school". Same pair note |
| thigh | A leg in blue shorts with a blue arrow pointing to the thigh. A child may say "leg" or "knee". The meaning depends on the arrow, a symbol; Jana should check it reads without it. The leg begins at the shorts with white above, a close-up crop |
| pink | A splash of bright pink paint. A child may say "paint" or "splash" |
| wife | A bride and groom. A child may say "bride", "groom" or "wedding"; Jana should review |
| wipe | A boy wiping a spill off a table with a blue cloth. A child may say "clean", "table" or "spill" |
| beef | A raw beef steak on butcher's paper. A child may say "steak" or "meat" (the old 🍖 was rejected for "meat") |
| beep | A hand pressing a steering-wheel horn, with sound marks. A child may say "horn", "honk" or "steering wheel"; car is a lexicon word |
| fate | A glowing crystal ball on a star-decorated stand. Abstract: a child may say "crystal ball", "magic" or "fortune"; Jana should review this word prominently |
| rate | A speedometer, dial 0–120 with the needle at 60. Abstract: a child may say "speed", "speedometer" or "gauge"; Jana should review. The dial prints numbers and "MPH", printed text as with date and late |
| nice | A smiling boy giving two thumbs up. **Weak for "nice"**: a child is likely to say "thumbs up", "happy" or "good"; it shows approval rather than a kind act. Integrated for coverage; Jana should decide whether to keep it |
| night | A house under a full moon and stars. A child may say "moon", "stars" or "house" |
| mice | Two mice facing each other (the description was "three mice"; changed to "two mice"). A child may say "mouse"; big's picture also has a mouse |
| math | A boy writing "2 + 3 = 5" on a chalkboard. **Depends on written numbers and symbols**, which the old 🔢 was rejected for; accepted as with date and rate. A child may say "school", "chalkboard" or "numbers". High value: math is in math / mat and math / map |
| path | A dirt trail through a grassy meadow toward pine trees and mountains. A child may say "trail" or "road" (the old 🛣️ was rejected for "road"). More meadow than woods, but trees are present, so the description was kept |
| stick | A single bare branch. A child may say "branch" or "wood" |
| kiss | A girl standing on tiptoe to kiss a boy on the cheek, with a heart; both children shown head to toe. A child may say "love", "kids" or "lips" (lip is a target word in slip / lip) |
| kit | A red first-aid kit with white crosses, bandages, tape and blue medical scissors. A child may say "first aid", "doctor" or "box" |
| might | A strong boy flexing his muscles, for "might" as strength. **Abstract interpretation**: a child may say "strong", "muscles" or "boy"; Jana should review prominently |
| fit | A child's foot in a white sock fitting into a blue sneaker, with an arrow at the heel. A child may say "shoe" or "foot"; the arrow is a symbol. Framing: the leg, at its top and left ends in a straight line in white space (the edge of the original panel), an intentional close-up crop, accepted as with shy |
| cash | A thick stack of $100 bills. A child may say "money" or "dollars" (the old 💵 was rejected for "money"). The bills show printed numbers and portraits |
| mash | A blue bowl of mashed potatoes with butter (no masher). A child may say "potatoes" or "food". High value: mash / mat, smash / mash |
| mat | A plain coir doormat with a black border and no text. A child may say "rug" or "carpet". High value: mash / mat, math / mat, match / mat |
| push | A boy leaning in to push a large wooden crate; boy and crate complete. A child may say "box" or "move". The old ✋ was rejected for "hand" |
| put | A kneeling boy putting a red block into a blue toy box that already holds blocks. A child may say "toys", "blocks" or "clean up". Clearly different from push (no pushing pose) |
| tap | A child may name the running faucet "faucet" rather than "tap" |
| tea | Check it reads as tea rather than coffee (see notes) |
| stone | A single gray rock. A child may say "rock" |
| tone | A tuning fork ringing with sound waves. **Symbolic**: a child may say "tuning fork", "music" or "sound"; Jana should review |
| stack | Four colored blocks stacked in a tower. A child may say "blocks" or "tower" |
| stool | A three-legged round wooden stool with no back. A child may say "chair" |
| mile | A dirt road through a meadow with a sign reading "1 MILE". **Printed text**, accepted for now as with date and rate; a child may say "road", "sign" or read it. Jana should review |
| tack | A flat, round brass thumbtack seen from the side, clearly different from the red 📌 pushpin used for pin. A child may say "pin" or "tack" |
| no | A red prohibition symbol (🚫). **Symbolic**: a child may say "stop" (a target word), "circle" or "sign"; the old ❌ was rejected for "X". Jana should review prominently |
| nail | A single silver nail, no hammer. A child may say "screw" |
| snap | A hand with thumb and finger pressed together and three action marks, for finger snapping. A child may say "fingers", "hand" or "click"; the pose can also read as a "finger heart". Framing: the sleeve, at the bottom ends in a straight line in white space (the edge of the original panel), an intentional close-up crop, accepted as with shy |
| nap | A boy asleep on a pillow under a blue blanket, hugging a teddy bear. A child may say "sleep", "bed" (a target word) or "teddy". No bed frame is shown |
| snip | Red scissors snipping a sheet of paper, with action marks. A child may say "scissors" or "cut" |
| nip | A puppy playfully nipping a child's sleeve, no blood or injury. A child may say "bite" (**a target word**), "puppy" or "dog"; Jana should review prominently. Framing: the child's arm, at the right ends in a straight line in white space (the edge of the original panel), an intentional close-up crop, accepted as with shy |
| smile | A boy grinning widely with teeth showing, with sparkle marks; it emphasizes the smile and differs from face. Rule kept: must look different from face. A child may say "happy", "teeth" or "face". Framing: the shirt, at the bottom ends in a straight line in white space (the edge of the original panel), an intentional close-up crop, accepted as with shy |
| smock | A light-blue art smock with a pocket and paint splatters. A child may say "shirt", "apron" or "paint shirt" |
| mock | A boy sticking out his tongue with hands at his ears, taunting a sad boy with crossed arms. Teasing: **socially sensitive and abstract**; a child may say "tease", "silly", "mean" or "tongue". Jana should review prominently, including whether to keep the word |

| slow | A turtle suggests slowness, but children may name the animal instead of the adjective |
| low | The child reaches to a low shelf; Jana should check that “low” is elicited rather than “shelf” or “block” |
| slip | The child is visibly slipping on ice; Jana should check the action reads as “slip” rather than “fall” |
| lip | The close-up clearly shows lips, though a child may say “mouth” |
| slug | The shell-free creature has eye stalks and a snail-like face; check it reads as slug and stays distinct from snail |
| led | The picture shows a child leading a group, but cannot show past tense; check the scene can elicit “led” |
| limb | The branch is attached to a whole tree; a child may name “tree” rather than “limb” |
| chin | The whole head is shown to avoid a cropped face; the chin is visible but may not stand out as the target |
| beet | A child may name this round red-purple root “radish” |
| peat | Peat may be unfamiliar; check the fibrous blocks are recognizable and can elicit “peat” |
| match | A child may call the unlit match a “stick” |
| catch | The child holds the ball in both hands; check the image conveys the action “catch” rather than just “ball” |

## Notes

| Word | Note |
|---|---|
| tar | Source file: `Glossy Tar Pouring Onto Asphalt.png` (black tar poured from a bucket onto asphalt), downscaled from 1254 px to 512 px to meet the 1024 px / 500 KB limit. The older empty-road image, also named `tar.png`, is not used |
| tea | The `pictureCautions` note that ☕ may be named "coffee" was about the old emoji. The new illustration has a tea bag; Jana should still check it reads as tea |
| key, tea, car, tar | Integrated 2026-10-14. Shown in key / tea, car / tar, sea / tea, star / tar and scar / car |
| coat, tote, cap, tap | Integrated 2026-10-14 from `~/Downloads/msjana_batch_2_images/`, used as delivered (512 px, under 500 KB). Shown in coat / tote and cap / tap |
| tap | Shows a running water faucet. Some children call this a "faucet"; Jana should confirm "tap" is the word they will say |
| came, tame, cub, tub | Integrated 2026-10-14 from `~/Downloads/msjana_batch_3_images/`, used as delivered (512 px, under 500 KB). Shown in came / tame and cub / tub. Three have review flags above |
| came, tame | Replaced in Batch 4 (2026-10-14) from `~/Downloads/msjana_batch_4_images/`. The earlier came picture (a boy walking out of a front door) and tame picture (a lion beside a man) are no longer used. The lexicon descriptions were updated to match the new pictures: came is now "a boy who came to visit, greeted by a friend at her front door", tame is "a child gently petting a tame pony" |
| cool, tool, back, bat | Integrated in Batch 4 (2026-10-14) from `~/Downloads/msjana_batch_4_images/`, used as delivered (512 px, under 500 KB). Shown in cool / tool, back / bat, bath / bat, stool / tool and school / cool |
| cool, back | Screen-reader descriptions updated 2026-10-14 to match the pictures: cool is now "three melting blue ice cubes with a snowflake", back is "the back view of a boy wearing a blue shirt and jeans" |
| pick, bike, bite | Integrated in Batch 5 (2026-10-14). pick and bike are the corrected files from `~/Downloads/msjana_batch_5_corrected_images/`; bite is from `~/Downloads/msjana_batch_5_images/`. The first pick (a hand picking an apple), pit (a hole in the ground) and bike (handlebars cut off) were rejected for cropping defects and never used. bite's screen-reader description was updated from "an apple with a bite taken out" to "a boy taking a bite of a red apple"; pick and bike already matched. Shown in pick / pit, bike / bite and thick / pick |
| pit | Integrated 2026-10-14 from `msjana_pit_fixed.zip` (extracted to `~/Downloads/pit.png`), used as delivered (512 px, 206 KB). It replaces the earlier corrected file, which was held for a stray fragment at its bottom edge and never used. The lexicon description, "a peach pit", is unchanged. Batch 5 (pick, pit, bike, bite) is complete |
| go, dough, gate, date | Integrated in Batch 6 (2026-10-14). go, dough and gate are from `~/Downloads/msjana_batch_6_images/`; date is the corrected file from `msjana_batch_6_date_fixed.zip`, made on its own rather than cut from the batch sheet. The first date.png in `msjana_batch_6_images/` was rejected for a strip of foliage and a fragment of the gate picture along its left edge, and never used. All four used as delivered (512 px, under 500 KB); lexicon descriptions already matched and are unchanged. Shown in go / dough and gate / date. gate's picture is a gate in a fence, not a door, which addresses the reason its old site picture (🚪) was rejected |
| guy, dye, gown, down | Integrated in Batch 7 (2026-10-14). These are the individually generated replacements (titled "Friendly Beard", "Hands-On", "Elegant Purple" and "Joyful Child"), supplied at 1254 × 1254 and downscaled to 512 × 512 with \`sips\` (no cropping or edits): guy 338 KB, dye 348 KB, gown 347 KB, down 327 KB. The first files in \`~/Downloads/msjana_batch_7_images/\` were rejected for sheet-slicing defects (fragments of gown and down in guy and dye; the tops of gown and down cut off) and never used. Descriptions updated: dye from "a cup of dye" to "white fabric being dipped into blue dye", down from "an arrow pointing down" to "a child sliding down a playground slide"; guy and gown unchanged. down's custom picture replaces its ⬇️ site picture. These four fill more of the square than earlier pictures; the circular frames in Bubble Pop and Feed the Monster clip at most 4.7% of the artwork (dye's forearm, which already runs off the frame) |
| got, dot, gum, dumb | Integrated in Batch 8 (2026-10-14) from \`~/Downloads/msjana_batch_8_images/\` (extracted from \`msjana_batch_8_images.zip\`), used as delivered: 512 × 512, got 318 KB, dot 166 KB, gum 248 KB, dumb 249 KB. All four passed inspection with no fragments or cropping. dumb's description changed from "the word dumb" to "a confused boy with question marks above his head"; the other three already matched. Integrated for website completeness only; not clinically reviewed |
| dole, lake, buck, but | Integrated in Batch 9 (2026-10-14) from \`~/Downloads/msjana_next_images/\` (extracted from \`msjana_next_images.zip\`), used as delivered: 512 × 512, dole 238 KB, lake 329 KB, buck 195 KB, but 228 KB. Descriptions changed: dole from "the word dole" to "a woman handing out bowls of soup", but from "the word but" to "a girl shrugging with her palms up"; lake and buck already matched. goal, lock and rat keep their existing pictures |
| late, lot, rack (first files) | **Rejected, never used.** Their files from the same ZIP have fragments of neighboring pictures: late has a thin blue-green strip of the lake picture down its left edge (x 24–32); lot has a red arc of the clock rim at its left edge (x 0–24, y 164–352); rack has a thin blue line along its top edge (x 68–156, y 0–4). Held unchanged until clean files arrive; the words still show their placeholders |
| late, lot, rack, sit, bad, bud, beg, big, bid | Integrated in Batch 10 (2026-10-14) from \`~/Downloads/msjana_batch_next_11/\` (extracted from \`msjana_batch_next_11.zip\`), used as delivered at 512 × 512, all under 320 KB. late, lot and rack are the clean replacements: the lake strip, clock arc and blue line are gone. Descriptions changed: bad from "a thumbs-down for something bad" to "a frowning boy giving a thumbs-down", bid from "a hand raised to make a bid" to "an auctioneer at a podium raising a gavel"; the other seven already matched. Partner pictures (lock, sick, bag, bug, bed, rat) unchanged |
| mug, mud (first files) | **Rejected, never used.** From the same ZIP. mug.png has a column of brown dirt from the mud picture along its right edge (x 470–512, y 150–420); mud.png's dirt is cut off flat along its left edge (y 158–428), the strip that ended up in mug. Held unchanged until clean files arrive; both still show placeholders |
| mug, mud, fan, pan, fin, fat, pat, pour, sea, sip, tip, tick | Integrated in Batch 11 (2026-10-14) from \`~/Downloads/msjana_batch_12/\` (extracted from \`msjana_batch_12.zip\`), used as delivered at 512 × 512, all under 330 KB. mug and mud are the clean replacements: no dirt along mug's right edge, and mud's sides are ragged scattered dirt rather than a flat cut. Descriptions changed: fin from "a fish fin" to "a shark fin sticking out of the sea", sip from "a child taking a sip" to "a child taking a sip of water from a glass", tick from "a check mark" to "a green check mark in a box"; the other nine already matched. fat's rule is unchanged |
| shop, top, thin, tank | Integrated in Batch 12 (2026-10-14) from \`~/Downloads/msjana_batch_10/\` (extracted from \`msjana_batch_10.zip\`), used as delivered at 512 × 512, 100–167 KB. Descriptions already matched; no changes. Each file sits on a slightly off-white inner panel (about x 105–405, y 64–410) that differs from the white canvas by only 3–4 levels, invisible at game sizes |
| tin, thick, leap, race | Integrated in Batch 13 (2026-10-14) from \`~/Downloads/msjana_batch_18/\` (extracted from \`msjana_batch_18.zip\`), used as delivered at 512 × 512, 136–186 KB. tin and thick are the clean replacements, now complete; thick contrasts with thin. Descriptions already matched; no changes |
| sell, tell, shy, thank, thought, taught, thigh, pink, wife, wipe, beef, beep, fate, rate (Batch 13 files) | **Rejected, never used.** From the same ZIP, held unchanged. The inner panel runs about x 64–446; problems found: sell — the girl customer is still sliced flat down her right side at x 446; thank — the gift and giver's sleeve still stop at x 431; tell — part of the lemonade stand and the sell girl at the left; shy — part of the tell boy at the left; taught — strips of other pictures along the top and a thought-bubble cloud at the left; thigh — part of the taught chalkboard and pupil at the left and a strip at the top; thought — a strip of the lemonade-stand tablecloth along the top; wife — green and blue strips along the top; wipe — the table ends in a straight cut at x 446; beef — a strip of wood at the left, and the paper is cut flat at x 446; beep — part of the beef picture at the left; pink — a green fragment at the lower right; fate — a small red fragment at the right; rate — the speedometer's numbers are garbled (60 appears twice, 120 appears twice), a visible artwork error for adult readers |
| sell, tell, shy, thank, thought, taught, thigh, pink, wife, wipe, beef, beep, fate, rate | Integrated in Batch 14 (2026-10-14) from \`~/Downloads/msjana_clean_replacements_14/\` (extracted from \`msjana_clean_replacements_14.zip\`), used as delivered at 512 × 512, 133–226 KB. All the earlier slices and fragments are gone; rate's dial now reads 0, 20, 40, 60, 80, 100, 120. Descriptions changed: thought from "a thought bubble" to "a child thinking about a piece of cake", fate from "the word fate" to "a magical crystal ball representing fate", rate from "the word rate" to "a speedometer showing a rate of speed"; the other eleven already matched. thought / taught pair note unchanged |
| nice, night, mice, math, path, stick | Integrated in Batch 15 (2026-10-14) from \`~/Downloads/msjana_batch_next_15/\` (extracted from \`msjana_batch_next_15.zip\`), used as delivered at 512 × 512, 134–283 KB. Descriptions changed: nice from "a friend being nice" to "a smiling boy giving two thumbs up", mice from "three mice" to "two mice", math from "math problems" to "a boy writing a math problem on a chalkboard"; night, path and stick already matched |
| cash, mash, mat, might, stone, tone, stack, stool, mile | Integrated in Batch 16 (2026-10-14) from \`~/Downloads/msjana_batch_24/\` (extracted from \`msjana_batch_24.zip\`), used as delivered at 512 × 512, 101–293 KB. cash, mash, mat and might are the replacements. Descriptions changed: might from "the word might" to "a strong child flexing his muscles", tone from "a musical note" to "a ringing tuning fork making a musical tone", mile from "a sign that says one mile" to "a road with a one-mile marker"; the rest already matched. math unchanged |
| kit, nail, no, tack, fit, nip, snap, smile, snip | Integrated in Repair Batch 17 (2026-10-14) from \`~/Downloads/msjana_repair_15/\` (extracted from \`msjana_repair_15.zip\`), used as delivered at 512 × 512, 58–122 KB. fit, snap, nip and tack now show the right subjects and tack meets its rule. Descriptions changed: no from "a hand held up to say no" to "a red no symbol", fit from "shoes that fit" to "a child's foot fitting into a shoe"; the rest already matched. The extra margin in this batch comes from shrinking the earlier panels rather than re-exporting them, so panel cuts remain as straight edges in white space: limb and waist crops (fit, nip, snap, smile) were accepted and flagged; cuts through whole subjects were held |
| kiss, push, put, nap, smock, mock (Repair 17 files) | **Rejected, never used**: kiss, push, put and nap were still sliced through the subject; smock and mock had fragments of other pictures |
| kiss, push, put, nap, smock, mock | Integrated in Repair Batch 18 (2026-10-14) from \`~/Downloads/msjana_final_repair_6.zip\`, used as delivered at 512 × 512, 159–209 KB. Regenerated as single, complete images with white margins; no cuts or fragments. Descriptions changed: push from "a child pushing a cart" to "a child pushing a large wooden box", put from "a child putting a toy in a box" to "a child putting toy blocks in a box", mock from "the word mock" to "a child making a teasing face at another child"; the other three already matched. All held images are now resolved |
| kiss, kit, fit, push, put, tack, no, nail, snap, nap, snip, nip, smile, smock, mock | **Created, not integrated.** From the same ZIP (inner panel about x 37–474, y 37–462), held unchanged; each problem is in its flag above. Sliced at the panel edge: kiss, push, put, snip, smile, smock, mock, nap. Fragments from other pictures: kit, no, nail, snap, nap. Wrong subject: fit (lightbulb), snap (breaking a stick), nip (bleeding fingertip). Rule broken: tack looks like pin's 📌 |
| kiss, kit, might, fit, cash, mash, mat, push, put | **Created, not integrated.** From the same ZIP, held unchanged. Technical defects: kiss — the girl is sliced flat down her right side (x 451) and a blue fragment sits below (x 311–348, y 476); cash — a strip of wood from another picture runs along the bottom (y 465–479); mash — a blue strip runs along the bottom (y 462–479); mat — a small orange fragment at the bottom right (x 350–375, y 475); push — the crate is sliced flat on its right side (x 449), missing its corner post; might — a brown fragment below (x 257–302, y 476). Wrong subjects: kit is a toolbox, put shows pushing, fit shows the flexing boy and might shows a thinking boy. fit.png's flexing-boy artwork is clean and suits might; it was not renamed or used without authorization |
| sell, tell, shy, tin, thick, thank | **Created, not integrated.** From the same ZIP. Each picture was cut by the edge of its inner panel, leaving a straight slice through the subject inside the canvas: sell's girl is sliced down her right side (x 405, 273 rows); tell's girl's hair is sliced on the left (x 110, 256 rows); tin's box is missing its right end (x 401); thick's book is missing its right end (x 404); thank's gift and the giver's blue sleeve stop at x 406, and the boy's shirt ends flat at the bottom; shy's adult jeans end in a flat line in mid-air at the top (y 64). Held unchanged until clean files arrive; all six still show placeholders |

## Words

| Jana | Word | Status | Existing asset | Shows today | Intended picture | Pairs |
|---|---|---|---|---|---|---|
| [ ] | back | Integrated ⚑ | none (site picture rejected) | custom illustration | the back view of a boy wearing a blue shirt and jeans | back-bat |
| [ ] | bad | Integrated ⚑ | none (site picture rejected) | custom illustration | a frowning boy giving a thumbs-down | bag-bad |
| [ ] | bag | Missing | site picture (`bag`) | site picture | a bag | bag-bad |
| [ ] | bat | Integrated ⚑ | site picture (`bat`) | custom illustration | a bat | back-bat, bath-bat |
| [ ] | bath | Missing | site picture (`bath`) | site picture | a bathtub full of bubbles | bath-bat |
| [ ] | beach | Missing | site picture (`beach`) | site picture | a sandy beach | beach-beet |
| [ ] | bed | Missing | site picture (`bed`) | site picture | a bed | beg-bed |
| [ ] | beef | Integrated ⚑ | none (site picture rejected) | custom illustration | a piece of beef | beef-beep |
| [ ] | beep | Integrated ⚑ | none | custom illustration | a car horn going beep | beef-beep |
| [ ] | beet | Integrated ⚑ | none | custom illustration | a red-purple beetroot with green leaves | beach-beet |
| [ ] | beg | Integrated ⚑ | none | custom illustration | a puppy sitting up to beg | beg-bed |
| [ ] | bid | Integrated ⚑ | none (site picture rejected) | custom illustration | an auctioneer at a podium raising a gavel | big-bid |
| [ ] | big | Integrated ⚑ | none (site picture rejected) | custom illustration | a big elephant next to a small mouse | big-bid |
| [ ] | bike | Integrated | site picture (`bike`) | custom illustration | a bike | bike-bite |
| [ ] | bite | Integrated ⚑ | none | custom illustration | a boy taking a bite of a red apple | bike-bite |
| [ ] | buck | Integrated ⚑ | none | custom illustration | a buck, a male deer with antlers · **must be:** a male deer with antlers; must look different from deer | buck-but |
| [ ] | bud | Integrated ⚑ | none | custom illustration | a flower bud | bug-bud |
| [ ] | bug | Missing | site picture (`bug`) | site picture | a bug | bug-bud |
| [ ] | but | Integrated ⚑ | none | custom illustration | a girl shrugging with her palms up | buck-but |
| [ ] | came | Integrated ⚑ | none | custom illustration | a boy who came to visit, greeted by a friend at her front door | came-tame |
| [ ] | can | Missing | emoji 🥫 | emoji | a tin can | scan-can |
| [ ] | cap | Integrated | site picture (`cap`) | custom illustration | a cap | cap-tap |
| [ ] | car | Integrated | site picture (`car`) | custom illustration | a car | car-tar, scar-car |
| [ ] | cash | Integrated ⚑ | none (site picture rejected) | custom illustration | paper money | cash-cat |
| [ ] | cat | Missing | site picture (`cat`) | site picture | a cat | cash-cat, catch-cat |
| [ ] | catch | Integrated ⚑ | none (site picture rejected) | custom illustration | a child catching a soccer ball with both hands | catch-cat |
| [ ] | chin | Integrated ⚑ | none | custom illustration | a smiling child’s full head with the chin clearly visible | chin-tin |
| [ ] | chip | Integrated | none | custom illustration | a potato chip | chip-tip |
| [ ] | chop | Integrated | none | custom illustration | an axe chopping wood | chop-top |
| [ ] | coat | Integrated | emoji 🧥 | custom illustration | a coat | coat-tote |
| [ ] | cool | Integrated ⚑ | none | custom illustration | three melting blue ice cubes with a snowflake | cool-tool, school-cool |
| [ ] | coop | Integrated ⚑ | none | custom illustration | a chicken coop with two chickens nearby | scoop-coop |
| [ ] | cub | Integrated | none | custom illustration | a bear cub | cub-tub |
| [ ] | date | Integrated ⚑ | none | custom illustration | a calendar with a date circled | gate-date |
| [ ] | deer | Missing | emoji 🦌 | emoji | a deer · **must be:** the animal | gear-deer |
| [ ] | dole | Integrated ⚑ | none | custom illustration | a woman handing out bowls of soup | goal-dole |
| [ ] | dot | Integrated ⚑ | none (site picture rejected) | custom illustration | a dot | got-dot |
| [ ] | dough | Integrated | none | custom illustration | a ball of dough | go-dough |
| [ ] | down | Integrated ⚑ | site picture (`down`) | custom illustration | a child sliding down a playground slide | gown-down |
| [ ] | dumb | Integrated ⚑ | none | custom illustration | a confused boy with question marks above his head | gum-dumb |
| [ ] | dye | Integrated ⚑ | none | custom illustration | white fabric being dipped into blue dye | guy-dye |
| [ ] | face | Missing | site picture (`face`) | site picture | a face | face-fate |
| [ ] | fan | Integrated ⚑ | none (site picture rejected) | custom illustration | a fan | fan-pan |
| [ ] | fat | Integrated ⚑ | none | custom illustration | a chubby cat · **must be:** a chubby cat or another nonhuman subject, never a person | fat-pat |
| [ ] | fate | Integrated ⚑ | none | custom illustration | a magical crystal ball representing fate | face-fate |
| [ ] | fin | Integrated ⚑ | none | custom illustration | a shark fin sticking out of the sea | fin-pin |
| [ ] | fish | Missing | site picture (`fish`) | site picture | a fish | fish-fit |
| [ ] | fit | Integrated ⚑ | none | custom illustration | a child's foot fitting into a shoe | fish-fit |
| [ ] | four | Missing | site picture (`four`) | site picture | the number four | four-pour |
| [ ] | gate | Integrated | none (site picture rejected) | custom illustration | a garden gate | gate-date |
| [ ] | gear | Missing | emoji ⚙️ | emoji | a gear | gear-deer |
| [ ] | go | Integrated ⚑ | none (site picture rejected) | custom illustration | a green light that means go | go-dough |
| [ ] | goal | Missing | emoji 🥅 | emoji | a soccer goal | goal-dole |
| [ ] | got | Integrated ⚑ | none (site picture rejected) | custom illustration | a child who got a present | got-dot |
| [ ] | gown | Integrated ⚑ | none | custom illustration | a long gown | gown-down |
| [ ] | gum | Integrated ⚑ | none | custom illustration | a stick of gum | gum-dumb |
| [ ] | guy | Integrated ⚑ | none | custom illustration | a guy waving | guy-dye |
| [ ] | kate | Integrated ⚑ | none | custom illustration | a girl wearing a name badge that says Kate | skate-kate |
| [ ] | key | Integrated | emoji 🔑 | custom illustration | a key | key-tea |
| [ ] | kin | Integrated ⚑ | none | custom illustration | a multigenerational family standing together | skin-kin |
| [ ] | kiss | Integrated ⚑ | none (site picture rejected) | custom illustration | a kiss | kiss-kit |
| [ ] | kit | Integrated ⚑ | none | custom illustration | a first-aid kit | kiss-kit |
| [ ] | lake | Integrated | none | custom illustration | a lake | lake-late |
| [ ] | lap | Integrated | none | custom illustration | a cat sitting on a lap | slap-lap |
| [ ] | late | Integrated ⚑ | none | custom illustration | a clock showing it is late | lake-late |
| [ ] | leaf | Missing | site picture (`leaf`) | site picture | a leaf | leaf-leap |
| [ ] | leap | Integrated ⚑ | none | custom illustration | a frog taking a leap | leaf-leap |
| [ ] | led | Integrated ⚑ | none | custom illustration | a child leading three children along a path | sled-led |
| [ ] | limb | Integrated ⚑ | none | custom illustration | a leafy tree limb growing from the trunk | slim-limb |
| [ ] | lip | Integrated ⚑ | none | custom illustration | a child’s lips in a close-up | slip-lip |
| [ ] | lock | Missing | site picture (`lock`) | site picture | a lock | lock-lot |
| [ ] | lot | Integrated ⚑ | none | custom illustration | a lot of balls | lock-lot |
| [ ] | low | Integrated ⚑ | none | custom illustration | a child reaching to place a block on a low shelf | slow-low |
| [ ] | lug | Integrated | none | custom illustration | a child lugging a heavy bag | slug-lug |
| [ ] | mall | Integrated ⚑ | none | custom illustration | a shopping mall with several storefronts | small-mall |
| [ ] | map | Missing | site picture (`map`) | site picture | a map | math-map |
| [ ] | mart | Integrated ⚑ | none | custom illustration | a small market storefront with produce outside | smart-mart |
| [ ] | mash | Integrated ⚑ | none | custom illustration | mashed potatoes | mash-mat, smash-mash |
| [ ] | mat | Integrated ⚑ | none | custom illustration | a doormat | mash-mat, math-mat, match-mat |
| [ ] | match | Integrated ⚑ | none (site picture rejected) | custom illustration | a single unlit wooden match | match-mat |
| [ ] | math | Integrated ⚑ | none (site picture rejected) | custom illustration | a boy writing a math problem on a chalkboard | math-mat, math-map |
| [ ] | mice | Integrated ⚑ | none | custom illustration | two mice | mice-might |
| [ ] | might | Integrated ⚑ | none | custom illustration | a strong child flexing his muscles | mice-might |
| [ ] | mile | Integrated ⚑ | none | custom illustration | a road with a one-mile marker | smile-mile |
| [ ] | mock | Integrated ⚑ | none | custom illustration | a child making a teasing face at another child | smock-mock |
| [ ] | mud | Integrated ⚑ | none | custom illustration | a puddle of mud | mug-mud |
| [ ] | mug | Integrated ⚑ | none | custom illustration | a mug | mug-mud |
| [ ] | nail | Integrated ⚑ | none (site picture rejected) | custom illustration | a nail | snail-nail |
| [ ] | nap | Integrated ⚑ | none | custom illustration | a child taking a nap | snap-nap |
| [ ] | nice | Integrated ⚑ | none | custom illustration | a smiling boy giving two thumbs up | nice-night |
| [ ] | night | Integrated ⚑ | none | custom illustration | a night sky with the moon | nice-night |
| [ ] | nip | Integrated ⚑ | none | custom illustration | a puppy giving a little nip | snip-nip |
| [ ] | no | Integrated ⚑ | none (site picture rejected) | custom illustration | a red no symbol | snow-no |
| [ ] | pan | Integrated ⚑ | none (site picture rejected) | custom illustration | a frying pan | fan-pan |
| [ ] | pat | Integrated ⚑ | none | custom illustration | a hand giving a dog a pat | fat-pat, path-pat |
| [ ] | path | Integrated ⚑ | none (site picture rejected) | custom illustration | a path through the woods | path-pat |
| [ ] | peach | Missing | site picture (`peach`) | site picture | a peach | peach-peat |
| [ ] | peat | Integrated ⚑ | none | custom illustration | a pile of fibrous peat blocks | peach-peat |
| [ ] | pick | Integrated ⚑ | none | custom illustration | a child picking a flower | pick-pit, thick-pick |
| [ ] | pie | Missing | emoji 🥧 | emoji | a pie | thigh-pie |
| [ ] | pin | Missing | emoji 📌 | emoji | a pin | fin-pin, thin-pin |
| [ ] | pink | Integrated ⚑ | none (site picture rejected) | custom illustration | the color pink | think-pink |
| [ ] | pit | Integrated ⚑ | none | custom illustration | a peach pit | pick-pit |
| [ ] | pour | Integrated ⚑ | none | custom illustration | a pitcher pouring water | four-pour |
| [ ] | push | Integrated ⚑ | none (site picture rejected) | custom illustration | a child pushing a large wooden box | push-put |
| [ ] | put | Integrated ⚑ | none | custom illustration | a child putting toy blocks in a box | push-put |
| [ ] | race | Integrated ⚑ | none | custom illustration | a race | race-rate |
| [ ] | rack | Integrated ⚑ | none | custom illustration | a coat rack | rack-rat |
| [ ] | rat | Missing | emoji 🐀 | emoji | a rat | rack-rat |
| [ ] | rate | Integrated ⚑ | none | custom illustration | a speedometer showing a rate of speed | race-rate |
| [ ] | rice | Missing | emoji 🍚 | emoji | a bowl of rice | rice-right |
| [ ] | right | Missing | emoji ➡️ | emoji | an arrow pointing right | rice-right |
| [ ] | scan | Integrated ⚑ | none | custom illustration | a hand-held scanner scanning a barcode on a box | scan-can |
| [ ] | scar | Integrated ⚑ | none | custom illustration | a child pointing to a small healed scar on an arm | scar-car |
| [ ] | school | Missing | emoji 🏫 | emoji | a school | school-cool |
| [ ] | scoop | Integrated ⚑ | none | custom illustration | a hand scooping ice cream from a tub | scoop-coop |
| [ ] | sea | Integrated ⚑ | none | custom illustration | the sea | sea-tea |
| [ ] | sell | Integrated ⚑ | none | custom illustration | a child selling lemonade | sell-tell |
| [ ] | ship | Missing | site picture (`ship`) | site picture | a ship | ship-tip |
| [ ] | shoe | Missing | site picture (`shoe`) | site picture | a shoe | shoe-two |
| [ ] | shop | Integrated ⚑ | none (site picture rejected) | custom illustration | a shop | shop-top |
| [ ] | shy | Integrated ⚑ | none (site picture rejected) | custom illustration | a shy child hiding | shy-tie |
| [ ] | sick | Missing | site picture (`sick`) | site picture | a sick child in bed | sick-sit, sick-tick |
| [ ] | sip | Integrated ⚑ | none | custom illustration | a child taking a sip of water from a glass | sip-tip |
| [ ] | sit | Integrated ⚑ | none (site picture rejected) | custom illustration | a child sitting down | sick-sit |
| [ ] | skate | Missing | site picture (`skate`) | site picture | an ice skate | skate-kate |
| [ ] | skin | Integrated ⚑ | none | custom illustration | a child showing an arm with normal healthy skin | skin-kin |
| [ ] | slap | Integrated | none | custom illustration | a child slapping a hand on a table | slap-lap |
| [ ] | sled | Missing | emoji 🛷 | emoji | a sled | sled-led |
| [ ] | slim | Integrated | none | custom illustration | a slim pencil | slim-limb |
| [ ] | slip | Integrated ⚑ | none | custom illustration | a child slipping on ice | slip-lip |
| [ ] | slow | Integrated ⚑ | none (site picture rejected) | custom illustration | a slow turtle | slow-low |
| [ ] | slug | Integrated ⚑ | none | custom illustration | a shell-free slug with eye stalks · **must be:** must look different from snail | slug-lug |
| [ ] | small | Integrated ⚑ | none | custom illustration | a small elephant beside a much larger elephant | small-mall |
| [ ] | smart | Integrated ⚑ | none (site picture rejected) | custom illustration | a girl placing a triangle into a shape puzzle | smart-mart |
| [ ] | smash | Integrated ⚑ | none | custom illustration | a colorful ball knocking down a tower of blocks | smash-mash |
| [ ] | smile | Integrated ⚑ | none (site picture rejected) | custom illustration | a smile · **must be:** must look different from face in face / fate | smile-mile |
| [ ] | smock | Integrated ⚑ | none | custom illustration | a painting smock | smock-mock |
| [ ] | snail | Missing | emoji 🐌 | emoji | a snail | snail-nail |
| [ ] | snap | Integrated ⚑ | none (site picture rejected) | custom illustration | fingers snapping | snap-nap |
| [ ] | snip | Integrated ⚑ | none | custom illustration | scissors snipping paper | snip-nip |
| [ ] | snow | Missing | site picture (`snow`) | site picture | snow | snow-no |
| [ ] | stack | Integrated ⚑ | none | custom illustration | a stack of blocks | stack-tack |
| [ ] | star | Missing | site picture (`star`) | site picture | a star | star-tar |
| [ ] | stick | Integrated ⚑ | none | custom illustration | a stick | stick-tick |
| [ ] | stone | Integrated ⚑ | none | custom illustration | a stone | stone-tone |
| [ ] | stool | Integrated ⚑ | none | custom illustration | a stool | stool-tool |
| [ ] | stop | Missing | site picture (`stop`) | site picture | a stop sign | stop-top |
| [ ] | sweat | Integrated ⚑ | none | custom illustration | a child sweating after exercise | sweat-wet |
| [ ] | sweep | Integrated ⚑ | none | custom illustration | a child sweeping a small pile with a broom | sweep-weep |
| [ ] | sweet | Integrated ⚑ | none | custom illustration | a child enjoying a lollipop | sweet-wheat |
| [ ] | swing | Integrated ⚑ | none | custom illustration | a child swinging on a playground swing | swing-wing |
| [ ] | tack | Integrated ⚑ | none | custom illustration | a thumbtack · **must be:** must look different from pin in thin / pin and fin / pin | stack-tack |
| [ ] | tame | Integrated ⚑ | none | custom illustration | a child gently petting a tame pony | came-tame |
| [ ] | tank | Integrated ⚑ | none | custom illustration | a fish tank | thank-tank |
| [ ] | tap | Integrated ⚑ | none | custom illustration | a water tap | cap-tap |
| [ ] | tar | Integrated | none | custom illustration | black tar on a road | car-tar, star-tar |
| [ ] | taught | Integrated ⚑ | none | custom illustration | a teacher who taught a lesson | thought-taught |
| [ ] | tea | Integrated ⚑ | site picture (`tea`) | custom illustration | a cup of tea | key-tea, sea-tea |
| [ ] | tell | Integrated ⚑ | none | custom illustration | a child telling a secret | sell-tell |
| [ ] | thank | Integrated ⚑ | none (site picture rejected) | custom illustration | a child saying thank you | thank-tank |
| [ ] | thick | Integrated ⚑ | none | custom illustration | a thick book | thick-tick, thick-pick |
| [ ] | thigh | Integrated ⚑ | none | custom illustration | a thigh | thigh-pie |
| [ ] | thin | Integrated ⚑ | none (site picture rejected) | custom illustration | a thin book · **must be:** a thin object or animal, never a person | thin-tin, thin-pin |
| [ ] | think | Missing | site picture (`think`) | site picture | a child thinking | think-pink |
| [ ] | thought | Integrated ⚑ | none | custom illustration | a child thinking about a piece of cake | thought-taught |
| [ ] | tick | Integrated ⚑ | none | custom illustration | a green check mark in a box | sick-tick, thick-tick, stick-tick |
| [ ] | tie | Missing | emoji 👔 | emoji | a necktie | shy-tie |
| [ ] | tin | Integrated ⚑ | none | custom illustration | a shiny tin box · **must be:** must look different from can in scan / can | thin-tin, chin-tin |
| [ ] | tip | Integrated ⚑ | none | custom illustration | the tip of a pencil | sip-tip, ship-tip, chip-tip |
| [ ] | tone | Integrated ⚑ | none | custom illustration | a ringing tuning fork making a musical tone | stone-tone |
| [ ] | tool | Integrated ⚑ | none | custom illustration | a tool | cool-tool, stool-tool |
| [ ] | top | Integrated ⚑ | none | custom illustration | a spinning top | shop-top, stop-top, chop-top |
| [ ] | tote | Integrated | none | custom illustration | a tote bag | coat-tote |
| [ ] | tub | Integrated ⚑ | none | custom illustration | a tub · **must be:** must look different from bath in bath / bat | cub-tub |
| [ ] | two | Missing | emoji 2️⃣ | emoji | the number two | shoe-two |
| [ ] | weep | Integrated ⚑ | none | custom illustration | a child gently weeping with visible tears | sweep-weep |
| [ ] | wet | Integrated ⚑ | none | custom illustration | a soaked dog with dripping fur | sweat-wet |
| [ ] | wheat | Integrated ⚑ | none | custom illustration | a sheaf of golden wheat stalks | sweet-wheat |
| [ ] | wife | Integrated ⚑ | none | custom illustration | a husband and wife | wife-wipe |
| [ ] | wing | Integrated ⚑ | none | custom illustration | a bird spreading one wing | swing-wing |
| [ ] | wipe | Integrated ⚑ | none | custom illustration | a child wiping a table | wife-wipe |
| smash, small, mall, smart, mart, swing, wing, sweet, wheat, sweep, weep, sweat, wet, kate, skin, kin, scoop, coop, scan, scar | Integrated 2026-10-14. Generated as separate compositions, visually reviewed, then reduced as complete images to 512 × 512 with white margins. All final PNGs are under 500 KB (146–249 KB); no neighboring fragments or clipped subjects found. Updated each imageAlt to describe its delivered picture. Added Jana review flags above; target words, lexicon rules, pair notes, and clinical approval states were preserved. |
| slow, low, slip, lip, slap, lap, led, slug, lug, slim, limb, chip, chin, chop, beet, peat, match, catch | Integrated 2026-10-14. Generated as separate images, visually inspected, and fitted uncropped onto white 512 × 512 canvases. All final PNGs are under 220 KB. Regenerated slap after rejecting a sleeve cropped by the first result, and regenerated chin after rejecting a flat crop through the face. Updated alt text to match the delivered art. Added Jana review flags for ambiguous concepts; no transcription, pair notes, lexicon rules, or clinical approvals changed. |

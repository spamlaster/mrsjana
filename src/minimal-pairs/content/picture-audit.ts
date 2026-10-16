// Pictures checked against this library. The test for a usable picture: shown on its own, would a young
// child name it with the target word? An existing picture that fails is not linked, even though it exists,
// and the word shows the placeholder until it has an illustration. None of this is clinical review:
// every picture, linked or emoji, still needs Jana's approval.

// Existing WordPicture entries (same key as the word) rejected for this library, with the reason.
// scripts/minimal-pairs.test.mjs fails if one of these is linked again.
export const rejectedPictures: Record<string, string> = {
  back: 'WordPicture shows the 🔙 sign, which is printed text ("BACK"), not a picture of a back',
  bad: 'WordPicture shows 👎; a child would say "thumbs down"',
  beef: 'WordPicture shows 🍖; a child would say "meat"',
  bid: 'WordPicture shows 💰; a child would say "money"',
  big: 'WordPicture shows 📏; a child would say "ruler"',
  cash: 'WordPicture shows 💵; a child would say "money"',
  catch: 'WordPicture shows 🥎; a child would say "ball"',
  dot: 'WordPicture shows ⚪; a child would say "circle"',
  fan: 'WordPicture shows 🌀, a cyclone, not a fan',
  gate: 'WordPicture shows 🚪; a child would say "door"',
  go: 'WordPicture shows 🏃; a child would say "run"',
  got: 'WordPicture shows ✅; a child would say "check"',
  kiss: 'WordPicture shows 💋; a child would say "lips", which clashes with lip in slip / lip',
  match: 'WordPicture shows 🔥; a child would say "fire"',
  math: 'WordPicture shows 🔢, printed numbers',
  nail: 'WordPicture shows 🔨; a child would say "hammer"',
  no: 'WordPicture shows ❌; a child would say "X"',
  pan: 'WordPicture shows 🍳; a child would say "egg"',
  path: 'WordPicture shows 🛣️; a child would say "road"',
  pink: 'WordPicture shows 🌸; a child would say "flower"',
  push: 'WordPicture shows ✋; a child would say "hand"',
  shop: 'WordPicture shows 🛒; a child would say "cart"',
  shy: 'WordPicture shows 😳, which does not read as shy',
  sit: 'WordPicture shows 🪑; a child would say "chair"',
  slow: 'WordPicture shows 🐢; a child would say "turtle"',
  smart: 'WordPicture shows 🧠; a child would say "brain"',
  smile: 'WordPicture shows 😊, the same picture as face',
  snap: 'WordPicture shows 🤏, a pinching hand',
  thank: 'WordPicture shows 🙏, which reads as praying',
  thin: 'WordPicture shows 🥢; a child would say "chopsticks"',
}

// Linked pictures that pass but deserve a second look in Jana's review.
export const pictureCautions: Record<string, string> = {
  tea: '☕ may be named "coffee"',
  bath: '🛁 may be named "tub", which is also a word in cub / tub',
  down: 'an arrow: symbolic, not a picture of an object',
  right: 'an arrow: symbolic, and right also means correct',
  four: 'four dots, to be counted',
  two: 'the numeral 2',
  rat: '🐀 may be named "mouse"',
  tie: '👔 may be named "shirt"',
  pin: '📌 is close to a thumbtack, and tack is a word in stack / tack',
  snow: '❄️ may be named "snowflake"',
  school: '🏫 may be named "building"',
  face: '😊 may be named "smile" or "happy"',
}

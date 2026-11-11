# Directing Voice

## Overview

Whether a promotion is voiced, and how. The voice dials and how the plan sets them; coverage, the voice mode; register; casting fit and source; language and address; pronunciation; the read; pace; the ElevenLabs controls; casting and takes; placement on the music's grid; the ending; a second voice; starting values per preset. What the lines say is in [writing-script.md](./writing-script.md); the voice's level in the mix is in [directing-sound.md](./directing-sound.md) → **Mix**.

## Guidelines

### The dials and the plan → voice map

Choose each dial on its own; no single setting decides the rest. The dials are this guide's sections, plus three owned elsewhere: voice ↔ captions and lines for the ear ([writing-script.md](./writing-script.md) → **Voice, captions, picture**, **Writing for the ear**), the mix ([directing-sound.md](./directing-sound.md) → **Mix**), and what the voice may claim ([promotion-contract.md](./promotion-contract.md) → **Honesty rules**).

- Music-led: the voice is never the signature device. It serves the film's one device, and the music stays the clock.
- Voice-led presets (Founder Lo-fi, Notes-app Lo-fi, Teach-first): the voice is the clock.

| Plan input | Sets |
| --- | --- |
| Audience region, home language | Language; accent; pronunciation; the language's normal rate; the shortlist's language filter |
| Age, literacy, second-language viewers | Pace (cut words, never slow down); address; line length; the older-viewer duck in **Mix** |
| App category, risk class | Register; read; arc (no hype in clinical health or finance); formal address for finance, clinical health and enterprise |
| Structure ([choosing-structure.md](./choosing-structure.md) → **The catalog**) | The default coverage; which blocks get lines |
| Energy 1–5 ([choosing-style.md](./choosing-style.md) → **Energy scale**) and the curve per beat | Coverage; read; arc; pace; tags |
| Preset | Coverage; arc; placement; second voice (**Voice presets per style**) |
| Clock (music or voice) | Placement; the **Mix** row; the ending |
| The track: BPM, bed density, tail length | Slots; carving; the spoken close |
| Length | Line counts scale with the blocks. Past ~60 s a third emotional turn fits |
| Sold ≠ shown | The seller speaks the sold line and the close ("we") |
| Placement (sound-on or muted-first) | Sound-on: the brand said early, the on-screen CTA voiced. Muted-first: every voiced fact also on screen, so none or key lines |
| Budget | Source; voices × takes |

When rows conflict: honesty and platform policy first, then category risk, then the market's address norm, then the structure, then energy, then preset.

### Coverage

The voice mode. Decide it when the concept is picked, from the structure's default and the placement, and record it in `promotion.md` → **Spec**. None is a full option, not a fallback.

| Mode | What it is | Values | Fits | Avoid when |
| --- | --- | --- | --- | --- |
| None | Music, type and UI sounds | 0 lines | Quick demo, Teaser, Offer-led; muted-first placements; ≤ 6 s | A high-involvement buy that needs explaining |
| Key lines | A few lines carry the key meaning: the sold line alone (1), bookends of hook, sold line and close (3), or phrases between the music's moments (3–6) | 1–6 lines at 20–30 s | Problem–Solution, Before–After–Bridge, Comparison, Feature–Benefit, Listicle; music-led films at energy 3–5 | A high-involvement buy: the problem and what each proof means go unsaid |
| Narrated | The voice carries the story: it names the problem and says what each proof beat means, in outcome words, never a button or a step; music-only breaths of 1–2 s after a line has framed what to watch | About 1 line per 4–5 s | PAS, How-to, Explainer, Founder story; high-involvement buys; sound-on placements | A muted-first placement without captions; a beat-cut film whose every bar is a hit |
| Speech on camera | A real person speaks: the founder, a consenting customer, a creator | Voice-led | Founder story, Testimonial, Creator | No such person; never an AI voice in their place |

- The voice-free floor and the gaps between lines: [writing-script.md](./writing-script.md) → **Coverage and gaps**.
- Voice the hook only when it is an address or a question. A type-device hook (a number reel, a slam list) stays type and music, or the voice takes only its turn word.

### Register and persona

| Register | Sounds like | Warmth / authority (start) | Fits | Avoid when |
| --- | --- | --- | --- | --- |
| Peer, second person | One owner talking to another | 8 / 4 | SMB, consumer, low-tech, local markets; pain and payoff lines | Enterprise |
| Seller, "we" | The seller's own voice | 7 / 6 | The sold line and the close when sold ≠ shown | An AI voice presented as the real founder |
| Host | Bright, forward, energetic | 7 / 5 | Offers, events, youth | Health, finance |
| Guide | Warm or measured; explains | 5 / 8 | B2B, enterprise, security, utilities, finance, health, education, developer launches, Teach-first | Claiming credentials ("doctor") |
| Announcer | Polished "voice of God" | 3 / 9 | YouTube and TV offers | Native feeds |
| Character, first person | A dramatized person | — | A labelled dramatization of the pain | A user or a testimonial: blocked by the honesty rules |

Pain and payoff lines speak *to* the viewer; the sold line and the close are the seller speaking. The voice is never a user ([promotion-contract.md](./promotion-contract.md) → **Honesty rules**).

### Casting fit and source

| Fit | Rule | Avoid |
| --- | --- | --- |
| Sounds like the audience | Peer age, the audience's accent | Luxury |
| Sounds like their aspiration | A successful, polished owner | Cold SMB audiences |
| Gender | Cast by fit; shortlist both genders | Mapping male to money, female to care or flowers |
| Age impression | Near the middle of the audience's age band, ±10 years | A teen-vlogger voice for an older audience |
| Timbre | Warm mid-range with some brightness. Bright cuts through a dense bed; gravel reads as a trailer; breathy reads as intimate | Every line bright: it tires the ear |
| Accent | The language variety matches the market (pt-BR ≠ pt-PT; Latin American ≠ Castilian Spanish). A regional accent only in a geo-targeted cut with a native check. English words in the speaker's own English variety | A foreign accent on local-language lines |

| Source | What it is | Limits | Use when |
| --- | --- | --- | --- |
| Library voice (default) | A shared voice used by its ID | Notice period 30 days–2 years; some carry a credit multiplier; not on the free tier's API | Always first |
| Speech-to-Speech | A real person reads each line with the wanted emotion, timing and accent (to a click if needed); a library voice speaks it | `eleven_multilingual_sts_v2`, 29 languages; billed as 1,000 characters a minute; ≤ 5 min a request; `POST /v1/voice-changer/<voice_id>` defaults to `eleven_english_sts_v2`; `remove_background_noise`; mic gain and room noise carry through | A native speaker can perform the read |
| Voice Design | A text prompt makes 3 preview voices | `eleven_multilingual_ttv_v2` or `eleven_ttv_v3`; preview text 100–1,000 characters; saving takes a voice slot; on v4 designed voices may be less performative | Nothing in the library fits |
| Instant clone | 1–2 min of the user's own clean audio, with consent | Only with an "AI voice" disclosure | The founder's own voice as narrator. Risk: never anyone else's voice, never Founder Lo-fi (its founder is real), never a line the founder wouldn't say |
| Human voice actor | Hired talent, outside ElevenLabs | A fee | The ear rejects every AI take |

### Language, code-switch, address

1. Audience region → home language → base language. A necessity buy gets the local language; a status buy may get a prestige language.
2. Market → the address form, from that language's Microsoft style guide. The tone may shift it.
3. UI language → the words that stay untranslated.
4. Lines → [writing-script.md](./writing-script.md) → **Honesty scan for words** → a literal back-translation → the Brief's native check.
5. Mark how each name, number, affix and acronym is said (**Pronunciation and numbers**), and look up or measure the language's normal rate (**Pace**).
6. A geo-targeted region with a different home language → a second cut, re-voiced and re-captioned, with its own native checker.

| Option | What it is | Fits | Avoid when |
| --- | --- | --- | --- |
| Everyday home language (default) | Code-switched as people speak: Hinglish; Spanglish in the US | Necessities, SMB tools, emotion | Status or enterprise buys |
| Aspirational language | A prestige language alone, often English | Luxury, global, enterprise | Necessities; older or low-literacy viewers |
| Pure standard language | No switching | Government, education; markets that don't code-switch | An audience that code-switches: it sounds translated |
| Loanwords and UI words | The local language carries grammar, verbs and emotion. UI words take the market's standard spoken form: Japanese solid katakana compounds (ダブルクリック); Spanish periphrasis ("dar clic") or -ear verbs; a local affix on the English stem where the language does that | Every app promotion | A switch at an ungrammatical joint; a bare English verb; a switch every word |
| Switch on the result word | The switched word gains salience (Spanglish: Spanish → English on the result word) | Result or offer words | The minority language carries the positive associations: reverse it |
| Informal "you" | tú (es-ES, es-MX), você (pt-BR) | Warm and energetic tones; consumer, SMB | High-status professionals, unless the user approves |
| Formal "you" | Sie, vous, usted, Japanese desu–masu | Calm or premium tones; finance, clinical health, enterprise; formal-default markets (de, fr, ja) | Youth or warm brands |
| Honorific and humble register | Japanese seller lines drop "you" (あなた can sound impolite), use honorific forms for the customer and humble forms for the seller (お問い合わせください); a native writer picks the spoken company form | Japanese B2B; any market with a supplier-to-customer register | — |
| Regional address | The market's own pronoun: vos in Argentina and Uruguay | That country | A pan-regional cut |

### Pronunciation and numbers

Before the casting test, list every name, acronym, loanword, affix and number in the lines, and the brand's stress (the user sets it). Fix in this order, listening after each:

| Fix | How | Models |
| --- | --- | --- |
| Standard spelling (default) | Write each word as the market's localisation standard spells it; Japanese loanwords in katakana, with kana readings for kanji names TTS may misread. Fix only what fails by ear | All |
| Numbers as words | Write numbers as they are said, in the system speakers use for each kind: clock times, dates, phone numbers (digit by digit) and money may each differ. Set `apply_text_normalization` to `on` for prices and dates (`auto` / `on` / `off`; on `eleven_flash_v2_5`, Enterprise only). Japanese: `apply_language_text_normalization`, which can heavily increase latency | All |
| Inline IPA | One word in slashes: `"/ˌbaɪoʊˈkemɪstri/"`; results vary by voice | v4 |
| Dictionary alias rule | A respelling rule; case-sensitive; the first match wins; ≤ 3 dictionaries a request; the API key needs pronunciation-dictionary permission | All |
| Dictionary phoneme rule | IPA or CMU for a recurring word; non-English phonemes need v4 | `eleven_v4`, `eleven_v4_turbo`, `eleven_flash_v2`, `eleven_v3` |
| Respelling | A phonetic spelling, only for a word that still fails after an alias; never in a caption | All |

The library's accent and locale tags are unreliable, and `verified_languages` ignores accent: check the variety by ear.

### Read, emotion arc, emphasis

- Every voiced film has ≥ 2 reads that sound clearly different: a pain read and a payoff read. Check by ear: play the pain line and the payoff line back to back on a phone speaker. Alike → re-direct, or recast. Every other dial stays plain.
- Write each voiced line's read, tags and stressed word beside it in the beat sheet before any take.

| Read | Sounds like | Fits | Avoid when |
| --- | --- | --- | --- |
| Conversational (default) | To one listener, with a natural, uneven rhythm | Short-form | — |
| Smile | An audible smile, brighter vowels | Payoff, sold line, close | Pain lines; health news |
| Soft sell | Low intensity, confident falling endings | Health, finance | Offer blasts |
| Hard sell | Loud, urgent | Retail TV, mass-market local ads | Risk: trust-led SMB or B2B on social |
| Dry / deadpan | Flat on purpose, a beat before the turn | Developer tools, pain lines | Second-language viewers: irony is misread |
| Intimate | Quiet, near the mic | Premium Calm | A dense bed |
| Hype / trailer | Peaky, or low gravitas | Energy 5, games, parody | Risk: SMB demos |
| Whisper / ASMR | Breathy, close | A Satisfying UI A/B only | Risk: general audiences react mostly badly |
| Rhythmic / chant | Syllables locked to the beat | Kinetic Slam hits, jingles | Over a vocal track |
| TTS-native | Openly synthetic | Notes-app Lo-fi | It would pass as human |

| Arc | Turns | Fits |
| --- | --- | --- |
| One colour: one read throughout | 0 | Nothing: it is the flat-voice failure |
| Pain → payoff: dry and lower → bright, smiling | 1 | Before / After, Kinetic Slam |
| Pain → payoff → invitation: adds a warm, falling sold line and close | 2, the most a 20–30 s film holds | Problem → solution |
| Curiosity → reveal: a rising question → a landed answer | 1 | Result-first, Data Hero |

Emphasis:

- One stress a line, on the result word, last.
- Claims, the sold line and the close end falling and confident; a rising end only on a real question.
- Each line's contour differs from the line before. Avoid "AI cadence": the same contour on every line, every word stressed.
- A list goes rise, rise, fall, in one take; never one take per word.

### Pace

- Use the voice's natural rate (1.0×). A line that doesn't fit, and any line for older or second-language viewers, gets fewer words. Never slow the read, time-stretch it or change its playback rate.
- Brisk (1.1–1.2×) only at energy 5 or on offers, never for older or second-language viewers. v4 has no speed setting: get pace from tags (`[quick, light pace]`) and the text. `eleven_multilingual_v2` and `eleven_flash_v2_5` take `speed` 0.7–1.2.
- Plan line lengths per [writing-script.md](./writing-script.md) → **Rate and budget** (the duration model and the planning rate). After casting, re-check each line against its slot with the picked voice's measured takes.

Normal read-speech rates, in syllables a second (Pellegrino, Coupé & Marsico 2011): English 6.19, French 7.18, German 5.97, Italian 6.99, Spanish 7.82, Japanese 7.84, Mandarin 5.18, Vietnamese 5.22. A language with no published rate: measure syllables ÷ (alignment span − gaps over 120 ms) over ≥ 10 native human clips.

### ElevenLabs model, settings, tags

Start on `eleven_v4`: its audio tags are the main emotion lever. Record the model, the settings and why in **Voice**. The values here override the text-to-speech skill's notes where they differ; check the current docs before relying on one.

| Model | Languages | Settings | Tags | `language_code` | Stitching | Max characters |
| --- | --- | --- | --- | --- | --- | --- |
| `eleven_v4` | 90+ | `stability`, `similarity_boost`; `clone_strength` for v4 professional clones | ✓ | ✓ | ✓ | 10,000 |
| `eleven_v4_turbo` | 90+ | As v4 | ✓ | ✓ | Check the current docs | Check the current docs |
| `eleven_v3` | 70+ | `stability` only: no similarity, speed or speaker boost | ✓ | ✓ | ✗ | 5,000 |
| `eleven_multilingual_v2` | 29 | `stability`, `similarity_boost`, `style`, `speed` 0.7–1.2, `use_speaker_boost` | ✗ | ✗ | ✓ | 10,000 |
| `eleven_flash_v2_5` | 32 | `stability`, `similarity_boost`, `speed` 0.7–1.2 | ✗ | ✓ | ✓ | 40,000; 50 % lower price a character |

| Lever | Rule |
| --- | --- |
| `voice_settings` | Pass them on every call: stored defaults vary by voice |
| `stability`, `similarity_boost` | Start at 0.5 and 0.75. Lower stability widens the emotional range; too low turns random; high goes monotone. Stability is not the emotion lever: A/B it by ear on hooks only. Lower similarity if artifacts appear |
| Audio tags | Descriptive English tags for voice quality, right before the words whose delivery changes: `[weary, dry]`, `[bright, relieved, smiling]`, `[warm, reassuring]`, `[curious]`, `[sighs]`. Combine freely; no fixed count a line. Match tags to the voice: a serious voice may ignore playful tags. Never sound-effect tags (`[applause]`): they can play as sounds |
| Punctuation and CAPS | Ellipses add a pause and weight; CAPS on one word add emphasis; no SSML on v4. Never write narrative cues ("she said excitedly"): they can be read aloud |
| `previous_text` / `next_text` | On every take, with its neighbours' text, for a continuous tone. To re-take one line between picked takes, pass `previous_request_ids` / `next_request_ids` instead: ≤ 3 each, under 2 h old, not on v3; they override the text fields |
| `seed` | Best-effort repeatability (0–4294967295); logged per **Takes** with the `request-id` and `character-cost` response headers |
| `language_code` | Enforces the language: ISO 639-1, or ISO 639-3 where a language has no two-letter code (`yue`, `ast`, `ckb`). On a code-switched line, A/B it on and off by ear |
| `output_format` | Default `mp3_44100_128`. `mp3_44100_192` needs Creator; `pcm_44100` and `wav_44100` need Pro. `pcm_24000` avoids an MP3 → AAC double encode below Pro: A/B it by ear |
| Audio effects | A phone-line filter preset only on a labelled second voice (**Second voice**); the narrator stays dry |
| Licence | Generate only on a paid plan: content made outside a paid subscription can't be used commercially. Never a Beta service in a promotion |

### Casting

The skill names no voice and has no default voice. Casting runs for each promotion. A voice the user approved for an earlier promotion may join as one candidate; it is reused only when the user confirms it for this one.

1. **Casting line.** Write it in **Voice**: language and code-switch, accent, register, age impression, warmth ↔ authority.
2. **Shortlist (free).** `GET https://api.elevenlabs.io/v1/shared-voices?language=<code>`, with `accent`, `locale`, `gender`, `age`, `use_cases`, `category` and `min_notice_period_days=30` as the casting line needs. Keep voices whose `language` is the target and whose `verified_languages` lists the target with the model you'll use (the language filter also returns non-native voices). Prefer `category` `high_quality` and no credit multiplier (`rate` 1.0); flag `live_moderation_enabled` (it adds latency); keep both genders.
3. **Preview screen (free).** Listen to each `preview_url` in the target language. Previews only rule voices out: flat, noisy, or the wrong variety.
4. **Casting test (paid).** 3–5 voices; the same 5–6 lines, model and settings; `/with-timestamps`; 2 takes each if the budget allows. Show it as a cost table per [promotion-contract.md](./promotion-contract.md) → **Media and paid calls**, and wait for the user's "go". Read `GET /v1/user/subscription` before and after each batch. Take the lines from the beat sheet, so one voice must do both pain and payoff:

   | # | Job | Example: a payroll app for contractors |
   | --- | --- | --- |
   | 1 | Pain | "Timesheets again... copy, add, check... again." |
   | 2 | Payoff | "Done." |
   | 3 | Address or question hook | "Still adding up timesheets on Friday night?" |
   | 4 | Sold line: who builds it, for whom | "We'll build you an app like this." |
   | 5 | Offer + close | The Brief's offer, then "Message us." |
   | 6 | The hardest names, acronyms and numbers | "Approve Kowalski's 42.5 hours, then send the PDF." |

5. **Pick (the user, by ear).** The user listens dry on a phone speaker at low volume, then on the bed in the preview. Reject a voice whose pain and payoff lines sound alike, or that misreads a name or number. The Brief's native checker approves the language. Record the voice ID, model, settings and reason in **Voice**.

The user may waive steps 3–5. Then pick one voice from the shortlist against the casting line, record the reason in **Voice**, and render the film's takes under their own cost table. The user judges the voice by ear at the sound gate; a rejected voice is recast.

### Takes

1. One request per line: `POST https://api.elevenlabs.io/v1/text-to-speech/<voice_id>/with-timestamps` with `text` (numbers written as said; the line's tags and punctuation), `model_id`, `language_code`, `voice_settings`, `previous_text` and `next_text`.
2. Save each take's audio and its `alignment` JSON (`characters`, `character_start_times_seconds`, `character_end_times_seconds`) in `assets/vo/raw/`. Log its inputs, `seed`, and the `request-id` and `character-cost` response headers in `assets/vo/raw/lines.json`.
3. Render 3–4 takes of the hook, the payoff, the sold line and the close; 2 of each other line.
4. Pick for: the smile; the result word stressed and falling; a contour unlike the line before; breath groups intact; names, numbers and loanwords right; no artifacts.
5. Place a take only after the user has heard it, or has said "you pick". Copy each pick to `assets/vo/<id>.mp3` and record it in **Voice**.
6. Trim only trailing silence. The voice chain is in [directing-sound.md](./directing-sound.md) → **Mix**.

### Placement on the grid

Measure every onset from the audio (`ffmpeg … silencedetect`), never from the TTS alignment: the alignment runs 30–60 ms off and has clipped a first syllable by ~0.13 s. A phrase's chosen instant hits its beat:

| Option | What it is | Values | Fits | Avoid when |
| --- | --- | --- | --- | --- |
| Stressed vowel on the beat (default) | The word lands | Place the take so its measured onset falls at beat − pre-roll. Pre-roll = the onset to the stressed vowel (its offset in the alignment), per line: 30–60 ms when the stress is on the first syllable (80–120 ms for s, f or h starts), longer otherwise. Pitch-accent languages: start on the accented mora, then tune by ear | All | — |
| Call-and-response | The hit lands, then the word | +1/8 note, ≤ +0.3 s | A phrase longer than its slot; question → hit | It would cross the drop |
| Rhythm-locked | One short word per beat | Slot ≥ word | List hooks, energy 4–5 | It would need syllables on 8ths |
| Free over the grid | Starts on a beat, then runs at the voice's natural rate | Ends ≥ 1/8 before the next hit | Sold line, app lines | — |

- Never voiced: the voice-free windows in [writing-script.md](./writing-script.md) → **Coverage and gaps**. The voice may land *with* a type word as its verbatim echo, or one 8th after a landing.
- A phrase longer than its slot answers its picture one 8th late, or gets shorter. It never overlaps the next phrase.
- Voice-led: place each take on its picture anchor; a line that doesn't fit gets shorter, or the picture holds longer.
- Duck the bed under each line per [directing-sound.md](./directing-sound.md) → **Mix**.

### Ending

Compute the ending per film from the measured take and the track's 8th note (30 ÷ BPM s), never from a fixed threshold. The tail is the music after the ending hit, under the end card. A 3.0 s close at 120 BPM (8th = 0.25 s) needs a tail ≥ 4.05 s.

| Tail after the ending hit | The spoken close |
| --- | --- |
| ≥ the close take + 1/8 + 0.8 s | The full close, starting at the hit + 1/8 |
| ≥ the offer take + 1/8 + 0.8 s | The offer only |
| Shorter | No voice after the hit: the close goes on the last caption beat before the hit, and the end card carries it |

- Music-led: ≥ 0.8 s of music alone after the last word.
- A tail too short for the close, where the picture allows: extend it per [directing-sound.md](./directing-sound.md) → **Cutting**.

### Second voice

One narrator. A second speaker only as one of these:

| Option | Rule |
| --- | --- |
| An AI voice the product "hears" (a clinician dictating) | Blocked by the honesty rules: an AI person using the product |
| A real member of the seller's team | Labelled "Demo", playing no role, 2–4 s, the narrator silent. Risk: it must not pass as a customer |
| A pain chorus | Old-way voice notes or chat messages, labelled as a dramatization; never uses or praises the product. Risk: it must not pass as real customers |
| Text to Dialogue | Only for overlapping speakers: `eleven_v4` or `eleven_v3` (set `model_id`; the default is v3); ≤ 2,000 characters in all. Lines on separate beats get separate takes |

### Voice presets per style

Starting values for each preset in [choosing-style.md](./choosing-style.md) → **Presets**; tune by ear. Pace is the natural rate unless noted; tags are v4 examples. The duck: [directing-sound.md](./directing-sound.md) → **Mix**.

| Preset | Coverage | Register · read · arc | Tags | Placement |
| --- | --- | --- | --- | --- |
| Kinetic Slam | Key lines, 4–6; narrated between the slams in a PAS | Peer + seller · dry pain → smiling payoff · 2 turns; optional chant on the slam words | `[dry]` → `[bright, smiling]` → `[warm, confident]` | Slam words rhythm-locked, or left to type |
| Exploded UI | Key lines, 3–5 | Peer · smile · 1 turn | `[warm, smiling]` | Free over the grid |
| Chat Chaos | Key lines: bookends + 1 | Peer · playful-urgent → relief | `[playful, urgent]` → `[relieved, warm]` | The hook as one take over the build |
| Satisfying UI | None, or key lines: the sold line only; a question hook as an A/B | Peer · quiet, curious | `[quiet, curious]` | Nothing over the fill; the ticks win |
| Before / After | Key lines, 3–4 | Peer · weary → bright | `[weary, dry]` → `[bright]` | The "before" list rhythm-locked in one take |
| Data Hero | Key lines, 3–5 | Peer + seller · dry → smile; never reads the numbers | `[matter-of-fact]` → `[bright, relieved, smiling]` | Numbers stay as type; the voice takes the turn word |
| Paper to App | Key lines: bookends + 1; narrated in a PAS | Peer · warm, knowing | `[warm, knowing]` | Free; silent through the morph |
| Founder Lo-fi | Speech on camera | The real founder, never AI · conversational | — | The voice is the clock |
| Notes-app Lo-fi | Narrated | TTS-native, flat by design, labelled | — | The voice is the clock |
| Premium Calm | None, or 1 key line | Guide · intimate | `[soft, intimate]` | Gaps ≥ 2 bars |
| Offer Blast | Key lines: offer + close | Host · light hard sell with a smile | `[bright, upbeat]`, brisk | On the offer slam |
| Teach-first | Narrated | Guide · conversational | `[clear, conversational]` | The voice is the clock |
| Deadline | Key lines: hook + offer + close | Light announcer · firm, falling | `[firm]` | The date on the beat |

| Energy | Register | Read | Coverage | Pace |
| --- | --- | --- | --- | --- |
| 1 | Guide | Intimate, soft | None, or one key line | Natural; gaps ≥ 2 bars |
| 2 | Peer, or the real founder | Warm, conversational | Narrated, speech on camera, or bookends; often voice-led | Natural |
| 3 | Peer | Conversational, light smile | Key lines (bookends, or 3–4), or narrated | Natural |
| 4 | Peer + seller | Dry pain → smiling payoff | Key lines 3–6, or narrated between the hits | Natural to 1.1× |
| 5 | Host | Hype or chant | None, chant hits, or narrated in a creator style | Brisk, 1.1–1.2× |

| App category | Start with |
| --- | --- |
| SMB | Peer, local accent |
| Consumer | Peer or host, with a smile |
| B2B | Guide, dry |
| Developer tools | Dry peer, or no voice |
| Health | Soft guide; no hype, no clinician persona |
| Finance | Measured; no urgency |

## References

- ElevenLabs text to speech: Eleven v4 (settings, no SSML or speed, language codes) https://elevenlabs.io/docs/overview/capabilities/text-to-speech/eleven-v4 · voice settings (stability, similarity, speed 0.7–1.2, what v3 lacks) https://elevenlabs.io/docs/eleven-creative/playground/text-to-speech · best practices (tags, punctuation, inline IPA, normalization, alias matching) https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices · models (languages, character limits, Flash price and normalization) https://elevenlabs.io/docs/overview/models
- ElevenLabs API: with timestamps (fields, defaults, `seed`, output formats by tier) https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps · request stitching (request IDs, `request-id` and `character-cost` headers, not on v3) https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/request-stitching · pronunciation dictionaries (phoneme-rule models) https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries · OpenAPI (shared-voices filters and fields, ≤ 3 dictionaries, the voice changer's default model, Voice Design models and preview length, the Dialogue default) https://api.elevenlabs.io/openapi.json
- ElevenLabs voices: Voice Library (notice period, credit multipliers, live moderation, free tier) https://elevenlabs.io/docs/eleven-creative/voices/voice-library · voice changer https://elevenlabs.io/docs/overview/capabilities/voice-changer · Voice Design https://elevenlabs.io/docs/eleven-creative/voices/voice-design · cloning https://elevenlabs.io/docs/eleven-creative/voices/voice-cloning/instant-voice-cloning · Text to Dialogue https://elevenlabs.io/docs/overview/capabilities/text-to-dialogue
- ElevenLabs commercial use and Beta services: https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform
- Microsoft localization style guides (address forms): https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides
- Pellegrino, Coupé & Marsico 2011 (read-speech rates, Table 1): https://www.livinglanguage.com/fulltext/pellegrino/Pellegrino_to%20appear_Language.pdf

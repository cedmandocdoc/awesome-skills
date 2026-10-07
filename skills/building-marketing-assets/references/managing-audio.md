# Managing Audio

## Overview

Sound for videos, in order: the music track first, its beat grid second, motion on the grid, then sound effects on the hits and a final loudness pass. The user adds the music; the agent fetches the sound effects.

## Guidelines

### Music search

Pick genre, mood, and tempo from the concept and the picked direction, then give 2–3 Pixabay searches as `https://pixabay.com/music/search/<terms>/` (spaces as `%20`).

| Direction or mood | Pixabay terms | BPM |
| --- | --- | --- |
| Product hero, confident | `corporate upbeat`, `tech minimal` | 100–125 |
| Kinetic type, energetic | `hip hop beat`, `electronic punchy` | 115–140 |
| Editorial, calm premium | `ambient piano`, `minimal cinematic` | 70–95 |
| Data punch | `electronic pulse`, `percussion build` | 110–130 |
| Playful | `quirky ukulele`, `happy pop` | 110–130 |
| Testimonial, warm | `acoustic warm`, `lofi chill` | 80–100 |

Tell the user:

- Pick a track at least as long as the video plus 2 s, and skip tracks marked as registered with Content ID.
- Download it (MP3 as Pixabay gives it, or WAV), save it to `<asset>/project/audio/`, and paste the track's page URL.
- Their own track works the same way; "no music" gives a video with sound effects only.

### Track intake

1. Any of MP3, WAV, M4A, AAC, OGG, FLAC: `ffmpeg -i <file> -ar 48000 -ac 2 <asset>/project/audio/music.wav`.
2. Length: `ffprobe -v error -show_entries format=duration -of csv=p=0 <file>`. Shorter than the video → offer a shorter cut or another track.
3. Record under **Track**: title, artist, page URL, license (Pixabay Content License, or the user's statement for their own track), download date.
4. Add it to the composition: `<audio id="music" data-timeline-role="music" data-start="0" data-duration="<s>" src="audio/music.wav">`.

### Beats

1. `npx hyperframes beats <asset>/project --json` writes `beats/audio/music.wav.json` (`time`, `strength` 0–1).
2. Shift `data-media-start` so a strong beat (strength ≥ 0.7) lands within the first 0.5 s, under the hook.
3. Cuts and major entrances go on strong beats; a calm track cuts on phrases instead of every beat.
4. End on a phrase end; fade the music over the last 0.5–1 s.

### Sound effects

| Cue | Use on |
| --- | --- |
| `whoosh` | Camera moves, transitions (start ~0.1 s early) |
| `click`, `tap` | UI taps |
| `pop` | Cards and stickers appearing |
| `riser` | The second before a reveal |
| `impact` | Big type or a number landing |
| `typing` | Text being entered |
| `ding` | Success states |

1. Without `FREESOUND_TOKEN`, skip sound effects and say so.
2. Search CC0 only: `curl -s "https://freesound.org/apiv2/search/text/?query=<cue>&filter=license:%22Creative%20Commons%200%22%20duration:%5B0%20TO%203%5D&sort=rating_desc&fields=id,name,username,url,previews&token=$FREESOUND_TOKEN"`.
3. Download the top result's `previews["preview-hq-mp3"]` to `<asset>/project/audio/sfx/<cue>-<id>.mp3`; list its id and URL under **Track**.
4. One `<audio>` per hit at the motion's time. At most one effect per 1–2 s; the same cue keeps the same sound throughout.

### Mix

1. Set `data-volume` so the music sits under the effects and any voice; effects peak above the music.
2. After rendering, normalize to −14 LUFS: `ffmpeg -i <render>.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 <render>.tmp.mp4`, then replace the render.
3. Verify: `ffmpeg -i <render>.mp4 -af ebur128 -f null - 2>&1 | grep " I:"` reads −14 ± 1 LUFS.

## References

- Pixabay Content License: https://pixabay.com/service/license-summary/
- Freesound API: https://freesound.org/docs/api/
- HyperFrames `beats`: https://hyperframes.heygen.com/packages/cli.md

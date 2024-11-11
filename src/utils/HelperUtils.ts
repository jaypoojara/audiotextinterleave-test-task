import {Transcript, TranscriptResult} from 'types';

export const convertTranscriptToArray = (
  transcript: Transcript,
): TranscriptResult[] => {
  const result = [];
  let currentTime = 0;
  const phrasesCount = Math.max(
    transcript.speakers[0].phrases.length,
    transcript.speakers[1].phrases.length,
  );

  for (let i = 0; i < phrasesCount; i++) {
    for (const speaker of transcript.speakers) {
      const phrase = speaker.phrases[i];
      if (!phrase) {
        continue;
      }

      const startTime = currentTime;
      const endTime = startTime + phrase.time;

      result.push({
        name: speaker.name,
        words: phrase.words,
        time: phrase.time,
        startTime,
        endTime,
      });

      currentTime = endTime + transcript.pause;
    }
  }

  return result;
};

export const getActivePhraseIndex = (
  transcriptArray: TranscriptResult[],
  currentTime: number,
): number | undefined => {
  for (let i = 0; i < transcriptArray.length; i++) {
    const phrase = transcriptArray[i];

    if (currentTime >= phrase.startTime && currentTime < phrase.endTime) {
      return i;
    }

    const nextPhrase = transcriptArray[i + 1];
    if (
      nextPhrase &&
      currentTime >= phrase.endTime &&
      currentTime < nextPhrase.startTime
    ) {
      return i + 1;
    }
  }

  return undefined;
};

export const formatTime = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};

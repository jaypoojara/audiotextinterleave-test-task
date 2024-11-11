import colors from '@theme/colors';
import audioPlayerManager from '@utils/AudioManager';
import {
  convertTranscriptToArray,
  getActivePhraseIndex,
} from '@utils/HelperUtils';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {FlatList} from 'react-native-reanimated/lib/typescript/Animated';
import translate from 'translate';
import {Transcript, TranscriptResult} from 'types';

const transcript: Transcript = {
  pause: 250,
  speakers: [
    {
      name: 'John',
      phrases: [
        {
          words: 'this is one phrase.',
          time: 1474,
        },
        {
          words: 'now the second phrase.',
          time: 1667,
        },
        {
          words: 'end with last phrase.',
          time: 1214,
        },
      ],
    },
    {
      name: 'Jack',
      phrases: [
        {
          words: 'another speaker here.',
          time: 1570,
        },
        {
          words: 'saying her second phrase.',
          time: 1989,
        },
        {
          words: 'and eventually finishing up.',
          time: 1486,
        },
      ],
    },
  ],
};

const GradientColors = [
  colors.gradientStart,
  colors.gradientMiddle,
  colors.gradientEnd,
];

const mp3File = 'https://audio.jukehost.co.uk/KQM8RqRTUC0MhuQlHCfDrWkkUQqzMy3y';

const useHomeScreen = () => {
  const flatListRef = useRef<FlatList<TranscriptResult>>(null);

  const phraseData = useMemo(() => {
    return convertTranscriptToArray(transcript);
  }, []);

  const [currentPhase, setCurrentPhase] = useState<number | undefined>(
    undefined,
  );
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>();
  const playingStatus = useRef<string | undefined>(undefined);

  const [isLoading, setLoading] = useState(true);
  const [phraseDataWithTranslate, setPhraseDataWithTranslate] = useState<
    (TranscriptResult & {translatedWords: string})[]
  >([]);

  const topGradientOpacity = useSharedValue(0);
  const bottomGradientOpacity = useSharedValue(1);
  const progressBarWidth = useSharedValue(0);

  const translateText = useCallback(async (string: string) => {
    return await translate(string, {
      from: 'en',
      to: 'es',
    })
      .then(res => res)
      .catch(err => {
        console.log(err);
        return undefined;
      });
  }, []);

  const getWithTranslate = useCallback(async () => {
    setLoading(true);
    const data = await Promise.all(
      phraseData.map(async item => ({
        ...item,
        translatedWords: (await translateText(item.words)) ?? item.words,
      })),
    );
    setPhraseDataWithTranslate(data);
    setLoading(false);
  }, [phraseData, translateText]);

  useEffect(() => {
    getWithTranslate();
  }, [getWithTranslate]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      const yOffset = event.contentOffset.y;
      topGradientOpacity.value = yOffset > 75 ? withTiming(1) : withTiming(0);
      bottomGradientOpacity.value =
        yOffset < event.contentSize.height - event.layoutMeasurement.height
          ? withTiming(1)
          : withTiming(0);
    },
  });

  const animatedTopGradientStyle = useAnimatedStyle(() => ({
    opacity: topGradientOpacity.value,
  }));

  const animatedBottomGradientStyle = useAnimatedStyle(() => ({
    opacity: bottomGradientOpacity.value,
  }));

  const handlePlayBtn = useCallback(() => {
    switch (playingStatus.current) {
      case audioPlayerManager.AUDIO_STATUS.play:
        playingStatus.current = audioPlayerManager.AUDIO_STATUS.pausePlayer;
        audioPlayerManager.pausePlayer();
        break;

      case audioPlayerManager.AUDIO_STATUS.pausePlayer:
        playingStatus.current = audioPlayerManager.AUDIO_STATUS.play;
        audioPlayerManager.resumePlayer();
        break;

      default:
        audioPlayerManager.startPlayer(mp3File, res => {
          const {status, data} = res;
          playingStatus.current = status;
          if (data?.currentPosition) {
            setCurrentPosition(data.currentPosition);
            data.duration !== undefined && setTotalDuration(data.duration);

            const index = getActivePhraseIndex(
              phraseData,
              data.currentPosition,
            );
            currentPhase !== index && setCurrentPhase(index);
          }
        });

        break;
    }
  }, [currentPhase, phraseData]);

  const handleRewindBtn = useCallback(() => {
    if (
      currentPhase !== undefined &&
      playingStatus.current === audioPlayerManager.AUDIO_STATUS.play
    ) {
      audioPlayerManager.seekToPlayer(phraseData[currentPhase].startTime);
    } else {
      handlePlayBtn();
    }
  }, [currentPhase, handlePlayBtn, phraseData]);

  const handleForwardBtn = useCallback(() => {
    if (
      currentPhase !== undefined &&
      playingStatus.current === audioPlayerManager.AUDIO_STATUS.play
    ) {
      audioPlayerManager.seekToPlayer(phraseData[currentPhase].endTime);
    } else {
      handlePlayBtn();
    }
  }, [currentPhase, handlePlayBtn, phraseData]);

  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value}%`,
  }));

  useEffect(() => {
    if (currentPhase !== undefined) {
      flatListRef.current?.scrollToIndex({
        index: currentPhase,
        animated: true,
        viewPosition: 0.5,
      });
    } else {
      phraseDataWithTranslate.length &&
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
          viewPosition: 0,
        });
    }
  }, [currentPhase, phraseDataWithTranslate.length]);

  useEffect(() => {
    if (totalDuration !== undefined) {
      const progress = (currentPosition / totalDuration) * 100;
      progressBarWidth.value = withTiming(progress, {duration: 150});
    }
  }, [currentPosition, progressBarWidth, totalDuration]);

  return {
    flatListRef,
    currentPhase,
    phraseDataWithTranslate,
    isLoading,
    totalDuration,
    currentPosition,
    GradientColors,
    onScroll,
    animatedTopGradientStyle,
    animatedBottomGradientStyle,
    animatedProgressStyle,
    handlePlayBtn,
    handleRewindBtn,
    handleForwardBtn,
  };
};

export default useHomeScreen;

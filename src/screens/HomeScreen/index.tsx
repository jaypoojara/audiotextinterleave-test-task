import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import translate from 'translate';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Transcript, TranscriptResult} from 'types';
import colors from '@theme/colors';
import {
  convertTranscriptToArray,
  formatTime,
  getActivePhraseIndex,
} from '@utils/HelperUtils';
import audioPlayerManager from '@utils/AudioManager';
import {styles} from './styles';
import FullScreenContainer from '@components/FullScreenContainer';
import {Images} from '@assets/images';

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

const HomeScreen = () => {
  const flatListRef = useRef<FlatList<TranscriptResult>>(null);

  const phraseData = useMemo(() => {
    return convertTranscriptToArray(transcript);
  }, []);

  const [currentPhase, setCurrentPhase] = React.useState<number | undefined>(
    undefined,
  );
  const [currentPosition, setCurrentPosition] = React.useState<number>(0);
  const [totalDuration, setTotalDuration] = React.useState<number>();
  const playingStatus = React.useRef<string | undefined>(undefined);

  const [isLoading, setLoading] = React.useState(true);
  const [phraseDataWithTranslate, setPhraseDataWithTranslate] = React.useState<
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

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: TranscriptResult & {translatedWords: string};
      index: number;
    }) => {
      return (
        <View
          style={[
            styles.cardContainer,
            index === currentPhase && styles.activeCardContainer,
          ]}>
          <View style={styles.cardRow}>
            <View style={styles.languageBadge}>
              <Text style={styles.languageText}>ES</Text>
            </View>
            <Text
              style={[
                styles.primaryText,
                index === currentPhase && styles.activePrimaryText,
              ]}>
              {item.translatedWords}
            </Text>
          </View>
          <View
            style={[
              styles.divider,
              index === currentPhase && styles.activeDivider,
            ]}
          />
          <View style={styles.cardRow}>
            <View style={styles.languageBadge}>
              <Text style={styles.languageText}>EN</Text>
            </View>
            <Text
              style={[
                styles.secondaryText,
                index === currentPhase && styles.activeSecondaryText,
              ]}>
              {item.words}
            </Text>
          </View>
        </View>
      );
    },
    [currentPhase],
  );

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

  return (
    <FullScreenContainer>
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.flagContainer}>
          <Image source={Images.us} style={styles.flagImage} />
          <Image source={Images.spain} style={styles.flagImage} />
        </View>
      </SafeAreaView>
      <Animated.View style={styles.flex1}>
        <Animated.FlatList
          ref={flatListRef}
          contentContainerStyle={styles.flatListContainer}
          data={phraseDataWithTranslate}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          onScroll={onScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {isLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.secondaryText}>Data Not Fond!</Text>
              )}
            </View>
          }
        />
        <Animated.View
          pointerEvents="none"
          style={[styles.gradientTop, animatedTopGradientStyle]}>
          <LinearGradient
            colors={GradientColors}
            style={styles.linearGradient}
          />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.gradientBottom, animatedBottomGradientStyle]}>
          <LinearGradient
            colors={GradientColors}
            style={styles.linearGradient}
          />
        </Animated.View>
      </Animated.View>
      <SafeAreaView style={styles.footerContainer}>
        <View style={styles.progressBarContainer}>
          <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
        </View>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTime(currentPosition)}</Text>
          {totalDuration && (
            <Text style={styles.timerText}>{formatTime(totalDuration)}</Text>
          )}
        </View>
        <View style={styles.controlContainer}>
          <TouchableOpacity onPress={handleRewindBtn}>
            <Image source={Images.rewind} style={styles.controlIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePlayBtn} style={styles.playButton}>
            <Image source={Images.play} style={styles.playIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleForwardBtn}>
            <Image source={Images.fastForward} style={styles.controlIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </FullScreenContainer>
  );
};

export default HomeScreen;

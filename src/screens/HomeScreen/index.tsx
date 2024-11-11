import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback} from 'react';
import LinearGradient from 'react-native-linear-gradient';

import Animated from 'react-native-reanimated';
import {TranscriptResult} from 'types';
import colors from '@theme/colors';
import {formatTime} from '@utils/HelperUtils';
import {styles} from './styles';
import {Images} from '@assets/images';
import useHomeScreen from '@hooks/useHomeScreen';

const HomeScreen = () => {
  const {
    flatListRef,
    currentPhase,
    phraseDataWithTranslate,
    onScroll,
    isLoading,
    GradientColors,
    totalDuration,
    currentPosition,
    animatedTopGradientStyle,
    animatedBottomGradientStyle,
    animatedProgressStyle,
    handlePlayBtn,
    handleRewindBtn,
    handleForwardBtn,
  } = useHomeScreen();

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

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default HomeScreen;

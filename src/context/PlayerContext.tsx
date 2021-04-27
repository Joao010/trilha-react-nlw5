import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string,
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  setPlayingState: (state: boolean) => any;
  play: (episode: Episode) => any;
  playList: (list: Episode[], index: number) => any;
  playNext: () => any;
  playPrevious: () => any;
  togglePlay: () => any;
  toggleLoop: () => any;
  toggleShuffle: () => any;
  clearPlayerState: () => any;
};

type PlayerContextProviderProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export const PlayerContextProvider = ({ children }: PlayerContextProviderProps) => {
  const [ episodeList, setEpisodeList ] = useState([]);
  const [ currentEpisodeIndex, setCurrentEpisodeIndex ] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = (currentEpisodeIndex + 1) < episodeList.length;

  const play = (episode: Episode) => {
    setEpisodeList([ episode ]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  };

  const playNext = () => {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  };

  const playPrevious = () => {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const setPlayingState = (state: boolean) => {
    setIsPlaying(state);
  };

  const clearPlayerState = () => {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  };

  return (
    <PlayerContext.Provider value={{
      episodeList,
      currentEpisodeIndex,
      setPlayingState,
      isPlaying,
      isLooping,
      isShuffling,
      play,
      playList,
      playNext,
      playPrevious,
      hasNext,
      hasPrevious,
      togglePlay,
      toggleLoop,
      toggleShuffle,
      clearPlayerState
    }}>
      { children }
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
};

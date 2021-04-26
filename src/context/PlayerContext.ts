import { createContext } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContext = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  setPlayingState: (state: boolean) => any;
  play: (episode: Episode) => any;
  togglePlay: () => any;
}

export const PlayerContext = createContext({} as PlayerContext);

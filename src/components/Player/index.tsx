import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { usePlayer } from '../../context/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export const Player = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [ progress, setProgress ] = useState(0);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    setPlayingState,
    playNext,
    playPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    clearPlayerState,
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  const setupProgressListener = () => {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  };

  const handleSeek = (amount: number) => {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  const handleEpisodeEnded = () => {
    hasNext
    ? playNext()
    : clearPlayerState();
  };

  useEffect(() => {
    if(!audioRef.current) return;

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  return <div className={styles.playerContainer}>
    <header>
      <img src='/playing.svg' alt='Tocando agora'/>
      <strong>Tocando agora {episode?.title}</strong>
    </header>

    {episode
    ? <div className={styles.currentEpisode}>
        <Image
        width={592}
        height={592}
        src={episode.thumbnail}
        objectFit='cover'
        />

        <strong>
          {episode.title}
        </strong>

        <span>
          {episode.members}
        </span>
      </div>
    : <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
    }

    <footer className={!episode && styles.empty}>
      <div className={styles.progress}>
        <span>
          {convertDurationToTimeString(progress)}
        </span>

        <div className={styles.slider}>
          {episode
          ? <Slider
            max={episode.duration}
            value={progress}
            onChange={handleSeek}
            trackStyle={{ backgroundColor: '#04d361' }}
            railStyle={{ backgroundColor: '#9f75ff'}}
            handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
            />
          : <div className={styles.emptySlider}/>
          }
        </div>

        <span>
          {convertDurationToTimeString(episode?.duration ?? 0)
          /* se episode.duration não existir irá receber 0 como valor padrão */}
        </span>
      </div>

      {episode &&
        <audio
        src={episode.url}
        ref={audioRef}
        loop={isLooping}
        autoPlay
        onPlay={() => setPlayingState(true)}
        onPause={() => setPlayingState(false)}
        onEnded={handleEpisodeEnded}
        onLoadedMetadata={setupProgressListener}
        />
      }

      <div className={styles.buttons}>
        <button
        type='button'
        onClick={toggleShuffle}
        disabled={!episode}
        className={isShuffling && styles.isActive}
        >
          <img src='/shuffle.svg' alt='Embaralhar'/>
        </button>

        <button
        type='button'
        onClick={playPrevious}
        disabled={!episode || !hasPrevious}
        >
          <img src='/play-previous.svg' alt='Tocar anterior'/>
        </button>

        <button
        type='button'
        disabled={!episode}
        className={styles.playerButton}
        onClick={togglePlay}
        >
          {isPlaying
          ? <img src='/pause.svg' alt='Pausar'/>
          : <img src='/play.svg' alt='Tocar'/>
          }
        </button>

        <button
        type='button'
        onClick={playNext}
        disabled={!episode || !hasNext}
        >
          <img src='/play-next.svg' alt='Tocar próxima'/>
        </button>

        <button
        type='button'
        disabled={!episode}
        onClick={toggleLoop}
        className={isLooping && styles.isActive}
        >
          <img src='/repeat.svg' alt='Repetir'/>
        </button>
      </div>
    </footer>
  </div>
};

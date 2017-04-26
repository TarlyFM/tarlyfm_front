import * as React from "react";
import * as ReactDOM from "react-dom";
import styled from 'styled-components';
import ReactAudioPlayer from 'react-audio-player';
import {VolumeSlider, PlayerInfo, PlayerButton} from '../components';

const PlayerDIV = styled.div`
  height: 75px;
  position: fixed;
  bottom: 0px;
  right: 0px;
  left: 0px

  border-top-style: groove;
  border-top-width: 5px;
  border-top-color: #e5e5e5;
  background-color: inherit;
  z-index: 2;
`

interface PlayerProps {

}
interface PlayerState {
  playing: boolean,
  volume: number,
  cachebust: number
}
export class Player extends React.Component<PlayerProps, PlayerState> {
  private HTMLPlayer: ReactAudioPlayer;

  constructor () {
    super();
    this.state = {
      playing: false,
      volume: -1,
      cachebust: new Date().getTime(),
    };
    this.PlayPause = this.PlayPause.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.fadeInVolume = this.fadeInVolume.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
  }

  /* BUTTON */

  PlayPause () {
    if (this.state.playing)
      this.HTMLPlayer.audioEl.pause();
    else
      this.HTMLPlayer.audioEl.play();
  }

  onPlay () {
    this.setState({
      playing: true,
    });
    if (this.state.volume == -1)
      this.fadeInVolume();
  }

  onPause () {
    this.setState({
      playing: false
    });
  }

  /* SLIDER */

  onVolumeChange (value: number) {
    this.setState({
      volume: value
    });
  }

  fadeInVolume () {
    if (this.state.volume < 100) {
      if (this.state.volume == -1)
        this.setState({
          volume: 0
        });
      else
        this.setState({
          volume: this.state.volume + 5
        });
      setTimeout(this.fadeInVolume, 100);
    }
  }

  render () {
    if (this.HTMLPlayer)
      this.HTMLPlayer.audioEl.volume = this.state.volume / 100;
    return <PlayerDIV>
      <PlayerButton onClick={this.PlayPause} playing={this.state.playing}/>
      <PlayerInfo title="En direct" description="Titre d'emission vraiment beaucoup trop archi-super long"/>
      <ReactAudioPlayer
        onPlay={this.onPlay}
        onPause={this.onPause}
        onError={(e) => alert("Error while fetching audio stream...")}
        controls={false}
        autoPlay={true}
        ref={(c) => this.HTMLPlayer = c}
        src={"http://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3?cache-buster=" + this.state.cachebust}
      />
      <VolumeSlider value={this.state.volume} onChange={this.onVolumeChange}/>
    </PlayerDIV>
  }
}
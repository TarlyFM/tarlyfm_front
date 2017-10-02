import React, { Component } from 'react';
import { Icon, Menu, Button, Input, Header} from 'semantic-ui-react';
import ReactAudioPlayer from 'react-audio-player';


const getVolumeIconName = (volume, muted) => {
  if (volume <= 0 || muted)
    return ("volume off");
  else if (volume > 75)
    return ("volume up");
  else
    return ("volume down");
}


const IconButton = (props) => (
  <Button style={{"background": "transparent"}} onClick={props.onClick}>
    <Icon name={props.name} size={props.size}/>
  </Button>
)


const PlayPauseButton = (props) => (
  <IconButton
    name={props.playing ? 'pause': 'play'}
    size='big'
    onClick={props.onClick}
  />
)


const VolumeControl = (props) => (
  <div style={{'position':'absolute', 'top':'0','right':'0', 'marginRight':'20px'}}>
    <IconButton
      onClick={props.onMuteToggle}
      size='big'
      name={getVolumeIconName(props.volume, props.muted)}
    />
    <Input type='range' min='0' max='100'
      value={props.muted ? 0 : props.volume}
      onChange={(event) => props.onChange(event.target.value)}
    />
  </div>
)


const DisplayMetadata = (props) => (
  <inline>
    <Header>Titre</Header>
    Nom de l artiste ou autre...
  </inline>
)


class PlayerPanel extends Component {

  constructor () {
    super();
    this.state = {
      playing: false,
      volume: -1,
      muted: false,
      cachebust: new Date().getTime(),
    };
    this.PlayPause = this.PlayPause.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.fadeInVolume = this.fadeInVolume.bind(this);
    this.onVolumeChange = this.onVolumeChange.bind(this);
    this.onMuteToggle = this.onMuteToggle.bind(this);
    this.updateVolume = this.updateVolume.bind(this);
  }

  updateVolume () {
    if (this.HTMLPlayer) {
      if (this.state.muted)
        this.HTMLPlayer.audioEl.volume = 0;
      else if (this.state.volume >= 0)
        this.HTMLPlayer.audioEl.volume = this.state.volume / 100;
    }
  }

  fadeInVolume () {
    if (this.state.volume < 100) {
      if (this.state.volume === -1)
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
    if (this.state.volume === -1)
      this.fadeInVolume();
  }

  onPause () {
    this.setState({
      playing: false
    });
  }

  onVolumeChange (value: number) {
    this.setState({
      volume: value,
      muted: false,
    });
  }

  onMuteToggle () {
    this.setState({
      muted: !this.state.muted
    });
  }

  render () {
    this.updateVolume();
    return <Menu fixed='top' style={{'height':'60px'}}>
      <ReactAudioPlayer
        onPlay={this.onPlay}
        onPause={this.onPause}
        onError={(e) => alert("Error while fetching audio stream...")}
        controls={false}
        autoPlay={true}
        ref={(c) => this.HTMLPlayer = c}
        src={"http://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3?cache-buster=" + this.state.cachebust}
      />
      <PlayPauseButton
        playing={this.state.playing}
        onClick={this.PlayPause}
      />
      <DisplayMetadata/>
      <VolumeControl
        onChange={this.onVolumeChange}
        onMuteToggle={this.onMuteToggle}
        volume={this.state.volume}
        muted={this.state.muted}
      />
    </Menu>
  }
}

export default PlayerPanel;
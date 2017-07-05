import React, { Component } from 'react';
import PropTypes from 'prop-types';

navigator.getMedia = navigator.getUserMedia;

export function Preview(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);

      this.videoBooted = false;
      this.meterEnabled = false;
      this.state = {
        vuMeter: 0
      };

      this.attachAudioAnalyser = this.attachAudioAnalyser.bind(this);
      this.setupMedia = this.setupMedia.bind(this);
    }

    componentDidMount() {
      this.setupMedia();
    }

    componentWillUpdate(nextProps, nextState) {
      const isSetupNeeded = (!this.meterEnabled && !this.videoBooted);
      const isNewSelectedDevices = (this.props.selectedAudio != nextProps.selectedAudio || this.props.selectedVideo != nextProps.selectedVideo);
      if (isSetupNeeded || isNewSelectedDevices)
        this.setupMedia();
    }

    setupMedia() {
      const {
        audio, options, videoId,
        selectedAudio, selectedVideo
      } = this.props;
      const videoEl = document.getElementById(videoId);
      const streamOptions = {
        audio: audio || false,
        video: true,
        mirrored: true,
        options: (options || {})
      };
      if (selectedAudio) {
        options['audio'] = {};
        options['audio']['optional'] = [{ sourceId: selectedAudio }];
      }
      if (selectedVideo) {
        options['video'] = {};
        options['video']['optional'] = [{ sourceId: selectedVideo }];
      }
      navigator.getMedia(streamOptions,
        stream => {
          if (audio) {
            this.attachAudioAnalyser(stream);
          }
          this.attachVideo(videoEl, stream);
          this.videoBooted = true;
        },
        err => {
          console.error(err)
        }
      );
    }

    attachAudioAnalyser(stream) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      microphone.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);

      javascriptNode.onaudioprocess = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (var i = 0; i < length; i++) {
          values += (array[i]);
        }

        const average = values / length;

        this.setState({ ...this.state, vuMeter: average });
        this.meterEnabled = true;
      }
    }

    attachVideo(element, stream) {
      if (element.srcObject !== undefined) {
        element.srcObject = stream;
      } else if (element.src !== undefined) {
        element.src = URL.createObjectURL(stream);
      } else {
        console.error('Error attaching stream to element.');
      }
    }

    render() {
      return (<WrappedComponent {...this.props} {...this.state} />);
    }
  };
}

Preview.PropTypes = {
  // @required
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  // @optional
  audio: PropTypes.bool,
  selectedAudio: PropTypes.string,
  selectedVideo: PropTypes.string,
  options: PropTypes.object
};


export const Video = props => (
  <video
    id="webcam-preview"
    className={props.className || "video"}
    height={props.height}
    width={props.width}
    autoPlay>
  </video>
);

// @TODO: insert Volume Meter component
export const VideoVUMeter = props => (
  <video
    id="webcam-preview"
    className={props.className || "video"}
    height={props.height}
    width={props.width}
    autoPlay>
  </video>
);

export const VideoPreview = Preview(Video);
export const VideoAudioPreview = Preview(VideoVUMeter);

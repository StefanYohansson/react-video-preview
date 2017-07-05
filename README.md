<p align="center">
  <b>react video preview</b>
  <br><br>
  <img width="45" src="https://raw.githubusercontent.com/StefanYohansson/sz-dotfiles/master/8bheart.png">
</p>

## Installation

**NPM**

```
npm install react-video-preview
```

## Usage

**Without jsx**

```js
ReactDOM.render(
  React.createElement(VideoPreview.VideoPreview, { videoId: 'webcam-preview', audio: true, width: 500, height: 500}, null),
  document.getElementById('root'));
```

**With jsx**
```jsx
ReactDOM.render(
  <VideoPreview videoId="webcam-preview" audio={true} width={500} height={500} />,
  document.getElementById('root')
);
```

## HOC

You can use HOC `Preview` to compose with another component and customize entire video/audio preview.

This is our default video component:

```jsx
export const Video = props => (
  <video
    id="webcam-preview"
    className={props.className || "video"}
    height={props.height}
    width={props.width}
    autoPlay>
  </video>
);

// here our hoc Preview receiving default Video
// you can use your custom video component instead
export const VideoPreview = Preview(Video);
```

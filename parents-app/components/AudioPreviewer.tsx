import { Platform, StyleSheet, View } from 'react-native';
import React from 'react';
import WebView from 'react-native-webview';
import Text from './Text';

const basicNormalHtml = (source: string) => `

    <audio controls key={"${source}"} 
        style="width:100%;padding: 1rem;"
        >
        <source src="${source}" type="audio/ogg">
        <source src="${source}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
`;

const normalHtml = (source: string) => `
<!DOCTYPE html>
<html lang="en">

<style>
* {
    transform: scale(1.5);
    transform-origin: 0 0;
    // width: 100%;
    margin: 0px !important;
    padding: 0px !important;
 }
</style>
<body>
    <audio controls key={"${source}"} 
    style="flex:1 1 auto;min-width:344px"
    >
    // <source src="${source}" type="audio/ogg">
    // <source src="${source}" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
    </body>
    </html>
`;
const customHtml = (source: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; background-color: #f9f9f9; font-family: Arial, sans-serif; }
audio { display: none; }
.controls { display: flex; justify-content: center; align-items: center; }
button { border: none; padding: 10px; margin: 0 10px; border-radius: 50%; background-color: #007bff; color: white; font-size: 16px; cursor: pointer; width: 50px; height: 50px; display: flex; justify-content: center; align-items: center; }
button:active { background-color: #0056b3; }
button:focus { outline: none; }
.slider-container { width: 100%; display: flex; justify-content: center; margin-top: 20px; }
.slider { -webkit-appearance: none; width: 90%; height: 5px; border-radius: 5px; background: #d3d3d3; outline: none; opacity: 0.7; -webkit-transition: .2s; transition: opacity .2s; cursor: pointer; }
.slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 15px; height: 15px; border-radius: 50%; background: #007bff; cursor: pointer; }
.slider::-moz-range-thumb { width: 15px; height: 15px; border-radius: 50%; background: #007bff; cursor: pointer; }
</style>
</head>
<body>
<audio id="audioPlayer">
  <source src="${source}" type="audio/ogg">
  <source src="${source}" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>
<div class="controls">
  <button onclick="play()">&#9658;</button>
  <button onclick="pause()">&#10074;&#10074;</button>
</div>
<div class="slider-container">
  <input type="range" min="0" max="100" value="0" class="slider" id="progressBar" onchange="seekAudio()">
</div>
<script>
var audio = document.getElementById('audioPlayer');
var progressBar = document.getElementById('progressBar');

audio.ontimeupdate = function() { updateProgress(); };

function play() { audio.play(); }
function pause() { audio.pause(); }
function updateProgress() {
  var value = (audio.currentTime / audio.duration) * 100;
  progressBar.value = value;
}
function seekAudio() {
  var seekTime = audio.duration * (progressBar.value / 100);
  audio.currentTime = seekTime;
}
</script>
</body>
</html>
`;


type AudioPreviewerProps = {
    source: string;
    title?: string;
};

export default function AudioPreviewer({ source, title = 'معاينة' }: AudioPreviewerProps) {

    if (Platform.OS !== 'web') {
        return (
            <View className=''>
                <Text className="mb-2" category="h6">
                    {title}
                </Text>
                <View className='w-full'>
                    {/* <WebView
                        key={source} // Use source as key to force re-render when source changes
                        style={styles.container}
                        originWhitelist={['*']}
                        source={{ html: renderedHtml }}
                    /> */}
                    <WebView
                        key={source} // Force re-render when source changes
                        style={styles.container}
                        originWhitelist={['*']}
                        // source={{ html: customHtml(source) }}
                        source={{ html: normalHtml(source) }}
                    />
                </View>
            </View>
        );
    }

    return (
        <View>
            <Text className="mb-2" category="h6">
                {title}
            </Text>
            <div className="w-full px-32">
                {/* Use source as key here as well to force re-render for web */}
                <audio key={source} className="w-full" controls>
                    <source src={source} type="audio/ogg" />
                    <source src={source} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        minHeight: 50,
        width: "100%",
    },
});

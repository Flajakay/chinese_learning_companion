const audioService = {
  playAudio: (text) => {
    const encodedText = encodeURIComponent(text);
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=zh-cn&client=tw-ob`;
    const audio = new Audio(audioUrl);
    audio.play().catch(error => console.error('Audio playback failed:', error));
  }
};

export default audioService;
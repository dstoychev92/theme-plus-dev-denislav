import {AlpineComponent, Alpine as AlpineType, DirectiveData} from 'alpinejs';

type VideoState = 'initial' | 'loading' | 'ready' | 'playing' | 'paused';

type YoutubeVideoComponent = AlpineComponent<{
  videoId: string;
  state: VideoState;
  isLazy: boolean;
  loadRequested: boolean;
  autoplay: boolean;
  loop: boolean;
  loadPlayer(): void;
  initVideo(): void;
  playVideo(): void;
  pauseVideo(): Promise<void>;
  unloadPlayer(): Promise<void>;
  destroyPlayer(): void;
  playerOptions?: any;
}>;

export default function youtubeVideo(Alpine: AlpineType) {
  Alpine.directive('youtube-video', ($el, data) => {
    handleYoutubeVideo($el, data, Alpine);
  }).before('bind');
}

function handleYoutubeVideo($el: HTMLElement, {modifiers, expression}: DirectiveData, Alpine: AlpineType) {
  const isLazy = modifiers.includes('lazy');
  const autoplay = modifiers.includes('autoplay');
  const loop = modifiers.includes('loop');

  if (typeof expression !== 'string') {
    console.warn('Invalid youtube video ID', expression);
    return;
  }

  const videoId = expression;

  Alpine.bind($el, {
    'x-data'(): YoutubeVideoComponent {
      return {
        state: 'initial',
        isLazy,
        loadRequested: false,
        videoId,
        autoplay,
        loop,

        init() {
          if (!this.isLazy) {
            this.loadPlayer();
          }
        },

        destroy() {
          this.destroyPlayer();
        },

        loadPlayer() {
          this.loadRequested = true;
          this.$load
            .script('https://www.youtube.com/iframe_api')
            .then(() => {
              // Initialize videos when the API is ready
              if (window.YT?.loaded) {
                this.$dispatch('theme:youtube:init');
              } else {
                window.onYouTubeIframeAPIReady = () => this.$dispatch('theme:youtube:init');
              }
            })
            .catch((error) => {
              console.error('Failed to load YouTube API:', error);
            });
        },

        initVideo() {
          // theme:youtube:init is a window-wide broadcast, so every player on the page
          // receives it when any one loads the API. Only init players that actually asked
          // to load — otherwise a lazy popup player initializes (and, with autoplay, plays)
          // the moment an unrelated inline video loads the API.
          if (!this.loadRequested) return;

          // Don't initialize the video twice
          if (this.$el._x_youtubePlayer) return;

          // Try to find the iframe or element to attach the player to
          let el = this.$el.querySelector('[data-youtube-player]');

          if (!el) {
            console.warn('No element found for YouTube player');
            return;
          }

          this.state = 'loading';

          try {
            // We store the player on the element as opposed to in alpine state because that will cause
            // it to be wrapped in a proxy and not be able to access the original methods.
            this.$el._x_youtubePlayer = new window.YT.Player(el, {
              videoId: this.videoId,
              playerVars: {
                cc_load_policy: 1,
                iv_load_policy: 3,
                modestbranding: 1,
                autoplay: this.autoplay,
                // YouTube requires `playlist` set to the same videoId in order to loop a single video.
                loop: this.loop ? 1 : 0,
                playlist: this.loop ? this.videoId : undefined,
                playsinline: 1,
                controls: 1,
                showinfo: 0,
                ecver: 2,
                fs: 1,
                rel: 0,
              },
              events: {
                onReady: () => {
                  this.state = 'ready';
                  this.$dispatch('theme:youtube:loaded', {videoId: this.videoId});
                },
                onStateChange: (event: any) => {
                  // Map YT states to our state
                  const YTState = window.YT.PlayerState;
                  switch (event.data) {
                    case YTState.PLAYING:
                      this.state = 'playing';
                      break;
                    case YTState.PAUSED:
                      this.state = 'paused';
                      break;
                    case YTState.ENDED:
                      break;
                    case YTState.BUFFERING:
                      this.state = 'loading';
                      break;
                    case YTState.CUED:
                      this.state = 'ready';
                      break;
                    default:
                      this.state = 'initial';
                  }
                },
                onError: (event: any) => {
                  console.error('YouTube player error:', event.data);
                  this.state = 'initial';
                },
              },
            });
          } catch (error) {
            console.error('Error initializing YouTube player:', error);
            this.state = 'initial';
          }
        },

        playVideo() {
          try {
            if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.playVideo === 'function') {
              this.$el._x_youtubePlayer.playVideo();
            }
          } catch (e) {
            console.warn('Error playing YouTube video:', e);
          }
        },

        async pauseVideo() {
          try {
            if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.pauseVideo === 'function') {
              this.$el._x_youtubePlayer.pauseVideo();
            }
          } catch (e) {
            console.warn('Error pausing YouTube video:', e);
          }
        },

        // Unloads the video to its initial state showing placeholder image
        async unloadPlayer() {
          try {
            if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.cueVideoById === 'function') {
              this.$el._x_youtubePlayer.cueVideoById({videoId: this.videoId});
              this.state = 'ready';
            }
          } catch (e) {
            console.warn('Error unloading YouTube player:', e);
          }
        },

        destroyPlayer() {
          try {
            if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.destroy === 'function') {
              this.$el._x_youtubePlayer.destroy();
              this.$el._x_youtubePlayer = undefined;
              this.state = 'initial';
            }
          } catch (e) {
            console.warn('Error destroying YouTube player:', e);
            // Clean up even if destroy fails
            this.$el._x_youtubePlayer = undefined;
            this.state = 'initial';
          }
        },
      };
    },
    // Wait for any youtube:init from any component to initialize the video
    '@theme:youtube:init.window': 'initVideo',
  });
}

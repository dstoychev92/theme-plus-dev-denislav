import {AlpineComponent, Alpine as AlpineType, DirectiveData} from 'alpinejs';

type VideoState = 'initial' | 'loading' | 'ready' | 'playing' | 'paused';

type VimeoVideoComponent = AlpineComponent<{
  videoId: number;
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
}>;

export default function vimeoVideo(Alpine: AlpineType) {
  Alpine.directive('vimeo-video', ($el, data) => {
    handleVimeoVideo($el, data, Alpine);
  }).before('bind');
}

function handleVimeoVideo($el: HTMLElement, {modifiers, expression}: DirectiveData, Alpine: AlpineType) {
  const isLazy = modifiers.includes('lazy');
  const autoplay = modifiers.includes('autoplay');
  const loop = modifiers.includes('loop');

  if (typeof expression !== 'string') {
    console.warn('Invalid vimeo video ID', expression);
    return;
  }

  const videoId = Number(expression);

  if (isNaN(videoId)) {
    console.warn('Invalid vimeo video ID', expression);
    return;
  }

  Alpine.bind($el, {
    'x-data'(): VimeoVideoComponent {
      return {
        state: 'initial',
        isLazy,
        loadRequested: false,
        autoplay,
        loop,
        videoId,

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
            .script('https://player.vimeo.com/api/player.js')
            .then(() => {
              this.$dispatch('theme:vimeo:init');
            })
            .catch((error) => {
              console.error('Failed to load Vimeo API:', error);
            });
        },
        initVideo() {
          // theme:vimeo:init is a window-wide broadcast, so every player on the page
          // receives it when any one loads the API. Only init players that actually asked
          // to load — otherwise a lazy popup player initializes (and, with autoplay, plays)
          // the moment an unrelated inline video loads the API.
          if (!this.loadRequested) return;

          // Don't initialize the video twice
          if (this.$el._x_vimeoPlayer) return;

          // Try to find the iframe or element to attach the player to
          let el = this.$el.querySelector('[data-vimeo-player]');

          if (!el) {
            console.warn('No element found for Vimeo player');
            return;
          }

          if (!window.Vimeo) return;

          this.state = 'loading';

          try {
            // We store the player on the element as opposed to in alpine state because that will cause
            // it to be wrapped in a proxy and not be able to access the original methods.
            this.$el._x_vimeoPlayer = new window.Vimeo.Player(el, {
              id: this.videoId,
              autoplay: this.autoplay,
              loop: this.loop,
              controls: true,
              muted: false,
              playsinline: true,
            });

            const events = ['play', 'pause', 'ended', 'loaded'];
            events.forEach((event) => {
              this.$el._x_vimeoPlayer?.on(event, () => {
                switch (event) {
                  case 'play':
                    this.state = 'playing';
                    break;
                  case 'pause':
                    this.state = 'paused';
                    break;
                  case 'loaded':
                    this.state = 'ready';
                    break;
                  default:
                    this.state = event as any;
                    break;
                }
              });
            });

            this.$dispatch('theme:vimeo:loaded', {videoId: this.videoId});
          } catch (error) {
            console.error('Error initializing Vimeo player:', error);
            this.state = 'initial';
          }
        },
        playVideo() {
          if (this.$el._x_vimeoPlayer?.play) {
            // Only play if the video is paused
            this.$el._x_vimeoPlayer
              .getPaused()
              .then((paused: boolean) => {
                if (paused) {
                  this.$el._x_vimeoPlayer?.play().catch((error) => {
                    console.error('Error playing Vimeo video:', error);
                  });
                }
              })
              .catch((error) => {
                console.error('Error checking Vimeo player state:', error);
              });
          }
        },
        async pauseVideo() {
          try {
            const paused = await this.$el._x_vimeoPlayer?.getPaused();
            if (!paused && this.$el._x_vimeoPlayer?.pause) {
              await this.$el._x_vimeoPlayer.pause();
            }
          } catch (error) {
            console.error('Error pausing Vimeo video:', error);
          }
        },
        // Unloads the video to its initial state showing placeholder image
        async unloadPlayer() {
          try {
            await this.pauseVideo();
            await this.$el._x_vimeoPlayer?.setCurrentTime(0);
            await this.$el._x_vimeoPlayer?.unload();
            this.state = 'ready';
          } catch (error) {
            console.error('Error unloading Vimeo player:', error);
          }
        },
        destroyPlayer() {
          try {
            if (this.$el._x_vimeoPlayer?.destroy) {
              this.$el._x_vimeoPlayer.destroy().catch((error) => {
                console.error('Error destroying Vimeo player:', error);
              });
            }
          } catch (e) {
            console.warn('Error destroying Vimeo player:', e);
          } finally {
            // Clean up even if destroy fails
            this.$el._x_vimeoPlayer = undefined;
            this.state = 'initial';
          }
        },
      };
    },
    // Wait for any theme:vimeo:init from any component to initialize the video
    '@theme:vimeo:init.window': 'initVideo',
  });
}

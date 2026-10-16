import {AlpineComponent, Alpine as AlpineType, Bindings, DirectiveData} from 'alpinejs';

type VideoState = 'initial' | 'playing' | 'paused' | null;

type VideoComponentData = {
  __video_video: HTMLVideoElement | null;
  __video_state: VideoState;
  __video_autoplay: boolean;
  __video_isInView: boolean;
  __video_hasIntersected: boolean;
  __video_shouldRenderVideo: boolean;
  get __video_id(): string;
  get __video_hidePosterImage(): boolean;
  get __video_showPlayButton(): boolean;
  __video_initVideo(): void;
  __video_playVideo(): void;
  __video_pauseVideo(): void;
  __video_muteVideo(): void;
  __video_unmuteVideo(): void;
  __video_unloadPlayer(): void;
  __video_catchPlayEvent(event: CustomEvent<string | string[]>): void;
  __video_catchPauseEvent(event: CustomEvent<string | string[]>): void;
  __video_catchMuteEvent(event: CustomEvent<string | string[]>): void;
  __video_catchUnmuteEvent(event: CustomEvent<string | string[]>): void;
  __video_handlePlayButtonClick(): void;
};

type VideoComponent = AlpineComponent<VideoComponentData>;

type VideoMagic = {
  id: string;
  state: VideoState;
  hidePosterImage: boolean;
  showPlayButton: boolean;
  shouldRenderVideo: boolean;
  handleIntersect(): void;
  handleEnter(): void;
  handleLeave(): void;
  playVideo(): void;
  pauseVideo(): void;
  muteVideo(): void;
  unmuteVideo(): void;
  unloadPlayer(): void;
  handlePlayButtonClick(): void;
};

declare module 'alpinejs' {
  interface Magics<T> {
    $video: VideoMagic;
  }
}

/**
 * Lazy playback for a <video> inside the component. The root does not render the video
 * itself — gate the <video> with `<template x-if="$video.shouldRenderVideo">` and wire the
 * viewport triggers with x-intersect calling the $video handlers (see snippets/core-video.liquid).
 * With `.autoplay` the video renders on first intersect, plays while in view, and pauses when
 * it leaves; without it a play button shows first and the video renders on click.
 *
 * Directives:
 *  - x-video: The root. Finds the <video> element inside itself once rendered
 *  - x-video.autoplay: Renders the video on first intersect and plays it while in view
 *
 * Magic ($video):
 *  - id: the <video> element's id
 *  - state: 'initial' | 'playing' | 'paused', or null before the video renders
 *  - shouldRenderVideo: true when the <video> should be in the DOM
 *  - hidePosterImage: true once playback started, so the poster can be hidden
 *  - showPlayButton: true while a click-to-play video has not been requested
 *  - handleIntersect() / handleEnter() / handleLeave(): viewport triggers, bind with x-intersect
 *  - playVideo() / pauseVideo() / muteVideo() / unmuteVideo() / unloadPlayer()
 *  - handlePlayButtonClick(): requests render and playback of a click-to-play video
 *
 * Events: the component dispatches theme:video:init / playing / paused / muted / unmuted with
 * the video id as detail. It listens on window for theme:video:play / pause / mute / unmute
 * whose detail is a video id or an array of ids, so other components can drive playback.
 */
export default function video(Alpine: AlpineType) {
  Alpine.directive('video', ($el, data: DirectiveData) => {
    if (data.value === null) {
      handleRoot($el, data, Alpine);
    } else {
      throw new Error(`Unknown directive: x-video:${data.value}`);
    }
  }).before('bind');

  Alpine.magic('video', ($el) => {
    const $data = Alpine.$data($el) as VideoComponentData;

    return {
      get id() {
        return $data.__video_id;
      },
      get state() {
        return $data.__video_state;
      },
      get hidePosterImage() {
        return $data.__video_hidePosterImage;
      },
      get showPlayButton() {
        return $data.__video_showPlayButton;
      },
      get shouldRenderVideo() {
        return $data.__video_hasIntersected && $data.__video_shouldRenderVideo;
      },
      handleIntersect() {
        $data.__video_hasIntersected = true;
      },
      handleEnter() {
        $data.__video_isInView = true;
      },
      handleLeave() {
        $data.__video_isInView = false;
      },
      playVideo() {
        $data.__video_playVideo();
      },
      pauseVideo() {
        $data.__video_pauseVideo();
      },
      muteVideo() {
        $data.__video_muteVideo();
      },
      unmuteVideo() {
        $data.__video_unmuteVideo();
      },
      unloadPlayer() {
        $data.__video_unloadPlayer();
      },
      handlePlayButtonClick() {
        $data.__video_handlePlayButtonClick();
      },
    };
  });
}

function handleRoot($el: HTMLElement, {modifiers}: DirectiveData, Alpine: AlpineType) {
  const autoplay = modifiers.includes('autoplay');

  // Alpine's Bindings type declares every value as `() => unknown`, but at runtime
  // `@event` handlers are called with the event. Assert at the boundary so the
  // handler bodies below keep their real `this` and parameter types.
  Alpine.bind($el, {
    'x-data'(): VideoComponent {
      return {
        __video_video: null,
        __video_state: null,
        __video_autoplay: autoplay,
        __video_isInView: false,
        __video_hasIntersected: false,
        __video_shouldRenderVideo: autoplay,

        get __video_id() {
          return this.__video_video?.id || '';
        },

        get __video_hidePosterImage() {
          return this.__video_state != null && this.__video_state !== 'initial';
        },

        get __video_showPlayButton() {
          return !this.__video_autoplay && !this.__video_shouldRenderVideo;
        },

        init() {
          if (this.__video_hasIntersected && this.__video_shouldRenderVideo) this.__video_initVideo();

          this.$watch('__video_isInView', (isInView: boolean) => {
            if (isInView) {
              if (this.__video_video && this.__video_autoplay) {
                this.__video_playVideo();
              } else if (!this.__video_video && this.__video_shouldRenderVideo) {
                this.__video_initVideo();
              }
            } else if (this.__video_video) {
              this.__video_pauseVideo();
            }
          });

          this.$watch('__video_shouldRenderVideo', (shouldRender: boolean) => {
            if (shouldRender && this.__video_hasIntersected) {
              this.__video_initVideo();
            }
          });
        },

        __video_initVideo() {
          if (this.__video_video) return;

          this.$nextTick(() => {
            // $refs.video leaks across x-video components when <template x-if> is involved,
            // so scope the lookup to this component's own DOM tree instead
            this.__video_video = this.$el.querySelector('video');
            if (!this.__video_video) return;

            this.$dispatch('theme:video:init', this.__video_id);

            if (this.__video_autoplay || this.__video_shouldRenderVideo) {
              this.__video_playVideo();
            }

            this.__video_video.onpause = () => {
              this.__video_state = 'paused';
              this.$dispatch('theme:video:paused', this.__video_id);
            };

            this.__video_video.onplay = () => {
              this.__video_state = 'playing';
              this.$nextTick(() => {
                this.$dispatch('theme:video:playing', this.__video_id);
              });
            };

            this.__video_video.onvolumechange = () => {
              if (this.__video_video?.muted) {
                this.$dispatch('theme:video:muted', this.__video_id);
              } else {
                this.$dispatch('theme:video:unmuted', this.__video_id);
              }
            };
          });
        },

        __video_playVideo() {
          if (!this.__video_video || !this.__video_video.paused) return;
          this.__video_video.play();
        },

        __video_pauseVideo() {
          if (!this.__video_video || this.__video_video.paused) return;
          this.__video_video.pause();
        },

        __video_muteVideo() {
          if (!this.__video_video) return;
          this.__video_video.muted = true;
        },

        __video_unmuteVideo() {
          if (!this.__video_video) return;
          this.__video_video.muted = false;
        },

        __video_unloadPlayer() {
          if (!this.__video_video) return;
          this.__video_pauseVideo();
          this.__video_state = 'initial';
          this.__video_video.load();
        },

        __video_catchPlayEvent(event) {
          if (event.detail.includes(this.__video_id)) this.__video_playVideo();
        },

        __video_catchPauseEvent(event) {
          if (event.detail.includes(this.__video_id)) this.__video_pauseVideo();
        },

        __video_catchMuteEvent(event) {
          if (event.detail.includes(this.__video_id)) this.__video_muteVideo();
        },

        __video_catchUnmuteEvent(event) {
          if (event.detail.includes(this.__video_id)) this.__video_unmuteVideo();
        },

        __video_handlePlayButtonClick() {
          this.__video_shouldRenderVideo = true;
        },
      };
    },
    '@theme:video:play.window'(this: VideoComponent, event: CustomEvent<string | string[]>) {
      this.__video_catchPlayEvent(event);
    },
    '@theme:video:pause.window'(this: VideoComponent, event: CustomEvent<string | string[]>) {
      this.__video_catchPauseEvent(event);
    },
    '@theme:video:mute.window'(this: VideoComponent, event: CustomEvent<string | string[]>) {
      this.__video_catchMuteEvent(event);
    },
    '@theme:video:unmute.window'(this: VideoComponent, event: CustomEvent<string | string[]>) {
      this.__video_catchUnmuteEvent(event);
    },
  } as unknown as Bindings);
}

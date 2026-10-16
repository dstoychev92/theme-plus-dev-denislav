
/*
* @license
* ANALOG Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/

import Alpine from "alpinejs";

//#region \0rollup-plugin-inject-process-env
(function() {
	const env = {};
	try {
		if (process) {
			process.env = Object.assign({}, process.env);
			Object.assign(process.env, env);
			return;
		}
	} catch (e) {}
	globalThis.process = { env };
})();

//#endregion
//#region src/js/plugins/youtube-video.ts
function youtubeVideo(Alpine) {
	Alpine.directive("youtube-video", ($el, data) => {
		handleYoutubeVideo($el, data, Alpine);
	}).before("bind");
}
function handleYoutubeVideo($el, { modifiers, expression }, Alpine) {
	const isLazy = modifiers.includes("lazy");
	const autoplay = modifiers.includes("autoplay");
	const loop = modifiers.includes("loop");
	if (typeof expression !== "string") {
		console.warn("Invalid youtube video ID", expression);
		return;
	}
	const videoId = expression;
	Alpine.bind($el, {
		"x-data"() {
			return {
				state: "initial",
				isLazy,
				loadRequested: false,
				videoId,
				autoplay,
				loop,
				init() {
					if (!this.isLazy) this.loadPlayer();
				},
				destroy() {
					this.destroyPlayer();
				},
				loadPlayer() {
					this.loadRequested = true;
					this.$load.script("https://www.youtube.com/iframe_api").then(() => {
						if (window.YT?.loaded) this.$dispatch("theme:youtube:init");
						else window.onYouTubeIframeAPIReady = () => this.$dispatch("theme:youtube:init");
					}).catch((error) => {
						console.error("Failed to load YouTube API:", error);
					});
				},
				initVideo() {
					if (!this.loadRequested) return;
					if (this.$el._x_youtubePlayer) return;
					let el = this.$el.querySelector("[data-youtube-player]");
					if (!el) {
						console.warn("No element found for YouTube player");
						return;
					}
					this.state = "loading";
					try {
						this.$el._x_youtubePlayer = new window.YT.Player(el, {
							videoId: this.videoId,
							playerVars: {
								cc_load_policy: 1,
								iv_load_policy: 3,
								modestbranding: 1,
								autoplay: this.autoplay,
								loop: this.loop ? 1 : 0,
								playlist: this.loop ? this.videoId : void 0,
								playsinline: 1,
								controls: 1,
								showinfo: 0,
								ecver: 2,
								fs: 1,
								rel: 0
							},
							events: {
								onReady: () => {
									this.state = "ready";
									this.$dispatch("theme:youtube:loaded", { videoId: this.videoId });
								},
								onStateChange: (event) => {
									const YTState = window.YT.PlayerState;
									switch (event.data) {
										case YTState.PLAYING:
											this.state = "playing";
											break;
										case YTState.PAUSED:
											this.state = "paused";
											break;
										case YTState.ENDED: break;
										case YTState.BUFFERING:
											this.state = "loading";
											break;
										case YTState.CUED:
											this.state = "ready";
											break;
										default: this.state = "initial";
									}
								},
								onError: (event) => {
									console.error("YouTube player error:", event.data);
									this.state = "initial";
								}
							}
						});
					} catch (error) {
						console.error("Error initializing YouTube player:", error);
						this.state = "initial";
					}
				},
				playVideo() {
					try {
						if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.playVideo === "function") this.$el._x_youtubePlayer.playVideo();
					} catch (e) {
						console.warn("Error playing YouTube video:", e);
					}
				},
				async pauseVideo() {
					try {
						if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.pauseVideo === "function") this.$el._x_youtubePlayer.pauseVideo();
					} catch (e) {
						console.warn("Error pausing YouTube video:", e);
					}
				},
				async unloadPlayer() {
					try {
						if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.cueVideoById === "function") {
							this.$el._x_youtubePlayer.cueVideoById({ videoId: this.videoId });
							this.state = "ready";
						}
					} catch (e) {
						console.warn("Error unloading YouTube player:", e);
					}
				},
				destroyPlayer() {
					try {
						if (this.$el._x_youtubePlayer && typeof this.$el._x_youtubePlayer.destroy === "function") {
							this.$el._x_youtubePlayer.destroy();
							this.$el._x_youtubePlayer = void 0;
							this.state = "initial";
						}
					} catch (e) {
						console.warn("Error destroying YouTube player:", e);
						this.$el._x_youtubePlayer = void 0;
						this.state = "initial";
					}
				}
			};
		},
		"@theme:youtube:init.window": "initVideo"
	});
}

//#endregion
//#region src/js/theme.youtube-video.ts
Alpine.plugin(youtubeVideo);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUueW91dHViZS12aWRlby5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi9zcmMvanMvcGx1Z2lucy95b3V0dWJlLXZpZGVvLnRzIiwiLi4vc3JjL2pzL3RoZW1lLnlvdXR1YmUtdmlkZW8udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBbHBpbmVDb21wb25lbnQsIEFscGluZSBhcyBBbHBpbmVUeXBlLCBEaXJlY3RpdmVEYXRhfSBmcm9tICdhbHBpbmVqcyc7XG5cbnR5cGUgVmlkZW9TdGF0ZSA9ICdpbml0aWFsJyB8ICdsb2FkaW5nJyB8ICdyZWFkeScgfCAncGxheWluZycgfCAncGF1c2VkJztcblxudHlwZSBZb3V0dWJlVmlkZW9Db21wb25lbnQgPSBBbHBpbmVDb21wb25lbnQ8e1xuICB2aWRlb0lkOiBzdHJpbmc7XG4gIHN0YXRlOiBWaWRlb1N0YXRlO1xuICBpc0xhenk6IGJvb2xlYW47XG4gIGxvYWRSZXF1ZXN0ZWQ6IGJvb2xlYW47XG4gIGF1dG9wbGF5OiBib29sZWFuO1xuICBsb29wOiBib29sZWFuO1xuICBsb2FkUGxheWVyKCk6IHZvaWQ7XG4gIGluaXRWaWRlbygpOiB2b2lkO1xuICBwbGF5VmlkZW8oKTogdm9pZDtcbiAgcGF1c2VWaWRlbygpOiBQcm9taXNlPHZvaWQ+O1xuICB1bmxvYWRQbGF5ZXIoKTogUHJvbWlzZTx2b2lkPjtcbiAgZGVzdHJveVBsYXllcigpOiB2b2lkO1xuICBwbGF5ZXJPcHRpb25zPzogYW55O1xufT47XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHlvdXR1YmVWaWRlbyhBbHBpbmU6IEFscGluZVR5cGUpIHtcbiAgQWxwaW5lLmRpcmVjdGl2ZSgneW91dHViZS12aWRlbycsICgkZWwsIGRhdGEpID0+IHtcbiAgICBoYW5kbGVZb3V0dWJlVmlkZW8oJGVsLCBkYXRhLCBBbHBpbmUpO1xuICB9KS5iZWZvcmUoJ2JpbmQnKTtcbn1cblxuZnVuY3Rpb24gaGFuZGxlWW91dHViZVZpZGVvKCRlbDogSFRNTEVsZW1lbnQsIHttb2RpZmllcnMsIGV4cHJlc3Npb259OiBEaXJlY3RpdmVEYXRhLCBBbHBpbmU6IEFscGluZVR5cGUpIHtcbiAgY29uc3QgaXNMYXp5ID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdsYXp5Jyk7XG4gIGNvbnN0IGF1dG9wbGF5ID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdhdXRvcGxheScpO1xuICBjb25zdCBsb29wID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdsb29wJyk7XG5cbiAgaWYgKHR5cGVvZiBleHByZXNzaW9uICE9PSAnc3RyaW5nJykge1xuICAgIGNvbnNvbGUud2FybignSW52YWxpZCB5b3V0dWJlIHZpZGVvIElEJywgZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlkZW9JZCA9IGV4cHJlc3Npb247XG5cbiAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgJ3gtZGF0YScoKTogWW91dHViZVZpZGVvQ29tcG9uZW50IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXRlOiAnaW5pdGlhbCcsXG4gICAgICAgIGlzTGF6eSxcbiAgICAgICAgbG9hZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIHZpZGVvSWQsXG4gICAgICAgIGF1dG9wbGF5LFxuICAgICAgICBsb29wLFxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzTGF6eSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkUGxheWVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgdGhpcy5kZXN0cm95UGxheWVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZFBsYXllcigpIHtcbiAgICAgICAgICB0aGlzLmxvYWRSZXF1ZXN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuJGxvYWRcbiAgICAgICAgICAgIC5zY3JpcHQoJ2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tL2lmcmFtZV9hcGknKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAvLyBJbml0aWFsaXplIHZpZGVvcyB3aGVuIHRoZSBBUEkgaXMgcmVhZHlcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5ZVD8ubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kZGlzcGF0Y2goJ3RoZW1lOnlvdXR1YmU6aW5pdCcpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5vbllvdVR1YmVJZnJhbWVBUElSZWFkeSA9ICgpID0+IHRoaXMuJGRpc3BhdGNoKCd0aGVtZTp5b3V0dWJlOmluaXQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgWW91VHViZSBBUEk6JywgZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdFZpZGVvKCkge1xuICAgICAgICAgIC8vIHRoZW1lOnlvdXR1YmU6aW5pdCBpcyBhIHdpbmRvdy13aWRlIGJyb2FkY2FzdCwgc28gZXZlcnkgcGxheWVyIG9uIHRoZSBwYWdlXG4gICAgICAgICAgLy8gcmVjZWl2ZXMgaXQgd2hlbiBhbnkgb25lIGxvYWRzIHRoZSBBUEkuIE9ubHkgaW5pdCBwbGF5ZXJzIHRoYXQgYWN0dWFsbHkgYXNrZWRcbiAgICAgICAgICAvLyB0byBsb2FkIOKAlCBvdGhlcndpc2UgYSBsYXp5IHBvcHVwIHBsYXllciBpbml0aWFsaXplcyAoYW5kLCB3aXRoIGF1dG9wbGF5LCBwbGF5cylcbiAgICAgICAgICAvLyB0aGUgbW9tZW50IGFuIHVucmVsYXRlZCBpbmxpbmUgdmlkZW8gbG9hZHMgdGhlIEFQSS5cbiAgICAgICAgICBpZiAoIXRoaXMubG9hZFJlcXVlc3RlZCkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gRG9uJ3QgaW5pdGlhbGl6ZSB0aGUgdmlkZW8gdHdpY2VcbiAgICAgICAgICBpZiAodGhpcy4kZWwuX3hfeW91dHViZVBsYXllcikgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gVHJ5IHRvIGZpbmQgdGhlIGlmcmFtZSBvciBlbGVtZW50IHRvIGF0dGFjaCB0aGUgcGxheWVyIHRvXG4gICAgICAgICAgbGV0IGVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignW2RhdGEteW91dHViZS1wbGF5ZXJdJyk7XG5cbiAgICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIGVsZW1lbnQgZm91bmQgZm9yIFlvdVR1YmUgcGxheWVyJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5zdGF0ZSA9ICdsb2FkaW5nJztcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXZSBzdG9yZSB0aGUgcGxheWVyIG9uIHRoZSBlbGVtZW50IGFzIG9wcG9zZWQgdG8gaW4gYWxwaW5lIHN0YXRlIGJlY2F1c2UgdGhhdCB3aWxsIGNhdXNlXG4gICAgICAgICAgICAvLyBpdCB0byBiZSB3cmFwcGVkIGluIGEgcHJveHkgYW5kIG5vdCBiZSBhYmxlIHRvIGFjY2VzcyB0aGUgb3JpZ2luYWwgbWV0aG9kcy5cbiAgICAgICAgICAgIHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIgPSBuZXcgd2luZG93LllULlBsYXllcihlbCwge1xuICAgICAgICAgICAgICB2aWRlb0lkOiB0aGlzLnZpZGVvSWQsXG4gICAgICAgICAgICAgIHBsYXllclZhcnM6IHtcbiAgICAgICAgICAgICAgICBjY19sb2FkX3BvbGljeTogMSxcbiAgICAgICAgICAgICAgICBpdl9sb2FkX3BvbGljeTogMyxcbiAgICAgICAgICAgICAgICBtb2Rlc3RicmFuZGluZzogMSxcbiAgICAgICAgICAgICAgICBhdXRvcGxheTogdGhpcy5hdXRvcGxheSxcbiAgICAgICAgICAgICAgICAvLyBZb3VUdWJlIHJlcXVpcmVzIGBwbGF5bGlzdGAgc2V0IHRvIHRoZSBzYW1lIHZpZGVvSWQgaW4gb3JkZXIgdG8gbG9vcCBhIHNpbmdsZSB2aWRlby5cbiAgICAgICAgICAgICAgICBsb29wOiB0aGlzLmxvb3AgPyAxIDogMCxcbiAgICAgICAgICAgICAgICBwbGF5bGlzdDogdGhpcy5sb29wID8gdGhpcy52aWRlb0lkIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIHBsYXlzaW5saW5lOiAxLFxuICAgICAgICAgICAgICAgIGNvbnRyb2xzOiAxLFxuICAgICAgICAgICAgICAgIHNob3dpbmZvOiAwLFxuICAgICAgICAgICAgICAgIGVjdmVyOiAyLFxuICAgICAgICAgICAgICAgIGZzOiAxLFxuICAgICAgICAgICAgICAgIHJlbDogMCxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICAgICAgb25SZWFkeTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdyZWFkeSc7XG4gICAgICAgICAgICAgICAgICB0aGlzLiRkaXNwYXRjaCgndGhlbWU6eW91dHViZTpsb2FkZWQnLCB7dmlkZW9JZDogdGhpcy52aWRlb0lkfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvblN0YXRlQ2hhbmdlOiAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgLy8gTWFwIFlUIHN0YXRlcyB0byBvdXIgc3RhdGVcbiAgICAgICAgICAgICAgICAgIGNvbnN0IFlUU3RhdGUgPSB3aW5kb3cuWVQuUGxheWVyU3RhdGU7XG4gICAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVFN0YXRlLlBMQVlJTkc6XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdwbGF5aW5nJztcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVFN0YXRlLlBBVVNFRDpcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgWVRTdGF0ZS5FTkRFRDpcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVFN0YXRlLkJVRkZFUklORzpcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2xvYWRpbmcnO1xuICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFlUU3RhdGUuQ1VFRDpcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3JlYWR5JztcbiAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25FcnJvcjogKGV2ZW50OiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1lvdVR1YmUgcGxheWVyIGVycm9yOicsIGV2ZW50LmRhdGEpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGluaXRpYWxpemluZyBZb3VUdWJlIHBsYXllcjonLCBlcnJvcik7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwbGF5VmlkZW8oKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyICYmIHR5cGVvZiB0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyLnBsYXlWaWRlbyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyLnBsYXlWaWRlbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3IgcGxheWluZyBZb3VUdWJlIHZpZGVvOicsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBhc3luYyBwYXVzZVZpZGVvKCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodGhpcy4kZWwuX3hfeW91dHViZVBsYXllciAmJiB0eXBlb2YgdGhpcy4kZWwuX3hfeW91dHViZVBsYXllci5wYXVzZVZpZGVvID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIucGF1c2VWaWRlbygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3IgcGF1c2luZyBZb3VUdWJlIHZpZGVvOicsIGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyBVbmxvYWRzIHRoZSB2aWRlbyB0byBpdHMgaW5pdGlhbCBzdGF0ZSBzaG93aW5nIHBsYWNlaG9sZGVyIGltYWdlXG4gICAgICAgIGFzeW5jIHVubG9hZFBsYXllcigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIgJiYgdHlwZW9mIHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIuY3VlVmlkZW9CeUlkID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIuY3VlVmlkZW9CeUlkKHt2aWRlb0lkOiB0aGlzLnZpZGVvSWR9KTtcbiAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdyZWFkeSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdFcnJvciB1bmxvYWRpbmcgWW91VHViZSBwbGF5ZXI6JywgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3lQbGF5ZXIoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmICh0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyICYmIHR5cGVvZiB0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyLmRlc3Ryb3kgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdGhpcy4kZWwuX3hfeW91dHViZVBsYXllci5kZXN0cm95KCk7XG4gICAgICAgICAgICAgIHRoaXMuJGVsLl94X3lvdXR1YmVQbGF5ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaW5pdGlhbCc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCdFcnJvciBkZXN0cm95aW5nIFlvdVR1YmUgcGxheWVyOicsIGUpO1xuICAgICAgICAgICAgLy8gQ2xlYW4gdXAgZXZlbiBpZiBkZXN0cm95IGZhaWxzXG4gICAgICAgICAgICB0aGlzLiRlbC5feF95b3V0dWJlUGxheWVyID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gICAgLy8gV2FpdCBmb3IgYW55IHlvdXR1YmU6aW5pdCBmcm9tIGFueSBjb21wb25lbnQgdG8gaW5pdGlhbGl6ZSB0aGUgdmlkZW9cbiAgICAnQHRoZW1lOnlvdXR1YmU6aW5pdC53aW5kb3cnOiAnaW5pdFZpZGVvJyxcbiAgfSk7XG59XG4iLCJpbXBvcnQgQWxwaW5lIGZyb20gJ2FscGluZWpzJztcbmltcG9ydCB5b3V0dWJlVmlkZW8gZnJvbSAnLi9wbHVnaW5zL3lvdXR1YmUtdmlkZW8nO1xuXG5BbHBpbmUucGx1Z2luKHlvdXR1YmVWaWRlbyk7XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsU0FBd0IsYUFBYSxRQUFvQjtDQUN2RCxPQUFPLFVBQVUsa0JBQWtCLEtBQUssU0FBUztFQUMvQyxtQkFBbUIsS0FBSyxNQUFNLE1BQU07Q0FDdEMsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNO0FBQ2xCO0FBRUEsU0FBUyxtQkFBbUIsS0FBa0IsRUFBQyxXQUFXLGNBQTRCLFFBQW9CO0NBQ3hHLE1BQU0sU0FBUyxVQUFVLFNBQVMsTUFBTTtDQUN4QyxNQUFNLFdBQVcsVUFBVSxTQUFTLFVBQVU7Q0FDOUMsTUFBTSxPQUFPLFVBQVUsU0FBUyxNQUFNO0NBRXRDLElBQUksT0FBTyxlQUFlLFVBQVU7RUFDbEMsUUFBUSxLQUFLLDRCQUE0QixVQUFVO0VBQ25EO0NBQ0Y7Q0FFQSxNQUFNLFVBQVU7Q0FFaEIsT0FBTyxLQUFLLEtBQUs7RUFDZixXQUFrQztHQUNoQyxPQUFPO0lBQ0wsT0FBTztJQUNQO0lBQ0EsZUFBZTtJQUNmO0lBQ0E7SUFDQTtJQUVBLE9BQU87S0FDTCxJQUFJLENBQUMsS0FBSyxRQUNSLEtBQUssV0FBVztJQUVwQjtJQUVBLFVBQVU7S0FDUixLQUFLLGNBQWM7SUFDckI7SUFFQSxhQUFhO0tBQ1gsS0FBSyxnQkFBZ0I7S0FDckIsS0FBSyxNQUNGLE9BQU8sb0NBQW9DLENBQUMsQ0FDNUMsV0FBVztNQUVWLElBQUksT0FBTyxJQUFJLFFBQ2IsS0FBSyxVQUFVLG9CQUFvQjtXQUVuQyxPQUFPLGdDQUFnQyxLQUFLLFVB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
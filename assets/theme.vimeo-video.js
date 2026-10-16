
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
//#region src/js/plugins/vimeo-video.ts
function vimeoVideo(Alpine) {
	Alpine.directive("vimeo-video", ($el, data) => {
		handleVimeoVideo($el, data, Alpine);
	}).before("bind");
}
function handleVimeoVideo($el, { modifiers, expression }, Alpine) {
	const isLazy = modifiers.includes("lazy");
	const autoplay = modifiers.includes("autoplay");
	const loop = modifiers.includes("loop");
	if (typeof expression !== "string") {
		console.warn("Invalid vimeo video ID", expression);
		return;
	}
	const videoId = Number(expression);
	if (isNaN(videoId)) {
		console.warn("Invalid vimeo video ID", expression);
		return;
	}
	Alpine.bind($el, {
		"x-data"() {
			return {
				state: "initial",
				isLazy,
				loadRequested: false,
				autoplay,
				loop,
				videoId,
				init() {
					if (!this.isLazy) this.loadPlayer();
				},
				destroy() {
					this.destroyPlayer();
				},
				loadPlayer() {
					this.loadRequested = true;
					this.$load.script("https://player.vimeo.com/api/player.js").then(() => {
						this.$dispatch("theme:vimeo:init");
					}).catch((error) => {
						console.error("Failed to load Vimeo API:", error);
					});
				},
				initVideo() {
					if (!this.loadRequested) return;
					if (this.$el._x_vimeoPlayer) return;
					let el = this.$el.querySelector("[data-vimeo-player]");
					if (!el) {
						console.warn("No element found for Vimeo player");
						return;
					}
					if (!window.Vimeo) return;
					this.state = "loading";
					try {
						this.$el._x_vimeoPlayer = new window.Vimeo.Player(el, {
							id: this.videoId,
							autoplay: this.autoplay,
							loop: this.loop,
							controls: true,
							muted: false,
							playsinline: true
						});
						[
							"play",
							"pause",
							"ended",
							"loaded"
						].forEach((event) => {
							this.$el._x_vimeoPlayer?.on(event, () => {
								switch (event) {
									case "play":
										this.state = "playing";
										break;
									case "pause":
										this.state = "paused";
										break;
									case "loaded":
										this.state = "ready";
										break;
									default: this.state = event;
								}
							});
						});
						this.$dispatch("theme:vimeo:loaded", { videoId: this.videoId });
					} catch (error) {
						console.error("Error initializing Vimeo player:", error);
						this.state = "initial";
					}
				},
				playVideo() {
					if (this.$el._x_vimeoPlayer?.play) this.$el._x_vimeoPlayer.getPaused().then((paused) => {
						if (paused) this.$el._x_vimeoPlayer?.play().catch((error) => {
							console.error("Error playing Vimeo video:", error);
						});
					}).catch((error) => {
						console.error("Error checking Vimeo player state:", error);
					});
				},
				async pauseVideo() {
					try {
						if (!await this.$el._x_vimeoPlayer?.getPaused() && this.$el._x_vimeoPlayer?.pause) await this.$el._x_vimeoPlayer.pause();
					} catch (error) {
						console.error("Error pausing Vimeo video:", error);
					}
				},
				async unloadPlayer() {
					try {
						await this.pauseVideo();
						await this.$el._x_vimeoPlayer?.setCurrentTime(0);
						await this.$el._x_vimeoPlayer?.unload();
						this.state = "ready";
					} catch (error) {
						console.error("Error unloading Vimeo player:", error);
					}
				},
				destroyPlayer() {
					try {
						if (this.$el._x_vimeoPlayer?.destroy) this.$el._x_vimeoPlayer.destroy().catch((error) => {
							console.error("Error destroying Vimeo player:", error);
						});
					} catch (e) {
						console.warn("Error destroying Vimeo player:", e);
					} finally {
						this.$el._x_vimeoPlayer = void 0;
						this.state = "initial";
					}
				}
			};
		},
		"@theme:vimeo:init.window": "initVideo"
	});
}

//#endregion
//#region src/js/theme.vimeo-video.ts
Alpine.plugin(vimeoVideo);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUudmltZW8tdmlkZW8uanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vc3JjL2pzL3BsdWdpbnMvdmltZW8tdmlkZW8udHMiLCIuLi9zcmMvanMvdGhlbWUudmltZW8tdmlkZW8udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBbHBpbmVDb21wb25lbnQsIEFscGluZSBhcyBBbHBpbmVUeXBlLCBEaXJlY3RpdmVEYXRhfSBmcm9tICdhbHBpbmVqcyc7XG5cbnR5cGUgVmlkZW9TdGF0ZSA9ICdpbml0aWFsJyB8ICdsb2FkaW5nJyB8ICdyZWFkeScgfCAncGxheWluZycgfCAncGF1c2VkJztcblxudHlwZSBWaW1lb1ZpZGVvQ29tcG9uZW50ID0gQWxwaW5lQ29tcG9uZW50PHtcbiAgdmlkZW9JZDogbnVtYmVyO1xuICBzdGF0ZTogVmlkZW9TdGF0ZTtcbiAgaXNMYXp5OiBib29sZWFuO1xuICBsb2FkUmVxdWVzdGVkOiBib29sZWFuO1xuICBhdXRvcGxheTogYm9vbGVhbjtcbiAgbG9vcDogYm9vbGVhbjtcbiAgbG9hZFBsYXllcigpOiB2b2lkO1xuICBpbml0VmlkZW8oKTogdm9pZDtcbiAgcGxheVZpZGVvKCk6IHZvaWQ7XG4gIHBhdXNlVmlkZW8oKTogUHJvbWlzZTx2b2lkPjtcbiAgdW5sb2FkUGxheWVyKCk6IFByb21pc2U8dm9pZD47XG4gIGRlc3Ryb3lQbGF5ZXIoKTogdm9pZDtcbn0+O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB2aW1lb1ZpZGVvKEFscGluZTogQWxwaW5lVHlwZSkge1xuICBBbHBpbmUuZGlyZWN0aXZlKCd2aW1lby12aWRlbycsICgkZWwsIGRhdGEpID0+IHtcbiAgICBoYW5kbGVWaW1lb1ZpZGVvKCRlbCwgZGF0YSwgQWxwaW5lKTtcbiAgfSkuYmVmb3JlKCdiaW5kJyk7XG59XG5cbmZ1bmN0aW9uIGhhbmRsZVZpbWVvVmlkZW8oJGVsOiBIVE1MRWxlbWVudCwge21vZGlmaWVycywgZXhwcmVzc2lvbn06IERpcmVjdGl2ZURhdGEsIEFscGluZTogQWxwaW5lVHlwZSkge1xuICBjb25zdCBpc0xhenkgPSBtb2RpZmllcnMuaW5jbHVkZXMoJ2xhenknKTtcbiAgY29uc3QgYXV0b3BsYXkgPSBtb2RpZmllcnMuaW5jbHVkZXMoJ2F1dG9wbGF5Jyk7XG4gIGNvbnN0IGxvb3AgPSBtb2RpZmllcnMuaW5jbHVkZXMoJ2xvb3AnKTtcblxuICBpZiAodHlwZW9mIGV4cHJlc3Npb24gIT09ICdzdHJpbmcnKSB7XG4gICAgY29uc29sZS53YXJuKCdJbnZhbGlkIHZpbWVvIHZpZGVvIElEJywgZXhwcmVzc2lvbik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgdmlkZW9JZCA9IE51bWJlcihleHByZXNzaW9uKTtcblxuICBpZiAoaXNOYU4odmlkZW9JZCkpIHtcbiAgICBjb25zb2xlLndhcm4oJ0ludmFsaWQgdmltZW8gdmlkZW8gSUQnLCBleHByZXNzaW9uKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBBbHBpbmUuYmluZCgkZWwsIHtcbiAgICAneC1kYXRhJygpOiBWaW1lb1ZpZGVvQ29tcG9uZW50IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0YXRlOiAnaW5pdGlhbCcsXG4gICAgICAgIGlzTGF6eSxcbiAgICAgICAgbG9hZFJlcXVlc3RlZDogZmFsc2UsXG4gICAgICAgIGF1dG9wbGF5LFxuICAgICAgICBsb29wLFxuICAgICAgICB2aWRlb0lkLFxuXG4gICAgICAgIGluaXQoKSB7XG4gICAgICAgICAgaWYgKCF0aGlzLmlzTGF6eSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkUGxheWVyKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIGRlc3Ryb3koKSB7XG4gICAgICAgICAgdGhpcy5kZXN0cm95UGxheWVyKCk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgbG9hZFBsYXllcigpIHtcbiAgICAgICAgICB0aGlzLmxvYWRSZXF1ZXN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuJGxvYWRcbiAgICAgICAgICAgIC5zY3JpcHQoJ2h0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9hcGkvcGxheWVyLmpzJylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy4kZGlzcGF0Y2goJ3RoZW1lOnZpbWVvOmluaXQnKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIFZpbWVvIEFQSTonLCBlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgaW5pdFZpZGVvKCkge1xuICAgICAgICAgIC8vIHRoZW1lOnZpbWVvOmluaXQgaXMgYSB3aW5kb3ctd2lkZSBicm9hZGNhc3QsIHNvIGV2ZXJ5IHBsYXllciBvbiB0aGUgcGFnZVxuICAgICAgICAgIC8vIHJlY2VpdmVzIGl0IHdoZW4gYW55IG9uZSBsb2FkcyB0aGUgQVBJLiBPbmx5IGluaXQgcGxheWVycyB0aGF0IGFjdHVhbGx5IGFza2VkXG4gICAgICAgICAgLy8gdG8gbG9hZCDigJQgb3RoZXJ3aXNlIGEgbGF6eSBwb3B1cCBwbGF5ZXIgaW5pdGlhbGl6ZXMgKGFuZCwgd2l0aCBhdXRvcGxheSwgcGxheXMpXG4gICAgICAgICAgLy8gdGhlIG1vbWVudCBhbiB1bnJlbGF0ZWQgaW5saW5lIHZpZGVvIGxvYWRzIHRoZSBBUEkuXG4gICAgICAgICAgaWYgKCF0aGlzLmxvYWRSZXF1ZXN0ZWQpIHJldHVybjtcblxuICAgICAgICAgIC8vIERvbid0IGluaXRpYWxpemUgdGhlIHZpZGVvIHR3aWNlXG4gICAgICAgICAgaWYgKHRoaXMuJGVsLl94X3ZpbWVvUGxheWVyKSByZXR1cm47XG5cbiAgICAgICAgICAvLyBUcnkgdG8gZmluZCB0aGUgaWZyYW1lIG9yIGVsZW1lbnQgdG8gYXR0YWNoIHRoZSBwbGF5ZXIgdG9cbiAgICAgICAgICBsZXQgZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS12aW1lby1wbGF5ZXJdJyk7XG5cbiAgICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ05vIGVsZW1lbnQgZm91bmQgZm9yIFZpbWVvIHBsYXllcicpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghd2luZG93LlZpbWVvKSByZXR1cm47XG5cbiAgICAgICAgICB0aGlzLnN0YXRlID0gJ2xvYWRpbmcnO1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdlIHN0b3JlIHRoZSBwbGF5ZXIgb24gdGhlIGVsZW1lbnQgYXMgb3Bwb3NlZCB0byBpbiBhbHBpbmUgc3RhdGUgYmVjYXVzZSB0aGF0IHdpbGwgY2F1c2VcbiAgICAgICAgICAgIC8vIGl0IHRvIGJlIHdyYXBwZWQgaW4gYSBwcm94eSBhbmQgbm90IGJlIGFibGUgdG8gYWNjZXNzIHRoZSBvcmlnaW5hbCBtZXRob2RzLlxuICAgICAgICAgICAgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXIgPSBuZXcgd2luZG93LlZpbWVvLlBsYXllcihlbCwge1xuICAgICAgICAgICAgICBpZDogdGhpcy52aWRlb0lkLFxuICAgICAgICAgICAgICBhdXRvcGxheTogdGhpcy5hdXRvcGxheSxcbiAgICAgICAgICAgICAgbG9vcDogdGhpcy5sb29wLFxuICAgICAgICAgICAgICBjb250cm9sczogdHJ1ZSxcbiAgICAgICAgICAgICAgbXV0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICBwbGF5c2lubGluZTogdHJ1ZSxcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBldmVudHMgPSBbJ3BsYXknLCAncGF1c2UnLCAnZW5kZWQnLCAnbG9hZGVkJ107XG4gICAgICAgICAgICBldmVudHMuZm9yRWFjaCgoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXI/Lm9uKGV2ZW50LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSAncGxheSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAncGF1c2UnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgY2FzZSAnbG9hZGVkJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdyZWFkeSc7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9IGV2ZW50IGFzIGFueTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0aGlzLiRkaXNwYXRjaCgndGhlbWU6dmltZW86bG9hZGVkJywge3ZpZGVvSWQ6IHRoaXMudmlkZW9JZH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgVmltZW8gcGxheWVyOicsIGVycm9yKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaW5pdGlhbCc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBwbGF5VmlkZW8oKSB7XG4gICAgICAgICAgaWYgKHRoaXMuJGVsLl94X3ZpbWVvUGxheWVyPy5wbGF5KSB7XG4gICAgICAgICAgICAvLyBPbmx5IHBsYXkgaWYgdGhlIHZpZGVvIGlzIHBhdXNlZFxuICAgICAgICAgICAgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXJcbiAgICAgICAgICAgICAgLmdldFBhdXNlZCgpXG4gICAgICAgICAgICAgIC50aGVuKChwYXVzZWQ6IGJvb2xlYW4pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgICB0aGlzLiRlbC5feF92aW1lb1BsYXllcj8ucGxheSgpLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwbGF5aW5nIFZpbWVvIHZpZGVvOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNoZWNraW5nIFZpbWVvIHBsYXllciBzdGF0ZTonLCBlcnJvcik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgYXN5bmMgcGF1c2VWaWRlbygpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgcGF1c2VkID0gYXdhaXQgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXI/LmdldFBhdXNlZCgpO1xuICAgICAgICAgICAgaWYgKCFwYXVzZWQgJiYgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXI/LnBhdXNlKSB7XG4gICAgICAgICAgICAgIGF3YWl0IHRoaXMuJGVsLl94X3ZpbWVvUGxheWVyLnBhdXNlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHBhdXNpbmcgVmltZW8gdmlkZW86JywgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy8gVW5sb2FkcyB0aGUgdmlkZW8gdG8gaXRzIGluaXRpYWwgc3RhdGUgc2hvd2luZyBwbGFjZWhvbGRlciBpbWFnZVxuICAgICAgICBhc3luYyB1bmxvYWRQbGF5ZXIoKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGF3YWl0IHRoaXMucGF1c2VWaWRlbygpO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXI/LnNldEN1cnJlbnRUaW1lKDApO1xuICAgICAgICAgICAgYXdhaXQgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXI/LnVubG9hZCgpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdyZWFkeSc7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIHVubG9hZGluZyBWaW1lbyBwbGF5ZXI6JywgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGVzdHJveVBsYXllcigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKHRoaXMuJGVsLl94X3ZpbWVvUGxheWVyPy5kZXN0cm95KSB7XG4gICAgICAgICAgICAgIHRoaXMuJGVsLl94X3ZpbWVvUGxheWVyLmRlc3Ryb3koKS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZXN0cm95aW5nIFZpbWVvIHBsYXllcjonLCBlcnJvcik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignRXJyb3IgZGVzdHJveWluZyBWaW1lbyBwbGF5ZXI6JywgZSk7XG4gICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgIC8vIENsZWFuIHVwIGV2ZW4gaWYgZGVzdHJveSBmYWlsc1xuICAgICAgICAgICAgdGhpcy4kZWwuX3hfdmltZW9QbGF5ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfSxcbiAgICAvLyBXYWl0IGZvciBhbnkgdGhlbWU6dmltZW86aW5pdCBmcm9tIGFueSBjb21wb25lbnQgdG8gaW5pdGlhbGl6ZSB0aGUgdmlkZW9cbiAgICAnQHRoZW1lOnZpbWVvOmluaXQud2luZG93JzogJ2luaXRWaWRlbycsXG4gIH0pO1xufVxuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQgdmltZW9WaWRlbyBmcm9tICcuL3BsdWdpbnMvdmltZW8tdmlkZW8nO1xuXG5BbHBpbmUucGx1Z2luKHZpbWVvVmlkZW8pO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLFNBQXdCLFdBQVcsUUFBb0I7Q0FDckQsT0FBTyxVQUFVLGdCQUFnQixLQUFLLFNBQVM7RUFDN0MsaUJBQWlCLEtBQUssTUFBTSxNQUFNO0NBQ3BDLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTTtBQUNsQjtBQUVBLFNBQVMsaUJBQWlCLEtBQWtCLEVBQUMsV0FBVyxjQUE0QixRQUFvQjtDQUN0RyxNQUFNLFNBQVMsVUFBVSxTQUFTLE1BQU07Q0FDeEMsTUFBTSxXQUFXLFVBQVUsU0FBUyxVQUFVO0NBQzlDLE1BQU0sT0FBTyxVQUFVLFNBQVMsTUFBTTtDQUV0QyxJQUFJLE9BQU8sZUFBZSxVQUFVO0VBQ2xDLFFBQVEsS0FBSywwQkFBMEIsVUFBVTtFQUNqRDtDQUNGO0NBRUEsTUFBTSxVQUFVLE9BQU8sVUFBVTtDQUVqQyxJQUFJLE1BQU0sT0FBTyxHQUFHO0VBQ2xCLFFBQVEsS0FBSywwQkFBMEIsVUFBVTtFQUNqRDtDQUNGO0NBRUEsT0FBTyxLQUFLLEtBQUs7RUFDZixXQUFnQztHQUM5QixPQUFPO0lBQ0wsT0FBTztJQUNQO0lBQ0EsZUFBZTtJQUNmO0lBQ0E7SUFDQTtJQUVBLE9BQU87S0FDTCxJQUFJLENBQUMsS0FBSyxRQUNSLEtBQUssV0FBVztJQUVwQjtJQUVBLFVBQVU7S0FD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
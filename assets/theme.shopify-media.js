
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
//#region src/js/plugins/shopify-model.ts
/**
* Extends x-shopify-media with a `model` value for 3D product models.
* `x-shopify-media:model` loads Shopify's model-viewer-ui on demand via initModel(),
* tracks state ('initial' | 'loading' | 'ready' | 'playing' | 'paused'), toggles
* play/pause on tap (not drag), and dispatches theme:model:loaded.
*/
function shopifyModel(Alpine) {
	Alpine.directive("shopify-media", ($el, data) => {
		if (data.value !== "model") return;
		Alpine.bind($el, { "x-data"() {
			return {
				state: "initial",
				pointerStartX: 0,
				pointerStartY: 0,
				get hasLoaded() {
					return this.state != "initial" && this.state != "loading";
				},
				get isLoading() {
					return this.state == "loading";
				},
				initModel() {
					this.state = "loading";
					window.Shopify?.loadFeatures?.([{
						name: "model-viewer-ui",
						version: "1.0",
						onLoad: this.setupModelViewerUI.bind(this)
					}]);
				},
				async setupModelViewerUI(errors) {
					if (errors) {
						console.error("Failed to load model viewer UI:", errors);
						this.state = "initial";
						return;
					}
					if (!window.Shopify?.ModelViewerUI) await this.waitForModelViewerUIOnSafari();
					if (!window.Shopify?.ModelViewerUI) {
						console.error("ModelViewerUI not available after waiting");
						this.state = "initial";
						return;
					}
					this.state = "ready";
					this.$nextTick(() => {
						const element = $el.querySelector("model-viewer");
						if (!element) {
							console.error("No model-viewer element found");
							this.state = "initial";
							return;
						}
						try {
							$el._x_modelViewer = new window.Shopify.ModelViewerUI(element);
							if (!$el._x_modelViewer) {
								console.error("Failed to create ModelViewerUI instance");
								this.state = "initial";
								return;
							}
							this.playModel();
							this.$dispatch("theme:model:loaded", { details: $el._x_modelViewer });
						} catch (error) {
							console.error("Error initializing model viewer:", error);
							this.state = "initial";
						}
					});
				},
				playModel() {
					if (!$el._x_modelViewer || this.state == "playing") return;
					try {
						$el._x_modelViewer.play();
						this.state = "playing";
					} catch (error) {
						console.error("Error playing model:", error);
					}
				},
				pauseModel() {
					if (!$el._x_modelViewer || this.state == "paused") return;
					try {
						$el._x_modelViewer.pause();
						this.state = "paused";
					} catch (error) {
						console.error("Error pausing model:", error);
					}
				},
				getPointerCoordinates(event) {
					if (!$el._x_modelViewer) return;
					this.pointerStartX = event.clientX;
					this.pointerStartY = event.clientY;
				},
				togglePlayPause(event) {
					if (!$el._x_modelViewer) return;
					const distanceX = Math.abs(event.clientX - this.pointerStartX);
					const distanceY = Math.abs(event.clientY - this.pointerStartY);
					if (Math.sqrt(distanceX * distanceX + distanceY * distanceY) < 10) {
						if (this.state == "playing") this.pauseModel();
						else this.playModel();
					}
				},
				async waitForModelViewerUIOnSafari() {
					const maxAttempts = 10;
					const interval = 50;
					for (let i = 0; i < maxAttempts; i++) {
						if (window.Shopify?.ModelViewerUI) return;
						await new Promise((resolve) => setTimeout(resolve, interval));
					}
				}
			};
		} });
	}).before("bind");
}

//#endregion
//#region src/js/theme.shopify-media.ts
Alpine.plugin(shopifyModel);

//#endregion
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlbWUuc2hvcGlmeS1tZWRpYS5qcyIsIm5hbWVzIjpbXSwic291cmNlcyI6WyIuLi9zcmMvanMvcGx1Z2lucy9zaG9waWZ5LW1vZGVsLnRzIiwiLi4vc3JjL2pzL3RoZW1lLnNob3BpZnktbWVkaWEudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBbHBpbmVDb21wb25lbnQsIEFscGluZSBhcyBBbHBpbmVUeXBlfSBmcm9tICdhbHBpbmVqcyc7XG5cbnR5cGUgTW9kZWxDb21wb25lbnQgPSBBbHBpbmVDb21wb25lbnQ8e1xuICBzdGF0ZTogJ2luaXRpYWwnIHwgJ2xvYWRpbmcnIHwgJ3JlYWR5JyB8ICdwbGF5aW5nJyB8ICdwYXVzZWQnO1xuICBnZXQgaGFzTG9hZGVkKCk6IGJvb2xlYW47XG4gIGdldCBpc0xvYWRpbmcoKTogYm9vbGVhbjtcbiAgcG9pbnRlclN0YXJ0WDogbnVtYmVyO1xuICBwb2ludGVyU3RhcnRZOiBudW1iZXI7XG4gIGluaXRNb2RlbCgpOiB2b2lkO1xuICBzZXR1cE1vZGVsVmlld2VyVUkoZXJyb3JzOiBhbnkpOiBQcm9taXNlPHZvaWQ+O1xuICB3YWl0Rm9yTW9kZWxWaWV3ZXJVSU9uU2FmYXJpKCk6IFByb21pc2U8dm9pZD47XG4gIHBsYXlNb2RlbCgpOiB2b2lkO1xuICBwYXVzZU1vZGVsKCk6IHZvaWQ7XG4gIGdldFBvaW50ZXJDb29yZGluYXRlcyhldmVudDogTW91c2VFdmVudCk6IHZvaWQ7XG4gIHRvZ2dsZVBsYXlQYXVzZShldmVudDogTW91c2VFdmVudCk6IHZvaWQ7XG59PjtcblxuLyoqXG4gKiBFeHRlbmRzIHgtc2hvcGlmeS1tZWRpYSB3aXRoIGEgYG1vZGVsYCB2YWx1ZSBmb3IgM0QgcHJvZHVjdCBtb2RlbHMuXG4gKiBgeC1zaG9waWZ5LW1lZGlhOm1vZGVsYCBsb2FkcyBTaG9waWZ5J3MgbW9kZWwtdmlld2VyLXVpIG9uIGRlbWFuZCB2aWEgaW5pdE1vZGVsKCksXG4gKiB0cmFja3Mgc3RhdGUgKCdpbml0aWFsJyB8ICdsb2FkaW5nJyB8ICdyZWFkeScgfCAncGxheWluZycgfCAncGF1c2VkJyksIHRvZ2dsZXNcbiAqIHBsYXkvcGF1c2Ugb24gdGFwIChub3QgZHJhZyksIGFuZCBkaXNwYXRjaGVzIHRoZW1lOm1vZGVsOmxvYWRlZC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2hvcGlmeU1vZGVsKEFscGluZTogQWxwaW5lVHlwZSkge1xuICBBbHBpbmUuZGlyZWN0aXZlKCdzaG9waWZ5LW1lZGlhJywgKCRlbCwgZGF0YSkgPT4ge1xuICAgIGlmIChkYXRhLnZhbHVlICE9PSAnbW9kZWwnKSByZXR1cm47XG4gICAgQWxwaW5lLmJpbmQoJGVsLCB7XG4gICAgICAneC1kYXRhJygpOiBNb2RlbENvbXBvbmVudCB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3RhdGU6ICdpbml0aWFsJyxcbiAgICAgICAgICBwb2ludGVyU3RhcnRYOiAwLFxuICAgICAgICAgIHBvaW50ZXJTdGFydFk6IDAsXG5cbiAgICAgICAgICBnZXQgaGFzTG9hZGVkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgIT0gJ2luaXRpYWwnICYmIHRoaXMuc3RhdGUgIT0gJ2xvYWRpbmcnO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBnZXQgaXNMb2FkaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUgPT0gJ2xvYWRpbmcnO1xuICAgICAgICAgIH0sXG5cbiAgICAgICAgICBpbml0TW9kZWwoKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2xvYWRpbmcnO1xuXG4gICAgICAgICAgICB3aW5kb3cuU2hvcGlmeT8ubG9hZEZlYXR1cmVzPy4oW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbmFtZTogJ21vZGVsLXZpZXdlci11aScsXG4gICAgICAgICAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgICAgICAgICAgb25Mb2FkOiB0aGlzLnNldHVwTW9kZWxWaWV3ZXJVSS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBhc3luYyBzZXR1cE1vZGVsVmlld2VyVUkoZXJyb3JzOiBhbnkpIHtcbiAgICAgICAgICAgIGlmIChlcnJvcnMpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgbW9kZWwgdmlld2VyIFVJOicsIGVycm9ycyk7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAnaW5pdGlhbCc7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuU2hvcGlmeT8uTW9kZWxWaWV3ZXJVSSkge1xuICAgICAgICAgICAgICBhd2FpdCB0aGlzLndhaXRGb3JNb2RlbFZpZXdlclVJT25TYWZhcmkoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCF3aW5kb3cuU2hvcGlmeT8uTW9kZWxWaWV3ZXJVSSkge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdNb2RlbFZpZXdlclVJIG5vdCBhdmFpbGFibGUgYWZ0ZXIgd2FpdGluZycpO1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAncmVhZHknO1xuXG4gICAgICAgICAgICB0aGlzLiRuZXh0VGljaygoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSAkZWwucXVlcnlTZWxlY3RvcignbW9kZWwtdmlld2VyJyk7XG4gICAgICAgICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ05vIG1vZGVsLXZpZXdlciBlbGVtZW50IGZvdW5kJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIC8vIFN0b3JlIHRoZSBpbnN0YW5jZSBvbiB0aGUgZGlyZWN0aXZlJ3Mgb3duIGVsZW1lbnQgKHRoZSBjbG9zdXJlICRlbCwgbm90IHRoaXMuJGVsKSBzaW5jZSB0aGlzLiRlbCBpcyB3aGljaGV2ZXIgZWxlbWVudCdzIGhhbmRsZXIgcnVucyBhIG1ldGhvZCwgYW5kIHRoaXMuJHJvb3QgaXMgYW4gYW5jZXN0b3Igc2hhcmVkIGJ5IGV2ZXJ5IG1lZGlhIGl0ZW1cbiAgICAgICAgICAgICAgICAkZWwuX3hfbW9kZWxWaWV3ZXIgPSBuZXcgd2luZG93LlNob3BpZnkhLk1vZGVsVmlld2VyVUkhKGVsZW1lbnQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEkZWwuX3hfbW9kZWxWaWV3ZXIpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgTW9kZWxWaWV3ZXJVSSBpbnN0YW5jZScpO1xuICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0ZSA9ICdpbml0aWFsJztcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlNb2RlbCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kZGlzcGF0Y2goJ3RoZW1lOm1vZGVsOmxvYWRlZCcsIHtkZXRhaWxzOiAkZWwuX3hfbW9kZWxWaWV3ZXJ9KTtcbiAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBpbml0aWFsaXppbmcgbW9kZWwgdmlld2VyOicsIGVycm9yKTtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ2luaXRpYWwnO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGxheU1vZGVsKCkge1xuICAgICAgICAgICAgaWYgKCEkZWwuX3hfbW9kZWxWaWV3ZXIgfHwgdGhpcy5zdGF0ZSA9PSAncGxheWluZycpIHJldHVybjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICRlbC5feF9tb2RlbFZpZXdlci5wbGF5KCk7XG4gICAgICAgICAgICAgIHRoaXMuc3RhdGUgPSAncGxheWluZyc7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwbGF5aW5nIG1vZGVsOicsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgcGF1c2VNb2RlbCgpIHtcbiAgICAgICAgICAgIGlmICghJGVsLl94X21vZGVsVmlld2VyIHx8IHRoaXMuc3RhdGUgPT0gJ3BhdXNlZCcpIHJldHVybjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICRlbC5feF9tb2RlbFZpZXdlci5wYXVzZSgpO1xuICAgICAgICAgICAgICB0aGlzLnN0YXRlID0gJ3BhdXNlZCc7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBwYXVzaW5nIG1vZGVsOicsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgICAgZ2V0UG9pbnRlckNvb3JkaW5hdGVzKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoISRlbC5feF9tb2RlbFZpZXdlcikgcmV0dXJuO1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyU3RhcnRYID0gZXZlbnQuY2xpZW50WDtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlclN0YXJ0WSA9IGV2ZW50LmNsaWVudFk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB0b2dnbGVQbGF5UGF1c2UoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmICghJGVsLl94X21vZGVsVmlld2VyKSByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZVggPSBNYXRoLmFicyhldmVudC5jbGllbnRYIC0gdGhpcy5wb2ludGVyU3RhcnRYKTtcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlWSA9IE1hdGguYWJzKGV2ZW50LmNsaWVudFkgLSB0aGlzLnBvaW50ZXJTdGFydFkpO1xuICAgICAgICAgICAgY29uc3QgdG90YWxEaXN0YW5jZSA9IE1hdGguc3FydChkaXN0YW5jZVggKiBkaXN0YW5jZVggKyBkaXN0YW5jZVkgKiBkaXN0YW5jZVkpO1xuXG4gICAgICAgICAgICAvLyBUcnkgdG8gZW5zdXJlIHRoYXQgdGhpcyBpcyBhIHRhcCwgbm90IGEgZHJhZy5cbiAgICAgICAgICAgIGlmICh0b3RhbERpc3RhbmNlIDwgMTApIHtcbiAgICAgICAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT0gJ3BsYXlpbmcnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXVzZU1vZGVsKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5TW9kZWwoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXN5bmMgd2FpdEZvck1vZGVsVmlld2VyVUlPblNhZmFyaSgpIHtcbiAgICAgICAgICAgIC8vIFdhaXRzIGZvciBTaG9waWZ5Lk1vZGVsVmlld2VyVUkgdG8gYmUgZGVmaW5lZC5cbiAgICAgICAgICAgIC8vIFRoaXMgc2VlbXMgdG8gYmUgbmVjZXNzYXJ5IGZvciBTYWZhcmkgc2luY2UgU2hvcGlmeS5Nb2RlbFZpZXdlclVJIGlzIGFsd2F5cyB1bmRlZmluZWQgb24gdGhlIGZpcnN0IHRyeS5cbiAgICAgICAgICAgIGNvbnN0IG1heEF0dGVtcHRzID0gMTA7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnZhbCA9IDUwO1xuXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1heEF0dGVtcHRzOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKHdpbmRvdy5TaG9waWZ5Py5Nb2RlbFZpZXdlclVJKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIGludGVydmFsKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pLmJlZm9yZSgnYmluZCcpO1xufVxuIiwiaW1wb3J0IEFscGluZSBmcm9tICdhbHBpbmVqcyc7XG5pbXBvcnQgc2hvcGlmeU1vZGVsIGZyb20gJy4vcGx1Z2lucy9zaG9waWZ5LW1vZGVsJztcblxuQWxwaW5lLnBsdWdpbihzaG9waWZ5TW9kZWwpO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJBLFNBQXdCLGFBQWEsUUFBb0I7Q0FDdkQsT0FBTyxVQUFVLGtCQUFrQixLQUFLLFNBQVM7RUFDL0MsSUFBSSxLQUFLLFVBQVUsU0FBUztFQUM1QixPQUFPLEtBQUssS0FBSyxFQUNmLFdBQTJCO0dBQ3pCLE9BQU87SUFDTCxPQUFPO0lBQ1AsZUFBZTtJQUNmLGVBQWU7SUFFZixJQUFJLFlBQVk7S0FDZCxPQUFPLEtBQUssU0FBUyxhQUFhLEtBQUssU0FBUztJQUNsRDtJQUVBLElBQUksWUFBWTtLQUNkLE9BQU8sS0FBSyxTQUFTO0lBQ3ZCO0lBRUEsWUFBWTtLQUNWLEtBQUssUUFBUTtLQUViLE9BQU8sU0FBUyxlQUFlLENBQzdCO01BQ0UsTUFBTTtNQUNOLFNBQVM7TUFDVCxRQUFRLEtBQUssbUJBQW1CLEtBQUssSUFBSTtLQUMzQyxDQUNGLENBQUM7SUFDSDtJQUNBLE1BQU0sbUJBQW1CLFFBQWE7S0FDcEMsSUFBSSxRQUFRO01BQ1YsUUFBUSxNQUFNLG1DQUFtQyxNQUFNO01BQ3ZELEtBQUssUUFBUTtNQUNiO0tBQ0Y7S0FFQSxJQUFJLENBQUMsT0FBTyxTQUFTLGVBQ25CLE1BQU0sS0FBSyw2QkFBNkI7S0FHMUMsSUFBSSxDQUFDLE9BQU8sU0FBUyxlQUFlO01BQ2xDLFFBQVEsTUFBTSwyQ0FBMkM7TUFDekQsS0FBSyxRQUFRO01BQ2I7S0FDRjtLQUVBLEtBQUssUUFBUTtLQUViLEtBQUssZ0JBQWdCO01BQ25CLE1BQU0sVUFBVSxJQUFJLGNBQWMsY0FBYztNQUNoRCxJQUFJLENBQUMsU0FBUztPQUNaLFFBQVEsTUFBTSwrQkFBK0I7T0FDN0MsS0FBSyxRQUFRO09BQ2I7TUFDRjtNQUVBLElBQUk7T0FFRixJQUFJLGlCQUFpQixJQUFJLE9BQU8sUUFBUyxjQUFlLE9BQU87T0FFL0QsSUFBSSxDQUFDLElBQUksZ0JBQWdCO1FBQ3ZCLFFBQVEsTUFBTSx5Q0FBeUM7UUFDdkQsS0FBSyxRQUFRO1FBQ2I7T0FDRjtPQUVBLEtBQUssVUFBVTtPQUVmLEtBQUssVUFBVSxzQkFBc0IsRUFBQyxTQUFTLElBQUksZUFBYyxDQUFDO01BQ3BFLFNBQVMsT0FBTztPQUNkLFFBQVEsTUFBTSxvQ0FBb0MsS0FBSztPQUN2RCxLQUFLLFFBQVE7TUFDZjtLQUNGLENBQUM7SUFDSDtJQUVBLFlBQVk7S0FDVixJQUFJLENBQUMsSUFBSSxrQkFBa0IsS0FBSyxTQUFTLFdBQVc7S0FDcEQsSUFBSTtNQUNGLElBQUksZUFBZSxLQUFLO01BQ3hCLEtBQUssUUFBUTtLQUNmLFNBQVMsT0FBTztNQUNkLFFBQVEsTUFBTSx3QkFBd0IsS0FBSztLQUM3QztJQUNGO0lBRUEsYUFBYTtLQUNYLElBQUksQ0FBQyxJQUFJLGtCQUFrQixLQUFLLFNBQVMsVUFBVTtLQUNuRCxJQUFJO01BQ0YsSUFBSSxlQUFlLE1BQU07TUFDekIsS0FBSyxRQUFRO0tBQ2YsU0FBUyxPQUFPO01BQ2QsUUFBUSxNQUFNLHdCQUF3QixLQUFLO0tBQzdDO0lBQ0Y7SUFFQSxzQkFBc0IsT0FBTztLQUMzQixJQUFJLENBQUMsSUFBSSxnQkFBZ0I7S0FDekIsS0FBSyxnQkFBZ0IsTUFBTTtLQUMzQixLQUFLLGdCQUFnQixNQUFNO0lBQzdCO0lBQ0EsZ0JBQWdCLE9BQU87S0FDckIsSUFBSSxDQUFDLElBQUksZ0JBQWdCO0tBQ3pCLE1BQU0sWUFBWSxLQUFLLElBQUksTUFBTSxVQUFVLEtBQUssYUFBYTtLQUM3RCxNQUFNLFlBQVksS0FBSyxJQUFJLE1BQU0sVUFBVSxLQUFLLGFBQWE7S0FJN0QsSUFIc0IsS0FBSyxLQUFLLFlBQVksWUFBWSxZQUFZLFNBR3BELElBQUksSUFBSTtNQUN0QixJQUFJLEtBQUssU0FBUyxXQUNoQixLQUFLLFdBQVc7V0FFaEIsS0FBSyxVQUFVO0tBRW5CO0lBQ0Y7SUFDQSxNQUFNLCtCQUErQjtLQUduQyxNQUFNLGNBQWM7S0FDcEIsTUFBTSxXQUFXO0tBRWpCLEtBQUssSUFBSSxJQUFJLEdBQUcsSUFBSSxhQUFhLEtBQUs7TUFDcEMsSUFBSSxPQUFPLFNBQVMsZUFDbEI7TUFFRixNQUFNLElBQUksU0FBUyxZQUFZLFdBQVcsU0FBUyxRQUFRLENBQUM7S0FDOUQ7SUFDRjtHQUNGO0VBQ0YsRUFDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNO0FBQ2xCOzs7O0FDekpBLE9BQU8sT0FBTyxZQUFZIn0=
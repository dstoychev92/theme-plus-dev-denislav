import {AlpineComponent, Alpine as AlpineType} from 'alpinejs';

type ModelComponent = AlpineComponent<{
  state: 'initial' | 'loading' | 'ready' | 'playing' | 'paused';
  get hasLoaded(): boolean;
  get isLoading(): boolean;
  pointerStartX: number;
  pointerStartY: number;
  initModel(): void;
  setupModelViewerUI(errors: any): Promise<void>;
  waitForModelViewerUIOnSafari(): Promise<void>;
  playModel(): void;
  pauseModel(): void;
  getPointerCoordinates(event: MouseEvent): void;
  togglePlayPause(event: MouseEvent): void;
}>;

/**
 * Extends x-shopify-media with a `model` value for 3D product models.
 * `x-shopify-media:model` loads Shopify's model-viewer-ui on demand via initModel(),
 * tracks state ('initial' | 'loading' | 'ready' | 'playing' | 'paused'), toggles
 * play/pause on tap (not drag), and dispatches theme:model:loaded.
 */
export default function shopifyModel(Alpine: AlpineType) {
  Alpine.directive('shopify-media', ($el, data) => {
    if (data.value !== 'model') return;
    Alpine.bind($el, {
      'x-data'(): ModelComponent {
        return {
          state: 'initial',
          pointerStartX: 0,
          pointerStartY: 0,

          get hasLoaded() {
            return this.state != 'initial' && this.state != 'loading';
          },

          get isLoading() {
            return this.state == 'loading';
          },

          initModel() {
            this.state = 'loading';

            window.Shopify?.loadFeatures?.([
              {
                name: 'model-viewer-ui',
                version: '1.0',
                onLoad: this.setupModelViewerUI.bind(this),
              },
            ]);
          },
          async setupModelViewerUI(errors: any) {
            if (errors) {
              console.error('Failed to load model viewer UI:', errors);
              this.state = 'initial';
              return;
            }

            if (!window.Shopify?.ModelViewerUI) {
              await this.waitForModelViewerUIOnSafari();
            }

            if (!window.Shopify?.ModelViewerUI) {
              console.error('ModelViewerUI not available after waiting');
              this.state = 'initial';
              return;
            }

            this.state = 'ready';

            this.$nextTick(() => {
              const element = $el.querySelector('model-viewer');
              if (!element) {
                console.error('No model-viewer element found');
                this.state = 'initial';
                return;
              }

              try {
                // Store the instance on the directive's own element (the closure $el, not this.$el) since this.$el is whichever element's handler runs a method, and this.$root is an ancestor shared by every media item
                $el._x_modelViewer = new window.Shopify!.ModelViewerUI!(element);

                if (!$el._x_modelViewer) {
                  console.error('Failed to create ModelViewerUI instance');
                  this.state = 'initial';
                  return;
                }

                this.playModel();

                this.$dispatch('theme:model:loaded', {details: $el._x_modelViewer});
              } catch (error) {
                console.error('Error initializing model viewer:', error);
                this.state = 'initial';
              }
            });
          },

          playModel() {
            if (!$el._x_modelViewer || this.state == 'playing') return;
            try {
              $el._x_modelViewer.play();
              this.state = 'playing';
            } catch (error) {
              console.error('Error playing model:', error);
            }
          },

          pauseModel() {
            if (!$el._x_modelViewer || this.state == 'paused') return;
            try {
              $el._x_modelViewer.pause();
              this.state = 'paused';
            } catch (error) {
              console.error('Error pausing model:', error);
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
            const totalDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // Try to ensure that this is a tap, not a drag.
            if (totalDistance < 10) {
              if (this.state == 'playing') {
                this.pauseModel();
              } else {
                this.playModel();
              }
            }
          },
          async waitForModelViewerUIOnSafari() {
            // Waits for Shopify.ModelViewerUI to be defined.
            // This seems to be necessary for Safari since Shopify.ModelViewerUI is always undefined on the first try.
            const maxAttempts = 10;
            const interval = 50;

            for (let i = 0; i < maxAttempts; i++) {
              if (window.Shopify?.ModelViewerUI) {
                return;
              }
              await new Promise((resolve) => setTimeout(resolve, interval));
            }
          },
        };
      },
    });
  }).before('bind');
}

import { isHtmlElement, isInputElement, isClipboardWriteAllowed } from '../utils/dom';
export default function (Alpine) {
    Alpine.directive('clipboard', ($el, data) => {
        if (data.value == 'target') {
            handleTarget($el, Alpine, data);
        }
        else if (data.value == 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-clipboard:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('clipboard', handleClipboardMagic(Alpine));
}
function handleClipboardMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            save(text) {
                navigator.clipboard.writeText(text);
                $data.handleSuccess();
            },
            get state() {
                return $data.state;
            },
            get isClipboardWriteAllowed() {
                return $data.isClipboardWriteAllowed;
            },
        };
    };
}
function handleTarget($el, Alpine, { expression }) {
    const attributes = {};
    const $data = Alpine.$data($el);
    $data.target = $el;
    if (isInputElement($el)) {
        $data.content = $el.value;
    }
    else if (isHtmlElement($el)) {
        $data.content = expression || $el.textContent || '';
    }
    Alpine.bind($el, attributes);
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        '@click': 'copyToClipboard',
    });
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                state: 'initial',
                target: undefined,
                content: '',
                timeoutDuration: 2500,
                isClipboardWriteAllowed: null,
                async init() {
                    await isClipboardWriteAllowed().then((allowed) => (this.isClipboardWriteAllowed = allowed));
                },
                async copyToClipboard(event) {
                    event.preventDefault();
                    if (this.isClipboardWriteAllowed) {
                        // This doesn't work inside the Shopify's Customizer <iframe> for policy reasons
                        navigator.clipboard.writeText(this.content).then(() => {
                            if (this.state === 'success')
                                return;
                            this.handleSuccess();
                            this.selectText();
                        });
                    }
                    else {
                        console.log('Clipboard access is denied');
                        // Simulate success behavior when in the Theme editor
                        if (window.Shopify.designMode) {
                            if (this.state === 'success')
                                return;
                            this.handleSuccess();
                            this.selectText();
                        }
                        else {
                            this.state = 'denied';
                            setTimeout(() => {
                                if (this.state === 'denied') {
                                    this.state = 'initial';
                                }
                            }, 4000);
                        }
                    }
                },
                handleSuccess() {
                    this.state = 'success';
                    setTimeout(() => {
                        this.state = 'initial';
                    }, this.timeoutDuration);
                },
                selectText() {
                    var _a, _b;
                    if (isInputElement(this.target)) {
                        this.target.select();
                    }
                    else if (isHtmlElement(this.target)) {
                        // Enable this for non-input tags too (<div>, etc.)
                        const range = document.createRange();
                        range.selectNode(this.target);
                        (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.removeAllRanges();
                        (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.addRange(range);
                    }
                },
            };
        },
    });
}

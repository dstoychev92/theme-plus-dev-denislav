import { warnMissingParentDirective } from '../utils/error';
/**
 * Enables the creation of a countdown timer component.
 *
 * - x-countdown - The root element of the component, initializing the countdown functionality and adding a data context for child directives. Pass the expiration date in ISO 8601 format, or the value `weekly` to count down to the next Monday at 9:00 AM Pacific Time (IANA zone `America/Los_Angeles`).
 * - x-countdown:days - The element containing the remaining 'days'
 * - x-countdown:hours - The element containing the remaining 'hours'
 * - x-countdown:minutes - The element containing the remaining 'minutes'
 * - x-countdown:seconds - The element containing the remaining 'seconds'
 *
 * Root modifier:
 * - .no-pad - Removes the leading zero from days, hours and minutes (e.g. "5" instead of "05"). Does not affect seconds, which stay two-digit padded. By default, values under 10 are zero-padded to two digits.
 *
 * Magic:
 * - $countdown - The state of the enclosing x-countdown: `days`, `hours`, `minutes` and
 *   `seconds` as display strings, `isExpired`, and `endDate(date)` to set a new target.
 *   The timer updates every second and stops when it reaches zero.
 *
 * @example
 * Default (padded) usage:
 *  <time x-countdown="2028-12-31T11:59:00.000-0500">
 *    <span x-countdown:days></span>
 *    <span x-countdown:hours></span>
 *    <span x-countdown:minutes></span>
 *    <span x-countdown:seconds></span>
 *  </time>
 *
 * @example
 * With .no-pad modifier (days, hours and minutes without leading zeros; seconds still padded):
 *  <time x-countdown.no-pad="2028-12-31T11:59:00.000-0500">
 *    <span x-countdown:days></span>
 *    <span x-countdown:hours></span>
 *    <span x-countdown:minutes></span>
 *    <span x-countdown:seconds></span>
 *  </time>
 *
 * @example
 * Weekly target (next Monday 9:00 AM Pacific):
 *  <time x-countdown="weekly">
 *    <span x-countdown:days></span>
 *    <span x-countdown:hours></span>
 *    <span x-countdown:minutes></span>
 *    <span x-countdown:seconds></span>
 *  </time>
 */
/**
 * Returns (UTC − Pacific) in ms for a given instant.
 * e.g. 28 800 000 for PST (UTC-8), 25 200 000 for PDT (UTC-7).
 */
function pacificOffsetMs(date) {
    const utc = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const pt = new Date(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    return utc.getTime() - pt.getTime();
}
function getNextMonday9AMPT() {
    const now = new Date();
    // Derive Pacific wall-clock components. The internal timestamp of ptNow is
    // meaningless (it depends on the system timezone), but its *getter* values
    // (.getDay(), .getHours(), etc.) always reflect Pacific wall-clock time.
    const ptNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const day = ptNow.getDay(); // 0 = Sunday, 1 = Monday...
    const hours = ptNow.getHours();
    let daysUntilMonday = (8 - day) % 7;
    if (daysUntilMonday === 0 && hours >= 9) {
        daysUntilMonday = 7;
    }
    // Encode the target Pacific wall-clock (YYYY-MM-DD 09:00) as a
    // timezone-neutral millisecond value via Date.UTC.
    const targetWallMs = Date.UTC(ptNow.getFullYear(), ptNow.getMonth(), ptNow.getDate() + daysUntilMonday, 9, 0, 0, 0);
    // Convert Pacific wall-clock ms → true UTC ms.
    // Two-pass refinement handles a DST transition between now and the target:
    // 1) estimate with the current offset, 2) refine with the offset at the estimate.
    const approxTarget = new Date(targetWallMs + pacificOffsetMs(now));
    return new Date(targetWallMs + pacificOffsetMs(approxTarget));
}
export default function (Alpine) {
    Alpine.directive('countdown', ($el, data) => {
        if (data.value == 'days') {
            handleDays($el, Alpine);
        }
        else if (data.value == 'hours') {
            handleHours($el, Alpine);
        }
        else if (data.value == 'minutes') {
            handleMinutes($el, Alpine);
        }
        else if (data.value == 'seconds') {
            handleSeconds($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-countdown:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('countdown', handleCountdownMagic(Alpine));
}
function handleCountdownMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            days: $data.__countdown_days,
            hours: $data.__countdown_hours,
            minutes: $data.__countdown_minutes,
            seconds: $data.__countdown_seconds,
            endDate(date) {
                $data.__countdown_endDate = date;
                $data.__countdown_start();
            },
            get isExpired() {
                return $data.__countdown_isExpired;
            },
        };
    };
}
function handleDays($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__countdown_isRoot)
                warnMissingParentDirective('x-countdown:days', 'x-countdown', this.$el);
        },
        'x-text'() {
            return this.__countdown_days;
        },
    });
}
function handleHours($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__countdown_isRoot)
                warnMissingParentDirective('x-countdown:hours', 'x-countdown', this.$el);
        },
        'x-text'() {
            return this.__countdown_hours;
        },
    });
}
function handleMinutes($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__countdown_isRoot)
                warnMissingParentDirective('x-countdown:minutes', 'x-countdown', this.$el);
        },
        'x-text'() {
            return this.__countdown_minutes;
        },
    });
}
function handleSeconds($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__countdown_isRoot)
                warnMissingParentDirective('x-countdown:seconds', 'x-countdown', this.$el);
        },
        'x-text'() {
            return this.__countdown_seconds;
        },
    });
}
function handleRoot($el, Alpine, data) {
    var _a;
    const padDigits = !((_a = data.modifiers) !== null && _a !== void 0 ? _a : []).includes('no-pad');
    Alpine.bind($el, {
        ['x-data']() {
            return countdown(data.expression, { padDigits });
        },
    });
}
function countdown(endDate, options) {
    var _a;
    const padDigits = (_a = options === null || options === void 0 ? void 0 : options.padDigits) !== null && _a !== void 0 ? _a : true;
    return {
        __countdown_isRoot: true,
        __countdown_endDate: endDate || '',
        __countdown_padDigits: padDigits,
        __countdown_msPerDay: 1000 * 60 * 60 * 24,
        __countdown_msPerHour: (1000 * 60 * 60 * 24) / 24, // msPerDay / 24
        __countdown_msPerMinute: (1000 * 60 * 60 * 24) / 24 / 60, // msPerHour / 60
        __countdown_msPerSecond: (1000 * 60 * 60 * 24) / 24 / 60 / 60, // msPerMinute / 60,
        __countdown_intervalTimer: undefined,
        __countdown_remainingTime: 0,
        __countdown_days: '0',
        __countdown_hours: '0',
        __countdown_minutes: '0',
        __countdown_seconds: '0',
        get __countdown_endDateParsed() {
            return this.__countdown_endDate === 'weekly'
                ? getNextMonday9AMPT().getTime()
                : Date.parse(this.__countdown_endDate);
        },
        get __countdown_isExpired() {
            return this.__countdown_remainingTime <= 0;
        },
        /* Formats a non-negative unit for display. When `applyPad` is true, values under 10 get a leading zero */
        __countdown_formatDigits(number, applyPad) {
            if (applyPad && number < 10) {
                return '0' + number;
            }
            return number.toString();
        },
        __countdown_update() {
            this.__countdown_remainingTime = this.__countdown_endDateParsed - Date.now();
            let days = 0;
            let hours = 0;
            let minutes = 0;
            let seconds = 0;
            let tempTime = this.__countdown_remainingTime;
            if (tempTime > 0) {
                days = parseInt((tempTime / this.__countdown_msPerDay).toString(), 10);
                tempTime -= days * this.__countdown_msPerDay;
                hours = parseInt((tempTime / this.__countdown_msPerHour).toString(), 10);
                tempTime -= hours * this.__countdown_msPerHour;
                minutes = parseInt((tempTime / this.__countdown_msPerMinute).toString(), 10);
                tempTime -= minutes * this.__countdown_msPerMinute;
                seconds = parseInt((tempTime / this.__countdown_msPerSecond).toString(), 10);
            }
            this.__countdown_days = this.__countdown_formatDigits(days, this.__countdown_padDigits);
            this.__countdown_hours = this.__countdown_formatDigits(hours, this.__countdown_padDigits);
            this.__countdown_minutes = this.__countdown_formatDigits(minutes, this.__countdown_padDigits);
            this.__countdown_seconds = this.__countdown_formatDigits(seconds, true);
            if (this.__countdown_isExpired) {
                clearInterval(this.__countdown_intervalTimer);
            }
        },
        __countdown_start() {
            clearInterval(this.__countdown_intervalTimer);
            this.__countdown_update();
            if (!this.__countdown_isExpired) {
                this.__countdown_intervalTimer = setInterval(() => {
                    this.__countdown_update();
                }, 1000);
            }
        },
        init() {
            this.__countdown_start();
        },
        destroy() {
            clearInterval(this.__countdown_intervalTimer);
        },
    };
}

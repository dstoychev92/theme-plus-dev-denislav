export class RevertibleValue {
    constructor(initialValue) {
        this.currentValue = initialValue;
        this.previousValue = initialValue;
    }
    set value(newValue) {
        if (newValue !== this.currentValue) {
            this.previousValue = this.currentValue;
            this.currentValue = newValue;
        }
    }
    get value() {
        return this.currentValue;
    }
    revert() {
        this.currentValue = this.previousValue;
    }
    commit() {
        this.previousValue = this.currentValue;
    }
}

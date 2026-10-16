export declare class RevertibleValue<TValue> {
    currentValue: TValue;
    previousValue: TValue;
    constructor(initialValue: TValue);
    set value(newValue: TValue);
    get value(): TValue;
    revert(): void;
    commit(): void;
}

import { ArrayToUnion } from '../types/utils';
export type State = string;
export type States = State[];
export type StateTransitions<TStates extends States, TState extends ArrayToUnion<TStates> = ArrayToUnion<TStates>> = Record<TState, TState[]>;
/**
 * StateMachine: A generic finite state machine implementation.
 *
 * A state machine is a conceptual model used to design systems and applications. It consists of a finite set of states and
 * transitions between those states, often driven by events. State machines are ideal for situations where an application or system
 * can be thought of as having distinct states with well-defined transitions, such as user interfaces, protocols, and life cycles.
 *
 * @template TStates A tuple of string literals representing the possible states.
 * @template TTransitions A mapping of each state to an array of states to which it can transition.
 * @template TState The current state of the machine, must be one of TStates.
 *
 * The `StateMachine` class provides mechanisms to manage states, transitions, and listeners that react to state changes.
 *
 * Usage example:
 *
 * // Define states and transitions
 * const states = ['idle', 'loading', 'success', 'error'] as const;
 * const transitions = {
 *   idle: ['loading'],
 *   loading: ['success', 'error'],
 *   success: ['idle'],
 *   error: ['idle'],
 * };
 *
 * // Create a state machine
 * const machine = new StateMachine('idle', states, transitions);
 *
 * // Listen for state changes
 * machine.on((newState, prevState) => {
 *   console.log(`Transitioned from ${prevState} to ${newState}`);
 * });
 *
 * // Change state
 * machine.state = 'loading';
 *
 * Features:
 * - Strongly typed states and transitions ensure only valid state changes are possible.
 * - Event listeners for state changes, to react to or log transitions.
 * - Custom error handling for invalid transitions.
 *
 * The class manages the current state privately and allows state changes only through the state setter,
 * which checks for valid transitions and notifies listeners.
 */
export declare class StateMachine<TStates extends States, TTransitions extends StateTransitions<TStates, ArrayToUnion<TStates>> = StateTransitions<TStates, ArrayToUnion<TStates>>, TState extends ArrayToUnion<TStates> = ArrayToUnion<TStates>> {
    private _state;
    private _prevState;
    private readonly listeners;
    states: TStates;
    transitions: TTransitions;
    /**
     * Initializes the state machine with the specified initial state, possible states, and valid transitions.
     *
     * @param initialState The starting state of the state machine.
     * @param states An array of possible states the state machine can be in.
     * @param transitions A record mapping each state to an array of states to which it can transition.
     *
     */
    constructor(initialState: ArrayToUnion<TStates>, states: [...TStates], transitions: TTransitions);
    /**
     *  Attempts to transition the state machine to a new state. Validates the transition against the defined rules
     *  and, if valid, updates the state and triggers the listeners. Throws an error if the transition is invalid.
     */
    set state(newState: TState);
    /**
     * Transitions the state machine to a new state, but only temporarily. After the specified timeout, the state will transition to the next state
     * This method is useful for UI interactions that should only be visible for a short period of time, such as a success message after a form submission.
     */
    setTransientState(transientState: TState, nextState: TState, timeout: number): Promise<void>;
    /**
     * Returns the current state of the state machine.
     */
    get state(): TState;
    /**
     * Returns the previous state of the state machine (if this is the initial state it will return null)
     */
    get prevState(): TState | null;
    /**
     * Registers a new listener function to be called when the state changes.
     * @param listener
     */
    on(listener: (newState: TState, prevState: TState) => void): void;
    /**
     * Removes a previously registered listener function so that it will no longer be called on state changes.
     * @param listener
     */
    off(listener: (newState: TState, prevState: TState) => void): void;
}

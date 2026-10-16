import { CamelCaseToSnakeCaseKeys } from '../../types/utils';
type CartChangeByIdPayload = {
    id: string | number;
};
type CartChangeByLinePayload = {
    line: number;
};
export type CartChangePayload = (CartChangeByIdPayload | CartChangeByLinePayload) & {
    quantity?: number;
    properties?: CamelCaseToSnakeCaseKeys<Record<string, any>>;
};
export declare function change(payload: CartChangePayload, init?: RequestInit): Promise<Response>;
export {};

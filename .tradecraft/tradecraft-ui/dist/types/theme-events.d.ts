export declare enum ThemeEvent {
    'theme:section:navigate' = 0,
    'theme:section:load' = 1,
    'theme:section:loaded' = 2,
    'theme:section:update' = 3
}
export interface ThemeEventPayload {
    'theme:section:navigate': {
        sectionId: string;
        url: string;
    };
    'theme:section:load': {
        sectionId: string;
        url: string;
    };
    'theme:section:loaded': {
        sectionId: string;
        url: string;
    };
    'theme:section:update': {
        sectionId: string;
        url: string;
        html: string;
    };
}

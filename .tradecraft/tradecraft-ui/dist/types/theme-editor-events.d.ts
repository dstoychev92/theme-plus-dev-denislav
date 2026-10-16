interface SectionEventDetail {
    sectionId: string;
    load?: boolean;
}
export interface BlockEventDetail {
    blockId: string;
    sectionId: string;
    load?: boolean;
}
export declare enum ThemeEditorEvent {
    INSPECTOR_ACTIVATED = "shopify:inspector:activate",
    INSPECTOR_DEACTIVATED = "shopify:inspector:deactivate",
    SECTION_LOAD = "shopify:section:load",
    SECTION_UNLOAD = "shopify:section:unload",
    SECTION_SELECT = "shopify:section:select",
    SECTION_DESELECT = "shopify:section:deselect",
    SECTION_REORDER = "shopify:section:reorder",
    BLOCK_SELECT = "shopify:block:select",
    BLOCK_DESELECT = "shopify:block:deselect"
}
export type ThemeEditorEventPayload = {
    [ThemeEditorEvent.INSPECTOR_ACTIVATED]: undefined;
    [ThemeEditorEvent.INSPECTOR_DEACTIVATED]: undefined;
    [ThemeEditorEvent.SECTION_LOAD]: SectionEventDetail;
    [ThemeEditorEvent.SECTION_UNLOAD]: SectionEventDetail;
    [ThemeEditorEvent.SECTION_SELECT]: SectionEventDetail;
    [ThemeEditorEvent.SECTION_DESELECT]: SectionEventDetail;
    [ThemeEditorEvent.SECTION_REORDER]: SectionEventDetail;
    [ThemeEditorEvent.BLOCK_SELECT]: BlockEventDetail;
    [ThemeEditorEvent.BLOCK_DESELECT]: BlockEventDetail;
};
export {};

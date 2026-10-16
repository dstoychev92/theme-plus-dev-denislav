export var ThemeEditorEvent;
(function (ThemeEditorEvent) {
    ThemeEditorEvent["INSPECTOR_ACTIVATED"] = "shopify:inspector:activate";
    ThemeEditorEvent["INSPECTOR_DEACTIVATED"] = "shopify:inspector:deactivate";
    ThemeEditorEvent["SECTION_LOAD"] = "shopify:section:load";
    ThemeEditorEvent["SECTION_UNLOAD"] = "shopify:section:unload";
    ThemeEditorEvent["SECTION_SELECT"] = "shopify:section:select";
    ThemeEditorEvent["SECTION_DESELECT"] = "shopify:section:deselect";
    ThemeEditorEvent["SECTION_REORDER"] = "shopify:section:reorder";
    ThemeEditorEvent["BLOCK_SELECT"] = "shopify:block:select";
    ThemeEditorEvent["BLOCK_DESELECT"] = "shopify:block:deselect";
})(ThemeEditorEvent || (ThemeEditorEvent = {}));

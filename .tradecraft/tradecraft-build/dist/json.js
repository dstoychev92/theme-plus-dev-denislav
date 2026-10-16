"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSchemaJsonc = exports.formatJsonc = void 0;
const jsonc_parser_1 = require("jsonc-parser");
function formatJsonc(content) {
    return (0, jsonc_parser_1.applyEdits)(content, (0, jsonc_parser_1.format)(content, undefined, { keepLines: false }));
}
exports.formatJsonc = formatJsonc;
/**
 * Formats jsonc in {% schema %} tags.
 */
function formatSchemaJsonc(content) {
    return content.replace(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/g, (_, schemaContent) => {
        return `{% schema %}\n${formatJsonc(schemaContent)}\n{% endschema %}`;
    });
}
exports.formatSchemaJsonc = formatSchemaJsonc;

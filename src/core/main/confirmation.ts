import { add_global_message } from "@/core/main/global-messages.js";
import type { FormattedText } from "@/util/format.js";

export function require_confirm(required: boolean, confirmation_text: () => FormattedText, action: () => void) {
    if (required) {
        add_global_message({
            type: 'confirm',
            message_text: confirmation_text(),
            done: action,
        });
    } else {
        action();
    }
}
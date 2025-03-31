import type { FormattedText } from "@/util/format.js";
import { reactive } from "vue";

export interface AlertData {
    type: 'alert';
    message_text: FormattedText;
    done?: () => void;
}

export interface InputData {
    type: 'input_box';
    message_text: FormattedText;
    input_type?: 'string' | 'number';
    cancel?: () => void;
    done: (text: string) => boolean | void;
}

export interface ConfirmData {
    type: 'confirm';
    message_text: FormattedText;
    cancel?: () => void;
    done: () => boolean | void;
}

export type MessageData = AlertData | InputData | ConfirmData;

export const global_messages: MessageData[] = reactive([]);
export const active_message_indices: Set<number> = reactive(new Set());

export function add_global_message(message: MessageData, show: boolean = true): number {
    const index = global_messages.length;
    global_messages.push(message);
    if (show) active_message_indices.add(index);
    return index;
}

export function manual_show_message(index: number) {
    active_message_indices.add(index);
}

export function manual_close_message(index: number) {
    active_message_indices.delete(index);
}
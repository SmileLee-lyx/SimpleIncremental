import type {ComputedRef} from "vue";

export interface ButtonProps {
    id: string,
    text: () => string,
    visible: () => boolean,
    buyable: () => boolean,
    buy: () => void,
    tooltipText?: () => string | null,
}
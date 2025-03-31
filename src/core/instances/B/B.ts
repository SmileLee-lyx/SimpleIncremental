import Ai from "@/core/instances/A/Ai.js";
import Ap from "@/core/instances/A/Ap.js";
import As from "@/core/instances/A/As.js";
import At from "@/core/instances/A/At.js";
import Atu from "@/core/instances/A/Atu.js";
import { register } from "@/core/instances/instance-init.js";
import DC from "@/core/main/DC.js";
import type Decimal from "break_eternity.js";

const B = {
    // reset

    B_gain_on_reset(): Decimal {
        return DC.d1;
    },

    Bp_gain_on_reset(): Decimal {
        return DC.d1;
    },

    /**
     * All B reset eventually call this function.
     */
    run_reset() {
        Ap.amount = Ap.amount_after_reset();
        for (let layer = 1; layer <= 8; layer++) {
            Ai(layer).amount = Ai(layer).bought = DC.d0;
        }
        At.bought = DC.d0;
        As.bought = DC.d0;
        Atu.bought = DC.d0;
    },
};

export default B;

declare global {
    interface Window {
        B: typeof B;
    }
}

export function init() {
    window.B = B;
}

register('B', { init: init });
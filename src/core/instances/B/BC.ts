import { register } from "@/core/instances/instance-init.js";
import { get_bit, set_bit } from "@/util/bit-util.js";
import { assignWithProperty } from "@/util/merge.js";

function _BC(index: number) {
    if (index < 0 || index >= 8 || !Number.isInteger(index)) throw new RangeError("invalid index");
    return {
        get unlocked(): boolean {
            return get_bit(window.player.B.BU_bits, index);
        },
        set unlocked(value: boolean) {
            set_bit(window.player.B.BU_bits, index, value);
        },
    };
}


const BC = assignWithProperty(_BC, {

});

export default BC;

declare global {
    interface Window {
        BC: typeof BC;
    }
}

register('BC', {
    init() {
        window.BC = BC;
    },
});
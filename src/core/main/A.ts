import Decimal from "break_eternity.js";
import { computed, type ComputedRef, ref, type Ref } from "vue";

let dZero = Decimal.dZero;
let dOne = Decimal.dOne;
let dTwo = Decimal.dTwo;
let dTen = Decimal.dTen;

export function sign(count: Decimal = dOne): void {
    let player = window.player;
    for (let i = 1; i <= player.A.generators.length; i++) {
        if (i == 1) {
            player.A.points.amount = player.A.points.amount.add(player.A.generators[i-1].amount.times(count));
        } else {
            player.A.generators[i-2].amount = player.A.generators[i-2].amount.add(player.A.generators[i-1].amount.times(count));
        }
    }
}

export function generator_price(layer: number): Decimal {
    return dTen.pow(3 * layer - 2);
}

export function auto_sign_speed(): Decimal {
    let player = window.player;
    if (!player.A.auto_sign) return dZero;
    return dTwo.pow(player.A.auto_sign_speed_bought);
}

export let last_sign_duration: Ref<number> = ref(0);

export let time_to_next_sign_ms: ComputedRef<number> = computed(() => {
    return new Decimal(1000).div(auto_sign_speed()).sub(last_sign_duration.value * 1000).floor().toNumber();
});

export function runGameLoop(duration: number) {
    let player = window.player;
    if (!player.A.auto_sign) {
        last_sign_duration.value = 0;
        return;
    }
    last_sign_duration.value += duration;
    let count = auto_sign_speed().times(last_sign_duration.value);
    if (count.lt(20)) {
        count = count.floor();
        last_sign_duration.value -= count.div(auto_sign_speed()).toNumber();
    } else {
        last_sign_duration.value = 0;
    }
    sign(count);
}
import { ExpLinearScaling, type Scaling } from "@/core/math/price.ts";
import Decimal from "break_eternity.js";
import { computed, type ComputedRef, ref, type Ref } from "vue";

let d0 = Decimal.dZero;
let d1 = Decimal.dOne;
let d2 = Decimal.dTwo;
let d10 = Decimal.dTen;

export function mult_per_buy10(): Decimal {
    return d2;
}

export function mult_buy10_total(layer: number): Decimal {
    let player = window.player;
    return mult_per_buy10().pow(player.A.Ai[layer - 1].bought.div(10).floor());
}

export function mult_per_As(): Decimal {
    return d2;
}

export function mult_As_total(layer: number): Decimal {
    let player = window.player;
    return mult_per_As().pow(player.A.As.sub(layer - 1).max(0));
}

export function mult(layer: number): Decimal {
    let player = window.player;
    if (player.A.Ai[layer - 1] === undefined) return d0;
    return mult_buy10_total(layer).times(mult_As_total(layer));
}

export function generated_per_sign(layer: number): Decimal {
    let player = window.player;
    if (player.A.Ai[layer - 1] === undefined) return d0;
    return player.A.Ai[layer - 1].amount.times(mult(layer));
}

export function sign(count: Decimal = d1): void {
    let player = window.player;
    for (let i = 1; i <= player.A.Ai.length; i++) {
        let generated_amount = generated_per_sign(i).times(count);
        if (i == 1) {
            player.A.Ap = player.A.Ap.add(generated_amount);
        } else {
            player.A.Ai[i - 2].amount = player.A.Ai[i - 2].amount.add(generated_amount);
        }
    }
}

export function Ai_price_scaling(layer: number): Scaling {
    switch (layer) {
        case 1:
            return new ExpLinearScaling(10, 1e2, 10);
        case 2:
            return new ExpLinearScaling(100, 1e3, 10);
        case 3:
            return new ExpLinearScaling(1e3, 1e4, 10);
        case 4:
            return new ExpLinearScaling(1e5, 1e6, 10);
        case 5:
            return new ExpLinearScaling(1e7, 1e8, 10);
        case 6:
            return new ExpLinearScaling(1e10, 1e10, 10);
        case 7:
            return new ExpLinearScaling(1e15, 1e15, 10);
        case 8:
            return new ExpLinearScaling(1e21, 1e20, 10);
        default:
            return new ExpLinearScaling(Infinity, Infinity, 10);
    }
}

export function At_price_scaling(): Scaling {
    return new ExpLinearScaling(10, 10, 1);
}

export let auto_sign_speed_price: Scaling = new ExpLinearScaling(100, 10, 1);

export function At_effective_amount(): Decimal {
    let player = window.player;
    return player.A.At;
}

export function auto_sign_speed_base(): Decimal {
    let player = window.player;
    return new Decimal("1.115").times(new Decimal("1.02").pow(player.A.Atu));
}

export function auto_sign_speed(): Decimal {
    let player = window.player;
    if (!player.A.At_unlocked) return d0;
    return auto_sign_speed_base().pow(At_effective_amount());
}

export function generated_per_second(layer: number): Decimal {
    return generated_per_sign(layer).mul(auto_sign_speed());
}

export function As_price(): { target: number, count: Decimal } {
    let player = window.player;
    if (player.A.As.lt(4)) {
        return { target: player.A.As.floor().toNumber() + 4, count: new Decimal(20) };
    } else {
        return { target: 8, count: new Decimal(20).mul(player.A.As.sub(3)) };
    }
}

export function Atu_price(): { target: number, count: Decimal } {
    let player = window.player;
    return { target: 8, count: player.A.Atu.add(1).mul(40) };
}

export let last_sign_duration: Ref<number> = ref(0);

export let time_to_next_sign_ms: ComputedRef<number> = computed(() => {
    return new Decimal(1000).div(auto_sign_speed()).sub(last_sign_duration.value * 1000).floor().toNumber();
});

export function runGameLoop_sign(duration: number) {
    let player = window.player;
    if (!player.A.At_unlocked) {
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

export function runGameLoop_auto_buy(duration: number) {
    let player = window.player;
    for (let i = 1; i <= 8; ++i) {
        if (player.A.Ai_automation[i - 1].unlocked && player.A.Ai_automation[i - 1].enabled) {
            if (player.A.As.lt(i - 4)) continue;
            let price_scaling = Ai_price_scaling(i);
            let price = price_scaling.price(player.A.Ai[i - 1].bought);
            let buyable = player.A.Ap.div(price).floor().min(
                10 - player.A.Ai[i - 1].bought.mod(10).floor().toNumber());
            player.A.Ai[i - 1].bought = player.A.Ai[i - 1].bought.plus(buyable);
            player.A.Ai[i - 1].amount = player.A.Ai[i - 1].amount.plus(buyable);
            player.A.Ap = player.A.Ap.sub(price.mul(buyable));
        }
    }
    if (player.A.At_automation.unlocked && player.A.At_automation.enabled) {
        if (player.A.At_unlocked && player.A.Ai[1].amount.gt(0)) {
            let price_scaling = At_price_scaling();
            let price = price_scaling.price(player.A.At);
            if (player.A.Ap.gte(price)) {
                player.A.At = player.A.At.plus(1);
                player.A.Ap = player.A.Ap.sub(price);
            }
        }
    }
}

export function runGameLoop(duration: number) {
    runGameLoop_sign(duration);
    runGameLoop_auto_buy(duration);
}
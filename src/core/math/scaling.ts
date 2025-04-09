import Dec from "@/core/main/Dec.js";
import Decimal, { type DecimalSource } from "break_eternity.js";

export interface Scaling {
    // 当前价格
    price(bought: DecimalSource): Decimal;

    // 当前价格函数的逆. 返回最小的 bought 使得 price(bought) > price.
    from_price(price: DecimalSource): Decimal;

    // 购买总价
    price_amount(bought: DecimalSource, new_bought: DecimalSource): Decimal;

    // 最多能购买的数量
    buy_max(bought: DecimalSource, currency: DecimalSource): Decimal;

    // 改为忽略低价部分

    to_ignore_low(): Scaling;
}

/** 初始价格为 `start`, 每购买 `raise_amount` 个物品后涨价, 价格提高 `raise` 倍.
 *  适用于早期数值较精确的时期, 即使在 `raise` 很小时也能正常工作.
 *
 * @param start
 * @param raise
 * @param raise_amount
 */
export class ExpLinearScaling implements Scaling {
    start: Decimal;
    raise: Decimal;
    raise_amount: Decimal;
    ignore_low: boolean;

    constructor(start: DecimalSource, raise: DecimalSource, raise_amount: DecimalSource,
                ignore_low: boolean = false) {
        this.start = new Decimal(start);
        this.raise = new Decimal(raise);
        this.raise_amount = new Decimal(raise_amount);
        this.ignore_low = ignore_low;
    }

    public price(bought: DecimalSource): Decimal {
        bought = new Decimal(bought);
        return this.start.mul(this.raise.pow(bought.div(this.raise_amount).floor()));
    }

    public from_price(price: DecimalSource): Decimal {
        price = new Decimal(price);
        if (price.lte(0)) return Dec.d0;
        return price.div(this.start).log(this.raise).floor().add(1).mul(this.raise_amount);
    }

    public price_amount(bought: DecimalSource, new_bought: DecimalSource): Decimal {
        bought = new Decimal(bought);
        new_bought = new Decimal(new_bought);
        if (!this.ignore_low) {
            // 等比数列求和
            return this.start.mul(
                this.raise.pow((new_bought.div(this.raise_amount).floor()))
                    .sub(this.raise.pow(bought.div(this.raise_amount).floor()))
                    .mul(this.raise_amount)
                    .div(this.raise.sub(1))
                    .sub(this.raise.pow(bought.div(this.raise_amount).floor())
                        .mul(bought.mod(this.raise_amount)))
                    .add(this.raise.pow(new_bought.div(this.raise_amount).floor())
                        .mul(new_bought.mod(this.raise_amount))),
            );
        } else {
            return this.price(new_bought.sub(1)).mul(
                new_bought.sub(1).mod(this.raise_amount).add(1)
                    .min(new_bought.sub(bought)));
        }
    }

    public buy_max(bought: DecimalSource, currency: DecimalSource): Decimal {
        bought = new Decimal(bought);
        currency = new Decimal(currency);
        if (!this.ignore_low) {
            let result1 = currency.div(this.price(bought)).floor();
            if (result1.add(bought.mod(this.raise_amount)).lte(this.raise_amount)) {
                return bought.add(result1);
            }
            result1 = this.raise_amount.sub(bought.mod(this.raise_amount));
            currency = currency.sub(this.price(bought).mul(result1));
            bought = bought.add(result1);

            let result2 = currency.div(this.start).div(this.raise_amount).mul(this.raise.sub(1))
                .add(this.raise.pow(bought.div(this.raise_amount)))
                .log(this.raise).floor().times(this.raise_amount);
            currency = currency.sub(this.price_amount(bought, result2));
            bought = result2;

            let result3 = currency.div(this.price(bought)).floor();
            return bought.add(result3.min(this.raise_amount));
        } else {
            return this.from_price(currency).max(bought);
        }
    }

    public to_ignore_low(): ExpLinearScaling {
        return new ExpLinearScaling(this.start, this.raise, this.raise_amount, true);
    }
}

type ThresholdSpecify = DecimalSource | { price: DecimalSource } | { amount: DecimalSource } |
    { price: DecimalSource; amount: DecimalSource };

function calculate_threshold(base: Scaling, threshold: ThresholdSpecify)
    : { threshold_price: Decimal; threshold_amount: Decimal; } {

    if (typeof threshold === 'object' && 'price' in threshold && 'amount' in threshold) {
        return { threshold_price: new Decimal(threshold.price), threshold_amount: new Decimal(threshold.amount) };
    } else if (typeof threshold === 'object' && 'price' in threshold) {
        let threshold_price = new Decimal(threshold.price);
        let threshold_amount = base.from_price(threshold.price);
        return { threshold_price, threshold_amount };
    } else if (typeof threshold === 'object' && 'amount' in threshold) {
        let threshold_amount = new Decimal(threshold.amount);
        let threshold_price = base.price(threshold_amount);
        return { threshold_price, threshold_amount };
    } else {
        let threshold_price = new Decimal(threshold);
        let threshold_amount = base.from_price(threshold);
        return { threshold_price, threshold_amount };
    }
}

// threshold_amount is minimal amount where price >= threshold price

export class ExpCapScaling implements Scaling {
    base: ExpLinearScaling;
    threshold_price: Decimal;
    threshold_amount: Decimal;

    constructor(base: ExpLinearScaling, threshold: ThresholdSpecify) {
        this.base = base;

        let { threshold_price, threshold_amount } = calculate_threshold(base, threshold);
        this.threshold_price = threshold_price;
        this.threshold_amount = threshold_amount;
    }

    public price(bought: DecimalSource): Decimal {
        bought = new Decimal(bought);

        if (bought.lt(this.threshold_amount)) {
            return this.base.price(bought);
        }

        return Dec.dInf;
    }

    public from_price(price: DecimalSource): Decimal {
        return this.base.from_price(price).min(this.threshold_amount);
    }

    public buy_max(bought: DecimalSource, currency: DecimalSource): Decimal {
        return this.base.buy_max(bought, currency).min(this.threshold_amount);
    }

    public price_amount(bought: DecimalSource, new_bought: DecimalSource): Decimal {
        new_bought = new Decimal(new_bought);

        if (new_bought.lte(this.threshold_amount)) return this.base.price_amount(bought, new_bought);

        return Dec.dInf;
    }

    public to_ignore_low(): ExpCapScaling {
        return new ExpCapScaling(this.base.to_ignore_low(),
            { amount: this.threshold_amount, price: this.threshold_price },
        );
    }
}

export class ExpQuadScaling implements Scaling {
    base: ExpLinearScaling;
    threshold_price: Decimal;
    threshold_amount: Decimal;

    raise: Decimal;

    // force ignore low

    constructor(base: ExpLinearScaling, threshold: ThresholdSpecify, raise: DecimalSource) {
        this.base = base;
        this.raise = new Decimal(raise);

        let { threshold_price, threshold_amount } = calculate_threshold(base, threshold);
        this.threshold_price = threshold_price;
        this.threshold_amount = threshold_amount;
    }

    public price(bought: DecimalSource): Decimal {
        bought = new Decimal(bought);

        if (bought.lte(this.threshold_amount)) {
            return this.base.price(bought);
        }

        return this.base.price(bought).mul(
            this.raise.pow(
                bought.sub(this.threshold_amount).div(this.base.raise_amount).floor().sqr(),
            ),
        );
    }

    public from_price(price: DecimalSource): Decimal {
        const base_result = this.base.from_price(price);
        if (base_result.lte(this.threshold_amount)) return base_result;

        price = new Decimal(price);

        // log currency = log start + log base.raise * t + log raise * (t - threshold_amount)^2

        const R = this.raise.log10();
        const S = this.base.raise.log10()
            .sub(this.raise.log10().mul(2).mul(this.threshold_amount.div(this.base.raise_amount)));
        const T = this.base.start.log10()
            .add(this.raise.log10().mul(this.threshold_amount.div(this.base.raise_amount).sqr()))
            .sub(price.log10());
        let result = (S.sqr().sub(R.mul(T).mul(4))).sqrt().sub(S).div(R.mul(2)).floor().add(1);

        return result.mul(this.base.raise_amount);
    }

    public buy_max(bought: DecimalSource, currency: DecimalSource): Decimal {
        currency = new Decimal(currency);
        if (currency.lt(this.threshold_price)) {
            return this.base.buy_max(bought, currency);
        }

        return this.from_price(currency).max(bought);
    }

    public price_amount(bought: DecimalSource, new_bought: DecimalSource): Decimal {
        new_bought = new Decimal(new_bought);

        if (new_bought.lte(this.threshold_amount)) return this.base.price_amount(bought, new_bought);

        let new_bought_mod_10: Decimal = new_bought.mod(10).floor();
        if (new_bought_mod_10.eq(0)) new_bought_mod_10 = Dec.d10;

        return this.price(new_bought.sub(1)).mul(new_bought_mod_10);
    }

    public to_ignore_low(): ExpQuadScaling {
        return new ExpQuadScaling(this.base.to_ignore_low(),
            { amount: this.threshold_amount, price: this.threshold_price },
            this.raise,
        );
    }
}

declare global {
    interface Window {
        ExpLinearScaling: typeof ExpLinearScaling;
        ExpQuadScaling: typeof ExpQuadScaling;
        ExpCapScaling: typeof ExpCapScaling;
    }
}

window.ExpLinearScaling = ExpLinearScaling;
window.ExpQuadScaling = ExpQuadScaling;
window.ExpCapScaling = ExpCapScaling;
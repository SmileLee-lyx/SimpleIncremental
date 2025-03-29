import Decimal, { type DecimalSource } from "break_eternity.js";

export interface Scaling {
    // 当前价格
    price: (bought: DecimalSource) => Decimal;

    // 购买总价
    price_amount: (bought: DecimalSource, count: DecimalSource) => Decimal;

    // 最多能购买的数量
    buy_max: (bought: DecimalSource, currency: DecimalSource) => Decimal;
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

    price(bought: DecimalSource): Decimal {
        bought = new Decimal(bought);
        return this.start.mul(this.raise.pow(bought.div(this.raise_amount).floor()));
    }

    price_amount(bought: DecimalSource, new_bought: DecimalSource): Decimal {
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

    buy_max(bought: DecimalSource, currency: DecimalSource): Decimal {
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
            let result1 = currency.div(this.price(bought)).floor();
            if (result1.add(bought.mod(this.raise_amount)).lte(this.raise_amount)) {
                return result1;
            }
            result1 = this.raise_amount.sub(bought.mod(this.raise_amount));
            bought = bought.add(result1);

            let result2 = currency.div(this.start).log(this.raise).floor().sub(1).times(this.raise_amount);
            bought = result2;

            let result3 = currency.div(this.price(bought)).floor();
            return bought.add(result3.min(this.raise_amount));
        }
    }
}

declare global {
    interface Window {
        LinearScaling: typeof ExpLinearScaling;
    }
}

window.LinearScaling = ExpLinearScaling;
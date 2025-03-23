<script lang="ts" setup>
import { is_shift_pressed } from "@/components/misc/global-keyboard-press.ts";
import MessageBox from "@/components/objects/MessageBox.vue";
import PurchaseButton from "@/components/objects/PurchaseButton.vue";
import ToggleButton from "@/components/objects/ToggleButton.vue";
import UpgradeButton from "@/components/objects/UpgradeButton.vue";
import { defaultPlayer } from "@/core/defines.ts";
import {
  Ai_price_scaling,
  As_price,
  At_price_scaling,
  Atu_price,
  auto_sign_speed,
  auto_sign_speed_base,
  generated_per_second,
  generated_per_sign,
  mult,
  mult_per_As,
  sign,
  time_to_next_sign_ms,
} from "@/core/main/A.ts";
import { SignSetting } from "@/core/settings.ts";
import { AlertId, BuyMode } from "@/core/typing.ts";
import { format } from "@/visual/format.ts";
import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";
import { ref, type Ref } from "vue";

let game = window.game;
let player = window.player;
let DEBUG = window.DEBUG;

function Ai(layer: number): { bought: Decimal; amount: Decimal; } {
  return player.A.Ai[layer - 1];
}

function A_bought(layer: number): () => number {
  return function () {
    return Ai(layer).bought.mod(10).floor().toNumber();
  };
}

function A_buyable(layer: number, mode: BuyMode = game.A.buy_mode): () => number {
  return function () {
    if (player.A.As.lt(layer - 4)) return 0;

    let bought = A_bought(layer)();
    let price_scaling = Ai_price_scaling(layer);
    let price = price_scaling.price(Ai(layer).bought);

    switch (mode) {
      case BuyMode.BUY_ONE:
        if (player.A.Ap.gte(price)) return 1;
        return 0;
      case BuyMode.BUY_TEN:
      case BuyMode.BUY_MAX:
        return player.A.Ap.div(price).floor().min(10 - bought).toNumber();
      default:
        return 0;
    }
  };
}

let show_shift_alert = ref(false);

function A_buy(layer: number, mode: BuyMode = game.A.buy_mode): () => void {
  return function () {
    if (player.A.As.lt(layer - 4)) return;

    if (layer === 2) show_shift_alert.value = true;

    let price_scaling = Ai_price_scaling(layer);
    switch (mode) {
      case BuyMode.BUY_ONE:
      case BuyMode.BUY_TEN:
        let price = price_scaling.price(Ai(layer).bought);
        let buyable = A_buyable(layer, mode)();
        Ai(layer).bought = Ai(layer).bought.plus(buyable);
        Ai(layer).amount = Ai(layer).amount.plus(buyable);
        player.A.Ap = player.A.Ap.sub(price.mul(buyable));
        break;
      case BuyMode.BUY_MAX:
        let new_bought = price_scaling.buy_max(Ai(layer).bought, player.A.Ap);
        player.A.Ap = player.A.Ap.sub(price_scaling.price_amount(Ai(layer).bought, new_bought));
        if (Ai(layer).bought.equals(Ai(layer).amount)) {
          Ai(layer).amount = new_bought;
        } else {
          Ai(layer).amount = Ai(layer).amount.plus(new_bought.sub(Ai(layer).bought));
        }
        Ai(layer).bought = new_bought;
        break;
      default:
        break;
    }
  };
}

let sign_nothing_msg_show: Ref<boolean> = ref(false);

function sign_on_click() {
  if (!player.A.Ai.some((x) => x.bought.gt(0))) {
    sign_nothing_msg_show.value = true;
  }
  sign();
}

let show_sign_setting_alert = ref(false);

function sign_visible(): boolean {
  if (DEBUG.DEBUG_SHOW_ALL) return true;
  switch (player.settings.sign_setting) {
    case SignSetting.DEFAULT: {
      if (player.A.At_unlocked && auto_sign_speed().gte("5")) {
        player.settings.sign_setting = SignSetting.NEVER;
        show_sign_setting_alert.value = true;
        return false;
      }
      return true;
    }
    case SignSetting.WHEN_SLOW: {
      return !player.A.At_unlocked || auto_sign_speed().lt("5");
    }
    case SignSetting.ALWAYS: {
      return true;
    }
    case SignSetting.NEVER: {
      return !player.A.At_unlocked;
    }
  }
}

function At_price(): Decimal {
  return At_price_scaling().price(player.A.At);
}

function At_buyable(): boolean {
  return Ai(2).amount.gt(0) && player.A.Ap.gte(At_price());
}

function At_buy() {
  if (!At_buyable()) return;
  player.A.Ap = player.A.Ap.sub(At_price());
  player.A.At = player.A.At.plus(1);
}

function At_buy_max() {
  if (!At_buyable()) return;
  let price_scaling = At_price_scaling();
  let new_bought = price_scaling.buy_max(player.A.At, player.A.Ap);
  player.A.Ap = player.A.Ap.sub(price_scaling.price_amount(player.A.At, new_bought));
  player.A.At = new_bought;
}

function As_visible(): boolean {
  if (DEBUG.DEBUG_SHOW_ALL) return true;
  if (!player.A.At_unlocked) return false;
  return player.A.As.gt(0) || player.A.Atu.gt(0) ||
      Ai(4).amount.gt(0);
}

function As_buyable(): boolean {
  if (!player.A.At_unlocked) return false;
  let { target, count } = As_price();
  return Ai(target).amount.gte(count);
}

function As_buy() {
  if (!As_buyable()) return;
  player.A.Ap = cloneDeep(defaultPlayer.A.Ap);
  player.A.Ai = cloneDeep(defaultPlayer.A.Ai);
  player.A.At = cloneDeep(defaultPlayer.A.At);
  player.A.As = player.A.As.plus(1);
}

function Atu_visible(): boolean {
  if (DEBUG.DEBUG_SHOW_ALL) return true;
  if (!player.A.At_unlocked) return false;
  return player.A.Atu.gt(0) ||
      Ai(8).amount.gt(0);
}

function Atu_buyable(): boolean {
  if (!player.A.At_unlocked) return false;
  let { target, count } = Atu_price();
  return Ai(target).amount.gte(count);
}

function Atu_buy() {
  if (!Atu_buyable()) return;
  player.A.Ap = cloneDeep(defaultPlayer.A.Ap);
  player.A.Ai = cloneDeep(defaultPlayer.A.Ai);
  player.A.At = cloneDeep(defaultPlayer.A.At);
  player.A.As = cloneDeep(defaultPlayer.A.As);
  player.A.Atu = player.A.Atu.plus(1);
}

let buy_mode_description = {
  [BuyMode.BUY_ONE]: "购买1个",
  [BuyMode.BUY_TEN]: "购买10个",
  [BuyMode.BUY_MAX]: "购买最大",
};
</script>

<template>
  <div class="text-box">
    <ToggleButton v-model="game.A.buy_mode" :values="[BuyMode.BUY_ONE, BuyMode.BUY_TEN, BuyMode.BUY_MAX]"
                  class="buy-mode-button" height="30px" width="120px">
      <template #selection>
        {{ buy_mode_description[game.A.buy_mode] }}
      </template>
    </ToggleButton>
    <template v-if="!player.A.At_unlocked">
      自动签到已禁用.
    </template>
    <template v-else>
      正在自动签到, 当前速度: {{ format(auto_sign_speed()) }}
      <template v-if="auto_sign_speed().lt(10)">, 下次签到还需
        <span class="sign-time">{{ time_to_next_sign_ms }}</span>ms
      </template>
      .
      <br>
      每个 <span class="A-text">A<sub>t</sub></span> 将自动签到速度提高 × {{ format(auto_sign_speed_base()) }}.
    </template>
    <br>
    <UpgradeButton
        :buy="sign_on_click"
        :visible="sign_visible">
      <template #text> 签到</template>
    </UpgradeButton>
    <UpgradeButton
        :buy="At_buy"
        :buyable="At_buyable"
        :has_tooltip="true"
        :visible="() => player.A.At_unlocked || DEBUG.DEBUG_SHOW_ALL">
      <template #text>
        购买一个<span class="A-text">A<sub>t</sub></span>.
        <br>
        <template v-if="Ai(2).amount.gt(0)">
          价格: <span class="A-text">{{ format(At_price()) }} A</span>
        </template>
        <template v-else>
          需要至少一个 <span class="A-text">A<sub>2</sub></span>.
        </template>
      </template>
      <template #tooltip>
        已购买: {{ format(player.A.At) }}
      </template>
    </UpgradeButton>
    <UpgradeButton
        :buy="As_buy"
        :buyable="As_buyable"
        :has_tooltip="true"
        :visible="As_visible">
      <template #text>
        <template v-if="!is_shift_pressed">
          购买一个 <span class="A-text">A<sub>*</sub></span>,
          <br>
          重置所有 <span class="A-text">A</span> 与 <span class="A-text">A<sub>t</sub></span>.
          <br>
          价格: <span class="A-text">{{ As_price().count }}</span>
          个 <span class="A-text">A<sub>{{ As_price().target }}</sub></span>.
        </template>
        <template v-else>
          <template v-if="player.A.As.lt(4)">
            解锁 <span class="A-text">A<sub>{{ player.A.As.toNumber() + 5 }}</sub></span>, <br>
          </template>
          并将
          <template v-if="player.A.As.lt(7)">前 {{ player.A.As.toNumber() + 1 }} 个</template>
          <template v-else>所有</template>
          <span class="A-text">A</span>的倍数 × {{ mult_per_As() }}.
        </template>
      </template>
      <template #tooltip>已购买: {{ format(player.A.As) }}</template>
    </UpgradeButton>
    <UpgradeButton
        :buy="Atu_buy"
        :buyable="Atu_buyable"
        :has_tooltip="true"
        :visible="Atu_visible">
      <template #text>
        <template v-if="!is_shift_pressed">
          购买一个 <span class="A-text">A<sub>tu</sub></span>,
          <br>
          重置所有 <span class="A-text">A</span>, <span class="A-text">A<sub>t</sub></span>,
          <span class="A-text">A<sub>*</sub></span>.
          <br>
          价格: <span class="A-text">{{ Atu_price().count }}</span>
          个 <span class="A-text">A<sub>{{ Atu_price().target }}</sub></span>.
        </template>
        <template v-else>
          将<span class="A-text">A<sub>t</sub></span>的效果略微提高.
        </template>
      </template>
      <template #tooltip>已购买: {{ format(player.A.Atu) }}</template>
    </UpgradeButton>
  </div>
  <div v-for="i in 8" :class="{'grey-background': i%2}"
       class="a-div">
    <span class="fixed-width text-left vert-flex" style="width: 100px">
      <span class="A-text">A<sub>{{ i }}</sub></span>
      <span class="small-small-text">×{{ format(mult(i)) }}</span>
    </span>
    <span class="text-left flex-element" style="width: 100px">
      <span class="A-text">{{ format(Ai(i).amount) }}</span>
      <br>
      <span v-if="player.A.At_unlocked">
        +{{ format(generated_per_second(i + 1)) }}/s
      </span>
      <span v-else>
        +{{ format(generated_per_sign(i + 1)) }}
      </span>
    </span>
    <PurchaseButton
        :already_bought="A_bought(i)" :buy="A_buy(i)" :buyable_amount="A_buyable(i)" :has_tooltip="true"
        :total_amount="10">
      <template #text>
        <span class="text-box small-text">
          <template v-if="!is_shift_pressed">
            购买 <span class="A-text">A<sub>{{ i }}</sub></span> <br>
            <template v-if="player.A.As.lt(i-4)">
              需要至少 {{ i - 4 }} 个 <span class="A-text">A<sub>*</sub></span>
            </template>
            <template v-else>
              价格: <span class="A-text">{{ format(Ai_price_scaling(i).price(Ai(i).bought)) }} A</span>
            </template>
          </template>
          <template v-else>
            每购买 <span class="A-text">10</span> 个, <br>
            所有 <span class="A-text">A<sub>{{ i }}</sub></span> 的效果翻倍.
          </template>
        </span>
      </template>
      <template #tooltip> 已购买: {{ format(Ai(i).bought) }}</template>
    </PurchaseButton>
  </div>
  <MessageBox v-if="sign_nothing_msg_show" @done="sign_nothing_msg_show = false">
    请先购买 <span class="A-text">A1</span> 再签到.
  </MessageBox>
  <MessageBox v-if="show_sign_setting_alert && !player.progress.ignored_alerts.includes(AlertId.HIDE_SIGN)"
              @done="player.progress.ignored_alerts.push(AlertId.HIDE_SIGN)">
    在自动签到速度首次大于 5 后, 手动签到按钮将仅在不能自动签到时显示.
    可在设置页修改手动签到按钮的显示逻辑.
  </MessageBox>
  <MessageBox v-if="show_shift_alert && !player.progress.ignored_alerts.includes(AlertId.SHIFT)"
              @done="player.progress.ignored_alerts.push(AlertId.SHIFT)">
    很多按钮都有额外信息, 可以按住 SHIFT 键查看.
  </MessageBox>
</template>

<style scoped>
.text-box {
  text-align: center;
}

.text-left {
  text-align: left;
}

.fixed-width {
  position: relative;
  display: inline-block;
}

.sign-time {
  position: relative;
  display: inline-block;
  text-align: right;
  width: 30px;
}

.a-div {
  box-sizing: border-box;
  padding: 10px;
  position: relative;
  display: flex;
  flex-direction: row;
  text-align: center;
  width: 100%;
}

.vert-flex {
  display: flex;
  flex-direction: column;
}

.flex-element {
  flex-grow: 1;
}

.grey-background {
  background: #ccc;
}

.small-text {
  line-height: 10px;
  font-size: 14px;
}

.small-small-text {
  font-size: 12px;
}

.buy-mode-button {
  position: absolute;
  left: 10px;
  top: 170px;
}
</style>
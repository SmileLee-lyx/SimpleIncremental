import DC from "@/core/main/DC.js";
import { defaultPlayer, type Player, TabId } from "@/core/main/defines.js";
import { AlertId, AutoSaveSetting, BuyMode, SignSetting } from "@/core/main/settings.js";
import Decimal from "break_eternity.js";
import { cloneDeep } from "lodash";

type MigrationResult = {
    success: true;
    result: Player;
    warnings?: string[];
} | {
    success: false;
    errors?: string[];
}

export function migration(data: any): MigrationResult {
    if (data === null || typeof data !== "object")
        return { success: false, errors: ["data-not-object"] };
    if (typeof data.version !== 'number')
        return { success: false, errors: ["no-version"] };
    const version = data.version;
    let result = data.data;
    if (version > 1)
        return { success: false, errors: ["invalid-version"] };
    let warnings: string[] = [];
    if (version <= 0) {
        result = migration_v1(result);
        warnings.push("version-0");
    }
    return {
        success: true,
        result: result as Player,
        warnings: warnings,
    };
}

enum TabId_v0 {
    A,
    A_UPGRADES,
    SETTINGS,
    CHEAT,
}

enum SignSetting_v0 {
    DEFAULT,
    WHEN_SLOW,
    ALWAYS,
    NEVER,
}

interface Player_v0 {
    A: {
        Ap: Decimal;
        Ai: { amount: Decimal, bought: Decimal }[];
        At_unlocked: boolean;
        At: Decimal;
        As: Decimal;
        Atu: Decimal;

        Ai_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode }[];
        At_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode };
    };
    settings: {
        sign_setting: SignSetting_v0;
        auto_save_setting: AutoSaveSetting;
    };
    progress: {
        unlocked_tabs: TabId_v0[];
        ignored_alerts: AlertId[];
        start_time: number;
        end_time: number;
        endgame: boolean;
        endgame_continue: boolean;
    };
}

interface Player_v1 {
    A: {
        Ap: Decimal;
        Ai: { amount: Decimal, bought: Decimal }[];
        At_unlocked: boolean;
        At: Decimal;
        As: Decimal;
        Atu: Decimal;

        Ai_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode }[];
        At_automation: { unlocked: boolean, enabled: boolean, buy_mode: BuyMode };
    };
    B: {
        unlocked: boolean;
        B_count: Decimal;
        Bp: Decimal;
        Bq: Decimal;
        BU_bits: number[];
        BU_qol_bits: number[];
        BC_completions: (Decimal | null)[];
    };
    settings: {
        sign_setting: SignSetting;
        auto_save_setting: AutoSaveSetting;
    };
    stats: {
        Game: {
            real_time: number;
            game_time: Decimal;

            best_Ap: Decimal;
            best_Bp: Decimal;
        }
        this_B: {
            real_time: number;
            game_time: Decimal;

            best_Ap: Decimal;
        }
    };
    progress: {
        meta: string;
        unlocked_tabs: TabId[];
        ignored_alerts: AlertId[];
        used_cheat: boolean;
        endgame: boolean;
    };
}

function migration_v1(data: Player_v0): Player_v1 {
    // re-balance

    let need_reset = false;

    if (data.A.As.gt(11)) {
        data.A.As = new Decimal(11);
        need_reset = true;
    }
    if (data.A.Atu.gt(3)) {
        data.A.Atu = new Decimal(3);
        need_reset = true;
    }

    if (need_reset) {
        data.A.Ap = cloneDeep(defaultPlayer.A.Ap);
        data.A.Ai = cloneDeep(defaultPlayer.A.Ai);
        data.A.At = cloneDeep(defaultPlayer.A.At);
    }

    // upgrade unlocked_tabs

    const unlocked_tabs: TabId[] = [TabId.A, TabId.SETTINGS, TabId.ACHIEVEMENTS];
    if (data.progress.unlocked_tabs.includes(TabId_v0.A_UPGRADES)) {
        unlocked_tabs.push(TabId.A_UPGRADES);
    }
    if (data.A.At_unlocked) {
        unlocked_tabs.push(TabId.AUTOMATION);
    }
    if (data.progress.unlocked_tabs.includes(TabId_v0.CHEAT)) {
        unlocked_tabs.push(TabId.CHEAT);
    }

    let sign_setting: SignSetting;
    switch (data.settings.sign_setting) {
        case SignSetting_v0.WHEN_SLOW:
        case SignSetting_v0.DEFAULT:
            sign_setting = SignSetting.DEFAULT;
            break;
        case SignSetting_v0.ALWAYS:
            sign_setting = SignSetting.ALWAYS;
            break;
        case SignSetting_v0.NEVER:
            sign_setting = SignSetting.NEVER;
            break;
        default:
            sign_setting = SignSetting.DEFAULT;
    }

    return {
        A: data.A,
        B: {
            unlocked: false,
            B_count: DC.d0,
            Bp: DC.d0,
            Bq: DC.d0,
            BU_bits: [0, 0],
            BU_qol_bits: [0, 0],
            BC_completions: [null, null, null, null, null, null, null, null],
        },
        settings: {
            sign_setting: sign_setting,
            auto_save_setting: data.settings.auto_save_setting,
        },
        stats: {
            Game: {
                real_time: 0,
                game_time: DC.d0,

                best_Ap: DC.d0,
                best_Bp: DC.d0,
            },
            this_B: {
                real_time: 0,
                game_time: DC.d0,

                best_Ap: DC.d0,
            },
        },
        progress: {
            meta: "",
            unlocked_tabs: unlocked_tabs,
            ignored_alerts: data.progress.ignored_alerts,
            used_cheat: false,
            endgame: false, // reset endgame
        },
    };
}

// for future migration: simply copy progress.Game to progress.this_C (for example)
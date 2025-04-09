import { register } from "@/core/instances/instance-init.js";
import type { AnimationSettings, ConfirmationSettings, Player } from "@/core/main/defines.js";
import { AutoSaveSetting, type SignSetting } from "@/core/main/settings.js";

const Settings = {
    get sign_setting(): SignSetting {
        return window.player.settings.sign_setting;
    },
    set sign_setting(value: SignSetting) {
        window.player.settings.sign_setting = value;
    },
    get auto_save_setting(): AutoSaveSetting {
        return window.player.settings.auto_save_setting;
    },
    set auto_save_setting(value: AutoSaveSetting) {
        window.player.settings.auto_save_setting = value;
    },

    get confirmation_setting(): ConfirmationSettings {
        return window.player.settings.confirmation_setting;
    },
    get animation_setting(): AnimationSettings {
        return window.player.settings.animation_setting;
    }
};

export default Settings;

declare global {
    interface Window {
        Settings: typeof Settings;
    }
}

register('Settings', {
    init() {
        window.Settings = Settings;
    },
});
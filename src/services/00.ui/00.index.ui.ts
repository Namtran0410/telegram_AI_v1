import { BotKeyboard } from "./01.keyboard.bot.ui.js";
import { StarKeyboard } from "./02.keyboard.star.ui.js";
import { MenuKeyboard } from "./03.keyboard.menu.ui.js";

export const UiIndex = {
    botKeyboard: new BotKeyboard(),
    starKeyboard: new StarKeyboard(),
    menuKeyboard: new MenuKeyboard(),
};
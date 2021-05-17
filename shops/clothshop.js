const NativeUI = require("libs/NativeUI");

const Menu = NativeUI.Menu;
const UIMenuItem = NativeUI.UIMenuItem;
const UIMenuListItem = NativeUI.UIMenuListItem;
const UIMenuCheckboxItem = NativeUI.UIMenuCheckboxItem;
const UIMenuSliderItem = NativeUI.UIMenuSliderItem;
const BadgeStyle = NativeUI.BadgeStyle;
const Point = NativeUI.Point;
const ItemsCollection = NativeUI.ItemsCollection;
const Color = NativeUI.Color;
const ListItem = NativeUI.ListItem;
const displayData = {
    drawableTop: -1,
    drawableTorso: -1,
    drawableUndershirt: -1
}

const ui = new Menu("SETUP", "Kleiderladen", new Point(50, 50));

const buttons = {
    submit: new UIMenuItem("Valid", "Dieses Kombination darf verkauft werden."),
    deny: new UIMenuItem("Invalid", "Dieses Kombination ist für die Tonne!"),

    deny_torso: new UIMenuItem("Invalid Torso", "Für dieses Top ist der Torso falsch"),
    deny_undershirt: new UIMenuItem("Invalid Undershirt", "Für dieses Top ist das Undershirt falsch"),
    deny_top: new UIMenuItem("Invalid Top", "Dieses Klediungsstück ist komplett verbuggt und darf nicht verkauft werden"),

    exit: new UIMenuItem("Verlassen", "Ich will hier raus! :D"),
}

buttons.submit.BackColor = new Color(58, 133, 79, 100);
buttons.submit.HighlightedBackColor = new Color(90, 209, 123);
buttons.submit.ForeColor = new Color(255, 255, 255);
buttons.submit.HighlightedForeColor = new Color(255, 255, 255);

buttons.deny.BackColor = new Color(204, 92, 92, 100);
buttons.deny.HighlightedBackColor = new Color(224, 47, 47);
buttons.deny.ForeColor = new Color(255, 255, 255);
buttons.deny.HighlightedForeColor = new Color(255, 255, 255);

buttons.deny_torso.BackColor = new Color(204, 92, 92, 100);
buttons.deny_torso.HighlightedBackColor = new Color(224, 47, 47);
buttons.deny_torso.ForeColor = new Color(255, 255, 255);
buttons.deny_torso.HighlightedForeColor = new Color(255, 255, 255);

buttons.deny_undershirt.BackColor = new Color(204, 92, 92, 100);
buttons.deny_undershirt.HighlightedBackColor = new Color(224, 47, 47);
buttons.deny_undershirt.ForeColor = new Color(255, 255, 255);
buttons.deny_undershirt.HighlightedForeColor = new Color(255, 255, 255);

buttons.deny_top.BackColor = new Color(204, 92, 92, 100);
buttons.deny_top.HighlightedBackColor = new Color(224, 47, 47);
buttons.deny_top.ForeColor = new Color(255, 255, 255);
buttons.deny_top.HighlightedForeColor = new Color(255, 255, 255);

ui.AddItem(buttons.submit);
ui.AddItem(buttons.deny);
ui.AddItem(buttons.deny_top);
ui.AddItem(buttons.deny_torso);
ui.AddItem(buttons.deny_undershirt);
ui.AddItem(buttons.exit);

ui.ItemSelect.on(item => {
    const {drawableTorso, drawableUndershirt, drawableTop} = displayData;
    switch (item.Text) {
        case "Valid":
            mp.events.callRemote("clothshop:setValidation", drawableTorso, drawableUndershirt, drawableTop, true);
            break;
        case "Invalid":
            mp.events.callRemote("clothshop:setValidation", drawableTorso, drawableUndershirt, drawableTop, false);
            break;
        case "Invalid Torso":
            mp.events.callRemote("clothshop:setValidation", drawableTorso, drawableUndershirt, drawableTop, "fTorso");
            break;
        case "Invalid Undershirt":
            mp.events.callRemote("clothshop:setValidation", drawableTorso, drawableUndershirt, drawableTop, "fUndershirt");
            break;
        case "Invalid Top":
            mp.events.callRemote("clothshop:setValidation", drawableTorso, drawableUndershirt, drawableTop, "fTop");
            break;
        case "Verlassen":
            mp.events.callRemote("clothshop:close");
            break;
    }
});

let isClothShopOpen = false;

mp.events.add("clothshop:selectItem", (drawableTop, drawableTorso, drawableUndershirt) => {
    if (!isClothShopOpen) {
        ui.Open();
        mp.gui.chat.show(false);
    }

    mp.players.local.setComponentVariation(3, drawableTorso, 0, 0);
    mp.players.local.setComponentVariation(8, drawableUndershirt, 0, 0);
    mp.players.local.setComponentVariation(11, drawableTop, 0, 0);

    isClothShopOpen = true;
    displayData.drawableTorso = drawableTorso;
    displayData.drawableUndershirt = drawableUndershirt;
    displayData.drawableTop = drawableTop;
});
mp.events.add("clothshop:close", () => {
    ui.Close();
    mp.gui.chat.show(true);

    isClothShopOpen = false;
    displayData.drawableTorso = -1;
    displayData.drawableUndershirt = -1;
    displayData.drawableTop = -1;
});

mp.events.add("render", () => {
    if (!isClothShopOpen) return;

    mp.game.graphics.drawText(JSON.stringify(displayData), [0.5, 0.005], {
        font: 7,
        color: [255, 255, 255, 185],
        scale: [.5, .5],
        outline: true,
        centre: true,
    });
});


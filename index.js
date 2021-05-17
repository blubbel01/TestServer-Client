require("./shops/clothshop");

mp.events.addProc("isMale", () => {
    return mp.players.local.isMale();
});


mp.events.add("notify", (message) => {
    mp.game.graphics.notify(message);
})

mp.keys.bind(188, true, () => {
    mp.players.forEachInStreamRange(player => {
        mp.game.invoke("0x988DB6FE9B3AC000", player.handle, true);
    });
});


let lastWeapon;
mp.events.add("render", () => {
    const currentWeapon = mp.players.local.weapon;
    if (lastWeapon !== currentWeapon) {
        lastWeapon = currentWeapon;
        weaponSwitch();
    }

    mp.game.invoke("0xB1906895227793F3", 0);
    mp.game.invoke("0x29961D490E5814FD", mp.players.local.handle, 2000);
    mp.game.invoke("0x5C8B2F450EE4328E", mp.players.local.handle, true);
});

function weaponSwitch() {
    if (lastWeapon === 0x0A3D4D34) {
        var componentModel = mp.game.weapon.getWeaponComponentTypeModel(0x7BC4CDDC);
        RequestModel(componentModel, 1000, function () {
            mp.game.invoke("0xD966D51AA5B28BB9", mp.players.local.handle >> 0, 0x0A3D4D34, 0x7BC4CDDC); // PDW Flashlight
        });
    }

    mp.players.forEachInStreamRange(player => {

        if (player.weapon === 0x0A3D4D34) {
            var componentModel = mp.game.weapon.getWeaponComponentTypeModel(0x7BC4CDDC);
            RequestModel(componentModel, 1000, function () {
                mp.game.invoke("0xD966D51AA5B28BB9", player.handle >> 0, 0x0A3D4D34, 0x7BC4CDDC); // PDW Flashlight
            });
        }
    });
}


function RequestModel(model, ms, callback) {
    if (model != 0) {
        if (mp.game.streaming.isModelValid(model)) {
            if (!mp.game.streaming.hasModelLoaded(model)) {
                mp.game.streaming.requestModel(model);
                var end = new Date().getTime() + ms;
                let interval = setInterval(() => {
                    if (mp.game.streaming.hasModelLoaded(model) || new Date().getTime() >= end) {
                        clearInterval(interval);
                        callback();
                    }
                }, 100);
            } else {
                callback();
            }
        } else {
            callback();
        }
    } else {
        callback();
    }
}

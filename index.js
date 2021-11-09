// require("./shops/clothshop");

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

});

mp.events.add("playerReady", () => {
    mp.game.invoke("0xB1906895227793F3", 3);
    mp.players.local.setProofs(true, false, false, false, true, true, true, false);
});


mp.events.add('playerWeaponShot', (targetPosition, targetEntity) => {
    mp.game.invoke("0xB1906895227793F3", 3);
});

function weaponSwitch() {
    if (lastWeapon === 0x61012683) {
        const componentModel = mp.game.weapon.getWeaponComponentTypeModel(0x7BC4CDDC);
        RequestModel(componentModel, 1000, function () {
            mp.game.invoke("0xD966D51AA5B28BB9", mp.players.local.handle >> 0, 0x61012683, 0xEAC8C270); // COMPONENT_GUSENBERG_CLIP_02
        });
    }

    mp.players.forEachInStreamRange(player => {

        if (player.weapon === 0x61012683) {
            const componentModel = mp.game.weapon.getWeaponComponentTypeModel(0x7BC4CDDC);
            RequestModel(componentModel, 1000, function () {
                mp.game.invoke("0xD966D51AA5B28BB9", player.handle >> 0, 0x61012683, 0xEAC8C270); // COMPONENT_GUSENBERG_CLIP_02
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

mp.events.add('outgoingDamage', (sourceEntity, targetEntity, targetPlayer, c_weapon, boneIndex, damage) => {
    if (mp.players.local.isPerformingStealthKill()) {
        return true;
    }

    if (targetEntity.type === "player" && targetPlayer != null) {
        if (mp.players.local.isInAnyVehicle(false) && !targetPlayer.isInAnyVehicle(false)) {
            if (!targetEntity.isSwimmingUnderWater() && !targetEntity.isSwimming()) {
                return true;
            }
        }

        if (c_weapon == 0x1D073A89) {
            mp.events.callRemote("playerShotPlayer", targetPlayer.name, String(c_weapon), boneIndex);
            if (boneIndex === 20) {
                return true;
            }
        } else {
            mp.events.callRemote("playerShotPlayer", targetPlayer.name, String(c_weapon), boneIndex);
        }
    }
});

let lastWeaponHash;
mp.events.add("render", () => {
    const currentWeapon = mp.players.local.weapon;
    if (lastWeaponHash !== lastWeaponHash) {
        lastWeaponHash = Number(currentWeapon);
    }
});

const accuracyMap = new Map();
accuracyMap.set(Number(mp.game.joaat("weapon_assaultrifle")), 50);
accuracyMap.set(Number(mp.game.joaat("weapon_compactrifle")), 85);
accuracyMap.set(Number(mp.game.joaat("weapon_machinepistol")), 100);
accuracyMap.set(Number(mp.game.joaat("weapon_combatmg_mk2")), 50);
accuracyMap.set(Number(mp.game.joaat("weapon_gusenberg")), 100);
accuracyMap.set(Number(mp.game.joaat("weapon_snowball")), 100);
accuracyMap.set(Number(mp.game.joaat("weapon_microsmg")), 100);
accuracyMap.set(Number(mp.game.joaat("weapon_appistol")), 100);

mp.events.add("playerWeaponShot", () => {
    const accuracy = accuracyMap.has(lastWeaponHash) ? accuracyMap.get(lastWeaponHash) : 0;

    if (accuracy) {
        if (accuracy >= 100) {
            mp.players.local.setAccuracy(100);
        } else {
            if (Math.random() <= (accuracy / 100)) {
                mp.players.local.setAccuracy(100);
            } else {
                mp.players.local.setAccuracy(99);
            }
        }
    } else {
        mp.players.local.setAccuracy(99);
    }
});

export class war {

    static async powerSurge(args) {
        if (args[0].item.type !== "spell") return {}
        if (args[0].hitTargets.length < 1) return {};
        let { resources } = actor.data.data;
        let [key, object] = Object.entries(resources).find(([key, object]) => key === "Power Surge" || object.label === "Power Surge");
        if (!key || !object) return {};
        if (object.value < 1) return {}
        let value = `data.resources.${key}.value`
        token = canvas.tokens.get(args[0].tokenId);
        actor = token.actor;
        if (!actor || !token || args[0].hitTargets.length < 1) return {};
        let target = canvas.tokens.get(args[0].hitTargets[0]._id);
        if (game.combat) {
            let combatTime = game.combat.round + game.combat.turn / 100;
            let lastTime = getProperty(token.data.flags, "midi-qol.powerSurgeTime");
            if (combatTime === lastTime) {
                MidiQOL.warn("Already used Power Surge this turn");
                return {};
            }
        }
        let useSurge = false
        if (!useSurge) {
            let dialog = new Promise((resolve, reject) => {
                new Dialog({
                    // localize this text
                    title: "Conditional Damage",
                    content: `<p>Use Power Surge?</p>`,
                    buttons: {
                        one: {
                            icon: '<i class="fas fa-check"></i>',
                            label: "Confirm",
                            callback: () => resolve(true)
                        },
                        two: {
                            icon: '<i class="fas fa-times"></i>',
                            label: "Cancel",
                            callback: () => { resolve(false) }
                        }
                    },
                    default: "two"
                }).render(true);
            });
            useSurge = await dialog;
            if (!useSurge) return {}
            const wizardLevels = actor.getRollData().classes.wizard?.levels;
            if (game.combat) {
                let combatTime = game.combat.round + game.combat.turn / 100;
                let lastTime = getProperty(token.data.flags, "midi-qol.powerSurgeTime");
                if (combatTime !== lastTime) {
                    await token.setFlag("midi-qol", "powerSurgeTime", combatTime)
                }
            }
            await actor.update({ value: object.value - 1 })
            return { damageRoll: `${Math.floor(wizardLevels / 2)}[force]`, flavor: "Power Surge" };
        }
    }

    static async powerSurgeRecharge(workflow) {
        if (workflow.actor.items.find(i => i.name === "Power Surge")) {
    
            new Dialog({
                title: "Power Surge",
                content: "Did you successfully end a spell with Counterspell or Dispel Magic",
                buttons: {
                    one: {
                        label: "Yes",
                        callback: async () => {
                            let { resources } = actor.data.data;
                            let [key, object] = Object.entries(resources).find(([key, object]) => key === "Power Surge" || object.label === "Power Surge");
                            if (!key || !object) return;
                            let value = `data.resources.${key}.value`
                            await workflow.actor.update({ [value]: Number(surge.value) += 1 })
                        }
                    }
                }
            })
        }
    }

    static durableMagic(effect, data){
        if (effect.parent.items.getName("Durable Magic")) {
            data.changes = [
                {
                    key: "data.attributes.ac.bonus",
                    mode: 2,
                    priority: 20,
                    value: "+2"
                },
                {
                    key: "data.bonuses.abilities.save",
                    mode: 2,
                    priority: 20,
                    value: "+2"
                },
            ]
            effect.data.update({ changes: data.changes })
        }
    }
}
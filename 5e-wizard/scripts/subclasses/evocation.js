export class evocation {

    static async empoweredEvocation(args) {
        let workflow = args[0]
        let token = canvas.tokens.get(workflow.tokenId);
        let actor = token.actor;
        if (game.combat) {
            let combatTime = game.combat.round + game.combat.turn / 100;
            let lastTime = getProperty(token.data.flags, "midi-qol.empoweredEvocationTime");
            if (combatTime === lastTime) {
                MidiQOL.warn("Empowered Evocation Damage: Already used this turn");
                return {};
            }
        }
        if (workflow.item.data.school !== "evo") return {}
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
                // localize this text
                title: "Conditional Damage",
                content: `<p>Use Empowered Evocation?</p>`,
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
        let use = await dialog
        if (use) {
            if (game.combat) {
                let combatTime = game.combat.round + game.combat.turn / 100;
                let lastTime = getProperty(token.data.flags, "midi-qol.empoweredEvocationTime");
                if (combatTime !== lastTime) {
                    await token.setFlag("midi-qol", "empoweredEvocationTime", combatTime)
                }
            }

            // How to check that we've already done one this turn?
            let wizard = actor.items.getName("Wizard")
            let damage = wizard.data.data.levels
            return { damageRoll: `${damage}`, flavor: "Empowered Evocation" };
        }
    }

    static async overChannel(args) {
        let workflow = args[0]
        let token = canvas.tokens.get(workflow.tokenId);
        let actor = token.actor;
        let usage = actor.getFlag("world", "overchannel") || 0
        usage++
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
                // localize this text
                title: `Overchannel: Use ${usage} (${usage * workflow.spellLevel}d12 self damage)`,
                content: `<p>Overchannel the spell?</p>`,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Confirm",
                        callback: () => {
                            resolve(true)
                        }
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
        let use = await dialog
        if (use) {
            let dice = workflow.damageRoll.formula
            let match = dice.match(/([0-9]+|[0-9]*d0*[1-9][0-9]*)/)
            let total = match[0] * match[1]
            let damage = total - workflow.damageRoll.total
            await actor.setFlag("world", "overchannel", usage)
            if (usage > 1) {
                let damageRoll = new Roll(`${usage * workflow.spellLevel}d12`).roll({ async: false })
                damageRoll.toMessage({ flavor: "Overcharge self damage" })
                actor.applyDamage(damageRoll.total)
            }
            return { damageRoll: `${damage}`, flavor: "Overchannel" };
        }
    }

    static async sculptSpell(args) {
        let workflow = args[0]
        if (workflow.item.type !== "spell") return
        let dialog = new Promise((resolve, reject) => {
            let targets = Array.from(workflow.targets)
            let content = targets.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, "")
            let max = workflow.spellLevel
            new Dialog({
                // localize this text
                title: "Sculpt Spells",
                content: `
                    <form class="flexcol">
                    <h3>Ignore tokens (maximum of ${1+max} tokens):</h3>
                        <div class="form-group">
                        <select id="remove" multiple>
                            ${content}
                        </select>
                        </div>
                    </form>`,
                buttons: {
                    one: {
                        icon: '<i class="fas fa-check"></i>',
                        label: "Confirm",
                        callback: (html) => {
                            let ids = html.find('#remove').val()
                            resolve(ids)
                        }
                    },
                },
            }).render(true);
        });
        let ids = await dialog;
        let targets = duplicate(workflow.hitTargets)
        targets = targets.filter(i => !ids.includes(i._id))
        workflow.hitTargets = targets
    }
}
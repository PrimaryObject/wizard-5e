
export class graviturgy {

    static async adjustDensity(args) {
        const lastArg = args[args.length - 1];
        let tactor;
        if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
        else tactor = game.actors.get(lastArg.actorId);
        let effect = tactor.effects.get(lastArg.effectId)
        let item = await fromUuid(lastArg.origin)
        let caster = item.parent

        const maxSize = caster.items.getName("Wizard").data.data.levels < 10 ? ["tiny", "sm", "med", "lrg"] : ["tiny", "sm", "med", "lrg", "huge"]
        if (!maxSize.includes(tactor.data.data.traits.size)) {
            ui.notification.notify("Target is too large to use Adjust Density")
            return
        }
        if (args[0] === "on") {
            new Dialog({
                title: "Change weight",
                buttons: {
                    one: {
                        label: "Increase",
                        callback: async () => {
                            let effect = tactor.effects.get(lastArg.effectId)
                            let data = [
                                {
                                    key: "data.attributes.movement.all",
                                    mode: 0,
                                    priority: 20,
                                    value: "+10"
                                },
                                {
                                    key: "flags.midi-qol.advantage.ability.save.str",
                                    mode: 2,
                                    priority: 20,
                                    value: "1",
                                },
                                {
                                    key: "flags.midi-qol.advantage.ability.check.str",
                                    mode: 2,
                                    priority: 20,
                                    value: "1",
                                },
                            ];
                            await effect.update({ "changes": data })
                        }
                    },
                    two: {
                        label: "Decrease",
                        callback: async () => {
                            let effect = tactor.effects.get(lastArg.effectId)
                            let data = [
                                {
                                    key: "data.attributes.movement.all",
                                    mode: 0,
                                    priority: 20,
                                    value: "-10"
                                },
                                {
                                    key: "flags.midi-qol.disadvantage.ability.save.str",
                                    mode: 2,
                                    priority: 20,
                                    value: "1",
                                },
                                {
                                    key: "flags.midi-qol.disadvantage.ability.check.str",
                                    mode: 2,
                                    priority: 20,
                                    value: "1",
                                },
                            ];
                            await effect.update({ "changes": data })
                        }
                    },
                }
            }).render(true);
        }
    }
}
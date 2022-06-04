import { abjuration } from './subclasses/abjuration.js';
import { conjuration } from './subclasses/conjuration.js';
import { bladesinging } from './subclasses/bladesinging.js';
import { divination as divination } from './subclasses/divination.js';
import { evocation } from './subclasses/evocation.js';
import { graviturgy } from './subclasses/graviturgy.js';
import { scribes } from './subclasses/scribes.js';
import { transmutation } from './subclasses/transmutation.js';
import { war } from './subclasses/war.js';
import { necromancy } from './subclasses/necromancy.js';
import { core } from './core.js';

Hooks.on("restCompleted", async (actor, data) => {
    if (!data.longRest) return;
    let scrolls = actor.items.filter(i => i.getFlag("world", "masterScrivener"))?.map(i => i._id)
    if (scrolls) {
        await actor.deleteEmbeddedDocuments("Item", scrolls)
        await ChatMessage.create({ content: `${actor.name} has all of their Master Scrolls removed` })
    }

    if (actor.items.find(i => i.name === "Arcane Ward")) {
        let { resources } = actor.data.data;
        let [key, object] = Object.entries(resources).find(([key, object]) => key === "Arcane Ward" || object.label === "Arcane Ward") || [null, null];
        if (!key || !object) return;
        let value = `data.resources.${key}.value`
        let label = `data.resources.${key}.label`
        await actor.update({ [value]: 0, [label]: "Arcane Ward - Spent" })
        await ChatMessage.create({ content: `${actor.name} has their Arcane Ward reset` })
    }

    if (actor.getFlag("world", "overchannel")) {
        await actor.setFlag("world", "overchannel", 0)
        await ChatMessage.create({ content: `${actor.name} has their Overchannel count reset` })
    }
    if (actor.items.getName("Power Surge")) {
        let { resources } = actor.data.data;
        let [key, object] = Object.entries(resources).find(([key, object]) => key === "Power Surge" || object.label === "Power Surge") || [null, null];
        if (!key || !object) return;
        let value = `data.resources.${key}.value`
        await actor.update({ [value]: 1 })
        await ChatMessage.create({ content: `${actor.name} has their Power Surge reset` })

    }
})



Hooks.on("midi-qol.RollComplete", (workflow) => {
    abjuration.updateWards(workflow)
    necromancy.grimHarvest(workflow)
    war.powerSurgeRecharge(workflow)
    divination.expertDivination(workflow)
    conjuration.resetBenign(workflow)
})


Hooks.on("preUpdateActor", async (actor, update) => {
    if (actor.items.getName("Arcane Ward")) {
        await abjuration.selfWards(actor, update)
    }
    let effect = actor.effects.find(i => i.data.label === "Arcane Wards Projected")
    if (effect) {
        await abjuration.projectedWards(actor, update, effect)
    }
    /**if (actor.items.getName("Song of Defense")) {
        bladesinging.songOfDefense(actor, update)
    }*/
});

Hooks.on("preCreateActiveEffect", (effect, data) => {
    if (effect.parent.items.getName("Focused Conjuration")) {
        conjuration.focusedConjuration(effect, data)
    }
    if (effect.data.label === "Concentrating") {
        war.durableMagic(effect, data)
    }
})

Hooks.on("preCreateActiveEffect", async (effect) => {
    let item = effect.parent.items.getName("Deflecting Shroud")
    if (effect.data.label === "Arcane Deflection" && !!item) {
        new Dialog({
            // localize this text
            title: "Deflecting Shroud",
            content: `<p>Target up to 3 enemies to damage</p>`,
            buttons: {
                one: {
                    icon: '<i class="fas fa-check"></i>',
                    label: "Confirm",
                    callback: async () => {
                        await item.roll()
                    }
                },
                two: {
                    icon: '<i class="fas fa-times"></i>',
                    label: "Cancel",
                }
            },
            default: "two"
        }).render(true);
    }
})

Hooks.on("renderAbilityUseDialog", scribes.changeTitle);
Hooks.on("midi-qol.DamageRollComplete", async (workflow) => {
    
    scribes.changeDamageType
});

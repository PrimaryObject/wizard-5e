export class abjuration {
    static async updateWards(workflow) {
        if (!workflow.actor.items.find(i => i.name === "Arcane Ward")) return
        if (workflow.item.labels?.school === "Abjuration") {
            let actor = game.actors.get(workflow.actor.id)
            let resources = Object.entries(actor.data.data.resources);
            let newValue, newName = "Arcane Ward";
            let maxVal = actor.items.getName("Wizard").data.data.levels * 2 + actor.data.data.abilities.int.mod
            let [key, object] = resources.find(([key, object]) => object.label.includes("Arcane Ward")) || [null, null];
            if (!key || !object) {
                [key, object] = resources.find(([key, object]) => key === "" || object.label === "");
                newValue = maxVal
            }
            else if (object.label === "Arcane Ward") {
                newValue = Math.min(object.value + workflow.itemLevel * 2, maxVal)
            }
            else {
                newValue = actor.items.getName("Wizard").data.data.levels * 2 + actor.data.data.abilities.int.mod
            }
            let resource = `data.resources.${key}.label`
            let value = `data.resources.${key}.value`
            await actor.update({ [resource]: newName, [value]: newValue })
        }
    
    }

    static async selfWards(actor, update){
        let newhp = getProperty(update, "data.attributes.hp.value");
        let oldhp = getProperty(actor, "data.data.attributes.hp.value")
        let delta = oldhp - newhp;
        if (delta > 0) {
            let { resources } = actor.data.data;
            let [key, object] = Object.entries(resources).find(([key, object]) => key === "Arcane Ward" || object.label === "Arcane Ward");
            if(!key || !object) return;
            let value = object.value
            let change = Math.min(delta, value)
            update.data.attributes.hp.value += change;
            update.data.resources = { [key]: { value: value - change } }
            ui.notifications.notify(`Damage to ${actor.name} is reduced by ${change}`)
        }
    }

    static async projectedWards(actor, update, effect){
        let newhp = getProperty(update, "data.attributes.hp.value");
        let oldhp = getProperty(actor, "data.data.attributes.hp.value")
        let delta = oldhp - newhp;
        if (delta > 0) {
            let source = game.actors.get(effect.data.origin.split(".")[1])
            let { resources } = source.data.data;
            let [key, object] = Object.entries(resources).find(([key, object]) => key === "Arcane Ward" || object.label === "Arcane Ward");
            if(!key || !object) return;
            let value = object.value
            let change = Math.min(delta, value)
            update.data.attributes.hp.value += change;
            await source.update({ [`data.resources.${key}.value`]: value - change })
            ui.notifications.notify(`Damage to ${actor.name} is reduced by ${change}`)
        }
    }
}
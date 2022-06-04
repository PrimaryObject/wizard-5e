export class necromancy {
    static async grimHarvest(workflow) {
        if (!workflow.actor.items.getName("Grim Harvest")) return
        let deaths = 0
        for (let t of workflow.damageList) {
            if (["undead", "construct"].includes(game.actors.get(t.actorId).data.data.details.type?.value)) continue
            debugger
            if (t.newHP < 1) deaths++
        }
        if (deaths) {
            let multi = workflow.item.labels?.school === "Necromancy" ? 3 : 2
            let hp = deaths * multi * workflow.itemLevel
            await workflow.actor.applyDamage(-hp)
            ChatMessage.create({content: `${workflow.actor.name} is healed for ${hp} through their Grim Harvest`})
        }
    
    }
}
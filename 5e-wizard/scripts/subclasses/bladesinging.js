export class bladesinging {
    /**static async songOfDefense(args) {
        let actor = game.actors.get(args[0].actor._id)

        let spells = Object.entries(actor.data.data.spells).filter(([key, object]) => object.max > 0);
        let content = ""
        spells.forEach((s) => {
            let name = s[0].slice(5, 6)
            let slots = `${s[1].value}/${s[1].max}`
            content += `<option value="${s[0]}">Level ${name}: ${slots}</option>`
        })
        let dialog = new Promise((resolve, reject) => {
            new Dialog({
                title: "Song of Defense",
                content: `
                <p>Expand a spell slots to block 5 times that spell level in damage</p>
                <form class="flexcol">
                <div class="form-group">
                  <select id="spell">
                    ${content}
                  </select>
                </div>
                `,
                buttons: {
                    confirm: {
                        label: "Confirm",
                        callback: async (html) => {
                            let spell = html.find("#spell").val()
                            let spellData = actor.data.data.spells[`${spell}`]
                            let path = `data.spells.${spell}.value`
                            let newVal = spellData.value - 1
                            await actor.update({ [path]: newVal })
                            resolve(spell.slice(5) * 5)
                        }
                    }
                }
            }).render(true)
        })
        let use = await dialog
        await actor.createEmbeddedDocuments("ActiveEffect", [{
            data: {
                changes: [{ key: "flags.midi-qol.DR.all", mode: 2, priority: 20, value: `${use}` }],
                flags: { dae: { specialDuration: ["isHit"] } }
            }
        }])
    }*/
}
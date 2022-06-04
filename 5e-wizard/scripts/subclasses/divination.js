export class divination {
    static async thirdEye(actor) {
        new Dialog({
            title: "Third Eye choice",
            content: `
            <form class="flexcol">
                <div class="form-group">
                  <select id="choice">
                    <option value="dark">Darkvision 60ft</option>
                    <option value="ethereal">Ethereal Sight 60ft</option>
                    <option value="lang">Greater Comprehension</option>
                    <option value="invis">See Invisibility 10ft</option>
                  </select>
                </div>
        
            `,
            buttons: {
                one: {
                    label: "Ok",
                    callback: async (html) => {
                        let value = html.find('#choice').val()
                        let changes;
                        switch (value) {
                            case "dark": changes = {
                                key: "ATL.dimVision",
                                mode: 4,
                                priority: 20,
                                value: "60"
                            }
                                break;
                            case "ethereal": changes = {
                                key: "changes.attributes.senses.special",
                                mode: 2,
                                priority: 20,
                                value: "Ethereal Sight 60ft"
                            }
                                break;
                            case "lang": changes = {
                                key: "changes.traits.languages.all",
                                mode: 0,
                                priority: 20,
                                value: "1"
                            }
                                break;
                            case "invis": changes = {
                                key: "changes.attributes.senses.special",
                                mode: 2,
                                priority: 20,
                                value: "See invisibility 10ft"
                            }
                        }
                        let data = {
                            label: "Third Eye",
                            changes: [changes],
                            icon: "icons/magic/perception/third-eye-blue-red.webp"
                        }
                        await actor.createEmbeddedDocuments("ActiveEffect", [data])
                    }
                },
            }
        }).render(true)
    }

    static async expertDivination(workflow) {
        if (workflow.item.type !== "spell") return
        if (workflow.itemLevel < 2) return;
        if (workflow.item.data.data.school !== "div") return;
        let spells = Object.entries(workflow.actor.data.data.spells).filter(([key, object]) => object.max > 0 && Number(key.slice(5)) < workflow.itemLevel && Number(key.slice(5)) < 6);
        let content = ""
        spells.forEach((s) => {
            let name = s[0].slice(5, 6)
            let slots = `${s[1].value}/${s[1].max}`
            content += `<option value="${s[0]}">Level ${name}: ${slots}</option>`
        })
        new Dialog({
            title: "Expert Divination",
            content: `
            <p>Recover a spell slot</p>
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
                    callback: async(html) => {
                        let spell = html.find("#spell").val()
                        let spellData = workflow.actor.data.data.spells[`${spell}`]
                        let newVal = Math.min(spellData.max, spellData.value +1)
                        let path = `data.spells.${spell}.value`
                        await workflow.actor.update({[path] : newVal, })
                    }
                }
            }
        }).render(true)
    }

}
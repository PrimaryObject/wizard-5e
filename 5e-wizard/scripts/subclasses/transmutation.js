export class transmutation {

    static async transmutorsStone(actor) {
        let item = actor.items.find(i => i.name === "Transmuter's Stone" && i.type === "consumable")
        let flag = actor.getFlag("world", "Transmuter’s Stone")
        if (flag && !item) {
            ui.notifications.error("You do not have your Transmuter’s Stone on your person")
            return;
        }

        new Dialog({
            title: "Transmuter’s Stone",
            content: `
                <form class="flexcol">
                <h3>Select Stone Properties</h3>
                    <div class="form-group">
                    <select id="choice">
                        <option value="dark">Darkvision 60ft</option>
                        <option value="speed">Speed 10ft</option>
                        <option value="con">Proficiency in Con saves</option>
                        <option value="acid">Acid Resistance </option>
                        <option value="cold">Cold Resistance </option>
                        <option value="fire">Fire Resistance </option>
                        <option value="lightning">Lighting Resistance </option>
                        <option value="thunder">Thunder Resistance </option>
                    </select>
                    </div>
                </form>
                `,
            buttons: {
                one: {
                    label: "Select",
                    callback: async (html) => {
                        let first = html.find('#choice').val()
                        let changes;
                        switch (first) {
                            case "dark": changes = {
                                key: "ATL.dimVision",
                                mode: 4,
                                priority: 20,
                                value: "60"
                            }
                                break
                            case "speed": changes = {
                                key: "data.attributes.movement.all",
                                mode: 2,
                                priority: 20,
                                value: "+10"
                            }
                                break
                            case "con": changes = {
                                key: "data.abilities.con.proficient",
                                mode: 4,
                                priority: 20,
                                value: "1"
                            }
                                break
                            case "acid": changes = {
                                key: "data.traits.dr.value",
                                mode: 0,
                                priority: 20,
                                value: "acid"
                            }
                                break
                            case "cold": changes = {
                                key: "data.traits.dr.value",
                                mode: 0,
                                priority: 20,
                                value: "cold"
                            }
                                break
                            case "fire": changes = {
                                key: "data.traits.dr.value",
                                mode: 0,
                                priority: 20,
                                value: "fire"
                            }
                                break
                            case "lightning": changes = {
                                key: "data.traits.dr.value",
                                mode: 0,
                                priority: 20,
                                value: "lightning"
                            }
                                break
                            case "thunder": changes = {
                                key: "data.traits.dr.value",
                                mode: 0,
                                priority: 20,
                                value: "thunder"
                            }
                        }
                        let data = {
                            label: "Transmuter’s Stone",
                            changes: [changes],
                            icon: "icons/commodities/stone/engraved-symbol-water-grey.webp"
                        }
                        let itemData = {
                            "name": "Transmuter's Stone",
                            "type": "consumable",
                            "img": "icons/commodities/stone/engraved-symbol-water-grey.webp",
                            "data": {
                                "consumableType": "trinket",
                                "equipped": true,
                                "attunement": 0,
                            },
                            "effects": [
                                data
                            ],
                        }
                        if (item) { item.delete() }
                        await actor.createEmbeddedDocuments("Item", [itemData])
                        await actor.setFlag("world", "Transmuter’s Stone", true)
                    },
                },
            },
        }).render(true)
    }

    static async masterTransmuter(actor){
        let item = actor.items.find(i => i.name === "Transmuter's Stone" && i.type === "consumable")
        let flag = actor.getFlag("world", "Transmuter’s Stone")
        if (flag && !item) {
            ui.notifications.error("You do not have your Transmuter’s Stone on your person")
            return;
        }
        await actor.deleteEmbeddedDocuments("Item", [item.id])
        await actor.unsetFlag("world", "Transmuter’s Stone")
    }
}
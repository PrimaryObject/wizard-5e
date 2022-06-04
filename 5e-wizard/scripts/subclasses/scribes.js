export class scribes {

    static async changeTitle(dialog, html) {
        if (!dialog.item.parent.items.getName("Awakened Spellbook")) return
        let damageTypeDropdown = `
            <div class="form-group">
                    <label>Change Element</label>
                    <div class="form-fields">
                        <select name="damageType">
                        
                        </select>
                    </div>
                </div>
            `;
        await dialog.item.parent.unsetFlag("world", `scribeElement`);
        const spellLevelDropdown = html.find($('select[name="level"]'));
        html.find($('button[class="dialog-button use default"]')).click(flagDamage)
        async function flagDamage() {
            const selectedDamage = html.find($('select[name="damageType"]'))[0].value;
            await dialog.item.parent.setFlag("world", `scribeElement`, selectedDamage);
        }
        spellLevelDropdown.change(updateDamageTypes);
        const insertPoint = html.find($('div[class="form-group"]')).eq(1);
        insertPoint.before(damageTypeDropdown);
        html.css("height", "auto");
        updateDamageTypes();

        function updateDamageTypes() {
            const selectedLevel = spellLevelDropdown[0].value;
            const damageDropDown = html.find($('select[name="damageType"]'));
            const userSpells = dialog.item.parent.items.filter(i => i.data.data.level == selectedLevel);
            let elements = [];
            for (let spell of userSpells) {
                for (let damage of spell.data.data.damage.parts) {
    
                    if (damage) {
                        if (damage[1]) elements.push(damage[1]);
                    }
                }
            }
            var uniqueElements = [];
            $.each(elements, function (i, el) {
                if ($.inArray(el, uniqueElements) === -1) uniqueElements.push(el);
            });
            uniqueElements.sort();
            let damageTypeUpdatedHtml = `<select name="damageType"><option value="nochange">No Change</option>`;
            for (let elem of uniqueElements) {
                damageTypeUpdatedHtml += `<option value="${elem.toLowerCase()}">${elem.charAt(0).toUpperCase() + elem.slice(1)}</option>`
            }
            damageTypeUpdatedHtml += `</select>`;
            damageDropDown.replaceWith(damageTypeUpdatedHtml);
    
        };
    }


    static async changeDamageType(workflow) {
        if (!workflow.actor.items.getName("Awakened Spellbook")) return

        const elementReplace = workflow.actor.getFlag("world", `scribeElement`);
        if (elementReplace && elementReplace != "nochange") {
            workflow.damageDetail[0].type = elementReplace;
            await workflow.actor.unsetFlag("world", `scribeElement`);

            let cont = `<div class="dnd5e chat-card item-card midi-qol-item-card">
                <header class="card-header flexrow">
                <img src="systems/dnd5e/icons/items/inventory/book-blue.jpg" title="Awakened Spellbook" width="36" height="36" />
                <h3 class="item-name">Awakened Spellbook</h3>
            </header></div>
            <div class="dice-roll">The damage type was changed to
                <div class="dice-result"><h4 class="dice-total">${elementReplace.charAt(0).toUpperCase() + elementReplace.slice(1)}</h4>
                </div>`;
            ChatMessage.create({ speaker: { alias: workflow.actor.data.name }, content: cont });

        }
        else if (elementReplace == "nochange") {
            await workflow.actor.unsetFlag("world", `scribeElement`);
        }

    }

    static async masterScrivener(actor) {
        let spells = actor.items.filter(i => i.data.data.level < 3)
        let options = spells.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, ``)

        new Dialog({
            title: "Select Spell to copy",
            content: `
            <form class="flexcol">
                <div class="form-group">
                    <select id="spell">
                    ${options}
                    </select>
                </div>
                `,
            buttons: {
                one: {
                    label: "Select",
                    callback: async (html) => {
                        let value = html.find('#spell').val()
                        let spell = duplicate(actor.items.get(value))
                        let damage = game.dnd5e.entities.Item5e.prototype._scaleDamage(spell.data.damage.parts[0], spell.data.scaling.formula, 1, actor.getRollData())
                        spell.name = `Empowered ${spell.name}`
                        spell.data.damage.parts[0][0] = damage[0]
                        spell = await game.dnd5e.entities.Item5e.createScrollFromSpell(spell)
                        let newSpell = await actor.createEmbeddedDocuments("Item", [spell.data])
                        await newSpell[0].setFlag("world", "masterScrivener", true)

                    }
                },
            }
        }).render(true)
    }

}
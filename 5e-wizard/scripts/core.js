export class core {

    static async signatureSpell(actor) {

        const first = actor.getFlag("world", "wizardSignatureSpell1st") || []
        const second = actor.getFlag("world", "wizardSignatureSpell2nd") || []
        let spell1 = actor.items.get(first[0])
        let spell2 = actor.items.get(second[0])
        let spellContent = ``
        if (spell1) {
            spellContent += `
          <label class="radio-label" ${first[1] ? "disabled" : ""}>
            <input type="radio" name="spell" value="${spell1.id}.1" ${first[1] ? "disabled" : ""}>
            <img src="${spell1.img}" style="border:0px; width: 50px; height:50px;" ${first[1] ? "disabled" : ""}>
            ${spell1.data.name}
          </label>
          `}
        if (spell2) {
            spellContent += `
          <label class="radio-label" ${second[1] ? "disabled" : ""}>
            <input type="radio" name="spell" value="${spell2.id}.2" ${second[1] ? "disabled" : ""}>
            <img src="${spell2.img}" style="border:0px; width: 50px; height:50px;" ${second[1] ? "disabled" : ""}>
            ${spell2.data.name}
          </label>
          `}
        const content = `
          <form class ="spellMastery">
            <div class="form-group" id="spells">
            ${spellContent}
          </div>
          `
        new Dialog({
            title: "Signature Spell",
            content: content,
            buttons: {
                one: {
                    label: "Cast",
                    callback: async (html) => {
                        let value = $("input[type='radio'][name='spell']:checked").val().split(".");
                        let spell = actor.items.get(value[0])
                        let mode = duplicate(spell.data.data.preparation.mode)
                        await spell.update({ "data.preparation.mode": "atwill" })
                        await spell.roll({ configureDialog: false })
                        await spell.update({ "data.preparation.mode": mode })
                        let flagString = value[1] === "1" ? "wizardSignatureSpell1st" : "wizardSignatureSpell2nd"
                        await actor.setFlag("world", flagString, [value[0], true])
                    }
                },
                two: {
                    label: "Add",
                    callback: () => {
                        core.addSpellSS(actor)
                    }
                }
            }
        }).render(true)


    }

    static async spellMastery(actor) {

        const first = actor.getFlag("world", "wizardSpellMastery1st") || []
        const second = actor.getFlag("world", "wizardSpellMastery2nd") || []
        let spell1 = actor.items.get(first)
        let spell2 = actor.items.get(second)
        let spellContent = ``
        if (spell1) {
            spellContent += `
<label class="radio-label">
    <b>First Level</b>
    <input type="radio" name="spell" value="${spell1.id}.1">
    <img src="${spell1.img}" style="border:0px; width: 50px; height:50px;">
    ${spell1.data.name}
</label>
`}
        if (spell2) {
            spellContent += `
<label class="radio-label">
    <b>Second Level</b>
    <input type="radio" name="spell" value="${spell2.id}.2">
    <img src="${spell2.img}" style="border:0px; width: 50px; height:50px;"}>
    ${spell2.data.name}
</label>
`}
        const content = `
<form class ="spellMastery">
    <div class="form-group" id="spells">
    ${spellContent}
</div>
`
        new Dialog({
            title: "Spell Mastery",
            content: content,
            buttons: {
                one: {
                    label: "Cast",
                    callback: async (html) => {
                        let value = $("input[type='radio'][name='spell']:checked").val().split(".");
                        let spell = actor.items.get(value[0])
                        let mode = duplicate(spell.data.data.preparation.mode)
                        await spell.update({ "data.preparation.mode": "atwill" })
                        await spell.roll({ configureDialog: false })
                        await spell.update({ "data.preparation.mode": mode })
                    }
                },
                two: {
                    label: "Add",
                    callback: () => {
                        core.addSpellSM(actor)
                    }
                }
            }
        }).render(true)

    }

    static addSpellSS(actor) {
        let first = actor.items.filter(i => i.data.data.level === 3)
        let second = actor.items.filter(i => i.data.data.level === 3)
        let firstData = first.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, ``)
        let secondData = second.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, ``)

        new Dialog({
            title: "Signature Spell select spells",
            content: `
            <form class="flexcol">
            <h3>First 3rd Level Spell</h3>
                <div class="form-group">
                  <select id="first">
                    ${firstData}
                  </select>
                </div>
            <h3>Second 3rd Level Spell</h3>
                <div class="form-group">
                  <select id="second">
                    ${secondData}
                  </select>
                </div>
              </form>
            `,
            buttons: {
                one: {
                    label: "Set Mastery Spells",
                    callback: async (html) => {
                        let first = html.find('#first').val()
                        let second = html.find('#second').val()
                        await actor.setFlag("world", "wizardSignatureSpell1st", [first, false])
                        await actor.setFlag("world", "wizardSignatureSpell2nd", [second, false])
                    }
                }
            }
        }).render(true)
    }

    static addSpellSM(actor) {
        let first = actor.items.filter(i => i.data.data.level === 1)
        let second = actor.items.filter(i => i.data.data.level === 2)
        let firstData = first.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, ``)
        let secondData = second.reduce((a, v) => { return a += `<option value="${v.id}">${v.name}</option>` }, ``)

        new Dialog({
            title: "Spell Mastery select spells",
            content: `
            <form class="flexcol">
            <h3>First Level Spell</h3>
                <div class="form-group">
                  <select id="first">
                    ${firstData}
                  </select>
                </div>
            <h3>Second Level Spell</h3>
                <div class="form-group">
                  <select id="second">
                    ${secondData}
                  </select>
                </div>
              </form>
            `,
            buttons: {
                one: {
                    label: "Set Mastery Spells",
                    callback: async (html) => {
                        let first = html.find('#first').val()
                        let second = html.find('#second').val()
                        await actor.setFlag("world", "wizardSpellMastery1st", first)
                        await actor.setFlag("world", "wizardSpellMastery2nd", second)
                    }
                }
            }
        }).render(true)
    }
}
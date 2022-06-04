export class conjuration {

    static async benignTransposition(args) {
        //DAE Macro Execute, Effect Value = "Macro Name" @target 
        if (!game.modules.get("advanced-macros")?.active) { ui.notifications.error("Please enable the Advanced Macros module"); return; }

        if (args[0].tag === "OnUse") {
            if (args[0].hitTargets?.length > 0) return

            let tactor = args[0].actor;
            let target = canvas.tokens.get(args[0].tokenId)
            let range = canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [{
                t: "circle",
                user: game.user._id,
                x: target.x + canvas.grid.size / 2,
                y: target.y + canvas.grid.size / 2,
                direction: 0,
                distance: 30,
                borderColor: "#FF0000",
                flags: {
                    world: {
                        benignTranposition: {
                            ActorId: tactor.id
                        }
                    }
                }
            }]);

            range.then(result => {
                let templateData = {
                    t: "rect",
                    user: game.user._id,
                    distance: 7.5,
                    direction: 45,
                    x: 0,
                    y: 0,
                    fillColor: game.user.color,
                    flags: {
                        world: {
                            benignTranposition: {
                                ActorId: tactor.id
                            }
                        }
                    }
                };

                Hooks.once("createMeasuredTemplate", deleteTemplatesAndMove);
                let doc = new CONFIG.MeasuredTemplate.documentClass(templateData, { parent: canvas.scene })
                let template = new game.dnd5e.canvas.AbilityTemplate(doc);
                template.actorSheet = tactor.document.sheet;
                template.drawPreview();

                async function deleteTemplatesAndMove(template) {

                    let removeTemplates = canvas.templates.placeables.filter(i => i.data.flags.world?.benignTranposition?.ActorId === tactor.id);
                    let templateArray = removeTemplates.map(function (w) {
                        return w.id
                    })
                    await target.document.update({ x: template.data.x, y: template.data.y }, { animate: false })
                    if (removeTemplates) await canvas.scene.deleteEmbeddedDocuments("MeasuredTemplate", templateArray)
                };
            });
        }
        if (args[0] === "on") {

            const lastArg = args[args.length - 1];
            let tactor;
            if (lastArg.tokenId) tactor = canvas.tokens.get(lastArg.tokenId).actor;
            else tactor = game.actors.get(lastArg.actorId);
            const target = canvas.tokens.get(lastArg.tokenId);
            let source = await fromUuid(lastArg.origin)
            let castToken = source.parent.getActiveTokens()[0]
            let updates = [{
                x: castToken.data.x, y: castToken.data.y, _id: target.id
            }, {
                x: target.data.x, y: target.data.y, _id: castToken.id
            }]
            canvas.scene.updateEmbeddedDocuments("Token", updates)
        }
    }

    static async resetBenign(workflow){
        let item = workflow.actor.items.find(i => i.name === "Benign Transposition")
        if (!item) return
        if(workflow.itemLevel < 1) return
        if (workflow.item.labels?.school === "Conjuration") {
            if(item.data.data.uses.value < 1)
            await item.update({"data.uses.value" : 1})
            ui.notifications.notify("Benign Transposition recharged")
        }
    }

    static focusedConjuration(effect, data){
        let origin = data.origin.split(".")
        let item = effect.parent.items.get(origin[3])
        if (item.labels?.school === "Conjuration") {
            data.changes = [
                {
                    key: "flags.midi-qol.concentrationSaveBonus",
                    mode: 2,
                    priority: 20,
                    value: "100"
                },
            ]
            effect.data.update({ changes: data.changes })
        }
    }
}
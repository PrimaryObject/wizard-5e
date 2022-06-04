# 5e Wizard

## Instructions

### Core Wizard

- Arcane recovery is handled by the [Short Rest Recovery module](<https://foundryvtt.com/packages/short-rest-recovery>)

- Spell Mastery

  - Use a macro with the command `Wizard.core.spellMastery(actor)`
  - Runs a dialog to select the spells and to cast without using slots

- Signature Spell
  - Use a macro with the command `Wizard.core.signatureSpell(actor)`
  - Runs a dialog to select the spells and to cast without using slots

### Bladesinging

- ~~Song of Defense will trigger when taking damage with a feature of that name present on the actor.~~
- Song of Defense can be now done with a Midi reaction

### Chronurgy

- None of these features are possible to automate unfortunately.

### Graviturgy

- Adjust density

  - Apply an active effect to the target that executes the macro `Wizard.graviturgy.adjustDensity(args)`

### Scribes

- Awakened Spellbook

  - Casting a leveled spell with this feature on the actor will add an additional option into the casting popup to change the damage type (thanks to [Ripper](https://github.com/theripper93) for this script and allowing me to include it here)

- Master Scrivener

  -Run the macro `Wizard.scribes.masterScrivener(actor)` to prompt for spell scroll creation, with additional level.

### Abjuration

- Arcane ward

  - Casting any abjuration spell will automatically find an empty resource slot and create an Arcane Wards resource (this is key to the automation working) and increment the resource according to the spell level cast. Any damage taken while the Arcane Ward resource is "charged" will be reduced by that amount, and the ward depleted.
  
- Projected Wards

  - Add an active effect onto the feature with the name "Arcane Wards Projected", when this is applied to another token, the Arcane Ward protection will apply to that target and calculate in the same manner as the normal Arcane Ward.

### Conjuration

- Benign Transposition

  - An active effect applied to the caster running the macro `Wizard.conjuration.benignTranspotition(args)`

- Focused Conjuration

  - While this feature is on the actor, casting any concentration Conjuration spell will automatically update the concentration to have a +100 save roll to remove the chance of failing a concentration check.

### Divination

- Expert Divination

  - On casting a divination spell the caster will be prompted to recover a spell slot.

- Third Eye

  - Run the macro `Wizard.divination.thirdEye(actor)`

### Enchantment

- Nothing to automate here

### Evocation

- Sculpt Spells

  - Set a `DamageBonusMacro` to execute the macro `await Wizard.evocation.sculptSpell(args)`, this will prompt the user for which tokens they want to avoid.

- Empowered Evocation

  - Set a `DamageBonusMacro` to execute the macro `return await Wizard.evocation.empoweredEvocation(args)`

- Overchannel

  - Set a `DamageBonusMacro` to execute the macro `return await Wizard.evocation.overChannel(args)`

### Necromancy

- Grim harvest

  - When a creature is brought to 0hp by a spell cast by an actor with this feature the caster is healed.

### Transmutation

- Transmuter's Stone

  - Run the macro `Wizard.tranmutation.transmutorsStone(actor)`, this will create or modify the item on the actor, cannot be run while they do not have the item on their person.

- Master Transmuter

  - No automation, but run the macro `Wizard.tranmutation.masterTransmuter(actor)` to delete the stone and re-set the status.

### War

- Arcane Deflection

  - Not included, but setup an active effect with the name Arcane Deflection (for use with Deflecting Shroud)

- Power Surge

  - Setup a resource called Power Surge

  - Set a `DamageBonusMacro` to execute the macro `return await Wizard.war.powerSurge(args)`

  - Casting a Dispel Magic or Counterspell will prompt to increase Power Surge resource

- Durable Magic

  - Casting a concentration spell with this feature on the actor will add an active effect to the Concentrating effect to give the correct bonuses.

- Deflecting Shroud

  - Setup item to roll the correct damage

  - When you use your Arcane Deflection it will prompt to target tokens and then auto roll the item

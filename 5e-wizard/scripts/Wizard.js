import { conjuration } from './subclasses/conjuration.js';
import {abjuration} from './subclasses/abjuration.js';
import { divination } from './subclasses/divination.js';
import { evocation } from './subclasses/evocation.js';
import { graviturgy } from './subclasses/graviturgy.js';
import { scribes } from './subclasses/scribes.js';
import { transmutation } from './subclasses/transmutation.js';
import { war } from './subclasses/war.js';
import { bladesinging } from './subclasses/bladesinging.js';
import { necromancy } from './subclasses/necromancy.js';
import {core } from './core.js';

window.Wizard = {
    abjuration : abjuration,
    bladesinging: bladesinging,
    conjuration : conjuration,
    divination : divination,
    evocation : evocation,
    graviturgy : graviturgy,
    scribes : scribes,
    transmutation : transmutation,
    war : war,
    core : core,
}
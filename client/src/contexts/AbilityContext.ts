import {createContextualCan} from '@casl/react';
import {createContext} from 'react';
import {PureAbility} from '@casl/ability';
import {AppAbility} from '../config/caslAbility';

export const AbilityContext = createContext<AppAbility>(new PureAbility());// export const Can = createContextualCan(AbilityContext.Consumer);
export const Can = createContextualCan(AbilityContext.Consumer);

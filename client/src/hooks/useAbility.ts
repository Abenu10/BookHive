import {useContext} from 'react';
import {AbilityContext} from '../contexts/AbilityContext';

export function useAbility() {
  return useContext(AbilityContext);
}

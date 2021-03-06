import {
  createCollectionReducer,
  createSingleResultSelector
} from '../lib/rest-helpers';

const sortBy = (field, reverse, primer) => {
   const key = x => primer ? primer(x[field]) : x[field];
   return (a, b) => {
      const A = key(a);
      const B = key(b);
      return ((A < B) ? -1 : ((A > B) ? 1 : 0)) * [1, -1][+!!reverse];
   }
}

const toArray = map => Object.keys(map).map(key => map[key])

const collectionReducer = createCollectionReducer('airfillWidget.inventory');
export default (state, action) => {
  state = collectionReducer(state, action);

  switch (action.type) {
    case 'SET_COUNTRY': {
      return {
        ...state,
        selectedCountry: action.payload
      };
    }
    case 'LOAD_OPERATOR': {
      return {
        ...state,
        selectedOperator: action.payload.operatorSlug
      };
    }
    case 'LOAD_OPERATOR_SUCCESS': {
      return {
        ...state,
        selectedOperator: action.payload.slug
      };
    }
  }
  return state;
}

export const selectInventory = createSingleResultSelector('airfillWidget.inventory');

export const selectCountryList = state => {
  const inventory = selectInventory(state).result;
  if (!inventory) { return []; }
  return toArray(inventory).sort(sortBy('name'))
}

export const selectCountry = state => {
  const inventory = selectInventory(state);
  if (inventory.result && state.airfillWidget.inventory.selectedCountry) {
    return inventory.result[state.airfillWidget.inventory.selectedCountry]
  }
  return null;
}

const empty = { Mobile: [] }
export const selectAvailableOperators = state => {
  const country = selectCountry(state);
  if (!country) { return empty; }

  return toArray(country.operators)
    .sort(sortBy('name'))
    .reduce((mem, operator) => {
      const type = operator.type || 'Mobile'
      mem[type] = mem[type] || []
      mem[type].push(operator)
      return mem
    }, { Mobile: [] });
}

export const selectSelectedOperator = state => {
  const operator = state.airfillWidget.inventory.selectedOperator;
  const country = selectCountry(state);

  if (operator && country && operator in country.operators) {
    return country.operators[operator];
  }

  return null;
}


import { State } from 'jumpsuit'

export default State({
  initial: {
    activities: []
  },
  addActivity(state, activity) {
    if (!activity) return state;

    return [...state, activity];
  }
})

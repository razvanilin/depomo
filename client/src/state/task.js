import { State } from 'jumpsuit'

export default State({
  initial: {
    tasks: {}
  },
  addTask(state, tasks) {
    if (!tasks) return state;

    return {...state, tasks};
  }
})

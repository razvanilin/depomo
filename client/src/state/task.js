import { State } from 'jumpsuit'

export default State({
  initial: {
    tasks: []
  },
  addTask(state, task) {
    if (!task) return state;

    return [...state, task];
  }
})

import { State } from 'jumpsuit'

export default State({
  initial: {
    tasks: {}
  },
  addTask(state, tasks) {
    if (!tasks) return state;
    if (tasks.constructor !== Array) {
      var tempTasks = state.tasks;
      tempTasks.push(tasks);
      return {...state, tempTasks};
    }

    return {...state, tasks};
  }
})

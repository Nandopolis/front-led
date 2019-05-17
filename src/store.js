import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
    goal_lap: 2,
    play: false,
    vel: { player_1: 0, player_2: 0, time: 0.0},
    pos: { player_1: 0, player_2: 0, time: 0.0},
    lap: { player_1: 0, player_2: 0, time: 0.0},
    winner: { player: 0, time: 0.0},
  },
  mutations: {
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state, event)  {
      console.error(state, event)
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      state.socket.message = message
      var timed_states = []
      var time = null
      message.forEach(data => {
        var data_type = data.data_type
        if (['vel', 'pos', 'lap'].indexOf(data_type) >= 0) {
          state[data_type].player_1 = data[data_type + '_1']
          state[data_type].player_2 = data[data_type + '_2']
          timed_states.push(state[data_type])
        }
        else if (data_type == 'win') {
          state.winner.player = data.winner
          timed_states.push(state.winner)
        }
        else if (data_type == 'time') {
          time = data.seconds
        }
        else if (data_type == 'goal') {
          state.goal_lap = data.goal_lap
        }
        else if (data_type == 'play') {
          state.play = data.status
        }
        else if (data_type == 'counter') {
          setTimeout(() => {
            this.$socket.sendObj({data_type: "counter"})
          }, 3000);
        }
      })
      if (time != null) {
        timed_states.forEach(state => {
          state.time = time
        });
      }
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {

  }
})

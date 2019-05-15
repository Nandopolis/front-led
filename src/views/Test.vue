<template>
  <div>
    <span>velocidad</span><br>
    <span>jugador 1: {{ vel.player_1 }} </span><br>
    <span>jugador 2: {{ vel.player_2 }}</span><br>
    <span>time: {{ vel.time }}</span>
  </div>
</template>

<script>
export default {
  name: 'test',
  computed: {
    vel() {
      return this.$store.state.vel
    }
  },
}
</script>

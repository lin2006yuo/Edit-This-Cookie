<template>
  <input
    class="c-input"
    v-model="value"
    @input="$emit('input', $event.target.value)"
  />
</template>

<script>
export default {
  props: ["value"],
}
</script>

<style lang='stylus'>
.c-input {
  outline: none;
  border: 1px solid var(--color-primary-light);
  background-color: #fff;
  border-radius: 3px;
  padding: 0 10px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  transition border-color .2s cubic-bezier(.645,.045,.355,1)
  &:hover {
    border: 1px solid #9f8d8d
  }
  &:focus {
    border 1px solid var(--color-primary)
  }
}
</style>

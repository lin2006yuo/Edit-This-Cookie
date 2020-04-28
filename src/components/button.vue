<template>
  <button class="c-button" @click="$emit('click')">
    <slot />
  </button>
</template>

<script>
export default {

}
</script>

<style lang='stylus'>
  .c-button
    display: inline-block
    line-height: 1
    white-space: nowrap
    cursor: pointer
    background: #fff
    border: 1px solid var(--color-border)
    color: var(--color-primary)
    background-color var(--color-secondary)
    text-align: center
    box-sizing: border-box
    outline: none
    margin: 0
    transition: .1s
    font-weight: 500
    padding: 6px 8px
    font-size: 14px
    border-radius: 4px
    &:hover
      background-color var(--color-secondary-deep)
</style>
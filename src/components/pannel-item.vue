<template>
  <div class='c-pannel-item'>
    <span class="c-pannel-item-header c-text">{{name}}</span>
    <slot name='content' />
    <slot name='action' />
  </div>
</template>

<script>
export default {
  props: ['name']
}
</script>

<style lang='stylus'>
.c-pannel-item
  display flex
  align-items center
.c-pannel-item-header
  width 100px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
  margin-right 4px
.c-pannel-item-content
  margin-right 4px
</style>
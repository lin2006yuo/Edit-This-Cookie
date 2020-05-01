<template>
  <div class="c-select-wrapper">
    <Input
      :class="{
        'c-select-input': true,
        'c-is-focus': selectShow,
      }"
      :value="value"
      @input="handleInput"
      @focus="toggleShow"
      @blur.stop="selectShow = false"
    >
      <template v-slot:icon>
        <svg-down @click="toggleShow" class="c-icon-down" />
      </template>
    </Input>
    <transition name="fade">
      <div v-if="selectShow" class="c-options">
        <template v-if="options.length">
          <div
            v-for="(item, index) in options"
            :key="index"
            class="c-options-item"
            @click="handleSelect(item)"
          >
            {{ item.name }}
          </div>
        </template>
        <template v-else>
          <div class="c-options-item">
            无
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<script>
import Input from "./input"
import SvgDown from "../assets/svg/down.svg"

export default {
  data() {
    return {
      selectShow: false,
    }
  },
  props: ["value", "options"],
  methods: {
    toggleShow(e) {
      e.stopPropagation()
      this.selectShow = !this.selectShow
    },
    handleInput(value) {
      this.$emit("input", value)
    },
    handleSelect(item) {
      this.$emit("input", item.value)
    },
  },
  components: {
    Input,
    SvgDown,
  },
  watch: {
    selectShow(show) {
      if (show) {
        document.addEventListener("click", this.toggleShow)
      } else {
        document.removeEventListener("click", this.toggleShow)
      }
    },
  },
}
</script>

<style lang="stylus">
.c-select-wrapper
  position relative
  .c-select-input.c-is-focus
    .c-input
      border 1px solid var(--color-primary)
  .c-options
    z-index 1000
    position absolute
    background-color #fff
    right 0
    left 0
    border 1px solid var(--color-primary)
    box-sizing border-box
    border-radius: 3px;
    .c-options-item
      color var(--color-text)
      cursor pointer
      padding 4px
      &:hover
        background-color var(--color-hover)

.c-icon-down
  cursor pointer
  width 12px
  height 12px
  fill var(--color-primary-deep)
  position absolute
  right 5px
  top 50%
  transform translateY(-50%)

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

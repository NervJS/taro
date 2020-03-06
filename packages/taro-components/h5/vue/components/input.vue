<script>
export default {
  name: 'taro-input',
  props: [
    'value',
    'type',
    'password',
    'placeholder',
    'disabled',
    'maxlength',
    'focus',
    'confirmType',
    'onInput',
    'onFocus',
    'onBlur',
    'onConfirm',
    'onChange',
    'onKeyDown'
  ],
  render () {
    const noop = function () {}
    return (
      <taro-input-core
          value={this.value}
          type={this.type}
          password={this.password}
          placeholder={this.placeholder}
          disabled={this.disabled}
          maxlength={this.maxlength}
          auto-focus={this.focus}
          confirm-type={this.confirmType}
          onInput={this.onInput || noop}
          onFocus={this.onFocus || noop}
          onBlur={this.onBlur || noop}
          onConfirm={this.onConfirm || noop}
          onChange={this.onChange || noop}
          onKeydown={this.onKeyDown || noop}
        />
    )
  }
}
</script>

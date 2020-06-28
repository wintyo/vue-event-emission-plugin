# Vue Event Emission Plugin

## Installation
### yarn
```
$ yarn add @wintyo/vue-event-emission-plugin
```

### npm
```
$ npm install --save @wintyo/vue-event-emission-plugin
```

## Setup
```
import Vue from 'vue';
import EventEmissionPlugin from '@wintyo/vue-event-emission-plugin';

Vue.use(EventEmissionPlugin);
```

## Usage
```vue
<template>
  <div>
    <button @click="$events.click1()">click1</button>
    <button @click="onClick2">click2</button>
    <button @click="onClick3">click3</button>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  // You can bundle emit events at a component.
  events: {
    // equivalent to `this.$emit('click1')`
    click1: () => [],
    // equivalent to `this.$emit('click2', value)`
    click2: (value) => [value],
    click3: {
      // equivalent to `this.$emit('click3', value, text)`
      payload: (value, text) => [value, text],
      // optional flag is true if the event is option.
      optional: true,
    },
  },
  methods: {
    onClick2() {
      this.$events.click2(10);
    },
    onClick3() {
      this.$events.click3(10, 'test');
    },
  },
});
</script>
```

### for class decorator
```typescript
import { Vue, Component } from 'vue-property-decorator';
import { tEventEmissions } from '@wintyo/vue-event-emission-plugin';

const events = {
  // equivalent to `this.$emit('click1')`
  click1: () => [],
  // equivalent to `this.$emit('click2', value)`
  click2: (value: number) => [value],
  click3: {
    // equivalent to `this.$emit('click3', value, text)`
    payload: (value: number, text: string) => [value, text],
    // optional flag is true if the event is option.
    optional: true,
  },
};

@Component(
  events,
)
export default class MyComponent extends Vue {
  // you can declare $events type.
  $events: tEventEmissions<typeof events>;

  onClick2() {
    // this properties can be typed.
    this.$events.click2(10);
  }
}
```

## Licence
MIT

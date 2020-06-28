import Vue, { PluginObject } from 'vue';

export type tEventFunction = (...params: Array<any>) => Array<any>;
export interface IEventOption {
  payload: tEventFunction;
  optional: boolean;
}

export interface IEvents {
  [eventName: string]: tEventFunction | IEventOption;
}

export type tEventEmissions<Events extends IEvents> = {
  [eventName in keyof Events]: Events[eventName] extends IEventOption
    ? (...params: Parameters<Events[eventName]['payload']>) => void
    : Events[eventName] extends tEventFunction
      ? (...params: Parameters<Events[eventName]>) => void
      : undefined;
}

// extend option
declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    events?: IEvents;
  }
}

// extend property
declare module 'vue/types/vue' {
  interface Vue {
    $events: {
      [eventName: string]: (...params: Array<any>) => void;
    }
  }
}

const Plugin = {
  install(Vue: any) {
    Vue.mixin({
      beforeCreate() {
        // no operation if events is empty
        const events = this.$options.events;
        if (!events) {
          return;
        }

        // get component information
        const componentTag = this.$options._componentTag;
        const parentFileName = this.$options.parent ? this.$options.parent.$options.__file : undefined;

        // setup events
        const $events: any = {};
        Object.keys(events).forEach((eventName) => {
          $events[eventName] = (...args: Array<any>) => {
            const emit = (typeof events[eventName] === 'function') ? events[eventName] : events[eventName].payload;
            // check number of arguments
            if (process.env.NODE_ENV !== 'production') {
              if (args.length !== emit.length) {
                console.warn(`<${componentTag}>: '${eventName}' event args list is not match!`);
              }
            }
            this.$emit(eventName, ...emit(...args));
          };
        });
        this.$events = $events;

        // check setting listener correctly
        if (process.env.NODE_ENV !== 'production') {
          const listenerKeys = Object.keys(this.$listeners);
          Object.keys(events).forEach((eventName) => {
            const index = listenerKeys.indexOf(eventName);
            if (index >= 0) {
              listenerKeys.splice(index, 1);
              return;
            }
            const isOptional = (typeof events[eventName] === 'object' && events[eventName].optional);
            // output warning if not optional
            if (!isOptional) {
              console.warn(`${parentFileName}: <${componentTag}>'s '${eventName}' listener is not set.`);
            }
          });
          listenerKeys.forEach((listenerKey) => {
            console.warn(`${parentFileName}: '${listenerKey}' is not <${componentTag}>'s listener name.`);
          });
        }
      },
    });
  }
} as PluginObject<never>;

export default Plugin;

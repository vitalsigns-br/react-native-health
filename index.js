import { Activities, Observers, Permissions, Units } from './src/constants'
import { NativeModules, TurboModuleRegistry } from 'react-native'

// On RN 0.85 (bridgeless) the native module's methods are non-enumerable
// (lazy getters / on the prototype), so the previous
// `Object.assign({}, AppleHealthKit, …)` copied none of them and every method
// came through as undefined. Forward to the live native module via a Proxy
// instead of snapshotting its keys. JS-only — no native rebuild required.
const AppleHealthKit =
  NativeModules.AppleHealthKit ||
  (TurboModuleRegistry.get && TurboModuleRegistry.get('AppleHealthKit'))

const Constants = {
  Activities,
  Observers,
  Permissions,
  Units,
}

export const HealthKit = new Proxy(AppleHealthKit || {}, {
  get(target, prop) {
    if (prop === 'Constants') {
      return Constants
    }
    const value = target[prop]
    return typeof value === 'function' ? value.bind(target) : value
  },
})

module.exports = HealthKit

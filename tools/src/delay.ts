const callbacks: Record<string, Function[]> = {}

export class DelaySystem {
  update(dt: number) {
    for (const timestamp in callbacks) {
      if (+timestamp < Date.now()) {
        const callbackArray = callbacks[timestamp]
        for (const callback of callbackArray) {
          callback()
        }
        delete callbacks[timestamp]
      }
    }
  }
}

export function setTimeout(callback: Function, timeout: number) {
  const key = Date.now() + timeout
  if (!(key in callbacks)) {
    callbacks[key] = []
  }
  callbacks[key].push(callback)
}

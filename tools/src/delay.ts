const callbacks: Record<string, Function> = {}

export class DelaySystem {
  update(dt: number) {
    for (const timestamp in callbacks) {
      if (+timestamp < Date.now()) {
        const callback = callbacks[timestamp]
        callback()
        delete callbacks[timestamp]
      }
    }
  }
}

export function setTimeout(callback: Function, timeout: number) {
  callbacks[Date.now() + timeout] = callback
}

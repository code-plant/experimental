import { Cleanup } from "@this-project/util-types-common";

export function on<E extends Event>(
  target: EventTarget,
  eventName: string,
  listener: (event: E) => void,
  capture = false
): Cleanup {
  target.addEventListener(
    eventName,
    listener as EventListenerOrEventListenerObject,
    capture
  );
  return () =>
    target.removeEventListener(
      eventName,
      listener as EventListenerOrEventListenerObject,
      capture
    );
}

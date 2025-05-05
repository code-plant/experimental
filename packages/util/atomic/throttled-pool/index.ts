import { eventBus, On, Trigger } from "@this-project/util-atomic-event-bus";
import { Awaitable } from "@this-project/util-common-types";

export class ThrottledPool {
  private readonly onEnd: On<void>;
  private readonly triggerEnd: Trigger<void>;
  private runningJobs = 0;

  constructor(private readonly jobs: number) {
    [this.onEnd, this.triggerEnd] = eventBus();
  }

  async run<T>(task: () => Awaitable<T>): Promise<T> {
    while (this.runningJobs == this.jobs) {
      let cleanup: () => void;
      await new Promise((resolve) => {
        cleanup = this.onEnd(resolve);
      });
      cleanup!();
    }
    this.runningJobs++;
    try {
      return await task();
    } finally {
      this.runningJobs--;
      this.triggerEnd();
    }
  }
}

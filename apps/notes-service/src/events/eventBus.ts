import { EventEmitter } from "events";
import { EventName } from "./events";

class AppEventBus extends EventEmitter {
    emitEvent(event: EventName, payload: any) {
        this.emit(event, payload);
    }

    subscribe(event: EventName, listener: (payload: any) => void) {
        this.on(event, listener);
    }
}

export const eventBus = new AppEventBus();

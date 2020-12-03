function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function setIntervalWithJitter(fn: () => void, period: number, jitter: number): () => void {
    function getInterval(): number {
        return period + getRandomArbitrary(-jitter, jitter);
    }

    let timeout: number | undefined;

    // Explicitly typed to force the DOM signature for setTimeout.
    const callback: TimerHandler = () => {
        try {
            fn();
        } catch (e) {
            timeout = undefined;
            throw e;
        }
        timeout = setTimeout(callback, getInterval());
    };

    timeout = setTimeout(callback, getInterval());

    return () => {
        if (timeout !== undefined) {
            clearInterval(timeout);
            timeout = undefined;
        }
    };
}

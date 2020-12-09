import * as React from 'react';

import { noop } from '../common';
import { setIntervalWithJitter } from '../common/interval';
import { TimeResponse } from '../protocol';

const timeSyncInterval = 15 * 60 * 1000; // 15 minutes

export interface ServerTime {
    now: () => number;
    addRef: () => void;
    delRef: () => void;
    syncTime: () => void;
}

const Context = React.createContext<ServerTime>(
    Object.seal({ now: Date.now, addRef: noop, delRef: noop, syncTime: noop })
);

export function ServerTimeProvider<P>(props: React.PropsWithChildren<P>) {
    const [offset, setOffset] = React.useState<number | undefined>(undefined);
    const refs = React.useRef(0);
    const forceUpdate = React.useRef(false);

    const syncTime = React.useCallback(() => {
        if (!forceUpdate.current && refs.current === 0) {
            forceUpdate.current = true;
            return;
        }
        forceUpdate.current = false;

        const fn = async () => {
            let bestRTT: number | undefined;
            let offset = 0;

            for (let i = 0; i < 3; i++) {
                const before = Date.now();
                const resp = await fetch('/api/time');
                const after = Date.now();

                const body = await resp.json();
                if (resp.ok) {
                    const rtt = (after - before) / 2;

                    if (bestRTT !== undefined && rtt > bestRTT) {
                        continue;
                    }

                    bestRTT = rtt;

                    const t = TimeResponse.parse(body);
                    const serverTime = t.time.getTime() + rtt;
                    offset = serverTime - Date.now();
                }
            }

            setOffset(offset);
        };
        fn().catch(noop);
    }, [setOffset]);

    React.useEffect(() => {
        return setIntervalWithJitter(syncTime, timeSyncInterval, timeSyncInterval / 10);
    }, [syncTime]);

    const now = React.useCallback(() => {
        if (offset === undefined) {
            syncTime();
        }
        return Date.now() + (offset ?? 0);
    }, [syncTime, offset]);

    const value = React.useMemo(
        () =>
            Object.seal({
                now,
                addRef: () => refs.current++,
                delRef: () => refs.current--,
                syncTime,
            }),
        [now, syncTime]
    );
    return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

export function useServerTime(): ServerTime {
    return React.useContext(Context);
}

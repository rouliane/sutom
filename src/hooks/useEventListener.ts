import {useEffect, useRef} from "react";

const useEventListener = (eventName: string, handler: (arg: any) => void, element = window) => {
    const savedHandler = useRef<() => void | undefined>();
    useEffect(() => {
        // @ts-ignore
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        // @ts-ignore
        const eventListener = (event: any) => savedHandler.current?.(event);
        element.addEventListener(eventName, eventListener);
        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

export default useEventListener;

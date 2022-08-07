/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/* eslint-disable no-lonely-if */

import * as React from 'react';
import { useReactToPrint } from 'react-to-print';

export function useDetectPrint() {
    const [isPrinting, toggleStatus] = React.useState(false);

    React.useEffect(() => {
        const printMq = window.matchMedia && window.matchMedia('print');

        toggleStatus(!!printMq.matches);

        const eventListener = (mqList: MediaQueryListEvent) => {
            toggleStatus(!!mqList.matches);
        };

        printMq.addEventListener('change', eventListener);

        return () => {
            printMq.removeEventListener('change', eventListener);
        };
    }, []);

    return isPrinting;
}

export function useFullscreen(): [boolean, (value: boolean) => void] {
    const [fullscreen, setFullscreenValue] = React.useState(!!document.fullscreenElement);

    React.useEffect(() => {
        const listener = () => {
            setFullscreenValue(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', listener);

        return () => {
            document.removeEventListener('fullscreenchange', listener);
        };
    }, []);

    const setFullScreen = React.useCallback((value: boolean) => {
        if (value) {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
        } else {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, []);

    return [fullscreen, setFullScreen];
}

export function usePrinter(): [() => void, () => void, boolean, React.MutableRefObject<any>] {
    const [isPrinting, setIsPrinting] = React.useState(false);
    const [isPrintingReady, setIsPrintingReady] = React.useState(false);
    const printMode = useDetectPrint();
    const printRef = React.useRef<any>();
    const printer = useReactToPrint({
        content: () => {
            return printRef.current!;
        },
        onAfterPrint: () => {
            setIsPrinting(false);
            setIsPrintingReady(false);
        },
    });

    React.useEffect(() => {
        if (!printMode) {
            setIsPrinting(false);
        }
    }, [printMode]);

    React.useEffect(() => {
        let timer: any = 0;

        if (isPrintingReady) {
            timer = setTimeout(() => {
                printer && printer();
            }, 2000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isPrintingReady, printer]);

    const doPrint = React.useCallback(() => {
        setIsPrinting(true);
    }, []);

    const doMakeReady = React.useCallback(() => {
        setIsPrintingReady(true);
    }, []);

    return [doPrint, doMakeReady, isPrinting, printRef];
}

export function useExport( props: { content: () => React.ReactInstance | null; onAfterExecute?: () => void } ): any {
    const { content, onAfterExecute } = props;

    // TODO: change logic in a way that on a trigger execution and successful completion
    // of its relative procedure, it calls the onAfterExecute fn
    const executeExport = (): void => {
        console.log('Executing export');
        onAfterExecute && setTimeout( () => onAfterExecute(), 10000);
    };
    executeExport();
    return content;
}

export function useExporter(): [() => void, () => void, boolean, React.MutableRefObject<any>] {
    const [isExporting, setIsExporting] = React.useState(false);
    const [isExportingReady, setIsExportingReady] = React.useState(false);
    // const exportMode = false; // TODO: Should be useless
    const exportRef = React.useRef<any>();
    if ( exportRef && exportRef.current ) {
        console.log('Got export ref', exportRef.current);
        debugger;
    } 
    const exporter = useExport({
        content: () => exportRef.current!,
        onAfterExecute: () => {
            setIsExporting(false);
            setIsExportingReady(false);
        },
    });

    // Should be useless
    // React.useEffect(() => {
    //     // if (!printMode) {
    //     if (!false) { // TODO: change accordingly
    //         setIsExporting(false);
    //     }
    // }, []);

    // If exporting ready flag is set to true
    // executes after 2000 ms the exporter cmp-fn
    React.useEffect(() => {
        let timer: any = 0;

        if (isExportingReady) {
            timer = setTimeout(() => {
                exporter && exporter();
            }, 2000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isExportingReady, exporter]);

    // 
    const doExport = React.useCallback(() => {
        setIsExporting(true);
    }, []);

    // When called marks isExporting flag to tru
    const doMakeReady = React.useCallback(() => {
        setIsExportingReady(true);
    }, []);

    return [doExport, doMakeReady, isExporting, exportRef];
}
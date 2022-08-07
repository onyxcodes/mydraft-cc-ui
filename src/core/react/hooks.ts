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

// TODO: Remove, should be useless
export function useImport( props: { content: () => React.ReactInstance | null; onAfterExecute?: () => void } ): any {
    const { content } = props;
    // const { content, onAfterExecute } = props;

    // TODO: change logic in a way that on a trigger execution and successful completion
    // of its relative procedure, it calls the onAfterExecute fn
    // const executeExport = (): void => {
    //     console.log('Executing export');
    //     onAfterExecute && setTimeout( () => onAfterExecute(), 10000);
    // };
    // executeExport();
    return content;
}

export function useImporter(): [() => void, () => void, () => void, boolean, React.MutableRefObject<any>] {
    const [isImporting, setIsImporting] = React.useState(false);
    const [isImportingReady, setIsImportingReady] = React.useState(false);
    const importRef = React.useRef<any>();

    const importer = useImport({
        content: () => importRef.current!,
        onAfterExecute: () => {
            setIsImporting(false);
            setIsImportingReady(false);
        },
    });

    // If exporting ready flag is set to true
    // executes after 2000 ms the importer cmp-fn
    React.useEffect(() => {
        let timer: any = 0;

        if (isImportingReady) {
            timer = setTimeout(() => {
                importer && importer();
            }, 2000);
        }

        return () => {
            clearTimeout(timer);
        };
    }, [isImportingReady, importer]);

    // 
    const doExport = React.useCallback(() => {
        setIsImporting(true);
    }, []);

    // When called marks isImporting flag to tru
    const doMakeReady = React.useCallback(() => {
        setIsImportingReady(true);
    }, []);

    const cancelImport = React.useCallback(() => {
        setIsImporting(false);
    }, []);

    return [doExport, doMakeReady, cancelImport, isImporting, importRef];
}
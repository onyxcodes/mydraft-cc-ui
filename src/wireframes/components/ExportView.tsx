import * as React from "react";

export interface ExportRendererProps {
    // true when rendered
    onRender?: () => void;
}

export const ExportView = ( props: ExportRendererProps ) => {
    const { onRender } = props;

    React.useCallback( () => {
        // simulate rendering throu
        onRender && onRender();
    }, [onRender])

    return (
        <>
            <div> Fake export view</div>
        </>
    )
}
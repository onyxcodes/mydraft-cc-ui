import * as React from "react";

export interface ExportRendererProps {
    // true when rendered
    onRender?: () => void;
    setFilePath: (path: string | undefined) => void;
    confirm: () => void;
    cancel: () => void;
    path?: string | undefined;
}

export const ImportView = ( props: ExportRendererProps ) => {
    const { onRender, confirm, cancel, setFilePath, path } = props;

    React.useCallback( () => {
        // simulate rendering throu
        onRender && onRender();
    }, [onRender]);

    return (
        <>
            <div> Fake export view</div>
            <label htmlFor="destinationPath">
                Choose destination file path:
            </label>
            <input 
                type="file"
                id="destinationPath"
                name="destinationPath"
                accept=".draft"
                onChange={(e) => setFilePath(e.target.value)}
                value={path}
            />
            <button
                disabled={!(path && path != "")}
                onClick={() => confirm()}
            >Save</button>
            <button
                onClick={() => cancel()}
            >Cancel</button>
        </>
    )
}
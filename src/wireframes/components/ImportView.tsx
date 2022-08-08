import * as React from "react";
import { Modal, Row, Col } from 'antd';
export interface ImportRendererProps {
    confirm: (confirmed: boolean, file?: File) => void;
    cancel: () => void;
}

export const ImportView = (props: ImportRendererProps) => {
    const { confirm, cancel } = props;
    const [ file, setFile ] = React.useState<File>();
    const [ confirmed, setConfirm ] = React.useState(false);

    confirm(confirmed, file);

    return (
            <Modal title='Import Diagram'
                visible={true}
                onCancel={cancel}
                onOk={() => setConfirm(true)}
            >
                <Row className='property'>
                    {/* TODO: parametrize text */}
                    <Col span={12} className='property-label'>Import from file</Col>
                    <Col span={12} className='property-value'>
                        <input
                            type="file"
                            accept=".draft"
                            onChange={(e) => setFile(e.target.files?.[0])}
                        />
                    </Col>
                </Row>
            </Modal>
    )
}
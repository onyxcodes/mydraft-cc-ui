/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { ExportOutlined, PrinterOutlined, SettingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, InputNumber, Menu, Modal, Row, Tooltip } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Color, ColorPicker, Shortcut } from '@app/core';
import { texts } from '@app/texts';
import { changeColor, changeSize, getEditor, useStore } from '@app/wireframes/model';

export interface SettingsMenuProps {
    // The print callback.
    onPrint: () => void;
    onExport: () => void;
}

export const SettingsMenu = React.memo((props: SettingsMenuProps) => {
    const { onPrint, onExport } = props;


    const dispatch = useDispatch();
    const editor = useStore(getEditor);
    const editorSize = editor.size;
    const editorColor = editor.color;
    const [isOpen, setIsOpen] = React.useState(false);
    const [sizeWidth, setWidth] = React.useState(0);
    const [sizeHeight, setHeight] = React.useState(0);
    const [color, setColor] = React.useState(Color.WHITE);

    React.useEffect(() => {
        setWidth(editorSize.x);
        setHeight(editorSize.y);
    }, [editorSize]);

    React.useEffect(() => {
        setColor(editorColor);
    }, [editorColor]);

    const doChangeSize = React.useCallback(() => {
        dispatch(changeSize({ width: sizeWidth, height: sizeHeight }));
        dispatch(changeColor({ color: color.toString() }));

        setIsOpen(false);
    }, [dispatch, sizeWidth, sizeHeight, color]);

    const doToggle = React.useCallback(() => {
        setIsOpen(value => !value);
    }, []);

    const doSetWidth = React.useCallback((value: number) => {
        setWidth(value);
    }, []);

    const doSetHeight = React.useCallback((value: number) => {
        setHeight(value);
    }, []);

    const exportMenu =
        <Menu>
            <MenuItem key="print" onClick={onPrint}>
                <PrinterOutlined /> {texts.common.printDiagrams}
            </MenuItem>
            <MenuItem key="export" onClick={onExport}>
                <SaveOutlined /> {texts.common.exportDiagrams}
            </MenuItem>
        </Menu>;

    return (
        <>
            <Dropdown overlay={exportMenu} placement='bottomRight'>
                <Button className='menu-item' size='large'>
                    <ExportOutlined />
                </Button>
            </Dropdown>

            <Shortcut onPressed={doToggle} keys='ctl+o' />

            <Tooltip mouseEnterDelay={1} title={texts.common.optionsTooltip}>
                <Button className='menu-item' size='large' onClick={doToggle}>
                    <SettingOutlined />
                </Button>
            </Tooltip>

            <Modal title='Diagram Options'
                visible={isOpen}
                onCancel={doToggle}
                onOk={doChangeSize}
            >
                <Row className='property'>
                    <Col span={12} className='property-label'>{texts.common.width}</Col>
                    <Col span={12} className='property-value'>
                        <InputNumber value={sizeWidth} min={300} max={3000} onChange={doSetWidth} />
                    </Col>
                </Row>

                <Row className='property'>
                    <Col span={12} className='property-label'>{texts.common.height}</Col>
                    <Col span={12} className='property-value'>
                        <InputNumber value={sizeHeight} min={300} max={3000} onChange={doSetHeight} />
                    </Col>
                </Row>

                <hr />

                <Row className='property'>
                    <Col span={12} className='property-label'>{texts.common.backgroundColor}</Col>
                    <Col span={12} className='property-value'>
                        <ColorPicker value={color} onChange={setColor} />
                    </Col>
                </Row>
            </Modal>
        </>
    );
});

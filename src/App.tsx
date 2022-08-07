/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Collapse, Layout, Tabs } from 'antd';
import classNames from 'classnames';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { usePrinter, useImporter } from '@app/core';
import { ArrangeMenu, ClipboardMenu, CustomProperties, EditorView, HistoryMenu, Icons, LayoutProperties, LoadingMenu, LockMenu, MoreProperties, Pages, PrintView, Recent, SettingsMenu, Shapes, UIMenu, VisualProperties } from '@app/wireframes/components';
import { loadDiagramAsync, newDiagram, selectTab, showInfoToast, toggleLeftSidebar, toggleRightSidebar, useStore } from '@app/wireframes/model';
import { texts } from './texts';
import { PresentationView } from './wireframes/components/PresentationView';
import { ImportView } from './wireframes/components/ImportView';
import { saveDiagramLocal } from '@app/wireframes/model';

const logo = require('./images/logo.svg').default;

export const App = () => {
    const dispatch = useDispatch();
    const route = useRouteMatch();
    const routeToken = route.params['token'] || null;
    const routeTokenSnapshot = React.useRef(routeToken);
    const selectedTab = useStore(s => s.ui.selectedTab);
    const showLeftSidebar = useStore(s => s.ui.showLeftSidebar);
    const showRightSidebar = useStore(s => s.ui.showRightSidebar);
    const [presenting, setPresenting] = React.useState(false);
    const [ filePath, setFilePath ] = React.useState<string | undefined>("");

    const [
        doImport,
        exportReady,
        cancelImport,
        isImporting,
        exportRef,
    ] = useImporter();

    const [
        print,
        printReady,
        isPrinting,
        ref,
    ] = usePrinter();

   

    React.useEffect(() => {
        const token = routeTokenSnapshot.current;

        if (token && token.length > 0) {
            dispatch(loadDiagramAsync({ tokenToRead: token, navigate: false }));
        } else {
            dispatch(newDiagram({ navigate: false }));
        }
    }, [dispatch]);

    React.useEffect(() => {
        if (isPrinting) {
            dispatch(showInfoToast('Printing started...'));
        }
    }, [dispatch, isPrinting]);

    // TODO: consider adapting
    React.useEffect(() => {
        if (isImporting) {
            dispatch(showInfoToast('Importing started...'));
        }
    }, [dispatch, isImporting]);

    const doSelectTab = React.useCallback((key: string) => {
        dispatch(selectTab(key));
    }, [dispatch]);

    const doToggleLeftSidebar = React.useCallback(() => {
        dispatch(toggleLeftSidebar());
    }, [dispatch]);

    const doToggleRightSidebar = React.useCallback(() => {
        dispatch(toggleRightSidebar());
    }, [dispatch]);

    const doEdit = React.useCallback(() => {
        setPresenting(false);
    }, []);

    const doPresent = React.useCallback(() => {
        setPresenting(true);
    }, []);

    const doSetFilePath = (path: string | undefined) => React.useCallback(() => {
        setFilePath(path)
    }, []);

    const doCancelImport = React.useCallback(() => {
        cancelImport();
    }, []);

    const doExport = React.useCallback(() => {
        dispatch(saveDiagramLocal({ navigate: false }))
        // cancelExport();
    }, []);

    const doConfirmImport = React.useCallback(() => {
        // dispatch(saveDiagramLocal({ navigate: false }))
        cancelImport();
    }, []);

    return (
        <>
            <Layout className='screen-mode'>
                <Layout.Header>
                    <img className='logo' src={logo} alt='mydraft.cc' />

                    <HistoryMenu />
                    <span className='menu-separator' />

                    <LockMenu />
                    <span className='menu-separator' />

                    <ArrangeMenu />
                    <span className='menu-separator' />

                    <ClipboardMenu />
                    <span className='menu-separator' />

                    <UIMenu onPlay={doPresent} />
                    <span className='menu-separator' />

                    {/* <SettingsMenu onPrint={print} /> */}
                    <SettingsMenu onPrint={print} onExport={doExport} />

                    <span style={{ float: 'right' }}>
                        <LoadingMenu
                            onImport={doImport}
                        />
                    </span>
                </Layout.Header>
                <Layout className='content'>
                    <Layout.Sider width={320} className='sidebar-left'
                        collapsed={!showLeftSidebar}
                        collapsedWidth={0}>

                        <Tabs type='card' onTabClick={doSelectTab} activeKey={selectedTab}>
                            <Tabs.TabPane key='shapes' tab={texts.common.shapes}>
                                <Shapes />
                            </Tabs.TabPane>
                            <Tabs.TabPane key='icons' tab={texts.common.icons}>
                                <Icons />
                            </Tabs.TabPane>
                            <Tabs.TabPane key='pages' tab={texts.common.pages}>
                                <Pages />
                            </Tabs.TabPane>
                            <Tabs.TabPane key='recent' tab={texts.common.recent}>
                                <Recent />
                            </Tabs.TabPane>
                        </Tabs>
                    </Layout.Sider>
                    <Layout.Content className='editor-content'>
                        <EditorView spacing={40} />
                    </Layout.Content>
                    <Layout.Sider width={330} className='sidebar-right'
                        collapsed={!showRightSidebar}
                        collapsedWidth={0}>

                        <Collapse bordered={false} defaultActiveKey={['layout', 'visual', 'more', 'custom']}>
                            <Collapse.Panel key='layout' header={texts.common.layout}>
                                <LayoutProperties />
                            </Collapse.Panel>
                            <Collapse.Panel key='visual' header={texts.common.visual}>
                                <VisualProperties />
                            </Collapse.Panel>
                            <Collapse.Panel key='more' header={texts.common.more}>
                                <MoreProperties />
                            </Collapse.Panel>
                            <Collapse.Panel key='custom' header={texts.common.custom}>
                                <CustomProperties />
                            </Collapse.Panel>
                        </Collapse>
                    </Layout.Sider>

                    <Button icon={showLeftSidebar ? <LeftOutlined /> : <RightOutlined />}
                        className={classNames('toggle-button-left', { visible: showLeftSidebar })}
                        size='small'
                        shape='circle'
                        onClick={doToggleLeftSidebar} />

                    <Button icon={showRightSidebar ? <RightOutlined /> : <LeftOutlined />}
                        className={classNames('toggle-button-right', { visible: showRightSidebar })}
                        size='small'
                        shape='circle'
                        onClick={doToggleRightSidebar} />
                </Layout>
            </Layout>

            {presenting &&
                <PresentationView onClose={doEdit} />
            }

            {isPrinting &&
                <div className='print-mode' ref={ref}>
                    <PrintView onRender={printReady} />
                </div>
            }

            {isImporting &&
                <div className='export-mode' ref={exportRef}>
                    <ImportView 
                        onRender={exportReady}
                        setFilePath={doSetFilePath}
                        confirm={doConfirmImport}
                        cancel={doCancelImport}
                        path={filePath}
                    />
                </div>
            }
        </>
    );
};

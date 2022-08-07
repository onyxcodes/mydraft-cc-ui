/*
 * mydraft.cc
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Shortcut } from '@app/core';
import { calculateSelection, getDiagram, selectItems, useStore } from '@app/wireframes/model';
import { ActionMenuButton, useGrouping, useRemove } from './../actions';

export const ArrangeMenu = React.memo(() => {
    const dispatch = useDispatch();
    const forRemvoe = useRemove();
    const forGrouping = useGrouping();
    const selectedDiagram = useStore(getDiagram);

    const doSelectAll = React.useCallback(() => {
        if (selectedDiagram) {
            dispatch(selectItems(selectedDiagram, calculateSelection(selectedDiagram.items.values, selectedDiagram)));
        }
    }, [dispatch, selectedDiagram]);

    return (
        <>
            <ActionMenuButton action={forGrouping.group} />
            <ActionMenuButton action={forGrouping.ungroup} />

            <Shortcut disabled={forRemvoe.remove.disabled} onPressed={forRemvoe.remove.onAction!} keys='del' />
            <Shortcut disabled={forRemvoe.remove.disabled} onPressed={forRemvoe.remove.onAction!} keys='backspace' />

            <Shortcut disabled={!selectedDiagram} onPressed={doSelectAll} keys='MOD + A' />
        </>
    );
});

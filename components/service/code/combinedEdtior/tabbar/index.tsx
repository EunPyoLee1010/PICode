import React, { useEffect, useState } from "react";
import { useCode } from "../../../../../hooks/code";
import { useDrag } from "../../../../../hooks/drag";
import { tabbarStyle, tabStyle } from "../../../../../styles/service/code/code";
import {
  addTab,
  checkTabDuplicating,
  deleteCode,
  deleteTab,
  findEmptyCode,
  findTabByPathInCode,
  getExtension,
  getLanguage,
  moveTab,
  reorderTab,
} from "../../functions";
import { TTab } from "../../types";
import { Tab } from "./tab";

export function Tabbar({
  tabList,
  tabOrderStack,
  codeId,
  focus,
}: {
  tabList: TTab[];
  tabOrderStack: number[];
  codeId: number;
  focus: boolean;
}): JSX.Element {
  const classes = tabbarStyle();
  const { code, setCode } = useCode();
  const { drag } = useDrag();

  function handleDragEnterTabbar(event: React.DragEvent<HTMLElement>) {
    if (tabList.length === 1 && tabOrderStack[0] === drag.tabId) {
      return;
    }

    if ((event.target as HTMLElement).classList.contains(classes.emptySpace))
      event.currentTarget.classList.add(classes.drag);
  }

  function handleDragLeaveTabbar(event: React.DragEvent<HTMLElement>) {
    if (tabList.length === 1 && tabOrderStack[0] === drag.tabId) {
      return;
    }

    if ((event.target as HTMLElement).classList.contains(classes.emptySpace))
      event.currentTarget.classList.remove(classes.drag);
  }

  function handleDragOverTabbar(event: React.DragEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();
  }

  function handleDropToTabbar(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (drag.path === "default") return;

    if (tabList.length === 1 && tabOrderStack[0] === drag.tabId) {
      return;
    }

    const targetList = document.getElementsByClassName(classes.drag);

    for (let i = 0; i < targetList.length; i++) {
      targetList[i].classList.remove(classes.drag);
    }

    const newRoot = (() => {
      const existingTabId = findTabByPathInCode(code.root, codeId, drag.path);

      if (drag.tabId === -1) {
        if (checkTabDuplicating(code.root, codeId, drag.path)) {
          return addTab(deleteTab(code.root, existingTabId), codeId, {
            path: drag.path,
            extension: getExtension(drag.path),
            langauge: getLanguage(getExtension(drag.path)),
            tabId: existingTabId,
            content: "",
          });
        } else {
          return addTab(code.root, codeId, {
            path: drag.path,
            extension: getExtension(drag.path),
            langauge: getLanguage(getExtension(drag.path)),
            tabId: code.tabCount,
            content: "",
          });
        }
      }

      const tempRoot = deleteTab(code.root, drag.tabId);
      if (tabOrderStack.includes(existingTabId)) {
        return addTab(deleteTab(code.root, existingTabId), codeId, {
          path: drag.path,
          extension: getExtension(drag.path),
          langauge: getLanguage(getExtension(drag.path)),
          tabId: existingTabId,
          content: "",
        });
      }
      return addTab(tempRoot, codeId, {
        path: drag.path,
        extension: getExtension(drag.path),
        langauge: getLanguage(getExtension(drag.path)),
        tabId: code.tabCount,
        content: "",
      });
    })();

    const emptyCodeId = findEmptyCode(newRoot) ?? -1;

    setCode({
      ...code,
      root: emptyCodeId !== -1 ? deleteCode(newRoot, emptyCodeId) : newRoot,
      tabCount: code.tabCount + 1,
      codeOrderStack: code.codeOrderStack.filter(
        (codeId) => emptyCodeId !== codeId
      ),
    });
  }

  return (
    <div className={`${classes.tabbar}`}>
      <div className={classes.section}>
        {tabList.map((o, idx) => (
          <Tab
            key={`Tab-${codeId}-${idx}`}
            path={o.path}
            tabId={o.tabId}
            tabOrderStack={tabOrderStack}
            focus={focus}
            codeId={codeId}
          />
        ))}
        <div
          className={classes.emptySpace}
          onDragEnter={handleDragEnterTabbar}
          onDragLeave={handleDragLeaveTabbar}
          onDragOver={handleDragOverTabbar}
          onDrop={handleDropToTabbar}
        ></div>
      </div>
    </div>
  );
}

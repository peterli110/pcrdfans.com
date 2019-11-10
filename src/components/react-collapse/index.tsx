import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

const COLLAPSED = 'collapsed';
const COLLAPSING = 'collapsing';
const EXPANDING = 'expanding';
const EXPANDED = 'expanded';

export default function Collapse({
  className,
  children,
  transition,
  render,
  elementType,
  layoutEffect,
  isOpen,
  collapseHeight,
  onInit,
  onChange,
  ...attrs
}: any) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [collapseState, setCollapseState] = useState(isOpen ? EXPANDED : COLLAPSED);
  const [collapseStyle, setCollapseStyle] = useState({
    height: isOpen ? null : getCollapseHeight(),
    visibility: isOpen ? null : getCollapsedVisibility(),
  });
  const [hasReversed, setHasReversed] = useState(false);
  const firstUpdate = useRef(true);

  const effect = layoutEffect ? useLayoutEffect : useEffect;
  effect(() => {
    if (!contentRef.current) return;

    if (firstUpdate.current) {
      onCallback(onInit);

      // Don't run effect on first render, the DOM styles are already correctly set
      firstUpdate.current = false;
      // console.log('skip effect first render');
      return;
    }

    // console.log('effect after didUpdate DOM update');

    switch (collapseState) {
      case EXPANDING:
        setExpanding();
        break;
      case COLLAPSING:
        setCollapsing();
        break;
      case EXPANDED:
        setExpanded();
        break;
      case COLLAPSED:
        setCollapsed();
        break;
      // no default
    }
  }, [collapseState]);

  function onCallback(callback: any) {
    if (callback) {
      // console.log('onCallback ' + callback.name);
      callback({
        collapseState,
        collapseStyle,
        hasReversed,
        isMoving: isMoving(collapseState),
      });
    }
  }

  function getCollapseHeight() {
    return collapseHeight || '0px';
  }

  function getCollapsedVisibility() {
    return collapseHeight ? '' : 'hidden';
  }

  function setCollapsed() {
    // console.log('setCollapsed');

    if (!contentRef.current) return;

    setCollapseStyle({
      height: getCollapseHeight(),
      visibility: getCollapsedVisibility(),
    });
    onCallback(onChange);
  }

  function setCollapsing() {
    // console.log('setCollapsing');

    if (!contentRef.current) return;

    const height = getContentHeight(); // capture height before setting it to async setState method

    setCollapseStyle({
      height,
      visibility: '',
    });

    nextFrame(() => {
      setCollapseStyle({
        height: getCollapseHeight(),
        visibility: '',
      });
      onCallback(onChange);
    });
  }

  function setExpanding() {
    // console.log('setExpanding');

    nextFrame(() => {
      if (contentRef.current) {
        const height = getContentHeight(); // capture height before setting it to async setState method

        setCollapseStyle({
          height,
          visibility: '',
        });
        onCallback(onChange);
      }
    });
  }

  function setExpanded() {
    // console.log('setExpanded');

    if (!contentRef.current) return;

    setCollapseStyle({
      height: '',
      visibility: '',
    });
    onCallback(onChange);
  }

  function getContentHeight() {
    if (contentRef && contentRef.current) {
      return `${contentRef.current.scrollHeight}px`;
    } else {
      return `100px`;
    }
  }

  function onTransitionEnd({ target, propertyName }: any) {
    // console.log('onTransitionEnd', collapseState, propertyName);

    if (target === contentRef.current && propertyName === 'height') {
      switch (collapseState) {
        case EXPANDING:
          setCollapseState(EXPANDED);
          break;
        case COLLAPSING:
          setCollapseState(COLLAPSED);
          break;
        // no default
      }
    }
  }

  // getDerivedStateFromProps
  const didOpen = collapseState === EXPANDED || collapseState === EXPANDING;

  if (!didOpen && isOpen) {
    setHasReversed(collapseState === COLLAPSING);
    setCollapseState(EXPANDING);
  }
  if (didOpen && !isOpen) {
    setHasReversed(collapseState === EXPANDING);
    setCollapseState(COLLAPSING);
  }
  // END getDerivedStateFromProps

  const style = {
    transition,
    ...collapseStyle,
  };
  const ElementType = elementType || 'div';
  const collapseClassName = `${className || 'collapse-css-transition'} --is-${collapseState}`;

  return (
    <ElementType
      ref={contentRef}
      style={style}
      className={collapseClassName}
      onTransitionEnd={onTransitionEnd}
      {...attrs}
    >
      {typeof render === 'function' ? render(collapseState) : children}
    </ElementType>
  );
}

function nextFrame(callback: any) {
  // Ensure it is always visible on collapsing, afterFrame didn't work
  requestAnimationFrame(() => requestAnimationFrame(callback));
}

function isMoving(collapseState: any) {
  return collapseState === EXPANDING || collapseState === COLLAPSING;
}
import React, { useRef, useState, useEffect } from "react";
import styled from "ui-toolkit/styled-components";
import useFilmstrip from "./useFilmstrip";
import { IconButton } from "office-ui-fabric-react/lib/Button";
import { getThemeValue } from "../PortalsThemeProvider/PortalsThemeProvider";

const CLASS_NAME = "filmstrip";

const Filmstrip: React.FC<FilmstripProps> = function({
  width = 400,
  spacing = 10,
  autopage = 0,
  children,
  className = "",
  ...rest
}) {
  let cssClass = [CLASS_NAME, className].filter(Boolean).join(" ");
  let containerRef = useRef(null);
  let totalCount = React.Children.count(children);
  let { paging, itemWidth, itemHeight } = useFilmstrip(totalCount, containerRef, {
    itemMinWidth: width,
    autopage,
    spacing,
  });

  return (
    <StyledPane className={cssClass} ref={containerRef} height={itemHeight}>
      <StyledItems itemWidth={itemWidth} className="filmstrip-items" spacing={spacing}>
        {children}
      </StyledItems>
      <StyledOverlay>
        {!paging.isDisabled && (
          <PagerButton
            onClick={paging.goBack}
            className="pager-button prev"
            iconProps={{ iconName: "ChevronLeftSmall" }}
          ></PagerButton>
        )}
        {!paging.isDisabled && (
          <PagerButton
            onClick={paging.goForward}
            className="pager-button next"
            iconProps={{ iconName: "ChevronRightSmall" }}
          ></PagerButton>
        )}
      </StyledOverlay>
    </StyledPane>
  );
};
export default Filmstrip;

export interface FilmstripProps {
  width?: number;
  spacing?: number;
  autopage?: number;
  className?: string;
  [key: string]: any;
}

const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* TODO: CHECK IF THIS WORKS IN IE */
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PagerButton = styled(IconButton)`
  pointer-events: initial;
  transition: opacity ease-out 200ms;
  opacity: 0;
  color: ${(props) => getThemeValue("palette.white", "#fff")};
  &:hover {
    color: ${(props) => getThemeValue("palette.white", "#fff")};
    background: ${(props) => getThemeValue("palette.themePrimary", "blue")};
  }
  background: ${(props) => getThemeValue("palette.themePrimary", "blue")};
  /* margin: 0 5px;
  border-radius: 50%; */
  /* The chevron icons don't look centered, fixing manually */
  &.next i {
    position: relative;
    left: 2px;
  }
  &.prev i {
    position: relative;
    right: 2px;
  }
`;

const StyledPane = styled.div`
  position: relative;
  width: 100%;
  margin-right: -${(props) => props.spacing}px;
  box-sizing: border-box;
  overflow: hidden;
  height: ${(props) => props.height}px;
  &:hover {
    .pager-button {
      opacity: 0.6;
    }
    .pager-button:hover {
      opacity: 0.85;
    }
  }
`;
const StyledItems = styled.div`
  width: 100%;
  position: relative;
  box-sizing: border-box;
  display: flex;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
  scroll-behavior: smooth;
  margin-right: -${(props) => props.spacing}px;
  padding-bottom: 1px;
  min-height: 50px;
  > * {
    box-sizing: border-box;

    flex: 0 0 ${(props) => props.itemWidth}px;
    margin-right: ${(props) => props.spacing}px;
    scroll-snap-align: start;
  }
`;

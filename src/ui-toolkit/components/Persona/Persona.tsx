import React from "react";
import Thumbnail from "../primitives/Thumbnail";
import Link from "../primitives/Link";
import styled from "ui-toolkit/styled-components";
import { getSiteUrl } from "../../core/utils/sharepointUtils";

function Persona({
  photo,
  title,
  subTitle,
  info,
  linkUrl,
  callToAction,
  orientation = "horizontal",
  photoSize,
  as = "div",
  ...rest
}: PersonaProps) {
  let profilePicture = (photo) => {
    let siteUrl = getSiteUrl();
    return photo ? photo : `${siteUrl}/_layouts/15/userphoto.aspx?size=L`;
  };

  return (
    <StyledPersonaWrapper as={as} {...rest}>
      <Link href={callToAction ? "" : linkUrl} className="personaLink">
        <StyledPersona className={"persona " + orientation}>
          <Thumbnail
            src={profilePicture(photo)}
            shape="circle"
            className="photo"
            height={photoSize}
            width={photoSize}
          />
          <div className={"details"}>
            <div className="textWrapper">
              <div className="title">{title}</div>
              {subTitle && <div className="subtitle">{subTitle}</div>}
              {info && <div className="info">{info}</div>}
            </div>
            {linkUrl && callToAction && (
              <Link href={linkUrl} className="callToAction">
                {callToAction}
              </Link>
            )}
          </div>
        </StyledPersona>
      </Link>
    </StyledPersonaWrapper>
  );
}

export default React.memo(Persona);

export interface PersonaProps {
  photo?: string;
  title: string;
  subTitle?: string;
  info?: string;
  linkUrl?: string;
  callToAction?: string;
  orientation?: "horizontal" | "vertical";
  photoSize?: string;
  as?: any;
  [key: string]: any;
}

const StyledPersonaWrapper = styled.div`
  &:not(.card-ui-toolkit) {
    .personaLink {
      > .persona {
        border-radius: 5px;
        padding: 10px;
      }
      &:hover > .persona {
        background: ${(props) => props.theme.palette.themeSecondary};
        .title,
        .subtitle,
        .info {
          color: ${(props) => props.theme.palette.white};
          text-decoration: none;
        }
      }
    }
  }
`;

const StyledPersona = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  padding: 5px;

  &.vertical {
    flex-direction: column;
    justify-content: space-around;
    .details {
      text-align: center;
      align-items: center;
    }
  }
  &.horizontal {
    .photo {
      margin-right: 10px;
    }
  }

  .details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 5px;
    align-items: flex-start;
  }
  .title {
    color: ${(props) => props.theme.semanticColors.bodyText};
    font-weight: 600;
    font-size: 15px;
    line-height: normal;
  }
  .subtitle {
    color: ${(props) => props.theme.semanticColors.bodySubtext};
    font-size: 13px;
    line-height: normal;
  }
  .info {
    color: ${(props) => props.theme.semanticColors.bodyText};
    font-size: 12px;
    line-height: normal;
  }
  .callToAction {
    margin-top: 10px;
    color: #fff;
    background: ${(props) => props.theme.palette.themePrimary};
    padding: 8px 20px;
    text-decoration: none;
    border-radius: 20px;
    display: inline-block;
    font-size: 13px;
    border: none;
    &:hover,
    &:active,
    &:focus {
      color: #fff;
      background-color: ${(props) => props.theme.palette.themeSecondary};
      outline: none;
      cursor: pointer;
    }
  }
`;

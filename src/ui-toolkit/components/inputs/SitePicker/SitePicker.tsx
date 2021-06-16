import * as React from "react";
import SiteChoiceGroup, { SiteChoiceType } from "./siteChoiceGroup";
import SiteUrlInput from "./SiteUrlInput";
import { getCurrentWebUrl as getCurrentSiteUrl } from "ui-toolkit/core/utils/sharepointUtils";
import styled from "ui-toolkit/styled-components";

const checkIsThisSite = function (siteUrl, currentSiteUrl) {
  return !siteUrl || siteUrl.toLowerCase() === currentSiteUrl.toLowerCase();
};

export class SitePicker extends React.Component<SitePickerProps, SitePickerState> {
  state = {
    siteChoice: checkIsThisSite(this.props.value, getCurrentSiteUrl())
      ? SiteChoiceType.ThisSite
      : SiteChoiceType.Other,
    urlIsValid: false,
  };
  onChange = (url: string, isValid: boolean) => {
    let siteUrl = null;
    if (isValid) {
      siteUrl = url;
      if (this.props.onChange) this.props.onChange(siteUrl);
    }
  };
  onChoiceGroupChange = (choiceKey: SiteChoiceType) => {
    this.setState({ siteChoice: choiceKey });
    if (choiceKey === SiteChoiceType.ThisSite) {
      this.props.onChange(getCurrentSiteUrl());
    }
  };
  render() {
    let siteChoice = this.state.siteChoice;

    return (
      <StyledContainer className="site-picker">
        <span className="connected-to">
          Currently Connected to: {getRelativeUrl(this.props.value)}
        </span>
        <SiteChoiceGroup
          label={this.props.label}
          value={siteChoice}
          onChange={this.onChoiceGroupChange}
        />
        <SiteUrlInput
          disabled={siteChoice === SiteChoiceType.ThisSite}
          url={this.props.value}
          onChange={this.onChange}
        />
      </StyledContainer>
    );
  }
}

const getRelativeUrl = (siteUrl: string) => {
  try {
    return siteUrl.toLowerCase().split(".sharepoint.com")[1];
  } catch (err) {
    return siteUrl;
  }
};
const StyledContainer = styled.div`
  position: relative;
  box-sizing: border-box;
  .connected-to {
    font-size: 12px;
  }
`;
export interface SitePickerProps {
  /** The site url value (Reac) */
  value: string;
  onChange: (siteUrl) => void;
  label: string;
}

export interface SitePickerState {
  urlIsValid: boolean;
  siteChoice: SiteChoiceType;
}

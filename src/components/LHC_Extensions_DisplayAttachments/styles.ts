import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';

const StyledCardContent = styled.button(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    border: 0.0625rem solid ${theme.base.palette['border-line']};
    padding: 0.5rem;
    min-height: 5rem;
    text-align: start;
    margin-inline-start: 0 !important;
    background: ${theme.base.palette['primary-background']};
    & > div {
      height: 100%;
    }
    & > div > div {
      align-self: start;
    }
  `;
});

export const StyledTable = styled.table(({ theme }: { theme: typeof themeDefinition }) => {
  return css`
    width: 100%;
    border-collapse: collapse;

    th {
      background-color: ${theme.base.palette['app-background']};
      padding: 0.75rem;
      text-align: left;
      font-weight: 600;
      border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
    }

    td {
      padding: 0.75rem;
      border-bottom: 0.0625rem solid ${theme.base.palette['border-line']};
    }

    tbody tr:hover {
      background-color: ${theme.base.palette['secondary-background']};
    }
  `;
});

export default StyledCardContent;

import styled from "styled-components"

export const PageContainer = styled.div`
  padding-bottom: 80px;
  background-color: #282c34;
  color: #e3e3e3;

  h1 {
    font-weight: 500;
    font-size: 1.3rem;
    padding: 1rem;
    padding-left: 1rem;
    color: #ebf1fd;
  }

  muted,
  .muted {
    color: #808a96;
  }
`

export const BrightBox = styled.div`
  background-color: #3e6189;
  border-radius: 0.2rem;
  margin-bottom: 0.5rem;

  padding: 0.5rem 1rem;
  color: #cbd3dd;
`

export const DimBox = styled.div`
  background-color: #2b3f56;
  border-radius: 0.2rem;

  padding: 0.5rem 1rem;
  color: #e3e3e3;

  margin-bottom: 0.5rem;
  text-align: ${props => (props.center ? "center" : "right")};

  strong {
    color: #ebf1fd;
  }
`

export const ListItem = styled.div`
  background-color: #1d2733;
  border-bottom: 1px solid #0e1824;
  padding: 0.5rem 1rem;
  /* color: #89919b; */
  color: #cbd3dd;
`

export const Breadcrum = styled.nav`
  font-size: 0.85rem;
  margin-bottom: 0 !important;

  a {
    color: #e3e3e3;
  }
  a:hover {
    color: #ebf1fd;
  }
  .is-active > a {
    color: #808a96 !important;
  }
`

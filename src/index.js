// flow
import * as React from "react";
import ReactDOM from "react-dom";
import styled, { injectGlobal, keyframes } from "styled-components";

type State = {
  people: Array<Object>,
  isLoaded: boolean,
  hasError: boolean,
  searchValue: string,
  sortOption: string
};

const getIcon = (type: string) => {
  const options = {
    "n/a": "fa fa-android",
    male: "fa fa-user-circle-o",
    female: "fa fa-user-circle-o",
    default: "fa fa-question-circle"
  };

  return options[type] || options.default;
};

const request = (query?: string, cb: Object => void): void => {
  return fetch(`https://swapi.co/api/people/?search=${query}`).then(res =>
    res.json().then(json => {
      if (!res.ok) {
        cb({ hasError: true, isLoaded: true });
        return Promise.reject(json);
      }
      return cb({ people: json.results, isLoaded: true });
    })
  );
};

class App extends React.Component<void, State> {
  state = {
    people: [],
    isLoaded: false,
    hasError: false,
    searchValue: "",
    sortOption: ""
  };
  componentDidMount() {
    return request("", data => this.setState(data));
  }
  handleSearch = () => {
    this.setState({ isLoaded: false, sortOption: "" }, () => {
      return request(this.state.searchValue, data => this.setState(data));
    });
  };
  handleSort = ({ target: { value } }: { target: { value: string } }) => {
    if (value === "A to Z") {
      return this.setState(state => ({
        people: state.people.sort((a, b) => {
          if (a.name > b.name) {
            return 1;
          }
        }),
        sortOption: value
      }));
    }
    return this.setState(state => ({
      people: state.people.sort((a, b) => {
        if (a.name < b.name) {
          return 1;
        }
      }),
      sortOption: value
    }));
  };
  render() {
    const { people, searchValue, isLoaded, sortOption } = this.state;
    return (
      <Wrapper>
        <SpaceBetween>
          <input
            placeholder="Search..."
            type="text"
            value={searchValue}
            onChange={({ target: { value } }) =>
              this.setState({ searchValue: value })
            }
            onKeyDown={({ keyCode }) => keyCode === 13 && this.handleSearch()}
          />
          <select onChange={this.handleSort} value={sortOption}>
            <option disabled selected value="">
              Sort Results...
            </option>
            <option>A to Z</option>
            <option>Z to A</option>
          </select>
        </SpaceBetween>
        <hr />
        {!isLoaded && (
          <Flex>
            <Loading className="fa fa-spinner" />
            <Margin value="0 0 0 15px">
              <Title>Loading...</Title>
            </Margin>
          </Flex>
        )}
        {isLoaded &&
          people.length === 0 && (
            <Item>
              <Icon className="fa fa-exclamation-triangle" />
              <Margin value="0 0 0 20px">
                <Title>
                  We couldn&#39;t find the droids you were looking for.
                </Title>
                <Bold>Please try a different search query</Bold>
              </Margin>
            </Item>
          )}
        {isLoaded && (
          <React.Fragment>
            {people.map((p, index) => (
              <Item key={index} index={index}>
                <Icon className={getIcon(p.gender)} aria-hidden="true" />
                <div>
                  <Title>{p.name}</Title>
                  <Margin value="5px 0 0 0">
                    <InfoFlex>
                      <BoldBullet>Height: {p.height}</BoldBullet>
                      <BoldBullet>Mass: {p.mass}</BoldBullet>
                      <Bold>Gender: {p.gender}</Bold>
                    </InfoFlex>
                  </Margin>
                </div>
              </Item>
            ))}
          </React.Fragment>
        )}
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 100%;
  @media (min-width: 767px) {
    width: 600px;
  }
`;

const Flex = styled.div`
  display: flex;
`;

const InfoFlex = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
`;

const Item = styled(Flex)`
  background: ${props => (props.index % 2 === 1 ? "#F2F2F2" : "#ffffff")};
  padding: 15px 25px;
  flex-direction: column;
  align-items: center;
  text-align: center;
  @media (min-width: 550px) {
    text-align: left;
    flex-direction: row;
    align-items: flex-start;
  }
`;

const Icon = styled.i`
  font-size: 35px;
  width: 35px;
  text-align: center;
  margin-right: 15px;
`;

const Margin = styled.div`
  margin: ${props => props.value || "0"};
`;

const Title = styled.div`
  font-size: 35px;
  display: inline-block;
  line-height: 35px;
`;

const Bold = styled.strong`
  text-transform: uppercase;
  font-size: 14px;
  margin-right: 5px;
  @media (min-width: 430px) {
    margin-right: 0;
  }
`;

const BoldBullet = styled(Bold)`
  @media (min-width: 430px) {
    ::after {
      content: '\\2022';
      margin: 0 5px;
    }
  }
`;

const SpaceBetween = styled(Flex)`
  justify-content: space-between;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Loading = styled.i`
  font-size: 30px;
  animation: ${rotate360} 2s linear infinite;
`;

injectGlobal`
    body {
      font-family: 'Titillium Web';
    }
`;

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

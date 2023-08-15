import React, { Component } from "react";
import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import { getTotalPhotos, getTotalTopics, getUserWithMostUploads, getUserWithLeastUploads } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];



class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      focused: null,
      photos: [],
      topics: []
    };
  }

  // check if there's a saved focus state in local storage after first render
  // set state of application to match
  componentDidMount() {
    const urlsPromise = [
      "/api/photos",
      "/api/topics"
    ].map(url => fetch(url).then(res => res.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });

    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }
  }

  // write value to local storage after update
  componentDidUpdate(prevProps, prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    this.setState(prevState => ({
      focused: prevState.focused ? null : id
    }));
  }


  render() {
    // conditional CSS class "dahsboard--focused"
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });

    // filter panel: get this.state.focused's panel.id if not null
    const panels = (this.state.focused ?
      data.filter(panel => this.state.focused === panel.id) : data)
      .map(panel =>
        <Panel
          key={panel.id}
          label={panel.label}
          value={panel.getValue(this.state)}
          onSelect={() => this.selectPanel(panel.id)} />);


    if (this.state.loading) {
      return <Loading />;
    }

    return (
      <main className={dashboardClasses}>
        {panels}
      </main>);
  }
}

export default Dashboard;

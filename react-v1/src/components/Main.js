import React from "react";
import { connect } from "react-redux";

import Layout from "../components/MyLayout.js";
import { initStore } from "../store/store";
import { fetchQueue } from "../actions/queueActions.js";
import { fetchUsers } from "../actions/usersActions.js";
import { fetchPlayingContext } from "../actions/playbackActions.js";
import Users from "../components/Users.js";
import Queue from "../components/Queue.js";
import AddToQueue from "../components/AddToQueue.js";
import NowPlaying from "../components/NowPlaying.js";
import Devices from "../components/Devices.js";

class Main extends React.Component {
  static defaultProps({ req, store, isServer }) {
    return Promise.all([
      store.dispatch(fetchQueue()),
      store.dispatch(fetchUsers()),
      store.dispatch(fetchPlayingContext()),
    ]);
  }
  render() {
    return (
      <Layout>
        {this.props.playing.track ? (
          <NowPlaying
            track={this.props.playing.track}
            user={this.props.playing.user}
            position={this.props.playing.position}
          />
        ) : null}
        <div className="app">
          <style jsx>
            {`
              .app {
                margin: 20px;
                padding: 20px;
              }
            `}
          </style>
          <div style={{ float: "left" }}>
            <Queue items={this.props.queue} session={this.props.session} />
            {this.props.session.user !== null ? <AddToQueue /> : null}
            {this.props.session.user !== null ? <Devices /> : null}
          </div>
          <div style={{ float: "right", width: "150px" }}>
            <Users items={this.props.users} />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({
  playing: state.playback,
  queue: state.queue,
  users: state.users,
  session: state.session,
});

// export default connect(initStore, mapStateToProps, null)(Main);

export default connect(mapStateToProps, null)(Main);

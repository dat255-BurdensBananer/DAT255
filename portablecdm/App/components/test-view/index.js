import React, { Component } from 'react';
import { connect } from 'react-redux';

import { locationsByLocationType } from '../../reducers/locationreducer'

import {
    View,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';

import {
    Text,
    SearchBar,
    List,
    ListItem
} from 'react-native-elements';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class TestView extends Component {

  render() {
    const {navigation} = this.props;

        return(
          <View style={styles.container}>
            <TopHeader
              firstPage
              navigation={navigation}
              title="Test"
              />

          </View>
              );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    subtitle: {
        fontSize: 10,
    }
});

function mapStateToProps(state) {
    return {
        fetchReliability: state.settings.fetchReliability,
        connection: state.settings.connection,
        limitCache: state.settings.cacheLimit,
        useSSL: state.settings.connection.scheme === 'https://'
    };
}

export default connect(mapStateToProps, { })(TestView);

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
    ListItem,
    Button
} from 'react-native-elements';

import { selectBerthLocation } from '../../actions';

import TopHeader from '../top-header-view';
import colorScheme from '../../config/colors';

class LocationSelection extends Component {
    state = {
        searchTerm: '',
    }

    sortRecentlyUsed(a, b) {
        let operations = this.props.operations;
        let recentlyUsed = [];

        if (operations.filter((x) => (
            x.at === a.URN ||
            x.from === a.URN ||
            x.to === a.URN)
        ).length > 0) {
            return -1;
        }

        if (operations.filter((x) =>
            x.at === b.URN ||
            x.from === b.URN ||
            x.to === b.URN
        ).length > 0) {
            return 1;
        }

        return 0;
    }

    search(locations, searchTerm) {
        return locations.filter(location => location.name.toUpperCase().includes(searchTerm.toUpperCase())).sort((a, b) => this.sortRecentlyUsed(a, b));
    }

    render() {
        const { selectLocationFor, selectLocation, navigation, onBackPress, locations } = this.props;

        return (
            <View style={styles.container}>
                <TopHeader
                    firstPage
                    navigation={navigation}
                    title="Select Berth"
                />
                <SearchBar
                    containerStyle={styles.searchBarContainer}
                    inputStyle={{ backgroundColor: colorScheme.primaryContainerColor }}
                    lightTheme
                    placeholder='Search by location name or type'
                    placeholderTextColor={colorScheme.tertiaryTextColor}
                    onChangeText={text => this.setState({ searchTerm: text })}
                    textInputRef='textInput'
                />
                <Button
                    containerViewStyle={styles.buttonContainer}
                    small
                    icon={{
                        name: 'filter-list',
                        size: 30,
                        color: colorScheme.primaryTextColor,
                        style: styles.iconStyle,
                    }}
                    backgroundColor = {colorScheme.primaryColor}
                    //onPress= {() => navigate('FilterMenu')}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'stretch',
    },
    subtitle: {
        fontSize: 10,
    }
});

function mapStateToProps(state, ownProps) {
    return {
        locations: locationsByLocationType (state, 'BERTH'),
        loading: state.location.loading,
        operations: state.portCalls.selectedPortCallOperations,
    }
}

export default connect(mapStateToProps, { selectBerthLocation })(LocationSelection);

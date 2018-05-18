import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    updateMyPortCalls,
    //updateMyPortCallIds,
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
    appendMyPortCalls,
    bufferMyPortCalls,
    setError,
 } from '../../actions';

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';

import {
    SearchBar,
    Button,
    List,
    ListItem,
    Icon,
} from 'react-native-elements';

import colorScheme from '../../config/colors';
import TopHeader from '../top-header-view';
import { getDateTimeString } from '../../util/timeservices';

class MyVesselsView extends Component {
    state = {
        searchTerm: '',
        refreshing: false,
        numLoadedPortCalls: 20,
    }

    componentWillMount() {
        this.loadPortCalls = this.loadPortCalls.bind(this);
        this._appendMyPortCalls = this._appendMyPortCalls.bind(this);
        this.loadPortCalls()
            .then(this.props.bufferMyPortCalls);
    }

    loadPortCalls() {
        return this.props.updateMyPortCalls().then(() => {
            if(this.props.error.hasError) {
                navigate('Error');
            }
        });
    }

    _appendMyPortCalls() {
        let { myPortCalls, appendMyPortCalls, isAppendingPortCalls } = this.props;
        if (myPortCalls.length > 0 && !isAppendingPortCalls) {
            return appendMyPortCalls(myPortCalls[myPortCalls.length - 1]);
        }
    }

    checkBottom(event){
         let {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
         const paddingToBottom = 100;
         if(!this.props.showLoadingIcon && layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            let numLoaded = this.state.numLoadedPortCalls;

             this.setState({numLoadedPortCalls: numLoaded + 20});
             let { myPortCalls, appendMyPortCalls } = this.props;
             if(numLoaded >= myPortCalls.length) {
                this._appendMyPortCalls();
             } else {
                 console.log('Loading more local port calls. Showing ' + numLoaded + ' of ' + myPortCalls.length + ' port calls.');
             }
         }
    }

    render() {
        const {navigation, showLoadingIcon, myPortCalls, selectPortCall} = this.props;
        const {navigate} = navigation;
        const {searchTerm} = this.state;

        // Quick fix for having 1 element with null value
        if (myPortCalls.length === 1) {
            myPortCalls.splice(0,1);
        }

        return(
            <View style={styles.container}>
                <TopHeader title="My Portcalls" navigation={this.props.navigation} firstPage/>
                {/*Render the search/filters header*/}
                <View style={styles.containerRow}>
                    <SearchBar
                        autoCorrect={false}
                        containerStyle = {styles.searchBarContainer}
                        showLoadingIcon={showLoadingIcon}
                        clearIcon
                        inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
                        lightTheme
                        placeholder='Search by name, IMO or MMSI number'
                        placeholderTextColor = {colorScheme.tertiaryTextColor}
                        onChangeText={text => this.setState({searchTerm: text})}
                        textInputRef='textInput'
                    />
                </View>

                {/*Render the List of PortCalls*/}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.loadPortCalls.bind(this)}
                    />
                    }
                    onScroll={this.checkBottom.bind(this)}
                    scrollEventThrottle={4}
                    >
                    <List>
                        {

                            this.search(myPortCalls, searchTerm).map( (myPortCall) => (
                                <ListItem
                                    roundAvatar
                                    avatar={myPortCall.vessel.photoURL ? {uri: myPortCall.vessel.photoURL} : null}
                                    key={myPortCall.portCallId}
                                    title={myPortCall.vessel.name}
                                    badge={{element: this.renderFavorites(myPortCall)}}
                                    titleStyle={styles.titleStyle}
                                    subtitle={getDateTimeString(new Date(myPortCall.startTime))}
                                    subtitleStyle={styles.subTitleStyle}
                                    // rightTitle={portCall.stage ? portCall.stage.replace(/_/g, ' ') : undefined}
                                    // rightTitleStyle={[styles.subTitleStyle, {fontSize: 9}]}
                                    onPress={() => {
                                        //console.log(JSON.stringify(portCall.vessel));
                                        selectPortCall(myPortCall);
                                        navigate('TimeLine')
                                    }}
                                    onLongPress={() => {
                                        Alert.alert(
                                            'Favorite ' + myPortCall.vessel.name,
                                            'What would you like to do?',
                                            [
                                                {text: 'Cancel'},
                                                {
                                                    text:
                                                        (this.props.favoriteVessels.includes(myPortCall.vessel.imo) ? 'Unf' : 'F') +
                                                        'avorite vessel',
                                                    onPress: () => {
                                                        this.props.toggleFavoriteVessel(myPortCall.vessel.imo);

                                                }},
                                                {
                                                    text:
                                                        (this.props.favoritePortCalls.includes(myPortCall.portCallId) ? 'Unf' : 'F') +
                                                    'avorite port call', onPress: () => {
                                                    this.props.toggleFavoritePortCall(myPortCall.portCallId);
                                                }}
                                            ]
                                        );
                                    }}
                                />
                            ))
                        }
                    </List>
                </ScrollView>
            </View>
        );
    }

    renderFavorites(myPortCall) {
        let showStar = this.props.favoritePortCalls.includes(myPortCall.portCallId);
        let showBoat = this.props.favoriteVessels.includes(myPortCall.vessel.imo);
        return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {showStar && <Icon
                        name='star'
                        color='gold'
                    />}
                    {showBoat && <Icon
                        name='directions-boat'
                        color='lightblue'
                    />}
                    {!!myPortCall.stage && <Text style={[styles.subTitleStyle, {fontSize: 9, marginLeft: 4}]}>
                        {myPortCall.stage.replace(/_/g, ' ')}
                    </Text>}
                </View>
        );
    }
    isFavorite(myPortCall) {
        return this.props.favoritePortCalls.includes(myPortCall.portCallId) ||
        this.props.favoriteVessels.includes(myPortCall.vessel.imo);
    }

    isFavoriteLocation(myPortCall) {
      return this.props.mylocations.includes(myPortCall.toLocation)
    }

    sortFilters(a,b) {
        let aFav = this.isFavorite(a);
        let bFav = this.isFavorite(b);
        if (aFav && !bFav) return -1;
        if (bFav && !aFav) return 1;

        let { filters } = this.props;
        let invert = filters.order === 'ASCENDING';
        if (filters.sort_by === 'LAST_UPDATE') {
            if (a.lastUpdated > b.lastUpdated)
                 return invert ? 1 : -1;
            else return invert ? -1 : 1;
        } else if (filters.sort_by === 'ARRIVAL_DATE') {
            if (a.startTime > b.startTime)
                 return invert ? 1 : -1;
            else return invert ? -1 : 1;
        }

        return 0;
    }

    search(myPortCalls, searchTerm) {
        let { filters } = this.props;

        return myPortCalls.filter(myPortCall => {
            return (myPortCall.vessel.name.toUpperCase().includes(searchTerm.toUpperCase()) ||
            myPortCall.vessel.imo.split('IMO:')[1].startsWith(searchTerm) ||
            myPortCall.vessel.mmsi.split('MMSI:')[1].startsWith(searchTerm)) &&
            (!myPortCall.stage || filters.stages.includes(myPortCall.stage));
        }).sort((a,b) => this.sortFilters(a,b))//.sort((a,b) => a.status !== 'OK' ? -1 : 1)
        .slice(0, this.state.numLoadedPortCalls);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colorScheme.primaryColor
    },
    // Search bar and filter button
    containerRow: {
        flexDirection: 'row',
        alignItems:'center',
        marginTop: 10,
        paddingLeft: 15,
        paddingRight: 0,
    },
    searchBarContainer: {
        backgroundColor: colorScheme.primaryColor,
        flex: 4,
        marginRight: 0,
        borderBottomWidth: 0,
        borderTopWidth: 0,
    },
    // Filter button container
    buttonContainer: {
        flex: 1,
        marginRight: 0,
        marginLeft: 0,
        alignSelf: 'stretch',
    },
    iconStyle: {
        alignSelf: 'stretch',
    },
    titleStyle: {
        color: colorScheme.quaternaryTextColor,
    },
    subTitleStyle: {
        color: colorScheme.tertiaryTextColor,
    },
})

function mapStateToProps(state) {
    return {
        myPortCalls: state.cache.myPortCalls,
        cacheLimit: state.cache.limit,
        favoritePortCalls: state.favorites.portCalls,
        favoriteVessels: state.favorites.vessels,
        showLoadingIcon: state.portCalls.portCallsAreLoading,
        filters: state.filters,
        error: state.error,
        isAppendingPortCalls: state.cache.appendingPortCalls
    }
}

export default connect(mapStateToProps, {
    updateMyPortCalls,
    //updateMyPortCallIds,
    appendMyPortCalls,
    selectPortCall,
    toggleFavoritePortCall,
    toggleFavoriteVessel,
    bufferMyPortCalls,
    setError,
})(MyVesselsView);

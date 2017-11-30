import React from 'react';
import { Platform, View, Text, StatusBar, TouchableHighlight, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import I18n from 'react-native-i18n';
import Calendar from '@components/Calendar';
import Moment from 'moment';
var {GooglePlacesAutocomplete} = require('@components/GooglePlaceAutoComplete');

import { Metrics, Styles, Icons, Colors, Fonts, Images } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

const customDayHeadings = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CommonWidgets = {
    renderStatusBar(color, translucent) {
        return (
            <StatusBar
                backgroundColor={color}
                barStyle={'light-content'}
                translucent={!!translucent}
            />
        );
    },
    renderNavBarHeader(headerText) {
        return (
            <View style={Styles.center}>
                <Text
                    style={[Fonts.style.h4,
                        { textAlign: 'center',
                            width: Metrics.screenWidth * 0.7,
                            color: Colors.textPrimary }]}
                    numberOfLines={1}>
                    {headerText}
                </Text>
            </View>
        );
    },
    renderSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 40 }} />
        );
    },
    renderBigSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 20 }} />
        );
    },
    renderLargeSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 10 }} />
        );
    },
    renderSmallSpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 50 }} />
        );
    },
    renderTinySpacer() {
        return (
            <View style={{ height: Metrics.screenHeight / 60 }} />
        );
    },
    renderCalendar(curDate, scale, dateChange) {
        const rowHeight = Metrics.screenHeight * 0.07 * scale;
        const customStyle = {
            calendarContainer: { width: Metrics.screenWidth * scale }, // Container View
            calendarControls: { width: Metrics.screenWidth / 3, marginBottom: 5 }, // title View
            calendarHeading: {marginBottom: 10},
            weekRow: { width: Metrics.screenWidth * scale, height: rowHeight, alignItems: 'center' }, // 30 day View
            dayButtonFiller: { width: Metrics.screenWidth * scale / 7 }, // backspace empty day
            dayButton: { width: Metrics.screenWidth  * scale / 7, height: rowHeight + 1, backgroundColor: Colors.calendarItem, justifyContent: 'center' }, // 1 day View
            // dayCircleFiller: { width: Metrics.screenWidth / 12 * scale, height: Metrics.screenWidth / 12 * scale, borderRadius: Metrics.screenWidth / 24 * scale },
            dayCircleFiller: { width: Metrics.screenWidth * scale / 7, height: Metrics.screenWidth * scale / 7, borderRadius: 0 },
            currentDayCircle: {
                backgroundColor: Colors.brandFourth
            },
            selectedDayCircle: {
                backgroundColor: Colors.brandFourth
            },
            selectedDayText: {
                color: Colors.textThird
            },
            controlButtonText: {
                margin: 0
            },
            title: { fontFamily: Fonts.type.italic, fontSize: Fonts.size.general },
            weekendHeading: { fontFamily: Fonts.type.italic },
            dayHeading: { fontFamily: Fonts.type.italic },
            day: { fontFamily: Fonts.type.italic, fontSize: Fonts.size.h5, width: Metrics.screenWidth * 0.06, textAlign: 'center', color: Colors.textThird },
            weekendDayText: { color: Colors.textThird }
        };
        return (
            <Calendar
                ref="calendar"
                showControls
                customStyle={customStyle}
                dayHeadings={customDayHeadings}
                monthNames={customMonthNames}
                titleFormat={'MMMM YYYY'}
                onDateSelect={dateChange}
            />
        );
    },
    renderAutoComplete(onPress, onClickCurrentLocation, address) {
        return (
            <GooglePlacesAutocomplete
                ref={(ref) => this._googlePlace = ref}
                placeholder={I18n.t('SEARCH_PLACEHOLDER')}
                minLength={1}
                autoFocus={false}
                fetchDetails={true}
                address={address}
                onPress={(data, details = null) => {
                    let selectAddress = {
                        description: data.description,
                        geometry: {
                            location: {
                                lat: details.geometry.location.lat,
                                lng: details.geometry.location.lng
                            }
                        }
                    };
                    onPress(data, details.geometry);
                }}
                onCurrentLocationPress={onClickCurrentLocation}
                getDefaultValue={() => { return ''; }}
                query={{
                    key: 'AIzaSyDn_iKru1ueVvJjjJhSNV_Snnc6z5BMZNk',
                    language: 'en', // language of the results
                    types: 'address', // default: 'geocode'
                }}
                styles={{
                    container: { top: Metrics.screenHeight * 0.15 },
                    description: { fontWeight: 'normal' },
                    predefinedPlacesDescription: { color: '#1faadb' },
                    textInput: {textAlign: 'center'}
                }}
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                }}
                GooglePlacesSearchQuery={{
                }}
                enablePoweredByContainer = {true}
                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
            />
        );
    },
    renderLogo() {
        return (
            <Image
                resizeMode={'contain'}
                style={Styles.imgLogo}
                source={Images.imgLogo} />
        );
    },
    renderMaterialButton(text, color, onPress) {
        return (
            <TouchableOpacity
                style={[Styles.button, Styles.buttonShadow, { borderRadius: 0, backgroundColor: color}]}
                onPress={onPress}>
                <Text style={Fonts.style.buttonText}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    },
    renderFacebookButton(text, color, onPress) {
        return (
            <TouchableOpacity
                style={[Styles.buttonFB, Styles.buttonShadow, { borderRadius: 0, backgroundColor: color}]}
                onPress={onPress}>
                <Text style={Fonts.style.buttonText}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    },
    renderStepButton(text, color, onPress) {
        return (
            <TouchableOpacity
                style={[Styles.buttonStep, Styles.buttonShadow, { borderRadius: 0, backgroundColor: color}]}
                onPress={onPress}>
                <Text style={Fonts.style.buttonText}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    },
    renderMaterial2Button(text, textColor, color, borderColor, onPress) {
        return (
            <TouchableOpacity
                style={[Styles.button, Styles.buttonShadow, { borderWidth: 1, backgroundColor: color, borderColor: borderColor}]}
                onPress={onPress}>
                <Text style={[Fonts.style.buttonText, {color: textColor}]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    },
    renderCloseButton(onPress) {
        return (
            <TouchableOpacity
                style={styles.backButton}
                onPress={onPress}>
                <Icon name="md-close" size={30} color={Colors.textPrimary} />
            </TouchableOpacity>
        );
    },
    renderBackButton(onPress) {
        return (
            <TouchableOpacity
                style={styles.backButton}
                onPress={onPress}>
                <Icon name="ios-arrow-back" size={25} color={Colors.green} />
            </TouchableOpacity>
        );
    },
    renderMenuButton(onPress) {
        return (
            <TouchableOpacity
                style={styles.backButton}
                onPress={onPress}>
                <Icon name="md-menu" size={25} color={Colors.Black} />
            </TouchableOpacity>
        );
    },
    renderAddIconButton(onPress) {
        return (
            <TouchableOpacity
                style={{ position: 'absolute', right: 0, top: 0, backgroundColor: 'transparent' }}
                onPress={onPress}>
                <Image style={{ width: 34, height: 34 }} source={Icons.iconAdd} />
            </TouchableOpacity>);
    },
    renderNavBarBackButton(onPress) {
        return (
            <TouchableOpacity
                style={{ paddingBottom: Platform.OS === 'android' ? 5 : 3 }}
                onPress={onPress} >
                <Icon name="ios-arrow-back" size={30} color={Colors.textPrimary} />
            </TouchableOpacity>
        );
    },
    renderWorkImage(image, onpress, onclose) {
        return (
            <TouchableOpacity style={styles.workImageView} onPress={onpress}>
                <View style={[Styles.center, styles.workImage, Styles.buttonShadow]}>
                    { image ?
                        <Image style={[styles.workImage, {backgroundColor: 'transparent'}]} source={{uri: image}}/>
                        :
                        <Icon name='md-add' size={50} style={{color: Colors.textPrimary}} />
                    }
                </View>
                { image ?
                    (<TouchableOpacity
                        style={styles.closeIcon}
                        onPress={onclose}>
                        <Image
                            style={{ width: 30, height: 30, borderRadius: 15 }}
                            source={Icons.iconClose}/>
                    </TouchableOpacity>) : <View/> }
            </TouchableOpacity>
        );
    },
    renderImageView(image) {
        return (
            <View style={styles.workImageView}>
                <View style={[Styles.center, styles.workImage, Styles.buttonShadow]}>
                    { image === '' ?
                        <Icon name='md-add' size={50} style={{ color: Colors.transparent }}/>
                        :
                        <Image style={[styles.workImage, {backgroundColor: 'transparent'}]} source={image}/>}
                </View>
            </View>
        );
    },
    renderForwardIcon() {
        return (
            <View style={styles.forwardIconContainer}>
                <Icon
                    style={{ marginTop: 5 }}
                    name={'ios-arrow-forward-outline'}
                    size={30}
                    color={Colors.textThird}
                />
            </View>
        );
    },
    renderSwipeButton(title, backgroundColor, textColor, onpress ) {
        return (
            <TouchableOpacity
                onPress={onpress}
                style={[styles.swipeButton, { backgroundColor: backgroundColor }]}>
                <Text style={{ color: textColor, fontFamily: Fonts.type.regular, fontSize: Fonts.size.h4 }}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    },
    renderDefaultButton(title, backgroundColor, textColor, onpress ) {
        return (
            <TouchableOpacity
                onPress={onpress}
                style={[styles.defaultButton, { backgroundColor: backgroundColor }]}>
                <Text style={{ color: textColor, fontFamily: Fonts.type.regular, fontSize: Fonts.size.h5 }}>
                    {title}
                </Text>
            </TouchableOpacity>
        );
    },
    renderAvatarPlaceholder(style) {
        return (
            <View style={[style, {alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white}]}>
                <Image style={{width: 10, resizeMode: 'contain'}}
                       source={Images.imgHelp}/>
            </View>
        )
    }
};
export default CommonWidgets;

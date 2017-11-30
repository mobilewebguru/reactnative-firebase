import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Camera from 'react-native-camera';
import Permissions from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import I18n from 'react-native-i18n';
import Gallery from '@components/Gallery/';
import { popRoute, pushNewRoute, replaceRoute } from '@actions/route';
import { setAvatar } from '@actions/globals';
import { Styles, Colors, Global } from '@theme/';
import Utils from '@src/utils';
import styles from './styles';

let permissionPhoto = '';
let permissionCamera = '';

class TakeItemPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageUri: null,
            viewLoading: false,
            selected: [],
        };
    }
    componentWillMount() {
        this.checkPermission();
        setTimeout(() => {
        this.setState((previousState) => {
            if (!previousState.viewLoading) {
                return { viewLoading: true };
            }
            return { viewLoading: false };
        });
        }, 300);
    }
    getSelectedImages(images, current) {
        if (images.length > 0) {
            this.setImage(Utils.getUri(images[0].uri));
        } else {
            this.setImage(null);
        }
    }
    setImage(imgUri) {
        if (imgUri === null) {
            this.setState({ imageUri: null });
            return;
        }
        ImageResizer.createResizedImage(imgUri, 800, 600, 'JPEG', 80)
            .then((resizedImageUri) => {
                this.setState({
                    imageUri: resizedImageUri,
                });
            }).catch((err) => {
                return Utils.toast('@Unable to resize the photo', err);
            });
    }
    alertForPhotosPermission() {
        Alert.alert(
            I18n.t('CAN_ACCESS_PHOTO_TITLE'),
            I18n.t('CAN_ACCESS_PHOTO_BODY'),
            [
                { text: I18n.t('NO_WAY'), onPress: () => console.log('permission denied'), style: 'cancel' },
                { text: I18n.t('OPEN_SETTING'), onPress: Permissions.openSettings },
            ]);
    }
    takePicture() {
        this.camera.capture()
            .then(data => this.setImage(Utils.getUri(data.path)))
            .catch(err => this.setImage(null));
    }
    refreshGallery() {
        this.setImage(null);
        this.refs['gallery'].refresh();
    }
    onSetImage() {
        // this.props.setAvatar(this.state.imageUri);
        // const s3Url = Utils.uploadImage("profiles", this.state.imageUri);
        // if (s3Url !== null) {
        //     console.log(s3Url);
        // }
        this.props.callback(this.state.imageUri);
        this.props.popRoute();
    }
    checkPermission() {
        if (Platform.OS === 'ios') {
            Permissions.check('photo')
                .then((response) => {
                    permissionPhoto = response;
                    console.log('---------------', response);
                    if (permissionPhoto === 'denied') {
                        this.alertForPhotosPermission();
                    }
                });
            Permissions.check('camera')
                .then((response) => {
                    permissionCamera = response;
                    if (permissionPhoto !== 'denied' && permissionCamera === 'denied') {
                        this.alertForPhotosPermission();
                    }
                });
        } else {
            permissionCamera = 'authorized';
        }
    }
    render() {
        const backButton =
            (<TouchableOpacity
                style={styles.backButton}
                onPress={() => this.props.popRoute()}
            >
                <Icon name={'ios-arrow-back'} size={25} style={{ color: Colors.white }} />
            </TouchableOpacity>);
        const refreshButton = this.state.imageUri !== null ?
            (<TouchableOpacity
                onPress={() => this.refreshGallery()}
                style={styles.refreshButton}>
                <Icon
                    raised
                    name={'md-refresh'}
                    type={'font-awesome'}
                    color={Colors.white}
                    size={20}
                />
            </TouchableOpacity>)
            :
            null;
        const captureButton = this.state.imageUri === null ?
            (<TouchableOpacity
                onPress={() => this.takePicture()}
                style={[Styles.center, styles.captureButtonContainer]}
            >
                <View style={styles.captureButton} />
            </TouchableOpacity>)
            :
            (<TouchableOpacity
                onPress={() => this.onSetImage()}
                style={[Styles.center, styles.captureButtonContainer]}
            >
                <Icon
                    raised
                    name={'md-checkmark'}
                    type={'font-awesome'}
                    color={Colors.white}
                    size={40}
                />
            </TouchableOpacity>);
        let imageView;
        if (this.state.imageUri === null) {
            imageView = (permissionCamera !== 'denied' ?
                <Camera
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    style={styles.preview}
                    aspect={Camera.constants.Aspect.fill}
                >
                    {captureButton}
                </Camera>
                :
                <View />
            )
        } else {
            imageView = <Image
                source={{ uri: this.state.imageUri }}
                style={styles.preview}
            >
                {captureButton}
            </Image>
        }

        return (
            <View style={[Styles.fullScreen, { backgroundColor: 'black' }]} >
                <View style={{ flex: 8, backgroundColor: '#3005' }}>
                    {
                        this.state.viewLoading ? imageView : null
                    }
                    {backButton}
                    {refreshButton}
                </View>
                <View style={{ flex: 2, backgroundColor: '#eef5e9' }}>
                    {
                        this.state.viewLoading ? (
                            <Gallery
                                ref={'gallery'}
                                scrollRenderAheadDistance={500}
                                initialListSize={1}
                                pageSize={3}
                                removeClippedSubviews={false}
                                groupTypes={'SavedPhotos'}
                                batchSize={5}
                                maximum={1}
                                selected={this.state.selected}
                                assetType={'Photos'}
                                imagesPerRow={3}
                                imageMargin={5}
                                callback={(images, current) => this.getSelectedImages(images, current)}
                            />
                        ) : null
                    }
                </View>

            </View>
        );
    }
}

TakeItemPhoto.propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    popRoute: React.PropTypes.func.isRequired,
    pushNewRoute: React.PropTypes.func.isRequired,
    replaceRoute: React.PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        popRoute: () => dispatch(popRoute()),
        pushNewRoute: route => dispatch(pushNewRoute(route)),
        replaceRoute: route => dispatch(replaceRoute(route)),
        setAvatar: avatar => dispatch(setAvatar(avatar)),
    };
}
function mapStateToProps(state) {
    const globals = state.get('globals');
    return { globals };
}
export default connect(mapStateToProps, mapDispatchToProps)(TakeItemPhoto);

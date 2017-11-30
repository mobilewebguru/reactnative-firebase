package com.se.stylenow;

import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.airbnb.android.react.maps.MapsPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.i18n.reactnativei18n.ReactNativeI18n;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.reactlibrary.RNCardViewPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new InAppBillingBridgePackage(),
                    new ReactNativeOneSignalPackage(),
                    new VectorIconsPackage(),
                    new RNSpinkitPackage(),
                    new ReactMaterialKitPackage(),
                    new MapsPackage(),
                    new ImageResizerPackage(),
                    new ImagePickerPackage(),
                    new ReactNativeI18n(),
                    new RNGeocoderPackage(),
                    new RNCardViewPackage(),
                    new RCTCameraPackage(),
                    new LocationServicesDialogBoxPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        AppEventsLogger.activateApp(this);
        SoLoader.init(this, /* native exopackage */ false);
    }
}

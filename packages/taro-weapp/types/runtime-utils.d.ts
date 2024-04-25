declare function initNativeApi(taro: any): void;
declare const needPromiseApis: Set<string>;
declare const components: {
    Progress: {
        "border-radius": string;
        "font-size": string;
        duration: string;
        bindActiveEnd: string;
    };
    RichText: {
        space: string;
        "user-select": string;
    };
    Text: {
        "user-select": string;
    };
    Map: {
        polygons: string;
        subkey: string;
        rotate: string;
        skew: string;
        "max-scale": string;
        "min-scale": string;
        "enable-3D": string;
        "show-compass": string;
        "show-scale": string;
        "enable-overlooking": string;
        "enable-auto-max-overlooking": string;
        "enable-zoom": string;
        "enable-scroll": string;
        "enable-rotate": string;
        "enable-satellite": string;
        "enable-traffic": string;
        "enable-poi": string;
        "enable-building": string;
        setting: string;
        bindLabelTap: string;
        bindRegionChange: string;
        bindPoiTap: string;
        bindPolylineTap: string;
        bindAbilitySuccess: string;
        bindAbilityFailed: string;
        bindAuthSuccess: string;
        bindInterpolatePoint: string;
        bindError: string;
        bindAnchorPointTap: string;
    };
    Button: {
        lang: string;
        "session-from": string;
        "send-message-title": string;
        "send-message-path": string;
        "send-message-img": string;
        "app-parameter": string;
        "show-message-card": string;
        "business-id": string;
        bindGetUserInfo: string;
        bindContact: string;
        bindGetPhoneNumber: string;
        bindGetRealTimePhoneNumber: string;
        bindChooseAvatar: string;
        bindError: string;
        bindOpenSetting: string;
        bindLaunchApp: string;
        bindAgreePrivacyAuthorization: string;
    };
    Form: {
        "report-submit-timeout": string;
    };
    Input: {
        "always-embed": string;
        "adjust-position": string;
        "hold-keyboard": string;
        "safe-password-cert-path": string;
        "safe-password-length": string;
        "safe-password-time-stamp": string;
        "safe-password-nonce": string;
        "safe-password-salt": string;
        "safe-password-custom-hash": string;
        "auto-fill": string;
        bindKeyboardHeightChange: string;
        bindNicknameReview: string;
    };
    Picker: {
        "header-text": string;
        level: string;
    };
    PickerView: {
        "immediate-change": string;
        bindPickStart: string;
        bindPickEnd: string;
    };
    Slider: {
        color: string;
        "selected-color": string;
    };
    Textarea: {
        "show-confirm-bar": string;
        "adjust-position": string;
        "hold-keyboard": string;
        "disable-default-padding": string;
        "confirm-type": string;
        "confirm-hold": string;
        bindKeyboardHeightChange: string;
    };
    ScrollView: {
        "enable-flex": string;
        "scroll-anchoring": string;
        enhanced: string;
        "using-sticky": string;
        "paging-enabled": string;
        "enable-passive": string;
        "refresher-enabled": string;
        "refresher-threshold": string;
        "refresher-default-style": string;
        "refresher-background": string;
        "refresher-triggered": string;
        bounces: string;
        "show-scrollbar": string;
        "fast-deceleration": string;
        type: string;
        reverse: string;
        clip: string;
        "enable-back-to-top": string;
        "cache-extent": string;
        "min-drag-distance": string;
        "scroll-into-view-within-extent": string;
        "scroll-into-view-alignment": string;
        padding: string;
        "refresher-two-level-enabled": string;
        "refresher-two-level-triggered": string;
        "refresher-two-level-threshold": string;
        "refresher-two-level-close-threshold": string;
        "refresher-two-level-scroll-enabled": string;
        "refresher-ballistic-refresh-enabled": string;
        "refresher-two-level-pinned": string;
        bindDragStart: string;
        bindDragging: string;
        bindDragEnd: string;
        bindRefresherPulling: string;
        bindRefresherRefresh: string;
        bindRefresherRestore: string;
        bindRefresherAbort: string;
        bindScrollStart: string;
        bindScrollEnd: string;
        bindRefresherWillRefresh: string;
        bindRefresherStatusChange: string;
    };
    StickySection: {
        "push-pinned-header": string;
    };
    GridView: {
        type: string;
        "cross-axis-count": string;
        "max-cross-axis-extent": string;
        "main-axis-gap": string;
        "cross-axis-gap": string;
    };
    ListView: {};
    StickyHeader: {};
    Swiper: {
        "snap-to-edge": string;
        "easing-function": string;
    };
    SwiperItem: {
        "skip-hidden-item-layout": string;
    };
    Navigator: {
        target: string;
        "app-id": string;
        path: string;
        "extra-data": string;
        version: string;
    };
    Camera: {
        mode: string;
        resolution: string;
        "frame-size": string;
        bindInitDone: string;
        bindScanCode: string;
    };
    Image: {
        webp: string;
        "show-menu-by-longpress": string;
    };
    LivePlayer: {
        mode: string;
        "sound-mode": string;
        "auto-pause-if-navigate": string;
        "auto-pause-if-open-native": string;
        "picture-in-picture-mode": string;
        "enable-auto-rotation": string;
        "referrer-policy": string;
        "enable-casting": string;
        bindstatechange: string;
        bindfullscreenchange: string;
        bindnetstatus: string;
        bindAudioVolumeNotify: string;
        bindEnterPictureInPicture: string;
        bindLeavePictureInPicture: string;
        bindCastingUserSelect: string;
        bindCastingStateChange: string;
        bindCastingInterrupt: string;
    };
    Video: {
        title: string;
        "play-btn-position": string;
        "enable-play-gesture": string;
        "auto-pause-if-navigate": string;
        "auto-pause-if-open-native": string;
        "vslide-gesture": string;
        "vslide-gesture-in-fullscreen": string;
        "show-bottom-progress": string;
        "ad-unit-id": string;
        "poster-for-crawler": string;
        "show-casting-button": string;
        "picture-in-picture-mode": string;
        "enable-auto-rotation": string;
        "show-screen-lock-button": string;
        "show-snapshot-button": string;
        "show-background-playback-button": string;
        "background-poster": string;
        "referrer-policy": string;
        "is-drm": string;
        "is-live": string;
        "provision-url": string;
        "certificate-url": string;
        "license-url": string;
        "preferred-peak-bit-rate": string;
        bindProgress: string;
        bindLoadedMetadata: string;
        bindControlsToggle: string;
        bindEnterPictureInPicture: string;
        bindLeavePictureInPicture: string;
        bindSeekComplete: string;
        bindCastingUserSelect: string;
        bindCastingStateChange: string;
        bindCastingInterrupt: string;
        bindAdLoad: string;
        bindAdError: string;
        bindAdClose: string;
        bindAdPlay: string;
    };
    Canvas: {
        type: string;
    };
    Ad: {
        "ad-type": string;
        "ad-theme": string;
    };
    CoverView: {
        "marker-id": string;
        slot: string;
    };
    Editor: {
        "read-only": string;
        placeholder: string;
        "show-img-size": string;
        "show-img-toolbar": string;
        "show-img-resize": string;
        focus: string;
        bindReady: string;
        bindFocus: string;
        bindBlur: string;
        bindInput: string;
        bindStatusChange: string;
        name: string;
    };
    MatchMedia: {
        "min-width": string;
        "max-width": string;
        width: string;
        "min-height": string;
        "max-height": string;
        height: string;
        orientation: string;
    };
    FunctionalPageNavigator: {
        version: string;
        name: string;
        args: string;
        bindSuccess: string;
        bindFail: string;
        bindCancel: string;
    };
    LivePusher: {
        url: string;
        mode: string;
        autopush: string;
        muted: string;
        "enable-camera": string;
        "auto-focus": string;
        orientation: string;
        beauty: string;
        whiteness: string;
        aspect: string;
        "min-bitrate": string;
        "max-bitrate": string;
        "audio-quality": string;
        "waiting-image": string;
        "waiting-image-hash": string;
        zoom: string;
        "device-position": string;
        "background-mute": string;
        mirror: string;
        "remote-mirror": string;
        "local-mirror": string;
        "audio-reverb-type": string;
        "enable-mic": string;
        "enable-agc": string;
        "enable-ans": string;
        "audio-volume-type": string;
        "video-width": string;
        "video-height": string;
        "beauty-style": string;
        filter: string;
        "picture-in-picture-mode": string;
        animation: string;
        bindStateChange: string;
        bindNetStatus: string;
        bindBgmStart: string;
        bindBgmProgress: string;
        bindBgmComplete: string;
        bindAudioVolumeNotify: string;
    };
    OfficialAccount: {
        bindLoad: string;
        bindError: string;
    };
    OpenData: {
        type: string;
        "open-gid": string;
        lang: string;
        "default-text": string;
        "default-avatar": string;
        bindError: string;
    };
    NavigationBar: {
        title: string;
        loading: string;
        "front-color": string;
        "background-color": string;
        "color-animation-duration": string;
        "color-animation-timing-func": string;
    };
    PageMeta: {
        "background-text-style": string;
        "background-color": string;
        "background-color-top": string;
        "background-color-bottom": string;
        "root-background-color": string;
        "scroll-top": string;
        "scroll-duration": string;
        "page-style": string;
        "root-font-size": string;
        "page-orientation": string;
        bindResize: string;
        bindScroll: string;
        bindScrollDone: string;
    };
    VoipRoom: {
        openid: string;
        mode: string;
        "device-position": string;
        bindError: string;
    };
    AdCustom: {
        "unit-id": string;
        "ad-intervals": string;
        bindLoad: string;
        bindError: string;
    };
    PageContainer: {
        show: string;
        duration: string;
        "z-index": string;
        overlay: string;
        position: string;
        round: string;
        "close-on-slide-down": string;
        "overlay-style": string;
        "custom-style": string;
        bindBeforeEnter: string;
        bindEnter: string;
        bindAfterEnter: string;
        bindBeforeLeave: string;
        bindLeave: string;
        bindAfterLeave: string;
        bindClickOverlay: string;
    };
    ShareElement: {
        mapkey: string;
        transform: string;
        duration: string;
        "easing-function": string;
    };
    KeyboardAccessory: {};
    RootPortal: {
        enable: string;
    };
    ChannelLive: {
        "feed-id": string;
        "finder-user-name": string;
    };
    ChannelVideo: {
        "feed-id": string;
        "finder-user-name": string;
        "feed-token": string;
        autoplay: string;
        loop: string;
        muted: string;
        "object-fit": string;
        bindError: string;
    };
    Snapshot: {};
};
declare const hostConfig: {
    initNativeApi: typeof initNativeApi;
    getMiniLifecycle(config: any): any;
    transferHydrateData(data: any, element: any, componentsAlias: any): {
        sid: any;
        v: string;
        nn: any;
    } | undefined;
};
export { initNativeApi, needPromiseApis, components, hostConfig };

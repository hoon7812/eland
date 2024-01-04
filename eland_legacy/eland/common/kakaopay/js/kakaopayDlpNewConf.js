/* **********************************************************************************
 *  File Name      : kakaopayDlpConf.js
 *  Description    : 가맹점제공용 DLP Library Config 파일 Ver 1.2
 *  Author         : 정명환 bkmatrix0@lgcns.com
 *  Date Created   : 2014.10.02
 ***********************************************************************************/
var kakaopayDlpNewConfig = {

    debugMode: ['info', false],

    userAgentMode: true,

    closeBtn: {
        WPM: true,
        MPM: true
    },

    channelType: {
        WPM: 'TMS',
        MPM: 'WEB'
    },

    returnUrl: '',

    cancelUrl: '',

    zIndex: 100001,

    overlayFlag: true,

    overlayClassName: 'kakaopay-overlay',

    prType: 'MPM',

    customTargetLayerCssFlag: false,

    dummyPageFlag: false,

    layerConfig: {
        WPM_QR: {
            left: '0',
            top: '0',
            width: '426',
            height: '600',
            position: 'absolute'
        },
        MPM: {
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            position: 'fixed'
        },
        WPM_TMS: {
            left: '0',
            top: '0',
            width: '426',
            height: '550',
            position: 'absolute'
        }
    },

    blackList: [

    ],

    transportConfig: {
        JSON: '/common/kakaopay/js/json3.min.js',
        WPM: {
            hostUrl: 'https://securelocal.overpass.co.kr',  //*배포시 변경 필요
            targetFile: '/sample/kakaopaySampleLayer.action',
            nameFile: '/html/dlp/name.html',
            localNameFile: 'name.html'
        },
        MPM: {
        	 hostUrl: 'https://securemolocal.overpass.co.kr', //*배포시 변경 필요
             targetFile: '/sample/kakaopaySampleLayer.action',
            nameFile: '/html/dlp/name.html',
            localNameFile: 'name.html',
            dummyFile: '/account/getDummyPage.dev'
        },
        WPM_IE6: {
        	hostUrl: 'https://securelocal.overpass.co.kr', //*배포시 변경 필요
            targetFile: '/sample/kakaopaySampleLayer.action',
            nameFile: '/html/dlp/name.html',
            targetUrl: '/account/getCertifyPage.dev',
            localNameFile: 'name.html'
        }
    },

    message: {
        KKP_CER_001: 'DLP창을 호출하던 도중 ERROR가 발생되었습니다.',
        KKP_CER_002: '[prType]지원하지 않는 호출방식 입니다.',
        KKP_CER_003: '지원하지 않는 브라우저 입니다. 카카오페이는 Internet Explorer 8 이상 지원합니다.',
        KKP_CER_004: '[tnxId] 필수값이 정의되어 있지 않습니다.',
        KKP_CER_005: '카카오페이를 지원하지 않는 디바이스입니다.',
        KKP_CER_006: '[customTargetLayerCssFlag] 는 true 또는 false값만 setting이 가능합니다.',
        KKP_CER_007: '[overlayFlag] 는 true 또는 false값만 setting이 가능합니다.',
        KKP_CER_008: '결제인증요청페이지 내에 [Target Layer] 가 정의되어 있지 않습니다.',
        KKP_CER_009: '결제인증요청페이지 내에 [Target Form] 이 정의되어 있지 않습니다.',
        KKP_CER_010: '[Callback] 함수가 정의되어 있지 않습니다.',
        KKP_CER_011: '[closeBtn] 는 true 또는 false값만 setting이 가능합니다.',
        KKP_CER_012: '[channelType] 은 QR(QR결제), TMS(TMS결제)만 setting이 가능합니다.',
        KKP_CER_013: 'IOS에서는 Safari브라우저를 통해 결제를 진행해주세요.',
        KKP_CER_014: '[userAgentMode] 는 true 또는 false값만 setting이 가능합니다.',
        KKP_CER_015: '[channelType] 은 MPM : WEB(WEB결제), APP(APP결제)만 setting이 가능합니다.',
        KKP_CER_016: '[channelType] : APP 의 경우 [returnUrl] 은 필수 입력사항입니다. setReturnUrl()을 통해 URL을 입력해주세요.'
    },

    callAppUrl: {
        AndroidIntentOne: 'intent://kakaopay/submit?txn_id=',
        AndroidIntentTwo: '#Intent;scheme=kakaotalk;package=com.kakao.talk;end',
        AndroidMarketUrl: 'market://details?id=com.kakao.talk',
        AndroidAppUrl: 'kakaotalk://kakaopay/submit?txn_id=',
        IOSMarketUrl: 'https://itunes.apple.com/app/id362057947',
        IOSAppUrl: 'kakaotalk://kakaopay/submit?txn_id='
    }

};
/* **********************************************************************************
 *  File Name      : kakaopayDlpServerConf.js
 *  Description    : DLP Server Config 파일 Ver 1.0
 *  Author         : 정명환 bkmatrix0@lgcns.com
 *  Date Created   : 2015.04.01
 ***********************************************************************************/
var kakaopayDlpServerConfig = {

    _privateDlpServer: {

        message: {
            KKP_SER_001: '팝업차단을 해제하신 후 결제를 하시기 바랍니다.',
            KKP_SER_002: '결제가 취소되었습니다.',
            KKP_SER_003: '잠시 후 다시 시도해주세요. 문제가 지속되면 카카오페이 고객센터에 문의해주세요.',
            KKP_SER_004: '유효시간 5분이 지나서, 결제가 자동취소되었습니다. 다시 결제요청해주시기 바랍니다.',
            KKP_SER_005: '네트워크 오류가 발생하였습니다. 잠시후 다시 시도해주세요.',
            KKP_SER_006: '연결이 원할하지 않습니다. 잠시 후 다시 시도해주세요.',
            KKP_SER_007: '카카오페이를 지원하지 않는 디바이스입니다.',
            KKP_SVE_001: '카카오톡과 카카오페이를 사용중인 전화번호를 입력해주세요.',
            KKP_SVE_002: '생년월일(YYMMDD)을 6자리로 입력해주세요.',
            KKP_INF_001: '카카오페이 PC결제를 그만 두시겠습니까?'
        },

        layerSizeInfo: {
            validateTelnumAlert: {
                width: '256',
                height: '126'
            },
            validateBirthAlert: {
                width: '256',
                height: '126'
            },
            closeDlpConfirm: {
                width: '256',
                height: '126'
            },
            informHelpAlert: {
                width: '356',
                height: '156'
            }
        },

        layerHtmlInfo: {
            COMMON_IMG_PATH: '/common/kakaopay/images',

            validateTelnumAlert: function() {
                return '<div id="telnumAlert" class="layerPopup hidden">' +
                    '<div class="layerPopupBg"> </div>' +
                    '<div id="telnumAlertLayer" class="layerPopupWrapper" tabindex=0>' +
                    '<div class="layerPopupBody">' +
                    '<p><strong>카카오페이 카드 간편결제에 가입된</br> 휴대폰 번호를 입력해주세요.</strong></p>' +
                    '</div>' +
                    '<div class="layerPopupFooter">' +
                    '<button id="alertOkBtn" class="btnCenter closeLayerPopup"><img src="' + this.COMMON_IMG_PATH + '/btn_lp_b03.png" onMouseOver="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03_h.png\';" onMouseOut="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03.png\';" alt="확인" /></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },
            validateBirthAlert: function() {
                return '<div id="birthAlert" class="layerPopup hidden">' +
                    '<div class="layerPopupBg"></div>' +
                    '<div id="birthAlertLayer" class="layerPopupWrapper" tabindex=0>' +
                    '<div class="layerPopupBody">' +
                    '<p><strong>생년월일 6자리를 입력해주세요.</br> 예)820301</strong></p>' +
                    '</div>' +
                    '<div class="layerPopupFooter">' +
                    '<button id="alertOkBtn" class="btnCenter closeLayerPopup"><img src="' + this.COMMON_IMG_PATH + '/btn_lp_b03.png" onMouseOver="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03_h.png\';" onMouseOut="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03.png\';" alt="확인" /></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },
            closeDlpConfirm: function() {
                return '<div id="closeConfirm" class="layerPopup hidden">' +
                    '<div class="layerPopupBg"> </div>' +
                    '<div id="closeConfirmLayer" class="layerPopupWrapper" tabindex=0>' +
                    '<div class="layerPopupBody">' +
                    '<p><strong>카카오페이 카드 간편결제를</br> 그만 두시겠습니까?</strong></p>' +
                    '</div>' +
                    '<div class="layerPopupFooter">' +
                    '<button id="confirmOkBtn" class="btnLeft"><img src="' + this.COMMON_IMG_PATH + '/btn_lp_b01.png" onMouseOver="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b01_h.png\';" onMouseOut="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b01.png\';" alt="그만두기" /></button>' +
                    '<button id="confirmCancelBtn" class="btnRight closeLayerPopup"><img src="' + this.COMMON_IMG_PATH + '/btn_lp_b02.png" onMouseOver="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b02_h.png\';" onMouseOut="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b02.png\';" alt="계속하기" /></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            },
            informHelpAlert: function() {
                return '<div id="helpAlert" class="layerPopup_help hidden">' +
                    '<div class="layerPopupBg"> </div>' +
                    '<div id="helpAlertLayer" class="layerHelpWrapper" tabindex=0>' +
                    '<div class="layerPopupBody">' +
                    '<p><strong>결제 메시지 수신을 위해 \'카카오톡 > 더보기(...) > </br> pay > 카드 간편결제 > 관리 > 결제요청 메시지 수신 설정\'</br>에서 \'결제요청 메시지 수신\'을 활성화 해주세요.</strong></p>' +
                    '</div>' +
                    '<div class="layerPopupFooter">' +
                    '<button id="alertOkBtn" class="btnHelp closehelpPopup"><img src="' + this.COMMON_IMG_PATH + '/btn_lp_b03.png" onMouseOver="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03_h.png\';" onMouseOut="this.src=\'' + this.COMMON_IMG_PATH + '/btn_lp_b03.png\';" alt="확인" /></button>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        },

        debugMode: ['info', false]

    },

    _publicDlpServer: {

        VERSION: '1.2',

        TIME_INTERVAL: 1000,

        MAX_TIME: {
            WPM: {
                QR: 300,
                TMS: 300
            },
            MPM: 300
        },

        JSON_LIB_PATH: '/common/kakaopay/js/json3.min.js',

        callAppUrl: {
            AndroidIntentOne: 'intent://kakaopay/submit?txn_id=',
            AndroidIntentTwo: '#Intent;scheme=kakaotalk;package=com.kakao.talk;end',
            AndroidMarketUrl: 'market://details?id=com.kakao.talk',
            AndroidAppUrl: 'kakaotalk://kakaopay/submit?txn_id=',
            IOSMarketUrl: 'https://itunes.apple.com/app/id362057947',
            IOSAppUrl: 'kakaotalk://kakaopay/submit?txn_id='
        }

    }
};
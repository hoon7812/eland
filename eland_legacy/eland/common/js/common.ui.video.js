	/**
	 * onYouTubeIframeAPIReady 함수는 필수로 구현해야 한다.
	 * 플레이어 API에 대한 JavaScript 다운로드 완료 시 API가 이 함수 호출한다.
	 * 페이지 로드 시 표시할 플레이어 개체를 만들어야 한다.
	 */
	function onYouTubeIframeAPIReady() {
		for(var i=0; i < vdosLeng; i++) {
			VideoSetting(i);
		}
	}

	function VideoSetting(idx) {
		var youtubeID = youtubeVdoArray[idx].yId;
		var youtubeOPT = youtubeVdoArray[idx].yOpt;
		var companyCD = youtubeVdoArray[idx].vCc;

		if($('#'+youtubeID).prop("tagName") != undefined && $('#'+youtubeID).prop("tagName").toLowerCase()=="iframe") {
			return;
		}

		//Wecandeo (PV0122)
		if ( companyCD == "10" ) {
			var iframe = document.createElement("iframe");
			iframe.setAttribute("name", youtubeID);
			iframe.setAttribute("id", youtubeID);
			iframe.setAttribute("frameborder", "0");
			iframe.setAttribute("width", youtubeOPT.width);
			iframe.setAttribute("height", youtubeOPT.height);
			iframe.setAttribute('allowfullscreen', '')
			iframe.src = "//play.wecandeo.com/video/v/?key="+youtubeOPT.videoId;
			$("#"+youtubeID).parent().html(iframe);

			var wecandeo_iframe = document.getElementById(youtubeID);
			var contents = wecandeo_iframe.contentWindow || wecandeo_iframe.contentDocument;
			playerArr[idx] = new smIframeAPI(contents);

			playerArr[idx].onEvent(smIframeEvent.PLAY , function(){
				// 영상 재생 시 실행
				console.log('wecandeo play idx:'+idx);
				console.log(playerArr[idx]);
			});
			playerArr[idx].onEvent(smIframeEvent.IDLE , function(){
				// 영상 정지 시 실행
				console.log('wecandeo stop idx:'+idx);
				console.log(playerArr[idx]);
			});
			playerArr[idx].onEvent(smIframeEvent.PAUSE , function(){
				// 영상 일시 정지 시 실행
				console.log('wecandeo pause idx:'+idx);
				console.log(playerArr[idx]);
			});

		//Youtube
		} if ( companyCD == "20" ) {
			playerArr[idx] = new YT.Player(youtubeID, {
				width : youtubeOPT.width,
				height : youtubeOPT.height,
				videoId : youtubeOPT.videoId,

				playerVars: {
					controls: 0, //하단 컨트롤 바
					playsinline: 1,  // IOS 동영상 영역 안에서 재생
					showinfo: 0,  //상단 Info
					modestbranding: 0, //Youtube 워터마크 여부(작동하지 않음)
					rel: 0 //추천영상여부
				},
				events : {
					'onStateChange': onPlayerStateChange
				}
			});
		}
	}

	function onPlayerStateChange(event) {
		playerState = event.data == YT.PlayerState.ENDED ? '종료됨' :
				event.data == YT.PlayerState.PLAYING ? '재생 중' :
				event.data == YT.PlayerState.PAUSED ? '일시중지 됨' :
				event.data == YT.PlayerState.BUFFERING ? '버퍼링 중' :
				event.data == YT.PlayerState.CUED ? '재생준비 완료됨' :
				event.data == -1 ? '시작되지 않음' : '예외';
		if(playerState=='종료됨') {
			$(event.target.a).parents('.set_vdo').find('.btn_vdo_play').show();
		}
			/*if(playerState=='재생 중') {
				
			} else if(playerState=='종료됨') {
				$(event.target.a).parents('.set_vdo').find('.btn_vdo_play').show();	
			} else if(playerState=='일시중지 됨') {
				$(event.target.a).parents('.set_vdo').find('.btn_vdo_play').show();
			}
		console.log('onPlayerStateChange 실행: ' + playerState);*/
	}

	function playYoutube(idx) {
		
		// 플레이어 자동실행 (주의: 모바일에서는 자동실행되지 않음)		
		//console.log(vdoCurrentIDX)
		for(var i=0; i < vdosLeng; i++) {
			//if(vdoCurrentIDX!=undefined && vdoCurrentIDX==idx) {//영상 멈춘 부분 부터 다시 재생
			
		
			if(vdoCurrentIDX==idx) {//영상 멈춘 부분 부터 다시 재생
				continue;
			} else {
				stopYoutube(i);
			}
		}
		var $id = $('#'+youtubeVdoArray[idx].yId);
		var $boxVdo = $id.parents('.set_vdo');
		var $vdoPlay = $boxVdo.find('.btn_vdo_play');
		var $vdoPause = $boxVdo.find('.btn_vdo_pause');
		$vdoPlay.hide();
		$vdoPause.css('display','block');
		$vdoPause.on('click',function() {
			actionPause(idx);
		});
		playerArr[idx].playVideo();
		vdoCurrentIDX = idx;//현재 선택된 동영상 index
	}

	function actionPause(idx) {//일시중지 액션
		var companyCD = youtubeVdoArray[idx].vCc;
		//Wecandeo (PV0122)
		if ( companyCD == "10" ) {
			console.log('Wecandeo Pause');
			playerArr[idx].pause();

		//Youtube
		} if ( companyCD == "20" ) {
			var $id = $('#'+youtubeVdoArray[idx].yId);
			var $boxVdo = $id.parents('.set_vdo');
			var $vdoPlay = $boxVdo.find('.btn_vdo_play');
			var $vdoPause = $boxVdo.find('.btn_vdo_pause');
			playerArr[idx].pauseVideo();
			$vdoPause.hide();
			$vdoPlay.show();
		}
	}

	function actionStop(idx) {//정지 액션
		var companyCD = youtubeVdoArray[idx].vCc;
		//Wecandeo (PV0122)
		if ( companyCD == "10" ) {
			console.log('Wecandeo Stop');
			playerArr[idx].stop();

		//Youtube
		} if ( companyCD == "20" ) {
			var $id = $('#'+youtubeVdoArray[idx].yId);
			console.log($id)
			var $boxVdo = $id.parents('.set_vdo');
			var $vdoPlay = $boxVdo.find('.btn_vdo_play');
			var $vdoPause = $boxVdo.find('.btn_vdo_pause');
			playerArr[idx].seekTo(0, true);     // 영상의 시간을 0초로 이동시킨다.
			playerArr[idx].stopVideo();
			$vdoPause.hide();
			$vdoPlay.show();
		}
	}
	function pauseYoutube(idx) {
		actionPause(idx);
	}
	function stopYoutube(idx) {
		actionStop(idx);
	}

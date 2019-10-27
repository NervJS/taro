declare namespace Taro {
  namespace checkIsSupportFacialRecognition {
    type Promised = {
      errMsg: string
      errCode: number
    }
    type Param = {
      checkAliveType?: number
    }
  }
  function checkIsSupportFacialRecognition(OBJECT?: checkIsSupportFacialRecognition.Param): Promise<checkIsSupportFacialRecognition.Promised>

  namespace startFacialRecognitionVerify {
    type Promised = {
      errMsg: string
      errCode: number
      verifyResult: string
    }
    type Param = {
      name: string
      idCardNumber: string
      checkAliveType?: number
    }
  }
  function startFacialRecognitionVerify(OBJECT?: startFacialRecognitionVerify.Param): Promise<startFacialRecognitionVerify.Promised>

  namespace startFacialRecognitionVerifyAndUploadVideo {
    type Promised = {
      errMsg: string
      errCode: number
      verifyResult: string
    }
    type Param = {
      name: string
      idCardNumber: string
      checkAliveType?: number
    }
  }
  function startFacialRecognitionVerifyAndUploadVideo(OBJECT?: startFacialRecognitionVerifyAndUploadVideo.Param): Promise<startFacialRecognitionVerifyAndUploadVideo.Promised>
}

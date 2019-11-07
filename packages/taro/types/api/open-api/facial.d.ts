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
  function checkIsSupportFacialRecognition(res?: checkIsSupportFacialRecognition.Param): Promise<checkIsSupportFacialRecognition.Promised>

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
  function startFacialRecognitionVerify(res?: startFacialRecognitionVerify.Param): Promise<startFacialRecognitionVerify.Promised>

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
  function startFacialRecognitionVerifyAndUploadVideo(res?: startFacialRecognitionVerifyAndUploadVideo.Param): Promise<startFacialRecognitionVerifyAndUploadVideo.Promised>
}

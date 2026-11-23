// 타이틀 움직이는 배경: 원본 mp4 → 소리 없는 핑퐁(앞→뒤) 반복 영상
// 사용: swift scripts/title-video.swift art/source-v2/title_bg.mp4 assets/maps/title-bg.mp4 [너비=1280]
// 처음·끝 프레임이 같아져서 loop 재생해도 튀지 않는다. ffmpeg 없이 macOS AVFoundation만 쓴다.
import AVFoundation
let a=CommandLine.arguments
guard a.count>=3 else{print("usage: swift title-video.swift <in.mp4> <out.mp4> [width]");exit(1)}
let asset=AVURLAsset(url:URL(fileURLWithPath:a[1]))
let track=asset.tracks(withMediaType:.video)[0]
let W=a.count>3 ? Int(a[3])! : 1280, H=Int((Double(W)*Double(track.naturalSize.height)/Double(track.naturalSize.width)).rounded())/2*2
let fps=Int32(track.nominalFrameRate.rounded())
// 앞으로 디코드한 프레임 시각 목록
let rd=try! AVAssetReader(asset:asset)
let ro=AVAssetReaderTrackOutput(track:track,outputSettings:nil);rd.add(ro);rd.startReading()
var times:[CMTime]=[]
while let s=ro.copyNextSampleBuffer(){ if CMSampleBufferGetNumSamples(s)>0{times.append(CMSampleBufferGetPresentationTimeStamp(s))} }
times.sort{CMTimeCompare($0,$1)<0}
let order=times+times.dropFirst().dropLast().reversed()+[times[0]]
let out=URL(fileURLWithPath:a[2]);try? FileManager.default.removeItem(at:out)
let w=try! AVAssetWriter(outputURL:out,fileType:.mp4)
let wi=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:W,AVVideoHeightKey:H,
  AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:2_500_000,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel]])
let ad=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:wi,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA,kCVPixelBufferWidthKey as String:W,kCVPixelBufferHeightKey as String:H])
w.add(wi);w.startWriting();w.startSession(atSourceTime:.zero)
let g=AVAssetImageGenerator(asset:asset);g.requestedTimeToleranceBefore = .zero;g.requestedTimeToleranceAfter = .zero
g.maximumSize=CGSize(width:W,height:H)
var last:CGImage?,miss=0
for (i,t) in order.enumerated(){
  // 같은 프레임을 다시 뽑을 때 가끔 실패한다: 앞 프레임을 한 번 더 쓴다
  var img=try? g.copyCGImage(at:t,actualTime:nil)
  if img==nil{img=try? g.copyCGImage(at:CMTimeAdd(t,CMTime(value:1,timescale:1000)),actualTime:nil)}
  if img==nil{miss+=1;img=last}
  guard let cg=img else{print("first frame failed");exit(1)};last=cg
  var pb:CVPixelBuffer?;CVPixelBufferPoolCreatePixelBuffer(nil,ad.pixelBufferPool!,&pb)
  CVPixelBufferLockBaseAddress(pb!,[])
  let ctx=CGContext(data:CVPixelBufferGetBaseAddress(pb!),width:W,height:H,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(pb!),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.premultipliedFirst.rawValue|CGBitmapInfo.byteOrder32Little.rawValue)!
  ctx.interpolationQuality = .none;ctx.draw(cg,in:CGRect(x:0,y:0,width:W,height:H))
  CVPixelBufferUnlockBaseAddress(pb!,[])
  while !wi.isReadyForMoreMediaData{usleep(2000)}
  ad.append(pb!,withPresentationTime:CMTime(value:CMTimeValue(i),timescale:fps))
}
wi.markAsFinished();let sem=DispatchSemaphore(value:0);w.finishWriting{sem.signal()};sem.wait()
print("frames",order.count,"miss",miss,"size",W,"x",H,"status",w.status.rawValue,w.error?.localizedDescription ?? "")

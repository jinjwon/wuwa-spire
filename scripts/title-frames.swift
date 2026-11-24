// 타이틀 영상 프레임 도구(ffmpeg 없이 macOS AVFoundation만 씀). scripts/title-dayparts.cjs가 부른다
//   swift scripts/title-frames.swift extract <in.mp4> <dir>                 모든 프레임을 <dir>/000.png… 로
//   swift scripts/title-frames.swift encode <dir> <from> <to> <out.mp4> [fps=24]
//     from~to 프레임을 앞→뒤→앞(핑퐁)으로 이어 소리 없는 H.264로. 처음·끝이 같아 loop 재생해도 튀지 않는다
import AVFoundation
import AppKit
let a=CommandLine.arguments
func fail(_ m:String)->Never{print(m);exit(1)}
if a.count>=4 && a[1]=="extract"{
  let asset=AVURLAsset(url:URL(fileURLWithPath:a[2])),tr=asset.tracks(withMediaType:.video)[0]
  let r=try! AVAssetReader(asset:asset),o=AVAssetReaderTrackOutput(track:tr,outputSettings:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA]);r.add(o);r.startReading()
  var i=0;let ctx=CIContext()
  while let sb=o.copyNextSampleBuffer(){guard let pb=CMSampleBufferGetImageBuffer(sb) else{continue}
    let ci=CIImage(cvPixelBuffer:pb),cg=ctx.createCGImage(ci,from:ci.extent)!
    try! NSBitmapImageRep(cgImage:cg).representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:"\(a[3])/\(String(format:"%03d",i)).png"));i+=1}
  print("frames",i,"fps",tr.nominalFrameRate);exit(0)
}
guard a.count>=6 && a[1]=="encode",let from=Int(a[3]),let to=Int(a[4]) else{fail("usage: extract <in.mp4> <dir> | encode <dir> <from> <to> <out.mp4> [fps]")}
let fps=Int32(a.count>6 ? a[6] : "24")!
let fwd=Array(from...to),order=fwd+fwd.dropFirst().dropLast().reversed()+[from]
let img={(i:Int)->CGImage in guard let r=NSImage(contentsOfFile:"\(a[2])/\(String(format:"%03d",i)).png")?.cgImage(forProposedRect:nil,context:nil,hints:nil) else{fail("missing frame \(i)")};return r}
let f0=img(from),W=f0.width,H=f0.height
let out=URL(fileURLWithPath:a[5]);try? FileManager.default.removeItem(at:out)
let w=try! AVAssetWriter(outputURL:out,fileType:.mp4)
let wi=AVAssetWriterInput(mediaType:.video,outputSettings:[AVVideoCodecKey:AVVideoCodecType.h264,AVVideoWidthKey:W,AVVideoHeightKey:H,
  AVVideoCompressionPropertiesKey:[AVVideoAverageBitRateKey:2_500_000,AVVideoProfileLevelKey:AVVideoProfileLevelH264HighAutoLevel]])
let ad=AVAssetWriterInputPixelBufferAdaptor(assetWriterInput:wi,sourcePixelBufferAttributes:[kCVPixelBufferPixelFormatTypeKey as String:kCVPixelFormatType_32BGRA,kCVPixelBufferWidthKey as String:W,kCVPixelBufferHeightKey as String:H])
w.add(wi);w.startWriting();w.startSession(atSourceTime:.zero)
for (k,i) in order.enumerated(){
  let cg=img(i);var pb:CVPixelBuffer?;CVPixelBufferPoolCreatePixelBuffer(nil,ad.pixelBufferPool!,&pb)
  CVPixelBufferLockBaseAddress(pb!,[])
  let ctx=CGContext(data:CVPixelBufferGetBaseAddress(pb!),width:W,height:H,bitsPerComponent:8,bytesPerRow:CVPixelBufferGetBytesPerRow(pb!),space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGImageAlphaInfo.premultipliedFirst.rawValue|CGBitmapInfo.byteOrder32Little.rawValue)!
  ctx.draw(cg,in:CGRect(x:0,y:0,width:W,height:H));CVPixelBufferUnlockBaseAddress(pb!,[])
  while !wi.isReadyForMoreMediaData{usleep(2000)}
  ad.append(pb!,withPresentationTime:CMTime(value:CMTimeValue(k),timescale:fps))
}
wi.markAsFinished();let sem=DispatchSemaphore(value:0);w.finishWriting{sem.signal()};sem.wait()
print("frames",order.count,"size",W,"x",H,"status",w.status.rawValue,w.error?.localizedDescription ?? "")
if w.status != .completed{exit(1)}

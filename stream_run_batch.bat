set video1="http://185.160.21.117:82/mjpg/video.mjpg"
set target1="rtmp://localhost/camera1/stream_"
set audio1="audio files/audio1.mp3"

set video2="http://185.137.146.14/mjpg/video.mjpg"
set target2="rtmp://localhost/camera2/stream_"
set audio2="audio files/audio2.mp3"

set video3="http://85.31.165.140/mjpg/video.mjpg"
set target3="rtmp://localhost/camera3/stream_"
set audio3="audio files/audio3.mp3"

set video4="http://129.125.136.20/mjpg/video.mjpg"
set target4="rtmp://localhost/camera4/stream_"
set audio4="audio files/audio4.mp3"

start "" ffmpeg -stream_loop -1 -i %video1% -stream_loop -1 -i %audio1% -threads 4 ^
-map 0:v -map 1:a -c:v libx264 -c:a aac -b:a 256k -f flv %target1%800 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:480" -c:a aac -b:a 128k -preset fast -f flv %target1%480 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:360" -c:a aac -b:a 64k -preset fast -f flv %target1%360

start "" ffmpeg -i %video1% -vf "scale=400:-1,fps=3" screenshots/camera1/img_%%03d.jpg

start "" ffmpeg -stream_loop -1 -i %video2% -stream_loop -1 -i %audio2% -threads 4 ^
-map 0:v -map 1:a -c:v libx264 -c:a aac -b:a 256k -f flv %target2%800 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:480" -c:a aac -b:a 128k -preset fast -f flv %target2%480 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:360" -c:a aac -b:a 64k -preset fast -f flv %target2%360

start "" ffmpeg -i %video2% -vf "scale=400:-1,fps=3" screenshots/camera2/img_%%03d.jpg

start "" ffmpeg -stream_loop -1 -i %video3% -stream_loop -1 -i %audio3% -threads 4 ^
-map 0:v -map 1:a -c:v libx264 -c:a aac -b:a 256k -f flv %target3%800 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:480" -c:a aac -b:a 128k -preset fast -f flv %target3%480 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:360" -c:a aac -b:a 64k -preset fast -f flv %target3%360

start "" ffmpeg -i %video3% -vf "scale=400:-1,fps=3" screenshots/camera3/img_%%03d.jpg

start "" ffmpeg -stream_loop -1 -i %video4% -stream_loop -1 -i %audio4% -threads 4 ^
-map 0:v -map 1:a -c:v libx264 -c:a aac -b:a 256k -f flv %target4%800 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:480" -c:a aac -b:a 128k -preset fast -f flv %target4%480 ^
-map 0:v -map 1:a -c:v libx264 -vf "scale=-2:360" -c:a aac -b:a 64k -preset fast -f flv %target4%360

start "" ffmpeg -i %video4% -vf "scale=400:-1,fps=3" screenshots/camera4/img_%%03d.jpg
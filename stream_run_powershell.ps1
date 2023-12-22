# Load JSON file
$json = Get-Content 'site/camera_config.json' | ConvertFrom-Json

foreach ($camera in $json) {
    $video = $camera.input_url
    $target = $camera.output_url
    $audio = $camera.audio_url

    If(!(test-path -PathType container "screenshots/camera$($camera.camera_id)")) {
        New-Item -ItemType Directory -Path "screenshots/camera$($camera.camera_id)"
    }

    # Start ffmpeg for streaming
    Start-Process -NoNewWindow -FilePath "ffmpeg" -ArgumentList "-stream_loop -1 -i `"$video`" -stream_loop -1 -i `"$audio`" -threads 4 -map 0:v -map 1:a -c:v libx264 -c:a aac -b:a 256k -f flv `"$target`"720 -map 0:v -map 1:a -c:v libx264 -vf `"scale=-2:480`" -c:a aac -b:a 128k -preset fast -f flv `"$target`"480 -map 0:v -map 1:a -c:v libx264 -vf `"scale=-2:360`" -c:a aac -b:a 64k -preset fast -f flv `"$target`"360"

    # Start ffmpeg for screenshots
    Start-Process -NoNewWindow -FilePath "ffmpeg" -ArgumentList "-i `"$video`" -vf `"scale=400:-1,fps=3`" screenshots/camera$($camera.camera_id)/img_%03d.jpg"
}
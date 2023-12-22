var cameraConfig = null;

async function fetchConfig() {
  const response = await fetch("./camera_config.json");
  cameraConfig = await response.json();
}

function createPlayer(playerId, posterUrl, srcUrl) {
  return `
    <div class="player-container-modal">
    <video id="player-${playerId}" class="video-js player vjs-16-9" controls
        poster="${posterUrl}">
    <source src="${srcUrl}" type="application/x-mpegURL">
    <p class="vjs-no-js">
    Prohlížeč nepodporuje Javascript nebo HTML5.
    </p>
  </video>
  </div>`;
}

function createThumbnail(playerId, location, country) {
  return `
        <div class="player-container-thumbnail" id="player-container-${playerId}">
        <img src="screenshots/${playerId}/img_001.jpg" class="thumbnail" alt="thumbnail" id="${playerId}-thumbnail"/>
        <p class="thumbnail-title">${location}, ${country}</p>
        </div>
    `;
}

function createThumbnailPlayer(playerId, posterUrl, srcUrl) {
  return `
        <video id="${playerId}" class="video-js player player-thumbnail vjs-16-9" width="500" height="264" aspectRatio="16:9"
            poster="${posterUrl}">
        <source src="${srcUrl}" type="application/x-mpegURL">
        <p class="vjs-no-js">
        Prohlížeč nepodporuje Javascript nebo HTML5.
        </p>
    </video>
    `;
}

function createPlayerModal(playerId, posterUrl, srcUrl, cameraId) {
    const camera = cameraConfig.find(x => x.camera_id == cameraId);
  return `<div class="modal modal-xl" tabindex="-1" id="${playerId}" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${camera.location}, ${camera.country}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${createPlayer(`${playerId}`, posterUrl, srcUrl)}
          <p class="thumbnail-title">rtmp://localhost/camera${camera.camera_id}/stream_720</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>`;
}

function create(htmlStr) {
  var frag = document.createDocumentFragment(),
    temp = document.createElement("div");
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
    frag.appendChild(temp.firstChild);
  }
  return frag;
}

async function createPlayers() {
  cameraConfig.forEach((camera, index) => {
    try {
      var fragment = create(
        createThumbnail(
          `camera${camera.camera_id}`,
          camera.location,
          camera.country
        )
      );
      var modalFragment = create(
        createPlayerModal(
          `camera${camera.camera_id}-modal`,
          `screenshots/camera${camera.camera_id}/img_001.jpg`,
          `camera${camera.camera_id}/stream.m3u8`,
          camera.camera_id
        )
      );
      document.body.appendChild(modalFragment);

      const cameraContainer = document.getElementById("camera-container");
      if (index == 0) {
        cameraContainer.appendChild(
          create(`<div class="row row-cols-auto"></div>`)
        );
      }

      const row = 0;
      const column = index;

      const rowElement = cameraContainer.getElementsByClassName("row")[row];
      let columnElement = rowElement.getElementsByClassName("col")[column];

      if (!columnElement) {
        rowElement.appendChild(create(`<div class="col"></div>`));
        columnElement = rowElement.getElementsByClassName("col")[column];
      }

      columnElement.appendChild(fragment);

      var playerFragment = create(
        createThumbnailPlayer(
          `camera${camera.camera_id}-player-thumbnail`,
          `screenshots/camera${camera.camera_id}/img_001.jpg`,
          `camera${camera.camera_id}/stream.m3u8`
        )
      );

      const containerElement = document.getElementById(
        `player-container-camera${camera.camera_id}`
      );
      containerElement.prepend(playerFragment);
      document
        .getElementById(`camera${camera.camera_id}-player-thumbnail`)
        .classList.add("d-none");

      document
        .getElementById(`player-container-camera${camera.camera_id}`)
        .addEventListener("click", function (e) {
          const modal = new bootstrap.Modal(
            document.getElementById(`camera${camera.camera_id}-modal`)
          );
          modal.toggle();
          options = {
            html5: {
                vhs: {
                  overrideNative: true,
                },
              }
         };
          var player = videojs(`player-camera${camera.camera_id}-modal`, options);
          player.qualityLevels();
          player.play();

          const modalElement = document.getElementById(
            `camera${camera.camera_id}-modal`
          );
          modalElement.addEventListener("hidden.bs.modal", (event) => {
            player.pause();
          });
        });

      document
        .getElementById(`player-container-camera${camera.camera_id}`)
        .addEventListener("mouseenter", function (e) {
          var player = videojs(`camera${camera.camera_id}-player-thumbnail`);
          document
            .getElementById(`camera${camera.camera_id}-player-thumbnail`)
            .classList.remove("d-none");
          document
            .getElementById(`camera${camera.camera_id}-thumbnail`)
            .classList.add("d-none");
          player.muted(true);
          player.play();
        });

      document
        .getElementById(`player-container-camera${camera.camera_id}`)
        .addEventListener("mouseleave", function (e) {
          var player = videojs(`camera${camera.camera_id}-player-thumbnail`);
          player.pause();

          document
            .getElementById(`camera${camera.camera_id}-player-thumbnail`)
            .classList.add("d-none");

          document
            .getElementById(`camera${camera.camera_id}-thumbnail`)
            .classList.remove("d-none");
        });
    } catch (error) {
      console.log("failed to load camera", camera.camera_id);
      console.error(error);
    }
  });
}

fetchConfig().then((x) => createPlayers());

console.log("javascript");
let currsong = new Audio();
let songs;
let currfolder;

async function getsongs(folder) {
  let a = await fetch(`/${folder}/`);
  currfolder = folder
  let responce = await a.text();

  let div = document.createElement("div");
  div.innerHTML = responce;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul = document.querySelector(".songList");
  songul.innerHTML = ""
  for (const song of songs) {
    songul.innerHTML += `<li>
                           
                            <div class="info">
                             <img class="invert" src="music.svg" alt="">
                              <div class="inf">  <div>${song.replaceAll("%20", " ")}</div>
                                <div>om</div></div>
                               
                            </div>
                            <img class="invert" src="pla.svg" alt="">
                          </li>`
  }

  Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      playsong(e.querySelector(".inf").firstElementChild.innerHTML.trim());
    });
  });


}


function convertSecondsToMinSec(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.round(seconds % 60);

  // Pad single-digit seconds with a leading zero if necessary
  if (remainingSeconds < 10) {
    remainingSeconds = '0' + remainingSeconds;
  }

  return `${minutes}:${remainingSeconds}`
}



const playsong = (track, pause = false) => {
  currsong.src = `/${currfolder}/` + track
  if (!pause) {

    currsong.play();
    playbtn.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".time").innerHTML = ` ${convertSecondsToMinSec(currsong.currentTime)}/${convertSecondsToMinSec(currsong.duration)}`

}
let cardcontaner = document.querySelector(".cardcointaner")

async function uplodeAlblums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);

  let responce = await a.text();

  let div = document.createElement("div");
  div.innerHTML = responce;
  let anchor = div.getElementsByTagName("a")
  let array = Array.from(anchor)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = (e.href.split("/").slice(-2)[0])
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
  
  let responce = await a.json()

      cardcontaner.innerHTML += `
                    <div  data-folder=${folder} class="card">
                        <img class="t" src="play.svg" alt="">
                        <img class="play" src="/songs/${folder}/cover.jfif" alt="">
                        <h2>${responce.title}</h2>
                        <p>${responce.dec}</p>`
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
      e.addEventListener("click", async item => {
        
        songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
      })
    })
  }
}

async function main() {

  await getsongs("songs/ncs")
  playsong(songs[0], true)

  await uplodeAlblums();
 
  playbtn.addEventListener("click", () => {
    if (currsong.paused) {
      currsong.play()
      playbtn.src = "pause.svg"
    } else {
      currsong.pause()
      playbtn.src = "pla.svg"
    }
  })


  currsong.addEventListener("timeupdate", () => {
    console.log(currsong.currentTime, currsong.duration)
    document.querySelector(".time").innerHTML = `${convertSecondsToMinSec(currsong.currentTime)}/${convertSecondsToMinSec(currsong.duration)}`
    document.querySelector(".circle").style.left = (currsong.currentTime / currsong.duration) * 100 + "%"

  })

  document.querySelector(".line").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%")
    document.querySelector(".circle").style.left = percent + "%";
    currsong.currentTime = (currsong.duration) * percent / 100
  })

  document.querySelector(".ham").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-500%"
  })

  prevouse.addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split("/").splice(-1)[0]);
    if (index > 0) {
      playsong(songs[index - 1]);
    } else {
      playsong(songs[songs.length - 1]);  
    }
  });

  next.addEventListener("click", () => {
    let index = songs.indexOf(currsong.src.split("/").splice(-1)[0]);
    if (index < songs.length - 1) {
      playsong(songs[index + 1]);
    } else {
      playsong(songs[0]); 
    }
  });
}

  





main()

$(window).on('load', function() {
    console.clear();
    if (getCookie('theme') === 'dark') {
        $('#theme-btn').html('<i class="twa twa-sunny-theme"></i>');
        $('#icon').html('<i class="twa twa-lg twa-home-bright"></i>');
        $('#github').html(`<i class='twa twa-bright-github'></i>`);
        $('#discord').html(`<i class="twa twa-bright-discord"></i>`);
        $('#email').html(`<i class='twa twa-bright-mail'></i>`);
        $('#clock').html(`<i class='twa twa-bright-clock'></i>`);
        $("body").addClass("dark");
    } else {
        $('#theme-btn').html('<i class="twa twa-moon-theme"></i>');
        $('#icon').html('<i class="twa twa-lg twa-home-dark"></i>');
        $('#github').html(`<i class='twa twa-dark-github'></i>`);
        $('#discord').html(`<i class="twa twa-dark-discord"></i>`);
        $('#email').html(`<i class='twa twa-dark-mail'></i>`);
        $('#clock').html(`<i class='twa twa-dark-clock'></i>`);
        $("body").addClass("bright");
    };
});

function toggleProjects() {
  if($("#body-1").css('display') == 'block') {
    $("#body-1").css('display', 'none');
    $("#body-2").css('display', 'block');
  } else {
    $("#body-1").css('display', 'block');
    $("#body-2").css('display', 'none');
  }

  new Sound("/assets/sounds/click.mp3").play();

}

function goBackHome() {
  if($("#body-1").css('display') == 'none') {
    $("#body-1").css('display', 'block');
    $("#body-2").css('display', 'none');
  }
}

function changeTheme() {
    if ($("body").hasClass("dark")) {
        $('#theme-btn').html('<i class="twa twa-moon-theme"></i>');
        $('#icon').html('<i class="twa twa-lg twa-home-dark"></i>');
        $('#github').html(`<i class='twa twa-dark-github'></i>`);
        $('#discord').html(`<i class="twa twa-dark-discord"></i>`);
        $('#email').html(`<i class='twa twa-dark-mail'></i>`);
        $('#clock').html(`<i class='twa twa-dark-clock'></i>`);
        setCookie('theme', 'bright', 1);
        $("body").removeClass("dark");
        $("body").addClass("bright");
    } else {
        $('#theme-btn').html('<i class="twa twa-sunny-theme"></i>');
        $('#icon').html('<i class="twa twa-lg twa-home-bright"></i>');
        $('#github').html(`<i class='twa twa-bright-github'></i>`);
        $('#discord').html(`<i class="twa twa-bright-discord"></i>`);
        $('#email').html(`<i class='twa twa-bright-mail'></i>`);
        $('#clock').html(`<i class='twa twa-bright-clock'></i>`);
        setCookie('theme', 'dark', 1);
        $("body").addClass("dark");
        $("body").removeClass("bright");
    }

    new Sound("/assets/sounds/switch.mp3").play();
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function Sound(src, dontDelete) {
    this.id = Date.now();
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.setAttribute("id", this.id);
    this.sound.style.display = "none";
    document.head.appendChild(this.sound);
    var elem = document.getElementById(this.id);
    this.play = function() {
        this.sound.play()
        if(!dontDelete) {
          setTimeout(function() {
              document.head.removeChild(elem)
          }, 100);
        }
    }
    this.stop = function() {
        this.sound.pause();
    }
}

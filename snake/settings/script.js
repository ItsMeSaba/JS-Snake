document.documentElement.style.setProperty('--bodyHeight', `${window.innerHeight}px`);


class Settings {
    colors() {
        let divs = document.getElementsByClassName('color');

        for(let i = 0; i < divs.length; i++) {
            divs[i].addEventListener('click', function() {
                localStorage.setItem('snakeColor', window.getComputedStyle(this).getPropertyValue('background-color'));
                this.className  == 'selected' ? this.className  = 'color' : this.className  = 'selected';
            })
        }
    }

    mobileButtons() {

        document.getElementById('slider').value = localStorage.btnSize;

        if(localStorage.buttonsOn == 'true') {
            document.getElementById('checkbox').checked = true;
            document.getElementById('slider').disabled = false;
        }
        
        document.getElementById('checkbox').addEventListener('click', function() {
            if(this.checked) {
                document.getElementById('slider').disabled = false;
                localStorage.buttonsOn = true;
            }

            else {
                document.getElementById('slider').disabled = true;
                localStorage.buttonsOn = false;
            }
        })
    }

    controlls() {

        let divs = document.getElementsByClassName('controll');
    
        for(let i = 0; i < divs.length; i++) {
            divs[i].addEventListener('click', function() {
                localStorage.setItem('buttons', false);
                localStorage.setItem('swipe', false);
                localStorage.setItem('keyboard', false);
                
                localStorage.setItem(`${this.id}`, true);
    
                console.log('done')
            });
        }

        document.getElementById('slider').value = localStorage.buttonSize || 50;
        document.getElementById('slider').addEventListener('change', () => {
            localStorage.setItem('buttonSize', document.getElementById('slider').value);
        })
    }
} 

let settings = new Settings();

settings.colors();
settings.controlls();
// settings.mobileButtons();


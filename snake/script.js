document.documentElement.style.setProperty('--bodyHeight', `${window.innerHeight}px`);

let getScore = () => {
    let highScore = localStorage.highScore ? localStorage.highScore : 0;
    document.querySelector('.highScore span').innerHTML = highScore;
}

getScore();


let chooseControll = () => {

    let divs = document.getElementsByClassName('controll');

    for(let i = 0; i < divs.length; i++) {
        divs[i].addEventListener('click', function() {
            localStorage.setItem('buttons', false);
            localStorage.setItem('swipe', false);
            localStorage.setItem('keyboard', false);
            
            localStorage.setItem(`${this.id}`, true);

            document.querySelector('.chooseControll').style.display = 'none';

            console.log('done')
        });
    }
}

if(localStorage.buttons != 'true' && localStorage.swipe != 'true' && localStorage.keyboard != 'true') {
    document.querySelector('.chooseControll').style.display = 'flex';
    chooseControll();
}
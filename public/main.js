function animateBackground() {
    let bg = Array.from(document.getElementsByClassName("bg"));
    let comm = Array.from(document.getElementsByClassName("commemoration"));

    if (bg.length == 1 || comm.length == 1) {
        bg[0].style.opacity = 0.6;
        comm[0].style.opacity = 1;
    } else {
        let offset = bg.length > 2 ? 0.4 : 0.7;

        bg.forEach((item, index) => {
            item.animate([{
                opacity: 0,
                easing: 'ease-in'
            }, {
                opacity: 0.6
            }, {
                opacity: 0.6,
                easing: 'ease-out'
            }, {
                opacity: 0,
                offset: offset,
            }, {
                opacity: 0
            }], {
                delay: 1000 * 6 * index,
                duration: 1000 * (6 * bg.length),
                iterations: Infinity,
            });
        });
        comm.forEach((item, index) => {
            item.animate([{
                opacity: 0,
                easing: 'ease-in',
            }, {
                opacity: 1,
                easing: 'ease-out'
            }, {
                opacity: 0,
                offset: offset
            }, {
                opacity: 0
            }], {
                delay: 1000 * 6 * index,
                duration: 1000 * (6 * comm.length),
                iterations: Infinity
            });
            item.classList.toggle('disable');
            // setInterval(toggleHTML, 1000 * 6 * index, item);
            setTimeout(toggleInterval, 1000 * 6 * index, item, 1000 * (6 * comm.length));
        });
    }
}

animateBackground();

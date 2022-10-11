import { useEffect, useState } from "react";

export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

export function getHoursAndMinutes(data) {
    let time = new Date(data)
    let hours = (time.getHours());
    let minutes = (time.getMinutes());
    return {
        hours,
        minutes
    }
}

const update = () => {
    var sun = document.querySelector('.sun');
    var x = Math.random() * 180;
    var y = Math.random() * 40;

    sun.style.transform = "rotateX(" + y + "deg) rotate(" + x + "deg)"
}

export const weatherSymbol = {
    sun: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0-_sPnBx3kpfd5R-TSjrxyIOr_UB3kVwpGA&usqp=CAU',
    snow: 'https://t4.ftcdn.net/jpg/01/26/18/77/240_F_126187797_CWWtNWjIe2yEOMqx0GApOeQFr1IWzo52.jpg',
    rain: 'https://t4.ftcdn.net/jpg/02/76/10/21/240_F_276102172_sEJktLJElRTXnp00tskBzHwXIcJuOc97.jpg',
    clouds: 'https://t4.ftcdn.net/jpg/01/15/96/61/240_F_115966155_JYIkOiNCvtqejjp9Zcz9KkV7JV75DIWN.jpg'
}

export const locationImage = 'https://as2.ftcdn.net/v2/jpg/02/72/89/67/1000_F_272896745_tlTivOH81qWIVzz34KqFGm8LO3N9hMYQ.jpg'

export const searchImage = 'https://as1.ftcdn.net/v2/jpg/03/25/73/68/1000_F_325736897_lyouuiCkWI59SZAPGPLZ5OWQjw2Gw4qY.jpg'
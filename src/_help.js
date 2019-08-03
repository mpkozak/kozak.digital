import * as selection from 'd3-selection';
import * as transition from 'd3-transition';



export const d3 = { ...selection, ...transition };



const alpha = ('qwertyuiopasdfghjklzxcvbnm').split('');
export const randomLetter = () => alpha[Math.floor(Math.random() * 26)];

export const shuffle = (array, seed) => {
    let new_array = [...array]
    let m = new_array.length, t, i;
  
    // While there remain elements to shuffle…
    while (m) {
  
      // Pick a remaining element…
      i = Math.floor(random(seed) * m--);
  
      // And swap it with the current element.
      t = new_array[m];
      new_array[m] = new_array[i];
      new_array[i] = t;
      ++seed
    }
  
    return new_array;
  }
  
function random(seed) {
    let x = Math.sin(seed++) * 10000; 
    return x - Math.floor(x);
}
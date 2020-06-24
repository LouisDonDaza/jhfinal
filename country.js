const STAR_COUNT = ( window.innerWidth + window.innerHeight ) / 8,
      STAR_SIZE = 3,
      STAR_MIN_SCALE = 0.2,
      OVERFLOW_THRESHOLD = 50;

const canvas = document.querySelector( 'canvas' ),
      context = canvas.getContext( '2d' );

let scale = 1, // device pixel ratio
    width,
    height;

let stars = [];

let pointerX,
    pointerY;

let velocity = { x: 0, y: 0, tx: 0, ty: 0, z: 0.0005 };

let touchInput = false;

generate();
resize();
step();

window.onresize = resize;
canvas.onmousemove = onMouseMove;
canvas.ontouchmove = onTouchMove;
canvas.ontouchend = onMouseLeave;
document.onmouseleave = onMouseLeave;

function generate() {

   for( let i = 0; i < STAR_COUNT; i++ ) {
    stars.push({
      x: 0,
      y: 0,
      z: STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE )
    });
   }

}

function placeStar( star ) {

  star.x = Math.random() * width;
  star.y = Math.random() * height;

}

function recycleStar( star ) {

  let direction = 'z';

  let vx = Math.abs( velocity.x ),
	    vy = Math.abs( velocity.y );

  if( vx > 1 || vy > 1 ) {
    let axis;

    if( vx > vy ) {
      axis = Math.random() < vx / ( vx + vy ) ? 'h' : 'v';
    }
    else {
      axis = Math.random() < vy / ( vx + vy ) ? 'v' : 'h';
    }

    if( axis === 'h' ) {
      direction = velocity.x > 0 ? 'l' : 'r';
    }
    else {
      direction = velocity.y > 0 ? 't' : 'b';
    }
  }
  
  star.z = STAR_MIN_SCALE + Math.random() * ( 1 - STAR_MIN_SCALE );

  if( direction === 'z' ) {
    star.z = 0.1;
    star.x = Math.random() * width;
    star.y = Math.random() * height;
  }
  else if( direction === 'l' ) {
    star.x = -OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 'r' ) {
    star.x = width + OVERFLOW_THRESHOLD;
    star.y = height * Math.random();
  }
  else if( direction === 't' ) {
    star.x = width * Math.random();
    star.y = -OVERFLOW_THRESHOLD;
  }
  else if( direction === 'b' ) {
    star.x = width * Math.random();
    star.y = height + OVERFLOW_THRESHOLD;
  }

}

function resize() {

  scale = window.devicePixelRatio || 1;

  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  stars.forEach( placeStar );

}

function step() {

  context.clearRect( 0, 0, width, height );

  update();
  render();

  requestAnimationFrame( step );

}

function update() {

  velocity.tx *= 0.96;
  velocity.ty *= 0.96;

  velocity.x += ( velocity.tx - velocity.x ) * 0.8;
  velocity.y += ( velocity.ty - velocity.y ) * 0.8;

  stars.forEach( ( star ) => {

    star.x += velocity.x * star.z;
    star.y += velocity.y * star.z;

    star.x += ( star.x - width/2 ) * velocity.z * star.z;
    star.y += ( star.y - height/2 ) * velocity.z * star.z;
    star.z += velocity.z;
  
    // recycle when out of bounds
    if( star.x < -OVERFLOW_THRESHOLD || star.x > width + OVERFLOW_THRESHOLD || star.y < -OVERFLOW_THRESHOLD || star.y > height + OVERFLOW_THRESHOLD ) {
      recycleStar( star );
    }

  } );

}

function render() {

  stars.forEach( ( star ) => {

    context.beginPath();
    context.lineCap = 'round';
    context.lineWidth = STAR_SIZE * star.z * scale;
    context.strokeStyle = 'rgba(255,255,255,'+(0.5 + 0.5*Math.random())+')';

    context.beginPath();
    context.moveTo( star.x, star.y );

    var tailX = velocity.x * 2,
        tailY = velocity.y * 2;

    // stroke() wont work on an invisible line
    if( Math.abs( tailX ) < 0.1 ) tailX = 0.5;
    if( Math.abs( tailY ) < 0.1 ) tailY = 0.5;

    context.lineTo( star.x + tailX, star.y + tailY );

    context.stroke();

  } );

}

function movePointer( x, y ) {

  if( typeof pointerX === 'number' && typeof pointerY === 'number' ) {

    let ox = x - pointerX,
        oy = y - pointerY;

    velocity.tx = velocity.tx + ( ox / 8*scale ) * ( touchInput ? 1 : -1 );
    velocity.ty = velocity.ty + ( oy / 8*scale ) * ( touchInput ? 1 : -1 );

  }

  pointerX = x;
  pointerY = y;

}

function onMouseMove( event ) {

  touchInput = false;

  movePointer( event.clientX, event.clientY );

}

function onTouchMove( event ) {

  touchInput = true;

  movePointer( event.touches[0].clientX, event.touches[0].clientY, true );

  event.preventDefault();

}

function onMouseLeave() {

  pointerX = null;
  pointerY = null;

}

/* Haversine formula - https://www.movable-type.co.uk/scripts/latlong.html?fbclid=IwAR2IRNZaMTNivLPxw36AOCOtd-wbD3Wu7MVhI6PsoA_DfPZrtHpMZrsASvk */
function calculateDistance(){
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
  console.log('new function');
  var depart = document.getElementById("departure").value;
  var dest = document.getElementById("dest").value;
  depart = depart.split(",");
  dest = dest.split(",");
  console.log("You are going from: " + depart + " to " + dest);
  let lat1 = Number(depart[0]);
  let lat2 = Number(dest[0]);
  let lon1 = Number(depart[1]);
  let lon2 = Number(dest[1]);
  console.log('first', depart[0], lon1, ' second', lat2, lon2);
  var R = 6371; // km 
//has a problem with the .toRad() method below.
var x1 = lat2-lat1;
var dLat = x1.toRad();
var x2 = lon2-lon1;
var dLon = x2.toRad();  
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c;

let msg = document.getElementById('form--msg');
msg.innerText = 'The distance between the two countries is ' + d.toFixed(0) + ' km.';
}
function calcDistance(){
  var depart = document.getElementById("departure").value;
  var dest = document.getElementById("dest").value;
  console.log("You are going from: " + depart + " to " + dest);
  let lat1 = Number(depart[0]);
  let lat2 = Number(dest[0]);
  let lon1 = Number(depart[1]);
  let lon2 = Number(dest[1]);

var R = 6371; // km 
//has a problem with the .toRad() method below.
var x1 = lat2-lat1;
var dLat = x1 * Math.PI/180;  
var x2 = lon2-lon1;
var dLon = x2 * Math.PI/180;  
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1 * Math.PI/180 * Math.cos(lat2 * Math.PI/180)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c; 
  /*
  const R = 6371e3; // metres
  const sig1 = lat1 * Math.PI/180; // φ, λ in radians
  const sig2 = lat2 * Math.PI/180;
  const omega1 = (lat2-lat1) * Math.PI/180;
  const omega2 = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(omega1/2) * Math.sin(omega1/2) +
          Math.cos(sig1) * Math.cos(sig2) *
          Math.sin(omega2/2) * Math.sin(omega2/2);
  //const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const c = 2 * Math.asin(Math.sqrt(a));

  //const d = Math.acos( Math.sin(sig1)*Math.sin(sig2) + Math.cos(sig1)*Math.cos(sig2) * Math.cos(omega2) ) * R;
  const d = R * c; // in metres
  */
 /*
  const R = 6371e3;
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  const a = (Math.pow(Math.sin(dlat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * (Math.pow(Math.sin(dlon/2),2)));
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  */

  console.log("Distance between these two countries is: " + d.toFixed(0) + " m.");
}
/*
const rad: number[] = args.map((deg: number) => deg / 180.0 * Math.PI);
        const lat1: number = rad[0];
        const lon1: number = rad[1];
        const lat2: number = rad[2];
        const lon2: number = rad[3];
        const R: number = 6372.8;
        const dLat: number = lat2 - lat1;
        const dLon: number = lon2 - lon1;

        const a: number = Math.sin(dLat / 2) *
            Math.sin(dLat / 2) +
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2) *
            Math.cos(lat1) *
            Math.cos(lat2);

        const c: number = 2 * Math.asin(Math.sqrt(a));

        return R * c;
*/
/*
Number.prototype.toRad = function() {
   return this * Math.PI / 180;
}

var lat1 = 42.546245; 
var lon1 = 1.601554; 
var lat2 = 23.424076; 
var lon2 = 53.847818; 

var R = 6371; // km 
//has a problem with the .toRad() method below.
var x1 = lat2-lat1;
var dLat = x1.toRad();  
var x2 = lon2-lon1;
var dLon = x2.toRad();  
var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);  
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
var d = R * c;
console.log(d);
*/
/***

This code is written by Alexander Petrov (E-mail: petrov.aa@phystech.edu)

LICENCE AGREEMENT

The owner of this code doesn't care about how you will use it.
Use it whatever reasons or whatever purpose you have.

***/

window.onload = function() {
	makeX();
	changeValues();
}

function changeValues() {
	var d1 = document.getElementById('diam1').value;
	var d2 = document.getElementById('diam2').value;
	document.getElementById('sigma11').value = (d1)/Math.pow(2.0,1.0/6.0);
	document.getElementById('sigma22').value = (d2)/Math.pow(2.0,1.0/6.0);
	document.getElementById('sigma12').value = (d1/2.0+d2/2.0)/Math.pow(2.0,1.0/6.0);
}

function applyEpsMagn() {
	epsilonMagn = 4 * document.getElementById('epsilonMagn').value;
	if(systemCreated)
		draw();
}

var systemCreated = false;

var diskTypes = true;

function createSystem() {
	if(document.getElementById('canv'))
	document.getElementById('canv').parentNode.removeChild(document.getElementById('canv'));

	diskTypes = document.getElementById('s_dt1').checked;
	// true - only disks of type A
	// false - disks of both types
	var d1 = document.getElementById('diam1').value;
	var d2 = document.getElementById('diam2').value;

	epsilonMagn = 4 * document.getElementById('epsilonMagn').value;

	for(var i=0;i<6;i++) {
		if(i<3) {
			diskColor[i] = "rgb(255,0,0)";
			diskR[i] = d1/2;
		} else {
			if(diskTypes) {
				diskColor[i] = "rgb(255,0,0)";
				diskR[i] = d1/2;
			} else {
				diskColor[i] = "rgb(0,255,0)";
				diskR[i] = d2/2;
			}
		}
		diskXX[i] = (-2.5 + i)
								* 0.9
								//- 0.3 + 0.6 * Math.random()
								;
	}
	draw();
	t = 0;
	vx = new Array(6);
	for(var i=0; i<6; i++)
		vx[i] = 0;
	document.getElementById("buttonStart").disabled=false;
	systemCreated = true;
}

function draw() {
	for(var i=0;i<6;i++)
		diskX[i]=diskXX[i];
	var drawingCanvas = document.getElementById('canvas');
	if(drawingCanvas && drawingCanvas.getContext) {
		var context = drawingCanvas.getContext('2d');
		context.clearRect(0,0,800,543);
		drawDiskLine(context);
		drawUvsXAxis(context);
		drawUvsX(context);
		drawDisks(context);
	}
}

var MARGINX = 50;
var WIDTH = 700;
var ORIGPOSX = 400;
var DISKLINEPOSY = 90;
var PIXEL = 0.5;

var XSTART =- 3.5;
var XEND = 3.5;

var diskColor = new Array(6);//=["red","red","red","red","red","red"];
var diskXX = new Array(6);//=[-2.5,-1.5,-0.5,0.5,1.5,2.5];
var diskX = new Array(6);//=[-2.5,-1.5,-0.5,0.5,1.5,2.5];
var diskR = new Array(6);//=[0.5,0.5,0.5,0.5,0.5,0.5];

/* This function maps x coordinate to both x coordinates on Diskline and on
UvsX plot */
function mapX (x) {
	return x*350/3.5 + ORIGPOSX;
}

/* This function maps y coordinate only to y coordinates on Diskline */
function mapY (y) {
	return y*350/3.5;
}

function drawDiskLine (context) {
	context.fillStyle = "#000";
	context.strokeStyle = "#000";
	context.lineWidth=1
	context.beginPath();
	context.moveTo(MARGINX+0,DISKLINEPOSY+PIXEL);
	context.lineTo(MARGINX+WIDTH,DISKLINEPOSY+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=XSTART;i<=XEND;i+=0.5) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,DISKLINEPOSY-7);
		context.lineTo(mapX(i)+PIXEL,DISKLINEPOSY+7);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="center";
		context.textBaseline="alphabetic";
		context.fillText(i,mapX(i),DISKLINEPOSY+30);
	}
	for (var i=XSTART;i<=XEND;i+=0.1) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,DISKLINEPOSY-3);
		context.lineTo(mapX(i)+PIXEL,DISKLINEPOSY+3);
		context.stroke();
		context.closePath();
	}
}

function drawDisks (context) {
	context.lineWidth=1
	for(var i=0;i<6;i++) {
		if(diskTypes || i<3)
			context.fillStyle="rgba(255,0,0,0.5)";
		else
			context.fillStyle="rgba(0,255,0,0.5)";
		context.beginPath();
		context.arc(mapX(diskX[i]),DISKLINEPOSY,mapY(diskR[i]),0,Math.PI*2,true);
		context.fill();
		context.closePath();
		context.beginPath();
		context.fillStyle=diskColor[i];
		context.arc(mapX(diskX[i]),AXISORIGPOSY,5,0,Math.PI*2,true);
		context.fill();
		context.closePath();
		context.beginPath();
		context.strokeStyle=diskColor[i];
		console.log(diskR[i]);
		context.moveTo(mapX(diskX[i])+PIXEL,DISKLINEPOSY-mapY(diskR[i]));
		context.lineTo(mapX(diskX[i])+PIXEL,UmapY(AXISYSTART));
		context.stroke();
		context.closePath();
	}
}

var AXISORIGPOSY = 250;
var AXISHEIGHT = 293;
var AXISYSTART = -10;
var AXISYEND = 1;

/* This function maps y coordinate only to y coordinates on UvsX plot */
function UmapY (y) {
	return -y*AXISHEIGHT/(AXISYEND-AXISYSTART) + AXISORIGPOSY;
}

function drawUvsXAxis (context) {
	context.fillStyle="#000"
	context.lineWidth=1
	context.font="italic 25px serif"
	context.textAlign="left";
	context.textBaseline="top";
	context.fillText("U(x)",MARGINX,AXISORIGPOSY-60);

	/* Grid */

	context.strokeStyle = "#CCC";
	for (var i=XSTART;i<=XEND;i+=0.5) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,UmapY(AXISYEND));
		context.lineTo(mapX(i)+PIXEL,UmapY(AXISYSTART));
		context.stroke();
		context.closePath();
	}
	for (var i=AXISYSTART;i<=AXISYEND;i+=1) {
		context.beginPath();
		context.moveTo(mapX(XSTART),UmapY(i)+PIXEL);
		context.lineTo(mapX(XEND),UmapY(i)+PIXEL);
		context.stroke();
		context.closePath();
	}

	/* X Tics */

	context.strokeStyle = "#000";
	context.beginPath();
	context.moveTo(MARGINX+0,AXISORIGPOSY+PIXEL);
	context.lineTo(MARGINX+WIDTH,AXISORIGPOSY+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=XSTART;i<=XEND;i+=0.5) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,AXISORIGPOSY-7);
		context.lineTo(mapX(i)+PIXEL,AXISORIGPOSY+7);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="center";
		context.textBaseline="alphabetic";
		context.fillText(i,mapX(i),AXISORIGPOSY+30);
	}
	for (var i=XSTART;i<=XEND;i+=0.1) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,AXISORIGPOSY-3);
		context.lineTo(mapX(i)+PIXEL,AXISORIGPOSY+3);
		context.stroke();
		context.closePath();
	}

	/* Y Tics */

	context.beginPath();
	context.moveTo(ORIGPOSX+PIXEL,UmapY(AXISYEND)+PIXEL);
	context.lineTo(ORIGPOSX+PIXEL,UmapY(AXISYSTART)+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=AXISYSTART;i<=AXISYEND;i+=1) {
		context.beginPath();
		context.moveTo(ORIGPOSX-7,UmapY(i)+PIXEL);
		context.lineTo(ORIGPOSX+7,UmapY(i)+PIXEL);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="right";
		context.textBaseline="middle"
		context.fillText(i,ORIGPOSX+PIXEL-10,UmapY(i)+PIXEL);
	}
}

var x = new Array();
var x_step = 0.04;
var LJ = new Array();
var epsilonMagn = 20;

function makeX () {
	x = new Array();
	for(var i=-3.5;i<=3.5;i+=x_step) x.push(i);
}

function calcLJ (context) {
	LJ = new Array();
	var dx, tmp;
	for(var k=0;k<x.length;k++) {
		LJ.push(0.0);
		for(var i=0;i<6;i++) {
			dx = diskX[i] - x[k];
			tmp = Math.pow(sigma(diskR[i],diskR[i])/dx,6.0);
			tmp = epsilonMagn*(tmp*tmp-tmp);
			if(tmp<0)
				LJ[k] += tmp;
			else
				LJ[k] += 0;
		}
	}
}

function drawUvsX (context) {
	calcLJ();
	context.strokeStyle = "blue";
	context.lineWidth=1;
	context.beginPath();
	context.moveTo(mapX(x[0]),UmapY(LJ[0]));
	for (var i=1;i<x.length;i++) {
		if(LJ[i]>AXISYEND)
			context.lineTo(mapX(x[i]),UmapY(AXISYEND));
		else if (LJ[i]<AXISYSTART)
			context.lineTo(mapX(x[i]),UmapY(AXISYSTART));
		else
			context.lineTo(mapX(x[i]),UmapY(LJ[i]));
		context.stroke();
	}
	context.closePath();
}

var calculating = false;
var calcObj;
var loader_icon;

function calcStart() {
	calculating = true;
	calcObj = setInterval(calcStep,5);
	document.getElementById("buttonStop").disabled=false;
	document.getElementById("buttonStart").disabled=true;
	document.getElementById("buttonCenter").disabled=false;
	loader_icon = document.createElement('DIV');
	loader_icon.className="loader";
	document.getElementById("loader_placeholder").appendChild(loader_icon);
}

function calcStop() {
	if(calculating) {
		calculating = false;
		document.getElementById("buttonStart").disabled=false;
		document.getElementById("buttonStop").disabled=true;
		document.getElementById("buttonCenter").disabled=true;
		clearInterval(calcObj);
		loader_icon.parentNode.removeChild(loader_icon);
	}
}

var dt = 0.002;
var mu = 0.01; // Friction coefficient

var redrawEvery=4;
var redrawEvery_c = 0;

var vx;

var toggleDragToCenter = false;

function sigma(r1, r2) {
	var rt = Math.pow(2,1.0/6.0);
	return (r1+r2)/rt;
}

function calcStep() {

	var dx, dr, f;
	var ax = new Array(6);
	for(var i=0; i<6; i++)
		ax[i] = 0;
	
	for(var i=0; i<5; i++)
		for(var j=i+1; j<6; j++) {
			dx = diskXX[i] - diskXX[j];
			f = 48 * Math.pow(sigma(diskR[i],diskR[j])/dx,13) - 24 * Math.pow(sigma(diskR[i],diskR[j])/dx,7.0);
			ax[i] += f;
			ax[j] -= f;
		}

	for(var i=0; i<6; i++)
		vx[i] += 0.5 * ax[i] * dt;

	for(var i=0; i<6; i++)
		diskXX[i] += vx[i] * dt;

	for(var i=0; i<6; i++)
		ax[i] = 0;

	for(var i=0; i<5; i++) {
		for(var j=i+1; j<6; j++) {
			dx = diskXX[i] - diskXX[j];
			f = 48 * Math.pow(sigma(diskR[i],diskR[j])/dx,13) - 24 * Math.pow(sigma(diskR[i],diskR[j])/dx,7.0);
			ax[i] += f;
			ax[j] -= f;
		}
	}

	for(var i=0; i<6; i++)
		vx[i] += 0.5 * ax[i] * dt;

	/* This block of code drag disks to x=0 coordinate */

	/* to Orig */

	if(toggleDragToCenter)
	for(var i=0; i<6; i++) {
		ax[i] = 0;
		dx = diskXX[i];
		f = - 5 / dx*dx;
		ax[i] += f;
		vx[i] += 0.5 * ax[i] * dx/Math.abs(dx) * dt;
		diskXX[i] += vx[i] * dt;
		ax[i] = 0;
		dx = diskXX[i];
		f = - 5 / dx*dx;
		ax[i] += f;
		vx[i] += 0.5 * ax[i] * dx/Math.abs(dx) * dt;
	}
	

	for(var i=0; i<6; i++)
		vx[i] -= vx[i]*mu;

	if(redrawEvery_c++==redrawEvery) {
		redrawEvery_c = 0;
		setTimeout(draw,1);
	}

}

function calcCenter () {
	toggleDragToCenter = !toggleDragToCenter;
	if(toggleDragToCenter)
		document.getElementById('buttonCenter').value="К центру: On ";
	else
		document.getElementById('buttonCenter').value="К центру: Off";
}

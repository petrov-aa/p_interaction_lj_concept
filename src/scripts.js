window.onload = function() {
	makeX();
	draw();
}

function createSystem() {
	var diskTypes = document.getElementById('s_dt1').checked;
	// true - only disks of type A
	// false - disks of both types
	var d1 = document.getElementById('diam1').value;
	var d2 = document.getElementById('diam2').value;

	for(var i=0;i<3;i++)
		diskColor[i] = "red";
	for(var i=3;i<6;i++)
		if(diskTypes)
			diskColor[i] = "red";
		else
			diskColor[i] = "green";

}

function draw() {
	var drawingCanvas = document.getElementById('canvas');
	if(drawingCanvas && drawingCanvas.getContext) {
		var context = drawingCanvas.getContext('2d');
		drawDiskLine(context);
		drawUvsXAxis(context);
		drawUvsX(context);
		drawDisks(context);
	}
}

var MARGINX=50
var WIDTH=700
var ORIGPOSX=400
var DISKLINEPOSY=50
var PIXEL=0.5

var XSTART=-3.5
var XEND=3.5

var diskColor=["red","red","red","red","red","red"]
var diskX=[-2.5,-1.5,-0.5,0.5,1.5,2.5]
var diskR=[0.5,0.5,0.5,0.5,0.5,0.5]

function mapX (x) {
	return x*350/3.5 + ORIGPOSX;
}
function mapY (y) {
	return y*350/3.5;
}

function drawDiskLine (context) {
	context.strokeStyle = "#000";
	context.lineWidth=1
	context.beginPath();
	context.moveTo(MARGINX+0,DISKLINEPOSY+PIXEL);
	context.lineTo(MARGINX+WIDTH,DISKLINEPOSY+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=XSTART;i<=XEND;i+=0.5) {
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,DISKLINEPOSY+PIXEL-7);
		context.lineTo(mapX(i)+PIXEL,DISKLINEPOSY+PIXEL+7);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="center";
		context.textBaseline="alphabetic";
		context.fillText(i,mapX(i),DISKLINEPOSY+30);
	}
}

function drawDisks (context) {
	context.strokeStyle="red";
	context.lineWidth=1
	for(var i=0;i<6;i++) {
		if(diskColor[i]=="red")
			context.fillStyle="rgba(255,0,0,0.5)"
		else
			context.fillStyle="rgba(0,255,0,0.5)"
		context.beginPath();
		context.arc(mapX(diskX[i])+PIXEL,DISKLINEPOSY+PIXEL,mapY(0.5),0,Math.PI*2,true);
		context.fill();
		context.closePath();
		if(diskColor[i]=="red")
			context.fillStyle="rgb(255,0,0)"
		else
			context.fillStyle="rgb(0,255,0)"
		context.beginPath();
		context.arc(mapX(diskX[i])+PIXEL,AXISORIGPOSY+PIXEL,5,0,Math.PI*2,true);
		context.fill();
		context.closePath();
		context.beginPath();
		context.moveTo(mapX(diskX[i])+PIXEL,DISKLINEPOSY+PIXEL);
		context.lineTo(mapX(diskX[i])+PIXEL,AXISORIGPOSY+PIXEL);
		context.stroke();
		context.closePath();
	}
}

var AXISORIGPOSY=250
var AXISHEIGHT=293
var AXISYSTART=-10
var AXISYEND=1

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

	/* X Axis */

	context.strokeStyle = "#000";
	context.beginPath();
	context.moveTo(MARGINX+0,AXISORIGPOSY+PIXEL);
	context.lineTo(MARGINX+WIDTH,AXISORIGPOSY+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=XSTART;i<=XEND;i+=0.5) {
		
		context.beginPath();
		context.moveTo(mapX(i)+PIXEL,AXISORIGPOSY+PIXEL-7);
		context.lineTo(mapX(i)+PIXEL,AXISORIGPOSY+PIXEL+7);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="center";
		context.textBaseline="alphabetic";
		context.fillText(i,mapX(i),AXISORIGPOSY+30);
	}

	/* Y Axis */

	context.beginPath();
	context.moveTo(ORIGPOSX+PIXEL,UmapY(AXISYEND)+PIXEL);
	context.lineTo(ORIGPOSX+PIXEL,UmapY(AXISYSTART)+PIXEL);
	context.stroke();
	context.closePath();
	for (var i=AXISYSTART;i<=AXISYEND;i+=1) {
		context.beginPath();
		context.moveTo(ORIGPOSX+PIXEL-7,UmapY(i)+PIXEL);
		context.lineTo(ORIGPOSX+PIXEL+7,UmapY(i)+PIXEL);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="right";
		context.textBaseline="middle"
		context.fillText(i,ORIGPOSX+PIXEL-10,UmapY(i)+PIXEL);
	}
}

var x = new Array();
var x_step = 0.01;
var LJ = new Array();

function makeX () {
	x = new Array();
	for(var i=-3.5;i<=3.5;i+=x_step) x.push(i);
}

function calcLJ (context) {
	LJ = new Array();
	for(var k=0;k<x.length;k++) {
		LJ.push(0.0);
		for(var i=0;i<6;i++) {
			dx = diskX[i] - x[k];
			tmp = Math.pow(diskR[i]*2.0/dx,6.0);
			tmp = 28*(tmp*tmp-tmp);
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
	context.lineWidth=2;
	context.beginPath();
	context.moveTo(mapX(x[0]),UmapY(LJ[0]));
	for (var i=1;i<x.length;i++) {
		if(LJ[i]>1)
			context.lineTo(mapX(x[i]),UmapY(1));
		else
			context.lineTo(mapX(x[i]),UmapY(LJ[i]));
		context.stroke();
	}
	context.closePath();
}

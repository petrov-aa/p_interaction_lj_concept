window.onload = function() {
	var drawingCanvas = document.getElementById('canvas');
	if(drawingCanvas && drawingCanvas.getContext) {
		var context = drawingCanvas.getContext('2d');
		drawDiskLine(context);
		drawDisks(context);
		drawUvsXAxis(context);
	}
}

MARGINX=50
WIDTH=700
ORIGPOSX=400
DISKLINEPOSY=50
PIXEL=0.5

XSTART=-3.5
XEND=3.5

diskColor=["red","red","red","red","red","red"]
diskX=[-2.5,-1.5,-0.5,0.5,1.5,2.5]

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
	for (i=XSTART;i<=XEND;i+=0.5) {
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
	for(i=0;i<6;i++) {
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
	}
}

AXISORIGPOSY=250
AXISHEIGHT=293
AXISYSTART=-10
AXISYEND=1

function UmapY (y) {
	return y*AXISHEIGHT/(AXISYEND-AXISYSTART);
}

function drawUvsXAxis (context) {
	context.strokeStyle = "#000";
	context.fillStyle="#000"
	context.lineWidth=1

	context.font="italic 25px serif"
	context.textAlign="left";
	context.textBaseline="top";
	context.fillText("U(x)",MARGINX,AXISORIGPOSY-50);

	context.beginPath();
	context.moveTo(MARGINX+0,AXISORIGPOSY+PIXEL);
	context.lineTo(MARGINX+WIDTH,AXISORIGPOSY+PIXEL);
	context.stroke();
	context.closePath();
	for (i=XSTART;i<=XEND;i+=0.5) {
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
	context.beginPath();
	context.moveTo(ORIGPOSX+PIXEL,AXISORIGPOSY-UmapY(AXISYEND)+PIXEL);
	context.lineTo(ORIGPOSX+PIXEL,AXISORIGPOSY-UmapY(AXISYSTART)+PIXEL);
	context.stroke();
	context.closePath();
	for (i=AXISYSTART;i<=AXISYEND;i+=1) {
		context.beginPath();
		context.moveTo(ORIGPOSX+PIXEL-7,AXISORIGPOSY-UmapY(i)+PIXEL);
		context.lineTo(ORIGPOSX+PIXEL+7,AXISORIGPOSY-UmapY(i)+PIXEL);
		context.stroke();
		context.closePath();
		context.font="16px sans-serif"
		context.textAlign="right";
		context.textBaseline="middle"
		context.fillText(i,ORIGPOSX+PIXEL-10,AXISORIGPOSY-UmapY(i)+PIXEL);
	}
}

function drawUvsX (context) {

}

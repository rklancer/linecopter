var fs = require('fs'),
    path = require('path'),
    cv = require('opencv'),
    Canvas = require('canvas');

function main() {
  var indir = process.argv[2] || 'line-challenge',
      outdir = process.argv[3] || 'extracted',
      images;

  images = fs.readdirSync(indir);

  images.forEach(function(imageName) {
    var p = path.resolve('', indir+ '/' +imageName);
      cv.readImage(p, function(err, im) {
      if (err) {
        console.error('error reading ' + imageName);
        return;
      }
      vis = createVisualizerImage(im);

      lines = findLines(im);
      drawLine(vis, aggregateLines(lines), '#FF0000');
      lines.forEach(function(line) {
        drawLine(vis, line, '#000000');
      });
      saveImage(vis, '../' + outdir + '/' + imageName);
    });
  });
}

function findLines(im) {
  global.im = im;
  im.canny(10, 100);
  im.save('canny.png');
  // Hough threshold appear to be hard-coded in node-opencv implementation
  return im.houghLinesP();
}

function aggregateLines(lines) {
  // TODO
  return [0, 0, 100, 100];
}


function createVisualizerImage(im) {
  var h = im.height(),
      w = im.width(),
      canvas = new Canvas(w, h),
      ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  return ctx;
}

function drawLine(ctx, line, color) {
  ctx.strokeStyle = color || '#ffffff';
  ctx.beginPath();
  ctx.moveTo(line[0], line[1]);
  ctx.lineTo(line[2], line[3]);
  ctx.stroke();
}

function saveImage(ctx, name) {
  var out = fs.createWriteStream(__dirname + '/' + name),
      stream = ctx.canvas.pngStream();

  stream.on('data', function(chunk){
    out.write(chunk);
  });

  stream.on('end', function(){
    console.log('saved png ' + name);
  });
}

module.exports = main;

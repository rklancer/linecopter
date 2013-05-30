var fs = require('fs'),
    cv = require('opencv'),
    Canvas = require('canvas');

function main() {
  var indir = process.argv[2] || 'line-challenge',
      outdir = process.argv[3] || 'extracted',
      images;

  images = fs.readdirSync(indir);

  images.forEach(function(imageName) {
    cv.readImage(indir+'/'+imageName, function(err, im) {
      if (err) {
        console.error('error reading ' + imageName);
        return;
      }
      vis = createVisualizerImage(im);

      findLines(im).forEach(function(line) {
        drawLine(vis, line);
      });
      saveImage(vis, outdir + '/' + imageName);
    });
  });
}

function findLines(im) {
  im.canny(5, 50);
  // Hough threshold appear to be hard-coded in node-opencv implementation
  return im.houghLinesP();
}

function createVisualizerImage(im) {
  var h = im.height(),
      w = im.width(),
      canvas = new Canvas(w, h),
      ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#000000';

  return ctx;
}

function drawLine(ctx, line) {
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

main();




const setBackground = (url , canvas) => {
    fabric.Image.fromURL(url , img => {
        canvas.backgroundImage = img;
        canvas.requestRenderAll()
    })
}

const canvas = new fabric.Canvas('canvas', {
    width: 1000,
    height:600,
    backgroundColor:'white'
}, stateful = true)


setBackground("https://img.freepik.com/free-photo/white-texture_1203-1221.jpg?t=st=1655107887~exp=1655108487~hmac=3d14365ef7ba065f29674229c27cebe393d9f5e156699dadd7408fa029a4ddbe&w=996", canvas)

const imgAdded = (e) => {
    const imageElem = document.getElementById('upload-file');
    const file = imageElem.files[0];
    fileToUrl(file)   
}

const fileToUrl = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('load', () =>{
        if(canvas.getObjects().length != 0){
            canvas.getObjects().map((o)=> canvas.remove(o))
        } 
        fabric.Image.fromURL(reader.result , img => {
            img.scaleToHeight(600)
            canvas.add(img)
            canvas.centerObject(img);
            canvas.requestRenderAll();
            img.setControlsVisibility({
                mt: false, 
                mb: false, 
                ml: false,
                mr: false, 
                tl:false,
                bl:false,
                tr:false,
                br:false,

            });
        })
    })
}


canvas.on('object:moving', function (e) {
    var obj = e.target;

    if(obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width){
      return;
    }
    obj.setCoords();

    if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
      obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
      obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
    }

    if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
      obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
      obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
    }
  });



canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 1) zoom = 1;
    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
    var vpt = this.viewportTransform;
    if (vpt[4] >= 0) {
      this.viewportTransform[4] = 0;
    } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
      this.viewportTransform[4] = canvas.getWidth() - 1000 * zoom;
    }
    if (vpt[5] >= 0) {
      this.viewportTransform[5] = 0;
    } else if (vpt[5] < canvas.getHeight() - 600 * zoom) {
      this.viewportTransform[5] = canvas.getHeight() - 600 * zoom;
    }
    });

const canvasDiv = document.querySelector('canvas');
canvasDiv.style.border = '2px dashed black';

const imageInput = document.getElementById('upload-file');
imageInput.addEventListener('change', imgAdded);



canvas.requestRenderAll();
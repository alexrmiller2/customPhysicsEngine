var win = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    width = win.innerWidth || e.clientWidth || g.clientWidth,
    height = win.innerHeight|| e.clientHeight|| g.clientHeight;
    
// Initialise an array to hold the physical objects
var physicalObjects = [];
 
// Initialise the canvas element and set it's width and height
var canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.width = width;
    canvas.height = height;
 
// Append the canvas element to the HTML body
document.body.appendChild(canvas);
 
// Get the canvas's context object
var context = canvas.getContext("2d");

class PhysicalObject {
    constructor(x, y, w, h) {
        // Set the object's x/y position
        this.x = x;
        this.y = y;

        // Set the object's width and height
        this.width = w;
        this.height = h;

        // Initialise the object's x and y velocity with a value of 0 (it's stationary initially)
        this.xVel = 0;
        this.yVel = 0;

        // Adjust the object's x velocity
        this.addXVel = function (vel) {
            this.xVel += vel;
        };

        // Adjust the object's y velocity
        this.addYVel = function (vel) {
            this.yVel += vel;
        };

        // Update the object's position for the next frame
        this.nextFrame = function () {
            this.x += this.xVel;
            this.y += this.yVel;
            
            if (this.x - (this.width / 2) > canvas.width) {
                this.x = -this.width / 2;
            }
            
            if (this.x + (this.width / 2) < 0) 
                this.x = canvas.width + this.width / 2;

            if (this.y - (this.height / 2) > canvas.height)
                this.y = -this.height / 2;
            
            if (this.y + (this.height / 2) < 0)
                this.y = canvas.height + this.height / 2;

        };
    }
}

frameRender = function() {
    // Clear view
    context.clearRect(0, 0, width, height);
    
    // For each object in the physicalObjects array...
    for (var i = 0; i < physicalObjects.length; i++) {
        
        // Draw a rectangle on the canvas to represent the object, based on the object's x, y, width and height
        context.fillRect(
            physicalObjects[i].x, 
            physicalObjects[i].y, 
            physicalObjects[i].width, 
            physicalObjects[i].height
        );

            
        physicalObjects[i].nextFrame();
    }
} 
     
frameRenderLoop = function() {
    frameRender();
    requestAnimationFrame(frameRenderLoop);
}


physicalObjects.push(new PhysicalObject(100, 100, 20, 20));  
physicalObjects[0].xVel += 1;


frameRenderLoop(); 

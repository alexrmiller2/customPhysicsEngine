// physics.js

class PhysicalObject {
    constructor(x, y, r, m, element) {
        this.element = element;
        this.homeX = x;
        this.homeY = y;
        this.x = this.homeX;
        this.y = this.homeY;
        this.initX = x;
        this.initY = y;
        this.radius = r;
        this.mass = m;
        this.angle = 0;
        this.angularVel = 0;
        this.velX = 0;
        this.velY = 0;
    }
}

class Environment {
    constructor(gravityX, gravityY, friction, restitution) {
        this.gravity = { x: gravityX, y: gravityY }; // Initialize gravity object
        this.friction = friction;
        this.restitution = restitution;
    }
}

function updatePhysics(physicalObjects, thisEnvironment) {
    physicalObjects.forEach((physicalObject) => {
        physicalObject.velX += thisEnvironment.gravity.x; // Apply gravity in the x direction
        physicalObject.velY += thisEnvironment.gravity.y; // Apply gravity in the y direction
        physicalObject.velX *= (1 - thisEnvironment.friction); // Apply friction to x velocity
        physicalObject.velY *= (1 - thisEnvironment.friction); // Apply friction to y velocity
        physicalObject.x += physicalObject.velX;
        physicalObject.y += physicalObject.velY;
    });
}

function updateObjectHomes(words, container, physicalObjects) {
    let letterIndex = 0;
    words.forEach((word) => {
        const items = word.textContent.split("");
        const wordRect = word.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        let internalPosition = 0;
        items.forEach((item) => {
            const physicalObject = physicalObjects[letterIndex];
            const element = physicalObject.element;
            element.internalPosition = internalPosition;

            element.homeLeft = wordRect.left - containerRect.left + element.internalPosition;
            element.homeTop = wordRect.top - containerRect.top;

            physicalObject.homeX = element.homeLeft + element.itemSpanWidth / 2;
            physicalObject.homeY = element.homeTop + element.itemSpanHeight / 2;

            internalPosition += element.itemSpanWidth;
            letterIndex++;
        });
    });
}

function moveObjectsHome(physicalObjects) {
    physicalObjects.forEach((physicalObject) => {
        physicalObject.x = physicalObject.homeX;
        physicalObject.y = physicalObject.homeY;
    });
}

export { updatePhysics, updateObjectHomes, moveObjectsHome, PhysicalObject, Environment };

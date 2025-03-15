addEventListener("DOMContentLoaded", (event) => {
    let timer = performance.now();
    const fpsElement = document.getElementById("fps"); // Cache the FPS element

    let container = document.querySelector(".physicsContainer");

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const text = new SplitType("p", { types: "words" });
    const words = [...text.words];
    let itemSpans = [];
    let physicalObjects = [];

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

            this.x = x;
            this.y = y;


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

    createElementsFromText = function () {

        words.forEach((word) => {
            const items = word.textContent.split("");
            const wordRect = word.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();


            word.style.opacity = 1;

            let internalPosition = 0;
            items.forEach((item) => {

                const itemSpan = document.createElement("span");
                itemSpan.textContent = item;
                itemSpan.style.position = "absolute";
                itemSpan.style.font = getComputedStyle(word).font;
                itemSpan.internalPosition = internalPosition;

                context.font = getComputedStyle(word).font;
                itemSpan.itemSpanWidth = context.measureText(item).width;
                itemSpan.itemSpanHeight = itemSpan.offsetHeight;

                itemSpan.homeLeft = wordRect.left - containerRect.left + internalPosition
                itemSpan.homeTop = wordRect.top - containerRect.top;

                internalPosition += itemSpan.itemSpanWidth;

                itemSpan.style.left = `${itemSpan.homeLeft}px`;
                itemSpan.style.top = `${itemSpan.homeTop}px`;
                itemSpan.style.color = "red";

                container.appendChild(itemSpan);
                itemSpans.push(itemSpan);

            });
        });
    }

    addPhysicalObjects = function () {
        itemSpans.forEach((itemSpan) => {
            physicalObjects.push(new PhysicalObject(itemSpan.homeLeft + itemSpan.itemSpanWidth / 2, itemSpan.homeTop + itemSpan.itemSpanHeight / 2, 10, 10, itemSpan));
        });
    }

    updatePhysics = function () {
        physicalObjects.forEach((physicalObject) => {
            physicalObject.velX += thisEnvironment.gravity.x; // Apply gravity in the x direction
            physicalObject.velY += thisEnvironment.gravity.y; // Apply gravity in the y direction
            physicalObject.velX *= (1 - thisEnvironment.friction); // Apply friction to x velocity
            physicalObject.velY *= (1 - thisEnvironment.friction); // Apply friction to y velocity
            physicalObject.x += physicalObject.velX;
            physicalObject.y += physicalObject.velY;
        });
    }

    updateObjectHomes = function () {
        let letterIndex = 0;
        words.forEach((word) => {
            const items = word.textContent.split("");
            const wordRect = word.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            let internalPosition = 0;
            items.forEach((item, itemIndex) => {
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
    };

    moveObjectsHome = function () {
        physicalObjects.forEach((physicalObject) => {
            physicalObject.x = physicalObject.homeX;
            physicalObject.y = physicalObject.homeY;

        });

    }

    frameRender = function () {

        updatePhysics();

        physicalObjects.forEach((physicalObject) => {
            const deltaX = physicalObject.x - physicalObject.initX;
            const deltaY = physicalObject.y - (physicalObject.initY);
            physicalObject.element.style.transform = `translate(${deltaX}px, ${deltaY}px) rotate(${physicalObject.angle}rad)`;
        });
    }

    handleResize = function () {
        updateObjectHomes();
        //moveObjectsHome();
    }

    let counter = 0;
    frameRenderLoop = function () {

        if (counter >= 10) {
            fpsElement.innerHTML = Math.round(10 * 1000 / (performance.now() - timer)); // Use cached element
            timer = performance.now();
            counter = 0;
        }

        counter++;
        frameRender();
        requestAnimationFrame(frameRenderLoop);
    }

    createElementsFromText();
    addPhysicalObjects();
    thisEnvironment = new Environment(0, 0.1, 0.1, 0.5);

    window.addEventListener('resize', handleResize);

    frameRenderLoop();

})
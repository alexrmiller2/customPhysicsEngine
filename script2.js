addEventListener("DOMContentLoaded", (event) => {;

    let container = document.querySelector(".physicsContainer");
    let itemElements = [];

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    function createElementsFromText() {

        const text = new SplitType("p", { types: "words" });
        const words = [...text.words];

        words.forEach((word) => {
            const items = word.textContent.split("");
            const wordRect = word.getBoundingClientRect();
            const stickyRect = container.getBoundingClientRect();

            word.style.opacity = 1;

            let internalPosition = 0;
            items.forEach((item, itemIndex) => {
                const itemSpan = document.createElement("span");
                itemSpan.className = "item";
                itemSpan.textContent = item;
                itemSpan.style.position = "absolute";
                itemSpan.style.font = getComputedStyle(word).font;
                container.appendChild(itemSpan);

                context.font = getComputedStyle(word).font;
                const itemWidth = context.measureText(item).width;
                const x = wordRect.left - stickyRect.left + internalPosition
                internalPosition += itemWidth;
                const y = wordRect.top - stickyRect.top;

                itemSpan.style.left = `${x}px`;
                itemSpan.style.top = `${y}px`;
                itemSpan.style.color = "red";
                itemElements.push(itemSpan);
            });
        });
    }

    function removeElements() {
        itemElements.forEach((item) => {
            container.removeChild(item);
        });
        itemElements = [];
    }

    function handleResize() {
        removeElements();
        createElementsFromText();
    }


    createElementsFromText();

    window.addEventListener('resize', handleResize);

})
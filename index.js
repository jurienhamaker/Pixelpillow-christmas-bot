// ==UserScript==
// @name         Pixelpillow christmas bot
// @namespace    https://jurien.dev/
// @version      1.0
// @description  Try to break the pixelpillow christmas songs!
// @author       Jurien Hamaker <jurien@kings-dev.io>
// @match        https://kerst.pixelpillow.nl/*
// @grant        none
// ==/UserScript==

let indicator = document.createElement('div');
indicator.style.position = "fixed";
indicator.style.width = "20px";
indicator.style.height = "20px";
indicator.style.left = "0px";
indicator.style.top = "0px";

let image = document.createElement('img');
image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mano_cursor.svg/340px-Mano_cursor.svg.png";
image.style["max-width"] = "100%";

indicator.appendChild(image);

(function () {
    'use strict';
    console.log("heelow!");

    const startButton = document.addEventListener("keyup", event => {
        if (event.keyCode === 68) {
            window.bot.speedDemon = !window.bot.speedDemon;
            console.log(`Speed demon ${window.bot.speedDemon ? 'activated' : 'de-activated'}`);
        }

        if (event.keyCode === 67) {
            createIndicator();
            window.bot.click();
        }
    });
})();

function createIndicator() {
    document.getElementsByTagName("body")[0].appendChild(indicator);
}

function startBot() {
    const startButton = document.getElementById("start");
    startButton.click();

    createIndicator();
    window.bot.forceStop = false;

    setTimeout(() => clickNote(), 1000);
    return "Starting bot";
}

function stopBot() {
    window.bot.forceStop = true;
}

function clickNote(auto = true, force = window.bot.speedDemon, last = false) {
    const gameover = checkGameOver();
    if (gameover) {
        console.log("Game over!");
        return;
    }

    if (window.bot.forceStop && !last) {
        console.log("Force stopped!");
        return;
    }

    const songContainer = document.getElementById("song");
    const todo = songContainer.getElementsByClassName("todo")[0];

    if (!todo) {
        return
    }

    if (!todo.parentElement.previousElementSibling) {
        console.log("We found the end, force ending so we can grab score.");
        stopBot();
        return;
    }

    if (todo.classList.contains("done")) {
        if (auto) {
            setTimeout(() => clickNote(auto, window.bot.speedDemon), 1);
        }
        return;
    }

    const clickPosition = getClickPosition(todo);
    indicator.style.top = `${clickPosition.y}px`;
    indicator.style.left = `${clickPosition.x}px`;
    if ((force || clickPosition.y > (window.innerHeight - 100)) && !window.bot.forceStop) {

        triggerMouseEvent(todo, "mousedown");
        todo.classList.add("done");

        if (window.bot.allLogs) {
            console.log(`clicked note at x: ${clickPosition.x}, y: ${clickPosition.y}`);
        }
    }

    if (auto) {
        setTimeout(() => clickNote(auto, window.bot.speedDemon), 1);
    }
}

function checkGameOver() {
    const gameover = document.getElementById("gameOver");

    if (gameover.style.opacity === "1") {
        return true;
    }

    return false;
}

function getClickPosition(element) {
    const rect = element.getBoundingClientRect();
    return {
        x: rect.x + (rect.width / 2),
        y: rect.y + (rect.height - 20)
    }
}

function triggerMouseEvent(node, eventType) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initEvent(eventType, true, true);
    node.dispatchEvent(clickEvent);
}

window.bot = {
    start: startBot,
    stop: stopBot,
    click: () => clickNote(false, true),
    speedDemon: false,
    forceStop: false,
    allLogs: false
};
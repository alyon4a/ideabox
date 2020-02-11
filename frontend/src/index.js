const url = "http://localhost:3000"
let addIdea = false;
let loggedInUser = null;

window.addEventListener('DOMContentLoaded', () => {
    getUser(); // Need to change to login
    getIdeas();
    addNewButtonListener();
    addFormSubmitEvent()
})

function getUser() {
    fetch(`${url}/users`)
    .then(resp => resp.json())
    .then(user => {
        loggedInUser = user[0]
    })
}

function addNewButtonListener() {
    const newIdeaBtn = document.getElementById('new-idea-btn');
    const newIdeaForm = document.getElementById('new-idea-container');
    newIdeaBtn.addEventListener('click', (event) => {
        addIdea = !addIdea;
        newIdeaForm.style.display = addIdea ? 'flex' : 'none';
    });
}

function addFormSubmitEvent() {
    const form = document.querySelector('form')
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const idea = {
            user_id: loggedInUser.id,
            title: form.title.value,
            description: form.description.value,
            image: form.image.value
        }
        createIdea(idea);
    });
}

function createIdea(idea) {
    fetch(`${url}/ideas`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(idea)
    }).then(resp => resp.json())
    .then(idea => {
        renderIdea(idea)
    })
}

function getIdeas() {
    fetch(`${url}/ideas`)
        .then(resp => resp.json())
        .then(ideas => {
            renderIdeas(ideas)
        })
}

function renderIdeas(ideas) {
    ideas.forEach(idea => {
        renderIdea(idea)
    });
}

function renderIdea(idea) {
    const ideaCollection = document.getElementById("idea-collection")
    const div = document.createElement('div')
    div.classList.add("card")
    div.dataset.id = idea.id

    div.innerHTML = `
    <img class='idea-img' src=${idea.image}>
    <h3>${idea.title}</h3>
    <p>${idea.description}</p>
    <div class='upvote'>
        <label class='upvote-num'>${idea.up_votes}</label>
        <button class='upvote-btn'>^</button>
        <button class='upvote-btn flip'>^</button>
    </div>
    `
    const upVote = div.querySelector('.upvote-btn')
    addUpVoteEvent(upVote)

    ideaCollection.appendChild(div)
}

function addUpVoteEvent(button) {
    button.addEventListener('click', (event) => {
        const id = event.target.parentElement.parentElement.dataset.id
        const up_vote = {
            user_id: loggedInUser.id,
            idea_id: parseInt(id)
        }

        fetch(`${url}/up_votes`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(up_vote)
        }).then(resp => resp.json())
        .then(idea => {
            renderIdea(idea)
        })
    })
}
const url = "http://localhost:3000"
let addIdea = false;
let loggedInUser = null;

window.addEventListener('DOMContentLoaded', () => {
    addLoginEventListener(); // Need to change to login
    getIdeas();
    addNewButtonListener();
    addFormSubmitEvent()
})

function getUser(email) {
    fetch(`${url}/users/login?email=${email}`)
    .then(resp => resp.json())
    .then(user => {
        if(user) {
            loggedInUser = user;
            const profile = document.querySelector(".profile")
            profile.innerHTML = ""
            profile.innerHTML = `<h1>Welcome, ${user.name}!</h1>`
        }
        console.log(loggedInUser)
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

function addLoginEventListener() {
    const form = document.querySelector('.login-form')
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = form.email.value;
        getUser(email);
        form.email.value = "";
    });
}

function addFormSubmitEvent() {
    const form = document.querySelector(".add-idea-form");
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
    <div class="row">
        <div class="col-6 text-left">
            <label class='upvote-num align-middle'>${idea.implementors}</label>
            <button class='upvote-btn align-middle justify-content-center'>
                <image class="icon" src="https://www.pinclipart.com/picdir/big/345-3453156_person-icons-outline-iconfinder-clipart.png" />
            </button>
        </div>
        <div class='col-6 justify-content-end'>
            <label class='upvote-num align-middle'>${idea.up_votes}</label>
            <button class='upvote-btn align-middle'>^</button>
            <button class='upvote-btn align-middle flip'>^</button>
        </div>
    </div>
    `
    // if(loggedInUser) {
        const upVote = div.getElementsByClassName('upvote-btn')[1]
        addUpVoteEvent(upVote)
    // }

    ideaCollection.appendChild(div)
}

function addUpVoteEvent(button) {
    button.addEventListener('click', (event) => {
        const id = event.target.parentElement.parentElement.parentElement.dataset.id
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
        .then(like => {
            const cards = document.getElementsByClassName('card')
            const card = Array.from(cards).find(cardInArray => {
                if(parseInt(cardInArray.dataset.id) === like.idea_id) {
                    return cardInArray
                }
            })
            if(card) {
                const likes = card.children[3].children[1].children[0].innerText
                card.children[3].children[1].children[0].innerText = parseInt(likes) + 1
            }
        }).catch(err => {
            console.log("already liked")
        })
    })
}
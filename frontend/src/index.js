const url = "http://localhost:3000"
let addIdea = false;
let loggedInUser = null;

window.addEventListener('DOMContentLoaded', () => {
    addLoginEventListener(); // Need to change to login
    hideOrDisplayOnLogin();
    addNewButtonListener();
    addFormSubmitEvent()
})

function getUser(email) {
    fetch(`${url}/users/login?email=${email}`)
    .then(resp => resp.json())
    .then(user => {
        if(user) {
            getIdeas();
            loggedInUser = user;
            const profile = document.querySelector(".profile")
            profile.innerHTML = ""
            profile.innerHTML = `<h1>Welcome, ${user.name}!</h1>`
            hideOrDisplayOnLogin();
        }
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
    <div class="card-content">
        <img class='idea-img' src=${idea.image}>
        <h3>${idea.title}</h3>
        <p>${idea.description}</p>
    </div>
    <div class="row no-gutters">
        <div class="col-3 text-left">
            <label class='upvote-num align-middle'>${idea.implementors}</label>
            <button class='upvote-btn align-middle justify-content-center'>
                <image class="icon" src="https://www.pinclipart.com/picdir/big/345-3453156_person-icons-outline-iconfinder-clipart.png" />
            </button>
        </div>
        <div class="col-6"><button class="btn btn-info idea-details-btn" data-toggle="modal" data-target="#ideaModal">...</button></div>
        <div class='col-3 text-right'>
            <label class='upvote-num align-middle'>${idea.up_votes}</label>
        </div>
    </div>
    `

    const ideaDetailsBtn = div.getElementsByClassName('idea-details-btn')[0];
    addIdeaDetailsBtnListener(ideaDetailsBtn);
    addUpVoteButton(div.querySelector('.text-right'), idea.id)

    ideaCollection.appendChild(div, idea.id)
}

function addUpVoteButton(div, ideaId) {
    if(loggedInUser) {
        const likedIdea = loggedInUser.up_votes.find(upVote => upVote.idea_id === ideaId)
        const button = document.createElement('button')
        button.className = "upvote-btn align-middle"
        button.innerText = '^'
        if(likedIdea) {
            button.classList.add('flip')
            addDownVoteEvent(button)
        } else {
            addUpVoteEvent(button)
        }
        div.appendChild(button)
    }
}

function addUpVoteEvent(button) {
    button.addEventListener('click', (event) => {
        const id = parseInt(event.target.parentElement.parentElement.parentElement.dataset.id)
        const up_vote = {
            user_id: loggedInUser.id,
            idea_id: id
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
            const card = event.target.parentElement.parentElement.parentElement
            updateUpVote(true, card)
            loggedInUser.up_votes.push(like)
            updateUpVoteButton(event.target, id)
        }).catch(err => {
            console.log("already liked")
        })
    })
}

function addDownVoteEvent(button) {
    button.addEventListener('click', (event) => {
        const ideaId = parseInt(event.target.parentElement.parentElement.parentElement.dataset.id)
        const upVoteIndex = loggedInUser.up_votes.findIndex(upVote => upVote.idea_id === ideaId)
        fetch(`${url}/up_votes/${loggedInUser.up_votes[upVoteIndex].id}`, {
            method: 'DELETE',
        }).then(resp => resp.json())
        .then(like => {
            loggedInUser.up_votes.splice(upVoteIndex, 1)
            const card = event.target.parentElement.parentElement.parentElement
            updateUpVote(false, card)
            updateUpVoteButton(event.target, ideaId)
        })
    })
}

function updateUpVoteButton(button, idea_id) {
    const parent = button.parentElement;
    button.remove()
    addUpVoteButton(parent, idea_id)
}

function updateUpVote(upvote, card) {
    const likes = card.getElementsByClassName('upvote-num')[1]
    if(upvote) {
        likes.innerText = parseInt(likes.innerText) + 1
    } else {
        likes.innerText = parseInt(likes.innerText) - 1
    }
}

function hideOrDisplayOnLogin() {
    hide = !loggedInUser;
    const loggedInDiv = document.getElementById('logged-in');
    loggedInDiv.style.display = hide ? 'none' : '';
}

function addIdeaDetailsBtnListener(button) {
    button.addEventListener('click', (event) => {
        const id = event.target.parentElement.parentElement.parentElement.dataset.id
        
        fetch(`${url}/ideas/${id}`)
        .then(resp => resp.json())
        .then(idea => {
            const modalBody = document.getElementsByClassName('modal-body')[0];
            const ideaModalLabel = document.getElementById('ideaModalLabel');
            ideaModalLabel.innerText = idea.title;
            renderIdeaDetails(idea, modalBody);
            addSaveButtonListener(idea);
        })
    })
}

function isUserImplementor(implementors) {
    const implementor = implementors.find(implementor => {return implementor.id === loggedInUser.id});
    return implementor != undefined;
}

function renderIdeaDetails(idea, modalBody) {
    const firstRow = modalBody.querySelector('.col-5')
    firstRow.innerHTML = `
        <img class="idea-img-details" src=${idea.image}>
    `
    const secondRow = modalBody.querySelector('.col-7')
    implementors = implementorsString(idea.implementors);
    secondRow.innerHTML = `
        <h4>Author: ${idea.user.name}</h4>
        <h4>Implementors: <br/> ${implementors}</h4>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="implement-check">
            <label class="form-check-label" for="implement-check">
                Implement this idea
            </label>
        </div>
    `
    const userIsImplementor = isUserImplementor(idea.implementors);
    if (userIsImplementor) {
        document.getElementById('implement-check').defaultChecked = true;
    }
    if (idea.user.id === loggedInUser.id) {
        secondRow.innerHTML += `<div><textarea rows=5>${idea.description}</textarea></div>`
    }
    else {
        secondRow.innerHTML += `<div><p>${idea.description}</p></div>`
    }
}

function implementorsString(implementors) {
    let result = implementors.reduce((result, implementor) => {
        const space = result.length > 0 ? ", " : " ";
        return result + space + implementor.name;
    }, "");
    if (result.length === 0) {
        result = "None."
    }
    return result;
}

function addSaveButtonListener(idea) {
    const saveBtnOld = document.getElementById('save-idea-btn');
    const saveBtnNew = saveBtnOld.cloneNode(true);
    saveBtnOld.parentNode.replaceChild(saveBtnNew, saveBtnOld);
    saveBtnNew.addEventListener('click', (event) => {
        const newDescription = document.querySelector('textarea').value;
        const userIsImplementor = isUserImplementor(idea.implementors);
        const implementChecked = document.getElementById('implement-check').checked;

        if (userIsImplementor && !implementChecked) {
            removeFromImplementors(idea);
        }
        else if (!userIsImplementor && implementChecked) {
            addToImplementors(idea);
        }
        if (idea.description !== newDescription) {
            idea.description = newDescription;
            updateIdeaDescription(idea);
        }
    });
}

function removeFromImplementors(idea) {
    const implementor = loggedInUser.implementors.find((implementor) => implementor.idea_id === idea.id);
    fetch(`${url}/implementors/${implementor.id}`, {
        method: 'DELETE',
    }).then(resp => resp.json())
    .then(implementor => {
        //TBD: update numbers on the idea card

        // loggedInUser.implementors.splice(upVoteIndex, 1)
        // const card = event.target.parentElement.parentElement.parentElement
        // updateUpVote(false, card)
        // updateUpVoteButton(event.target, ideaId)
    })
    
    console.log(implementor);
    
}

function addToImplementors(idea) {
    const implementor = {
        user_id: loggedInUser.id,
        idea_id: idea.id
    }

    fetch(`${url}/implementors`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(implementor)
    }).then(resp => resp.json())
    .then(implementor => {
        loggedInUser.implementors.push(implementor);
        // TBD: update correspondent card with new implementor count
        
        // const card = event.target.parentElement.parentElement.parentElement
        // updateUpVote(true, card)
        // updateUpVoteButton(event.target, id)
    }).catch(err => {
        console.log(err);
    })
}

function updateIdeaDescription(idea) {
    fetch(`${url}/ideas/${idea.id}`, {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(idea)
    }).then(resp => resp.json())
    .then(newIdea => {
        console.log(newIdea);
        // TBD: update correspondent card with new description
    
    }).catch(err => {
        console.log(err);
    })
}
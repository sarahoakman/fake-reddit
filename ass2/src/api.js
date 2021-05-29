/**
 * Make a request to `path` with `options` and parse the response as JSON.
 * @param {*} path The url to make the reques to.
 * @param {*} options Additiona options to pass to fetch.
 */
const getJSON = (path, options) => 
    fetch(path, options)
    .then(res => res.json())
        .catch(err => console.warn(`API_ERROR: ${err.message}`));

/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */

 // added class functions for each type of api call required 

export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    } 

    /** @param {String} path */
    makeAPIRequest(path, options) {
        return getJSON(`${this.url}/${path}`, options);
    }

    loginUser(username, password) {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            }),
        }
        return this.makeAPIRequest('auth/login', options);
    }

    // api call: authenticate user for register
    registerUser(username, password, email, name) {
        const data = {
            "username": username,
            "password": password,
            "email": email,
            "name": name
        }
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }
        return this.makeAPIRequest('auth/signup', options);
    }

    // api call: get users information using a username
    getUserByUsername(user) {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('user?username=' + user, options);
    }

    // api call: get users information using an id
    getUserById(id) {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        };
        // get current user information 
        if (id == null) {
            return this.makeAPIRequest('user', options);
        // get another users information
        } else {
            return this.makeAPIRequest('user?id=' + id, options);
        }
    }

    // api call: get 10 posts from feed from start index
    getFeed(start) {
        const options = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('user/feed?p='+start, options);
    }

    // api call: get post information 
    getPostInfo(id) {
        const options = { 
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('post?id=' + id, options);

    }

    // api call: add a comment to a post using its id 
    addComment(comment, id) {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    'comment': JSON.stringify(comment),
                }   
            )
        }
        return this.makeAPIRequest('post/comment?id=' + id, options);
    }

    // api call: unlike a post using its id
    unlikePost(id) {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('post/unlike?id=' + id, options)
    }

    // api call: like a post using its id
    likePost(id) {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('post/like?id=' + id, options)
    }

    // api call: follow a user
    followUser(username, followers) {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('user/follow?username=' + username, options)
    }

    // api call: unfollow a user
    unfollowUser(username, followers) {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token')
            },
        }
        return this.makeAPIRequest('user/unfollow?username=' + username, options)
    }

    // api call: update the user according to info given
    updateUser(nameInput, emailInput, passwordInput) {
        const payload = {};
        if (emailInput != '') {
            payload['email'] = emailInput;
        }
        if (nameInput != '') {
            payload['name'] = nameInput;
        }
        if (passwordInput != '') {
            payload['password'] = passwordInput;
        }
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(payload)
        };
        this.makeAPIRequest('user', options);
    }

    // api call: delete posts given their id
    deletePosts(id) {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token') 
            }
        };
        this.makeAPIRequest('post?id=' + id, options);    
    }

    // api call: update posts given a payload and post id
    updatePost(payload, id) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + localStorage.getItem('token') 
            },
            body: JSON.stringify(payload)
        };
        return this.makeAPIRequest('post?id=' + id, options)
    }
}


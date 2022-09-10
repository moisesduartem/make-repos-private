const axios = require('axios').default;

const args = process.argv.slice(2);
const [githubUser, accessToken] = args;

const githubApi = axios.create({
    baseURL: 'https://api.github.com',
    auth: {
        username: githubUser,
        password: accessToken
    }
})

function handleError(reason) {
    console.error(reason.message)
}

function changeRepoToPrivate(repoName) {
    githubApi.patch(`/repos/${githubUser}/${repoName}`, {
        private: true,
    })
    .then(response => response.data)
    .catch(handleError);
}

function getAllRepos(data) {
    const repos = data.map(x => x.name);
    repos.forEach((value, index) => {
        changeRepoToPrivate(value);
    });
}

githubApi
.get(`/users/${githubUser}/repos?type=owner`)
.then(response => getAllRepos(response.data))
.catch(handleError);
